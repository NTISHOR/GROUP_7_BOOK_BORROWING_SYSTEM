const itemList = document.getElementById('itemList');
const totalCountElement = document.getElementById('totalCount');

// 1. Load data
let borrowedBooks = JSON.parse(localStorage.getItem('borrowedBooks')) || [];

function displayCart() {
    if (!itemList) return;
    itemList.innerHTML = ""; 
    
    // If no books, show a message
    if (borrowedBooks.length === 0) {
        itemList.innerHTML = "<p style='text-align:center; padding: 20px; color: #666;'>Your list is empty. Go back to the Library to add books!</p>";
        if(totalCountElement) totalCountElement.innerText = "0";
        return;
    }

    // Show the books
    borrowedBooks.forEach((book, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = "cart-item";
        const bookImg = book.image || "https://via.placeholder.com/60x80?text=Book";
        
        itemDiv.innerHTML = `
            <img src="${bookImg}" alt="Book Cover">
            <div class="item-details">
                <h4>${book.title}</h4>
                <p>${book.author || 'G7 Author'}</p>
            </div>
            <button class="remove-btn" onclick="removeItem(${index})">Remove</button>
        `;
        itemList.appendChild(itemDiv);
    });

    if(totalCountElement) totalCountElement.innerText = borrowedBooks.length;
}

// 2. Remove Book
window.removeItem = function(index) {
    borrowedBooks.splice(index, 1);
    localStorage.setItem('borrowedBooks', JSON.stringify(borrowedBooks));
    displayCart();
};

// 3. Confirm Function (NO alerts, NO dashboard redirects)
window.confirmBorrow = function() {
    const currentCart = JSON.parse(localStorage.getItem('borrowedBooks')) || [];

    if (currentCart.length === 0) {
        alert("Your borrowing list is empty!");
        return;
    }
    
    // Using './' tells the browser to look in the EXACT same folder as cart.html
    window.location.href = "./borrow_detail.html"; 
};

// Start the display
displayCart();