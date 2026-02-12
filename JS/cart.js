const itemList = document.getElementById('itemList');
const totalCountElement = document.getElementById('totalCount');

// 1. Get data from Local Storage
let borrowedBooks = JSON.parse(localStorage.getItem('borrowedBooks')) || [];

function displayCart() {
    if (!itemList) return; // Safety check
    itemList.innerHTML = ""; 
    
    if (borrowedBooks.length === 0) {
        itemList.innerHTML = "<p style='text-align:center; padding: 20px;'>Your list is empty. Go back and add some books!</p>";
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
    borrowedBooks.splice(index, 1);
    
    // Update Local Storage
    localStorage.setItem('borrowedBooks', JSON.stringify(borrowedBooks));
    localStorage.setItem('cartTotal', borrowedBooks.length);
    
    displayCart();
};

// 3. Confirm Borrowing Function
window.confirmBorrow = function() {
    if (borrowedBooks.length === 0) {
        alert("Your borrowing list is empty!");
        return;
    }
    alert("Success! You have borrowed " + borrowedBooks.length + " books. Please return them within 14 days.");
    
    // Clear the cart after successful borrowing
    localStorage.removeItem('borrowedBooks');
    localStorage.setItem('cartTotal', 0);
    window.location.href = "dashborad.html"; // Ensure this matches your filename
};

// Initialize the page
displayCart();