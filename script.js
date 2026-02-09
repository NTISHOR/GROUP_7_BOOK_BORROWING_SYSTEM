// --- 1. INITIALIZATION & DATA ---
const searchInput = document.getElementById('search');
const categorySelect = document.getElementById('category');
const productGrid = document.getElementById('productGrid');
const cartCountElement = document.getElementById('cart-count');

let borrowedBooks = JSON.parse(localStorage.getItem('borrowedBooks')) || [];

updateCartUI();
checkExistingBorrowed();

// --- 2. SEARCH & FILTER LOGIC ---
function filterBooks() {
    const term = searchInput.value.toLowerCase();
    const cat = categorySelect.value;
    const cards = document.querySelectorAll('.product-card');
    let visibleCount = 0; 

    cards.forEach(card => {
        const title = card.getAttribute('data-title').toLowerCase();
        const category = card.getAttribute('data-category');
        const matchesSearch = title.includes(term);
        const matchesCategory = cat === "" || category === cat;

        card.style.display = (matchesSearch && matchesCategory) ? "flex" : "none";
        if (matchesSearch && matchesCategory) visibleCount++;
    });

    const existingMsg = document.getElementById('no-results-msg');
    if (existingMsg) existingMsg.remove();

    if (visibleCount === 0 && productGrid) {
        const noResults = document.createElement('div');
        noResults.id = 'no-results-msg';
        noResults.style.gridColumn = "1 / -1";
        noResults.style.textAlign = "center";
        noResults.style.padding = "40px";
        noResults.innerHTML = `<h2 style="color: #666;">No books found! 📚</h2>`;
        productGrid.appendChild(noResults);
    }
}

if (searchInput) searchInput.oninput = filterBooks;
if (categorySelect) categorySelect.onchange = filterBooks;

// --- 3. MAIN GRID INTERACTION ---
if (productGrid) {
    productGrid.addEventListener('click', (e) => {
        const card = e.target.closest('.product-card');
        if (!card) return; 

        // If clicking the borrow button on the main grid
        if (e.target.tagName === 'BUTTON' && !e.target.disabled) {
            handleBorrow(card);
            return; 
        }
        // Otherwise, open the modal
        showQuickView(card);
    });
}

// --- 4. QUICK VIEW (MODAL) FUNCTIONS ---
function showQuickView(card) {
    const modal = document.getElementById('bookModal');
    if (!modal) return;

    const title = card.getAttribute('data-title');
    const category = card.getAttribute('data-category');
    const img = card.querySelector('img').src;
    const author = card.querySelector('p').innerText;

    document.getElementById("modalTitle").innerText = title;
    document.getElementById("modalAuthor").innerText = author;
    document.getElementById("modalCat").innerText = category;
    document.getElementById("modalImg").src = img;

    modal.style.display = "block";

    const modalBorrowBtn = document.getElementById("modalBorrowBtn");
    const isAlreadyBorrowed = borrowedBooks.some(b => b.title === title);

    if (isAlreadyBorrowed) {
        modalBorrowBtn.innerText = "Already Borrowed";
        modalBorrowBtn.classList.add('borrowed-btn'); // Matches CSS for disabled look
        modalBorrowBtn.disabled = true;
    } else {
        modalBorrowBtn.innerText = "Borrow Now";
        modalBorrowBtn.classList.remove('borrowed-btn');
        modalBorrowBtn.disabled = false;
        
        // This is the key: clicking borrow inside the modal triggers the fly
        modalBorrowBtn.onclick = () => {
            handleBorrow(card);
            modal.style.display = "none";
        };
    }
}

// --- 5. BORROWING & UI UPDATES ---
function handleBorrow(card) {
    const title = card.getAttribute('data-title');
    const category = card.getAttribute('data-category');
    const bookImg = card.querySelector('img');
    const button = card.querySelector('button');
    const badge = card.querySelector('.badge');

    animateToCart(bookImg); // Animation Triggered

    borrowedBooks.push({ title, category });
    localStorage.setItem('borrowedBooks', JSON.stringify(borrowedBooks));

    setBorrowedState(button, badge);
    updateCartUI();
}

function setBorrowedState(button, badge) {
    if (button) {
        button.innerText = "Borrowed";
        button.disabled = true;
    }
    if (badge) {
        badge.innerText = "Borrowed";
        badge.className = "badge borrowed"; 
    }
}

function updateCartUI() {
    if (cartCountElement) {
        cartCountElement.innerText = borrowedBooks.length;
    }
}

function checkExistingBorrowed() {
    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card => {
        const title = card.getAttribute('data-title');
        const isBorrowed = borrowedBooks.some(b => b.title === title);
        if (isBorrowed) {
            const button = card.querySelector('button');
            const badge = card.querySelector('.badge');
            setBorrowedState(button, badge);
        }
    });
}

// --- 6. ANIMATION FIX ---
function animateToCart(bookImageElement) {
    const cart = document.querySelector('.cart-link'); 
    if (!cart || !bookImageElement) return;

    const flyingImg = document.createElement('img');
    flyingImg.src = bookImageElement.src;
    flyingImg.classList.add('flying-book');
    
    // Get exact starting position
    const rect = bookImageElement.getBoundingClientRect();
    flyingImg.style.left = rect.left + 'px';
    flyingImg.style.top = rect.top + 'px';
    flyingImg.style.width = rect.width + 'px';
    
    document.body.appendChild(flyingImg);

    const cartRect = cart.getBoundingClientRect();

    // Use a slight delay to ensure the transition triggers
    setTimeout(() => {
        flyingImg.style.left = (cartRect.left + 10) + 'px';
        flyingImg.style.top = (cartRect.top + 10) + 'px';
        flyingImg.style.width = '20px';
        flyingImg.style.height = '30px';
        flyingImg.style.opacity = '0.5';
        flyingImg.style.transform = 'rotate(720deg)';
    }, 50);

    setTimeout(() => {
        flyingImg.remove();
        cart.classList.add('cart-bounce');
        setTimeout(() => cart.classList.remove('cart-bounce'), 300);
    }, 850);
}

// --- 7. SIDEBAR & GLOBAL LISTENERS ---
const menuIcon = document.getElementById('menuIcon');
const sidebar = document.getElementById('mySidebar');
const closeSidebar = document.getElementById('closeSidebar');

if (menuIcon) menuIcon.onclick = () => sidebar.classList.add('open');
if (closeSidebar) closeSidebar.onclick = () => sidebar.classList.remove('open');

window.addEventListener('click', (e) => {
    const modal = document.getElementById('bookModal');
    if (e.target.classList.contains('close-modal') || e.target === modal) {
        if (modal) modal.style.display = "none";
    }
    if (sidebar && sidebar.classList.contains('open')) {
        if (e.target !== sidebar && !sidebar.contains(e.target) && e.target !== menuIcon && !menuIcon.contains(e.target)) {
            sidebar.classList.remove('open');
        }
    }
});

window.addEventListener('keydown', (e) => {
    if (e.key === "Escape") {
        const modal = document.getElementById('bookModal');
        if (modal) modal.style.display = "none";
        if (sidebar) sidebar.classList.remove('open');
    }
});