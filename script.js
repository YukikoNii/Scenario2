<<<<<<< HEAD
// Price rows 
const rows = document.querySelectorAll('.compTable tbody tr');
console.log(rows); 

  rows.forEach(row => {
    const priceCells = Array.from(row.querySelectorAll('td:not(.item, .threshold)'));
    const threshold = parseInt(row.querySelector('.threshold').textContent.slice(1)); 
    const prices = priceCells.map(cell => {
        return parseInt(cell.textContent.slice(1));  
    });

    console.log(prices);

    // Calculate the lowest price
    const minPrice = Math.min(...prices);

    if (minPrice <= threshold) {

        // color the min price cell
        priceCells.forEach((cell, index) => {
        const cellPrice = prices[index];
        if (cellPrice === minPrice) {
            cell.classList.add('bg-yellow-200');
        }

    });
    }
  });
=======



var thresholds = document.querySelectorAll('.threshold');



// Update the highlighting everytime threshold is changed
thresholds.forEach(threshold => {

  const thresInput = threshold.querySelector('.thresPrice');
  if (thresInput) {
    thresInput.addEventListener("change", function(e) {
      e.preventDefault(); 
      highlightBestDeal(thresInput);
    });
  }

  document.addEventListener("DOMContentLoaded", function() {
    highlightBestDeal(threshold.querySelector('.thresPrice'));
  });
  
});


// Highlight the best deal under the user-set threshold

function highlightBestDeal(thresInput) {
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
      } else {
        console.log(thresInput);
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
    logo.innerHTML = "Honey"; 
    sidebar.classList.remove('w-16');
    sidebar.classList.add('w-64');
    collapsed = false;

    setTimeout( () => {
      navtexts.forEach(text => (text.style.display = "block"))

    button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" /></svg>';

    }, 100);   
    } else {
    logo.innerHTML = "H"; 
    navtexts.forEach(text => (text.style.display = "none"));
    sidebar.classList.remove('w-64');
    sidebar.classList.add('w-16');
    collapsed = true;

    button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5" /></svg>';
  }
}) 


var priceSearchBar = document.querySelector('.priceSearchBar');
priceSearchBar.addEventListener("submit", function(e) {
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
>>>>>>> 9a52338 (first commit)
