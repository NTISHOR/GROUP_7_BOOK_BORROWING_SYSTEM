const itemList = document.getElementById('itemList');
const totalCountElement = document.getElementById('totalCount');

// 1. Get data from LocalStorage
let borrowedBooks = JSON.parse(localStorage.getItem('borrowedBooks')) || [];

function displayCart() {
    itemList.innerHTML = ""; // Clear list
    
    if (borrowedBooks.length === 0) {
        itemList.innerHTML = "<p>Your list is empty. Go back and add some books!</p>";
        totalCountElement.innerText = "0";
        return;
    }

    borrowedBooks.forEach((book, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = "cart-item";
        itemDiv.innerHTML = `
            <img src="${book.image}" alt="Book Cover">
            <div class="item-details">
                <h4>${book.title}</h4>
                <p>${book.author}</p>
            </div>
            <button class="remove-btn" onclick="removeItem(${index})">Remove</button>
        `;
        itemList.appendChild(itemDiv);
    });

    totalCountElement.innerText = borrowedBooks.length;
}

// 2. Remove Function
window.removeItem = function(index) {
    // Remove the specific book from the array
    borrowedBooks.splice(index, 1);
    
    // Update LocalStorage
    localStorage.setItem('borrowedBooks', JSON.stringify(borrowedBooks));
    localStorage.setItem('cartTotal', borrowedBooks.length);
    
    // Refresh the display
    displayCart();
};

// Initialize the page
displayCart();