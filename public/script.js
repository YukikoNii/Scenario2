
// Load data dynamically from firebase
displayCouponsInDashboard();
displayPricesInDashBoard();

setTimeout(() => {
  var thresholds = document.querySelectorAll('.threshold');
  thresholds.forEach(threshold => {
    const itemName = threshold.parentElement.querySelector('.item').innerHTML;
    highlightBestDeal(threshold.querySelector('.thresPrice'), itemName);
  });

  thresholds.forEach(threshold => {

    const thresInput = threshold.querySelector('.thresPrice');
    const itemName = threshold.parentElement.querySelector('.item').innerHTML;
    if (thresInput) {
      thresInput.addEventListener("change", function (e) {
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
    const compTable = document.querySelector('.compTable');
    const retailers = Array.from(compTable.querySelectorAll('th:not(.item, .threshold)'));
    const prices = priceCells.map(cell => {
      return parseInt(cell.textContent.slice(1));
    });
    const thresPrice = parseInt(thresInput.value.slice(1));

    // Calculate the lowest price
    const minPrice = Math.min(...prices);

    // color the min price cell
    priceCells.forEach((cell, index) => {
      const cellPrice = prices[index];
      if (cellPrice === minPrice && minPrice <= thresPrice) {
        cell.classList.add('bg-red-200');


        // In actual app, an email should be sent at a set time of the day, as it would be annoying for users to receive emails every time the price changes or every time they change the threshold. 
        (async () => {
          await sendEmail(itemName, retailers[index].textContent, cellPrice, thresPrice);
        })();

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
if (button) {
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
}

// maybe remove the search function (not working)
document.addEventListener("DOMContentLoaded", function () {

  var priceSearchBar = document.querySelector('.priceSearchBar');
  if (priceSearchBar) {
    priceSearchBar.addEventListener("submit", function (e) {
      // prevent the form from submitting (i.e. reloading the page)
      e.preventDefault();

      var tables = document.querySelectorAll('.compTable');
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


const emailForm = document.querySelector('.email');

if (emailForm) {
  emailForm.addEventListener("submit", function (e) {
    e.preventDefault();
    email = emailForm.elements.email.value;
    localStorage.setItem("email", email); // Save email in local storage
  })
}



function sendEmail(item, retailer, price, threshold) {
  const email = localStorage.getItem("email"); // Get email from local storage

  if (email) {
    return fetch('http://localhost:8080/sendEmail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: email,
        subject: 'Maple: Price Drop Alert',
        text: `${item} is now available at £${price} on ${retailer}, under your threshold price of £${threshold}`
      }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to send email: ${response.statusText}`);
        }
        console.log('Email sent successfully');
      })
      .catch(error => {
        console.error('Error sending email:', error);
      });
  }
}

// Fetching data from firebase
async function fetchCoupons(retailer) {
  try {
    const response = await fetch("http://localhost:8080/fetchCoupons", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ "retailer": retailer })
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
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ "product": product })
    });

    const data = await response.json();
    return await data;

  } catch (error) {
    console.error("Error occured while fetching data:", error);
  }
}

async function displayCouponsInDashboard() {
  const coupons_data = await fetchCoupons(null);
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





async function scrapeCoupons(retailer) {
  try {
    const response = await fetch("http://localhost:8080/scrapeCoupons", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ "retailer": retailer })
    });

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
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ "product": product })
    });

    if (!response.ok) {
      console.error("Failed to scrape coupons. Status:", response.status);
    }

  } catch (error) {
    console.error("Error occured while fetching data:", error);
  }
}
