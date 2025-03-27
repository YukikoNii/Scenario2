// Call the function when the popup is opened

document.addEventListener("DOMContentLoaded", function () {
  const couponBtn = document.querySelector('.coupon-btn');
  const couponTable = document.querySelector('.couponTable');

  couponBtn.addEventListener('click', async function () {
    if (couponTable.classList.contains('hidden')) {
      const websiteName = await getWebsiteName();
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
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      const currentUrl = currentTab.url; // Get the URL of the current tab
      const websiteName = new URL(currentUrl).hostname.replace(/^www\./, '');
      resolve(websiteName);
    });
  });
}

async function displayCouponsInPopup(retailer) {
  await scrapeCoupons(retailer); // run the python script to scrape coupons. Data is added to the database. 
  const coupons_data = await fetchCoupons(retailer); // get coupons from the database, specifying the retailer name. 
  console.log("Fetched Coupons:", coupons_data); // Debugging log

  if (!coupons_data || coupons_data.length === 0) {
    console.error("No coupons found for retailer:", retailer);
    return; // Exit if no data
  }

  // TODO: get the popup component 
  const couponRows = document.querySelector('.couponRows');
  couponRows.innerHTML = "";

  coupons_data.forEach(coupon => {
    couponRows.innerHTML += `<tr><th class="py-3 px-4 text-left">${coupon.code}</th><th class="py-3 px-4 text-left">${coupon.description}</th></tr>`;
  })
}


// run this when a user clicks on a button in the popup 
async function displayPricesInPopup(product) {
  await scrapePrices(product); // run the python script to scrape prices. Data is added to the database.
  const raw_data = await fetchPrices(product); // get prices from the database, specifying the product name.
  console.log(raw_data);

  const priceField = document.querySelector('.prices');
  priceField.innerHTML = ""; // Clear previous content

  if (raw_data) {
    const data = raw_data[product];

    if (data) {
      priceField.classList.remove('hidden'); // Show the box
      Object.entries(data).forEach(([retailer, price]) => {
        priceField.innerHTML += `
          <div>
            <span>${retailer.toString().trim()}</span>
            <span>${price.toString().trim()}</span>
          </div>`;
      });
    } else {
      priceField.classList.add('hidden'); // Hide the box if no data
    }
  } else {
    priceField.classList.add('hidden'); // Hide the box if no data
  }
}
