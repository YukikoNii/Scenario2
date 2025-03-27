import time
import firebase_admin
from firebase_admin import credentials, firestore
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import sys
import os 
import re 
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "serviceAccountKey.json"


cred = credentials.Certificate(os.path.join(os.getcwd(), "serviceAccountKey.json"))
firebase_admin.initialize_app(cred)
db = firestore.client()

# Set up Chrome options to run headlessly (without opening the browser window)
def get_driver():
    """Initialize and return the WebDriver for Chrome."""
    chrome_options = Options()
    chrome_options.add_argument("--headless=new")
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument("--disable-gpu")  
    chrome_options.add_argument("window-size=1920,1080")
    chrome_options.add_argument("--disable-blink-features=AutomationControlled")
    chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
    chrome_options.add_experimental_option("useAutomationExtension", False)
    chrome_options.add_argument("--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")

    prefs = {"profile.default_content_setting_values.cookies": 2}  # Block cookies
    chrome_options.add_experimental_option("prefs", prefs)

    driver = webdriver.Chrome(options=chrome_options)
    return driver


def clean_product_data(product_data):
    cleaned_data = {}
    
    for key, value in product_data.items():
        # Remove leading/trailing whitespaces and clean up invalid characters (like commas)
        cleaned_key = key.strip()
        cleaned_key = re.sub(r'[^\w\s]', '', cleaned_key)  # Remove special characters like commas, periods
        
        # If the cleaned key is non-empty, add it to the cleaned_data
        if cleaned_key:
            cleaned_data[cleaned_key] = value
    
    return cleaned_data

# Function to search for a product and scrape the first link
def scrape_price_runner(keyword):
    driver = get_driver()
    wait = WebDriverWait(driver, 10)

    data = {}
    # Open the PriceRunner website
    driver.get("https://www.pricerunner.com")
    
    # Find the search bar and input the keyword
    search_box = driver.find_element(By.CLASS_NAME, "pr-1w40bwr")  
    search_box.send_keys(keyword)
    search_box.send_keys(Keys.RETURN)  # Press 'Enter' to submit the search
    
    # Wait for the page to load
    time.sleep(4)  #
    
    # Find the first product link in the search results
    product_grid = wait.until(EC.presence_of_element_located((By.CLASS_NAME, "pr-13k6084-ProductList-grid")))

    if product_grid:
    
        products = product_grid.find_elements(By.XPATH, "./*")
        first_match = products[0]

        link = first_match.find_element(By.TAG_NAME, "a")

        href = link.get_attribute("href")

        driver.get(href)  

        
        parent_divs = wait.until(EC.presence_of_all_elements_located((By.CLASS_NAME, "pr-19usnh7")))

        # Loop through each parent div
        for parent_div in parent_divs:
            
            child_divs = parent_div.find_elements(By.CLASS_NAME, "pr-1u8qly9")

            if child_divs:
                for child in child_divs:
                    retailer = ""
                    aria = child.get_attribute('aria-label')
                    if aria:
                        retailer = aria.split(" ")[0]
                    
                    try:
                        price = child.find_element(By.CLASS_NAME, "pr-134edi3")
                        
                        if price:
                            data[retailer] = price.text
                    except:
                        pass 
        
        data = clean_product_data(data)
        
        product_ref = db.collection("products").document(keyword)

        # Data structure to store the product name and retailer prices
        product_data = {
            "product_name": keyword,
            "prices": data
        }

        product_ref.set(product_data)

    # Close the driver
    driver.quit()
    print("FINISHEd!!")
        


keyword = sys.argv[1]
scrape_price_runner(keyword)

