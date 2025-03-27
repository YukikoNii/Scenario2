

displayCouponsInDashboard();
displayPricesInDashBoard();

setTimeout(() => {
  var thresholds = document.querySelectorAll('.threshold');
  thresholds.forEach(threshold => {
    console.log(threshold);
    const itemName = threshold.parentElement.querySelector('.item').innerHTML;
    highlightBestDeal(threshold.querySelector('.thresPrice'), itemName);
  });

  thresholds.forEach(threshold => {

    const thresInput = threshold.querySelector('.thresPrice');
    const itemName = threshold.parentElement.querySelector('.item').innerHTML;
    if (thresInput) {
      thresInput.addEventListener("change", function (e) {
        console.log("hello");
        e.preventDefault();
        highlightBestDeal(thresInput, itemName);
      });
    }

  });
}, 1000);



// Highlight the best deal under the user-set threshold

function highlightBestDeal(thresInput, itemName) {
  if (thresInput != undefined) {
    const priceCells = Array.from(thresInput.parentElement.parentElement.querySelectorAll('td:not(.item, .threshold)'));
    const prices = priceCells.map(cell => {
      return parseInt(cell.textContent.slice(1));
    });
    const thresPrice = parseInt(thresInput.value.slice(1));

    // Calculate the lowest price
    const minPrice = Math.min(...prices);
    console.log(minPrice);

    // color the min price cell
    priceCells.forEach((cell, index) => {
      const cellPrice = prices[index];
      if (cellPrice === minPrice && minPrice <= thresPrice) {
        cell.classList.add('bg-red-200');

        // In actual app, emails should be sent at a set time of the day, as it would be annoying for users to receive emails every time the price changes or every time they change the threshold. 
        //sendEmail(itemName, cellPrice, thresPrice);

      } else {
        cell.classList.remove('bg-red-200');
      }
    });

  }
};


var button = document.querySelector('.sidebarButtonShape');
var sidebar = document.querySelector('.sidebar');
var navtexts = document.querySelectorAll('.navtext');
var logo = document.querySelector('.logo');

var collapsed = false;
button.addEventListener("click", function () {
  if (collapsed) {
    logo.innerHTML = "Maple";
    sidebar.classList.remove('w-16');
    sidebar.classList.add('w-64');
    collapsed = false;

    setTimeout(() => {
      navtexts.forEach(text => (text.style.display = "block"))

      button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" /></svg>';

    }, 100);
  } else {
    logo.innerHTML = "M";
    navtexts.forEach(text => (text.style.display = "none"));
    sidebar.classList.remove('w-64');
    sidebar.classList.add('w-16');
    collapsed = true;

    button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5" /></svg>';
  }
})


// maybe remove the search function (not working)
document.addEventListener("DOMContentLoaded", function () {

  var priceSearchBar = document.querySelector('.priceSearchBar');
  if (priceSearchBar) {
    priceSearchBar.addEventListener("submit", function (e) {
      console.log("hello");
      // prevent the form from submitting (i.e. reloading the page)
      e.preventDefault();
      console.log("Form submission prevented"); // Check if this logs

      var tables = document.querySelectorAll('.compTable');
      console.log(tables);
      var searchTerm = e.target.elements.search.value;
      tables.forEach(table => {
        if (table.querySelector('.productName').textContent.toLowerCase().includes(searchTerm.toLowerCase())) {
          table.style.display = "";
        } else {
          table.style.display = "none";
        }
      });
    });
  }
});

// saving email
var email = 'zcabyni@ucl.ac.uk';

const emailForm = document.querySelector('.email');

if (emailForm) {
  emailForm.addEventListener("submit", function (e) {
    e.preventDefault();
    email = emaiLForm.elements.email.value;
    console.log(email);
  })
}



function sendEmail(item, price, threshold) {
  // make post request to send email 
  fetch('http://localhost:8080/sendEmail', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to: email,
      subject: 'Maple: Price Drop Alert',
      text: item + ' is now available at £' + price + ', under your threshold price of £' + threshold // TODO: fix this 
    }),
  })
}

// Fetching data from firebase
async function fetchCoupons(retailer) {
  try {
    const response = await fetch("http://localhost:8080/fetchCoupons", {
      method: "POST", // Using POST method
      headers: {
        "Content-Type": "application/json", // Indicate we're sending JSON data
      },
      body: JSON.stringify({ "retailer": retailer }) // Send retailer as JSON
    });

    const data = await response.json();
    return await data;

  } catch (error) {
    console.error("Error occured while fetching data:", error);
  }
}


