// Call the function when the popup is opened

document.addEventListener("DOMContentLoaded", function () {
  const couponBtn = document.querySelector('.coupon-btn');
  const couponTable = document.querySelector('.couponTable');

  couponBtn.addEventListener('click', function () {
    if (couponTable.classList.contains('hidden')) {
      const websiteName = getWebsiteName();
      displayCouponsInPopup(websiteName);
      couponTable.classList.remove('hidden'); // Show the table
    } else {
      couponTable.classList.add('hidden'); // Hide the table
    }
  });

  const priceBtn = document.querySelector('.price-btn');
  priceBtn.addEventListener('click', function () {
    const product = document.querySelector('.product-name').value;
    displayPricesInPopup(product);
  });
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


// run this when a user clicks on a button in the popup 
async function displayPricesInPopup(product) {
  // TODO: add function to get product name

  await scrapePrices(product); // run the python script to scrape prices. Data is added to the database.
  const raw_data = await fetchPrices(product); // get coupons from the database, specifying the product name. 
  console.log(raw_data);

  if (raw_data) {
    const data = raw_data[product];

    if (data) {
      const priceField = document.querySelector('.prices');
      priceField.innerHTML = "";


      Object.entries(data).forEach(([retailer, price]) => {
        priceField.innerHTML += `<div>${retailer.toString().trim()} : ${price.toString().trim()}</div><br>`
      });
    }
  }

}
