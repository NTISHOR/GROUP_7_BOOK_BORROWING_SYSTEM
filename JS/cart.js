const itemList = document.getElementById("itemList");
const totalCountElement = document.getElementById("totalCount");

// 1. Get data from LocalStorage
let borrowedBooks = JSON.parse(localStorage.getItem("borrowedBooks")) || [];

function displayCart() {
  itemList.innerHTML = ""; // Clear list

  if (borrowedBooks.length === 0) {
    itemList.innerHTML =
      "<p>Your list is empty. Go back and add some books!</p>";
    totalCountElement.innerText = "0";
    return;
  }

  borrowedBooks.forEach((book, index) => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "cart-item";
    
    // FIX: Point to your local folder. 
    // We use book.image_name because that's what your SQL update saved.
    const imagePath = `assets/images/${book.image_name}`;

    itemDiv.innerHTML = `
            <img src="${imagePath}" alt="${book.title}" onerror="this.src='assets/images/php.png'">
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
window.removeItem = function (index) {
  borrowedBooks.splice(index, 1);
  localStorage.setItem("borrowedBooks", JSON.stringify(borrowedBooks));
  localStorage.setItem("cartTotal", borrowedBooks.length);
  displayCart();
};

// Initialize the page
displayCart();