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
