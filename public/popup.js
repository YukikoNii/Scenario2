






// Call the function when the popup is opened



document.addEventListener("DOMContentLoaded", function () {
  const couponBtn = document.querySelector('.coupon-btn');
  couponBtn.addEventListener('click', function () {
    const websiteName = getWebsiteName();
    displayCouponsInPopup(websiteName);

  })
});

// Function to get the current tab URL
function getWebsiteName() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0];
    const currentUrl = currentTab.url; // Get the URL of the current tab
    const websiteName = new URL(currentUrl).hostname.replace(/^www\./, '');
    return websiteName;

  });
}

async function displayCouponsInPopup(retailer) {
  console.log(retailer);
  // TODO: add function to get name of the retailer

  scrapeCoupons(retailer); // run the python script to scrape coupons. Data is added to the database. 
  const coupons_data = await fetchCoupons(retailer); // get coupons from the database, specifying the retailer name. 

  // TODO: get the popup component 
  const couponRows = document.querySelector('.couponRows');
  couponRows.innerHTML = "";

  coupons_data.forEach(coupon => {
    couponRows.innerHTML += `<th class="py-3 px-4 text-left">${coupon.code}</th><th class="py-3 px-4 text-left">${coupon.description}</th></tr>`
  })
}


// run this when a user clicks on a button in the popup or something 
function displayPricesInPopup() {
  // TODO: add function to get product name
  const product = "iphone 16";

  scrapePrices(product); // run the python script to scrape prices. Data is added to the database. 
  const prices_data = fetchPrices(product); // get coupons from the database, specifying the product name. 

  // TODO: get the popup component and then display the price data
}