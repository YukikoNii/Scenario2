
var thresholds = document.querySelectorAll('.threshold');


// Update the highlighting everytime threshold is changed
thresholds.forEach(threshold => {

  const thresInput = threshold.querySelector('.thresPrice');
  const itemName = threshold.parentElement.querySelector('.item').innerHTML;
  if (thresInput) {
    thresInput.addEventListener("change", function (e) {
      e.preventDefault();
      highlightBestDeal(thresInput, itemName);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    highlightBestDeal(threshold.querySelector('.thresPrice'), itemName);
  });

});


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


var priceSearchBar = document.querySelector('.priceSearchBar');
if (priceSearchBar) {
  priceSearchBar.addEventListener("submit", function (e) {
    // prevent the form from submitting (i.e. reloading the page)
    e.preventDefault();
    var products = document.querySelectorAll('.compTableRow');
    var searchTerm = e.target.elements.search.value;
    products.forEach(product => {
      if (product.querySelector('.item').textContent.toLowerCase().includes(searchTerm.toLowerCase())) {
        product.style.display = "";
      } else {
        product.style.display = "none";
      }
    });
  });
}

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
      text: item + ' is now available at $' + price + ', under your threshold price of $' + threshold // TODO: fix this 
    }),
  })
}

// Fetching data from firebase
async function fetchData() {
  try {
    const response = await fetch("http://localhost:8080/fetchData");
    const coupons_data = await response.json();
    const compTableRows = document.querySelector('.compTableRows');
    compTableRows.innerHTML = "";

    coupons_data.forEach(coupon => {
      compTableRows.innerHTML += `<tr class="hover:bg-red-50"> <td class="item py-3 px-4 font-semibold bg-gray-100 border-r">${coupon.retailer}</td><th class="py-3 px-4 text-left">${coupon.code}</th><th class="py-3 px-4 text-left">${coupon.description}</th> <th class="py-3 px-4">ACOUPON CODE #3</th></tr>`
    })

  } catch (error) {
    console.error("Error occured while fetching data:", error);
  }
}

fetchData(); 