// Fetching price data from firebase
async function fetchPrices(product) {
  try {
    const response = await fetch("http://localhost:8080/fetchPrices", {
      method: "POST", // Using POST method
      headers: {
        "Content-Type": "application/json", // Indicate we're sending JSON data
      },
      body: JSON.stringify({ "product": product }) // Send retailer as JSON
    });

    const data = await response.json();
    return await data;

  } catch (error) {
    console.error("Error occured while fetching data:", error);
  }
}

async function displayCouponsInDashboard() {
  const coupons_data = await fetchCoupons(null);
  console.log(coupons_data);
  const compTableRows = document.querySelector('.compTableRows');
  if (compTableRows) {
    compTableRows.innerHTML = "";

    coupons_data.forEach(coupon => {
      compTableRows.innerHTML += `<tr class="hover:bg-red-50"> <td class="item py-3 px-4 font-semibold bg-gray-100 border-r">${coupon.retailer}</td><th class="py-3 px-4 text-left">${coupon.code}</th><th class="py-3 px-4 text-left">${coupon.description}</th></tr>`
    })
  }
}

async function displayPricesInDashBoard() {
  const prices_data = await fetchPrices(null);
  console.log(prices_data);

  const priceCompArea = document.querySelector('.priceComparison');
  if (priceCompArea) {

    Object.entries(prices_data).forEach(([product, retailers]) => {
      var html =
        `
      <div style="overflow-x: auto;">
      <table class="min-w-full table-auto bg-white shadow-md rounded-xl compTable">
          <thead class="bg-red-800 text-white">
            <tr>
              <th class="item py-3 px-4 text-left rounded-tl-xl">Product</th>
              <th class="threshold py-3 px-4 text-left">Threshold</th>
      `

      // Loop over each retailer for the current product
      Object.entries(retailers).forEach(([retailer, price]) => {
        html += `<th class="py-3 px-4 text-left">${retailer}</th>`
      });

      const prices = Object.values(retailers).map(price => {
        return parseFloat(price.replace(/[^0-9.-]+/g, ''));
      });

      const minPrice = Math.min(...prices);


      html +=
        `  </tr>
          </thead>

          <tbody>
            <tr class="compTableRow">
              <td class="item productName py-3 px-4 font-semibold bg-gray-100">${product}</td>
              <td class="threshold py-3 px-4 font-semibold bg-gray-100 border-r">
                <input
                  class="thresPrice border-2 border-gray-200 rounded py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:border-red-700"
                  name="price" value="£${minPrice}">
              </td>
        `

      Object.entries(retailers).forEach(([retailer, price]) => {
        price = price.replace(/,/g, "");
        html += `<td class="py-3 px-4">${price}</td>`
      });

      html +=
        `  </tr>
          </tbody>
          </table>
          </div>
        `

      priceCompArea.innerHTML += html;

    })
  }
}

// run this when a user clicks on a button in the popup or something 
function displayCouponsInPopup() {
  // TODO: add function to get name of the retailer
  const retailer = "amazon.co.uk";

  scrapeCoupons(retailer); // run the python script to scrape coupons. Data is added to the database. 
  const coupons_data = fetchCoupons(retailer); // get coupons from the database, specifying the retailer name. 

  // TODO: get the popup component 
  const compTableRows = document.querySelector('.compTableRows');
  compTableRows.innerHTML = "";

  coupons_data.forEach(coupon => {
    compTableRows.innerHTML += `<tr class="hover:bg-red-50"> <td class="item py-3 px-4 font-semibold bg-gray-100 border-r">${coupon.retailer}</td><th class="py-3 px-4 text-left">${coupon.code}</th><th class="py-3 px-4 text-left">${coupon.description}</th></tr>`
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



async function scrapeCoupons(retailer) {
  try {
    const response = await fetch("http://localhost:8080/scrapeCoupons", {
      method: "POST", // Using POST method
      headers: {
        "Content-Type": "application/json", // Indicate we're sending JSON data
      },
      body: JSON.stringify({ "retailer": retailer }) // Send retailer as JSON
    });

    // Optionally check if the request was successful (status 200)
    if (!response.ok) {
      console.error("Failed to scrape coupons. Status:", response.status);
    }

  } catch (error) {
    console.error("Error occured while fetching data:", error);
  }
}


async function scrapePrices(product) {
  try {
    const response = await fetch("http://localhost:8080/scrapePrices", {
      method: "POST", // Using POST method
      headers: {
        "Content-Type": "application/json", // Indicate we're sending JSON data
      },
      body: JSON.stringify({ "product": product }) // Send retailer as JSON
    });

    // Optionally check if the request was successful (status 200)
    if (!response.ok) {
      console.error("Failed to scrape coupons. Status:", response.status);
    }

  } catch (error) {
    console.error("Error occured while fetching data:", error);
  }
}
