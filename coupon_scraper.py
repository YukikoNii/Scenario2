
import time
import firebase_admin
from firebase_admin import credentials, firestore
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
import os
import sys 
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "serviceAccountKey.json"


retailer = sys.argv[1]  # The first argument (after the script name) will be the retailer

cred = credentials.Certificate(os.path.join(os.getcwd(), "serviceAccountKey.json"))
firebase_admin.initialize_app(cred)
db = firestore.client()


def get_driver():
    chrome_options = Options()
    chrome_options.add_argument("--headless=new")
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument("--disable-gpu")  
    chrome_options.add_argument("window-size=1920,1080")
    chrome_options.add_argument("--disable-blink-features=AutomationControlled")
    chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
    chrome_options.add_experimental_option("useAutomationExtension", False)
    chrome_options.add_argument("--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")


    driver = webdriver.Chrome(options=chrome_options)
    return driver



def scrape_coupons():

    driver = get_driver()

    driver.get(f'https://www.vouchercodes.co.uk/{retailer}')
    max_height = driver.execute_script("return document.body.scrollHeight")
    ids = []

    while True:
        ids += list(get_ids(driver))
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(2) 

        new_height = driver.execute_script("return document.body.scrollHeight")
        if new_height == max_height:
            break  # All coupons were loaded 
        max_height = new_height # Update height 


    get_coupon_codes(set(ids), driver)

def get_ids(driver):
    coupon_divs = driver.find_elements(By.XPATH, '//*[contains(@data-qa, "offerType:code")]')
    for coupon_div in coupon_divs:
        idAttribute = coupon_div.get_attribute("id")
        if idAttribute:
            yield idAttribute.split("-")[1]

def get_coupon_codes(ids, driver):
    wait = WebDriverWait(driver, 8)

    for id in ids:
        driver.get(f'https://www.vouchercodes.co.uk/?rc={id}')
        coupon_code_div = wait.until(EC.element_to_be_clickable((By.XPATH, '//*[contains(@data-qa, "el:code")]')))
        coupon_description_div = wait.until(EC.element_to_be_clickable((By.XPATH, '//*[contains(@data-qa, "el:offerTitle")]')))
        code = coupon_code_div.text 
        description = coupon_description_div.text

        db.collection("coupons").document(code).set({
        "Retailer": retailer,
        "Code": code,
        "Description": description,
        })
        

scrape_coupons()
