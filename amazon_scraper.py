import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


def get_driver():
    chrome_options = Options()
    chrome_options.add_argument("--headless=new")
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("window-size=1920,1080")
    chrome_options.add_argument("--disable-blink-features=AutomationControlled")
    chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
    chrome_options.add_experimental_option("useAutomationExtension", False)
    chrome_options.add_argument(
        "--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    )
    return webdriver.Chrome(options=chrome_options)


def scrape_amazon_prices(search_term):
    driver = get_driver()
    try:
        url = f"https://www.amazon.co.uk/s?k={search_term}"
        driver.get(url)

        # Wait for product results
        wait = WebDriverWait(driver, 10)
        wait.until(EC.presence_of_all_elements_located((By.CSS_SELECTOR, "div[data-component-type='s-search-result']")))

        products = driver.find_elements(By.CSS_SELECTOR, "div[data-component-type='s-search-result']")
        results = []

        for product in products[:5]:  # top 5 products
            try:
                title_el = product.find_element(By.CSS_SELECTOR, "h2 a span")
                price_whole = product.find_element(By.CSS_SELECTOR, "span.a-price-whole")
                price_frac = product.find_element(By.CSS_SELECTOR, "span.a-price-fraction")
                link = product.find_element(By.CSS_SELECTOR, "h2 a").get_attribute("href")

                title = title_el.text.strip()
                price = float(f"{price_whole.text}.{price_frac.text}")
                results.append({
                    "retailer": "Amazon UK",
                    "title": title,
                    "price": price,
                    "currency": "GBP",
                    "url": link
                })
            except Exception:
                continue  # Skip incomplete product blocks

        return results

    finally:
        driver.quit()


# Example usage
data = scrape_amazon_prices("iPhone16")
for entry in data:
    print(entry)