const cartList = document.getElementById('cart-list');
const subtotalCount = document.getElementById('subtotal-count');
const totalItemsFinal = document.getElementById('total-items-final');

// Load the data saved by script.js
let borrowedBooks = JSON.parse(localStorage.getItem('borrowedBooks')) || [];

function renderCart() {
    cartList.innerHTML = ""; 
    
    if (borrowedBooks.length === 0) {
        cartList.innerHTML = "<h3>Your cart is empty.</h3><a href='index.html'>Go back to borrow books</a>";
    }

    borrowedBooks.forEach((book, index) => {
        const bookDiv = document.createElement('div');
        bookDiv.className = 'book-card';
        bookDiv.innerHTML = `
            <img src="${book.image}" alt="Book Cover">
            <div class="book-info">
                <h4>${book.title}</h4>
                <p style="color: #777;">By ${book.author}</p>
            </div>
            <button class="remove-btn" onclick="removeItem(${index})">🗑️</button>
        `;
        cartList.appendChild(bookDiv);
    });

    // Update the Summary side-bar
    subtotalCount.innerText = borrowedBooks.length;
    totalItemsFinal.innerText = borrowedBooks.length;
}

// Function to remove a single book
window.removeItem = function(index) {
    borrowedBooks.splice(index, 1);
    localStorage.setItem('borrowedBooks', JSON.stringify(borrowedBooks));
    localStorage.setItem('cartTotal', borrowedBooks.length);
    renderCart();
};

renderCart();