import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Set up Chrome options to run headlessly (without opening the browser window)
chrome_options = Options()
chrome_options.add_argument("--headless")  # Run in the background without opening the browser

# Initialize WebDriver (make sure you have the correct path to ChromeDriver)
driver = webdriver.Chrome(options=chrome_options)

# Function to search for a product and scrape the first link
def scrape_price_runner(keyword):
    # Open the PriceRunner website
    driver.get("https://www.pricerunner.com")
    
    # Find the search bar and input the keyword
    search_box = driver.find_element(By.CLASS_NAME, "pr-1w40bwr")  
    search_box.send_keys(keyword)
    search_box.send_keys(Keys.RETURN)  # Press 'Enter' to submit the search
    
    # Wait for the page to load
    time.sleep(3)  # Adjust the sleep time if necessary (e.g., for slow loading)
    
    # Find the first product link in the search results
    product_grid = driver.find_element(By.CLASS_NAME, "pr-13k6084-ProductList-grid")
    
    # Get the href (URL) of the first link
    products = product_grid.find_elements(By.XPATH, "./*")
    first_match = products[0]

    # Find the <a> tag within the first child
    link = first_match.find_element(By.TAG_NAME, "a")

    # Get the href attribute
    href = link.get_attribute("href")

    # Print or use the href link
    print(href)

    driver.get(href)  # Replace with the target URL
    
    parent_divs = driver.find_elements(By.CLASS_NAME, "pr-19usnh7")

    # Loop through each parent div
    for parent_div in parent_divs:
        
        # Find all child div elements within the current parent div
        child_divs = parent_div.find_elements(By.CLASS_NAME, "pr-1u8qly9")

        if child_divs:
            for child in child_divs:
                retailer = ""
                aria = child.get_attribute('aria-label')
                if aria:
                    retailer = aria.split(" ")[0]
                price = child.find_element(By.CLASS_NAME, "pr-134edi3")
                print(retailer, price.text)
        else:
            print("No child divs found.")

    # Close the driver
    driver.quit()
        
 

# Example usage
keyword = "Apple iPhone 16 Pro Max 256GB"
scrape_price_runner(keyword)

# Close the driver after scraping
driver.quit()