const searchInput = document.getElementById('search');
const categorySelect = document.getElementById('category');
const productGrid = document.getElementById('productGrid');
const products = Array.from(productGrid.getElementsByClassName('product-card'));

// --- SEARCH & FILTER LOGIC ---
function filterBooks() {
  const searchTerm = searchInput.value.toLowerCase();
  const categoryTerm = categorySelect.value;

  products.forEach(product => {
    const title = product.dataset.title.toLowerCase();
    const author = product.dataset.author.toLowerCase();
    const category = product.dataset.category;

    const matchesSearch = title.includes(searchTerm) || author.includes(searchTerm);
    const matchesCategory = categoryTerm === "" || category === categoryTerm;

    if(matchesSearch && matchesCategory){
      product.style.display = "block";
    } else {
      product.style.display = "none";
    }
  });
}

searchInput.addEventListener('input', filterBooks);
categorySelect.addEventListener('change', filterBooks);

// --- CART & BORROW LOGIC ---
const cartCountElement = document.getElementById('cart-count');
const borrowButtons = document.querySelectorAll('.product-card button:not([disabled])');

// Initialize cart count from local storage
let cartCount = localStorage.getItem('cartTotal') ? parseInt(localStorage.getItem('cartTotal')) : 0;

// Update badge on page load
updateCartUI();

borrowButtons.forEach(button => {
    button.addEventListener('click', () => {
        // 1. Get book details from the HTML data attributes
        const card = button.closest('.product-card');
        const bookData = {
            title: card.getAttribute('data-title'),
            author: card.getAttribute('data-author'),
            image: card.querySelector('img').src
        };

        // 2. Get existing list of borrowed books from memory
        let borrowedBooks = JSON.parse(localStorage.getItem('borrowedBooks')) || [];
        
        // 3. Add the new book and update count
        borrowedBooks.push(bookData);
        cartCount = borrowedBooks.length;
        
        // 4. Save everything back to localStorage
        localStorage.setItem('borrowedBooks', JSON.stringify(borrowedBooks));
        localStorage.setItem('cartTotal', cartCount);
        
        // 5. Update the UI
        updateCartUI();
        
        // Feedback on the button
        button.innerText = "Added!";
        button.disabled = true;
        button.style.backgroundColor = "#ccc";
    });
});

function updateCartUI() {
    if (cartCountElement) {
        cartCountElement.innerText = cartCount;
        cartCountElement.style.display = cartCount > 0 ? 'block' : 'none';
    }
}