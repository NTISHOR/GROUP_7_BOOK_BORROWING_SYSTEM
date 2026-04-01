<?php
session_start();
include 'db.php';

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    header("Location: login.html");
    exit();
}

// Fetch books from the database
$query = "SELECT * FROM books";
$result = mysqli_query($conn, $query);
?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>G7 BBS Library</title>
    <style>
      :root {
        --primary: #1e40af;
        --primary-dark: #1e3a8a;
        --text: #0f172a;
        --gray: #64748b;
        --light: #f8fafc;
        --success: #10b981;
        --danger: #ef4444;
      }

      * { margin: 0; padding: 0; box-sizing: border-box; }

      body {
        font-family: "Segoe UI", system-ui, -apple-system, sans-serif;
        background: linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%);
        color: var(--text);
        min-height: 100vh;
        display: flex;
        flex-direction: column;
      }

      header {
        background: white;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
        padding: 18px 5%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: sticky;
        top: 0;
        z-index: 100;
      }

      header h1 { font-size: 28px; color: var(--primary); display: flex; align-items: center; gap: 10px; }

      nav { display: flex; align-items: center; gap: 28px; }
      nav a { color: var(--gray); text-decoration: none; font-weight: 500; cursor: pointer; }

      .cart-link { position: relative; font-weight: 600; }
      #cart-count {
        position: absolute;
        top: -8px;
        right: -12px;
        background: var(--danger);
        color: white;
        font-size: 10px;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .search-filter { padding: 40px 5% 30px; background: white; text-align: center; }
      .search-bar { display: flex; max-width: 620px; margin: 0 auto; gap: 12px; }
      #search, #category { padding: 12px; border: 1.5px solid #e2e8f0; border-radius: 10px; font-size: 16px; }
      #search { flex: 1; }

      .product-grid {
        display: grid;
        gap: 28px;
        padding: 40px 5%;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      }

      .product-card {
        background: white;
        border-radius: 20px;
        padding: 20px;
        box-shadow: 0 10px 20px rgba(0,0,0,0.05);
        text-align: center;
        transition: 0.3s;
        display: flex;
        flex-direction: column;
        height: 100%;
      }
      .product-card:hover { transform: translateY(-10px); }
      .product-card img { width: 100%; height: 220px; object-fit: cover; border-radius: 10px; margin-bottom: 15px; }
      .product-card h3 { font-size: 1.1rem; margin-bottom: 5px; min-height: 2.6em; }
      .product-card p { color: var(--gray); font-size: 0.9rem; margin-bottom: 15px; }
      
      .product-card button {
        background: var(--primary);
        color: white;
        border: none;
        padding: 12px;
        border-radius: 8px;
        cursor: pointer;
        width: 100%;
        font-weight: bold;
        margin-top: auto;
      }
      .product-card button:hover { background: var(--primary-dark); }

      footer { background: #0f172a; color: white; text-align: center; padding: 25px; margin-top: auto; }
    </style>
  </head>
  <body>
    <header>
      <h1>📚 G7 BBS</h1>
      <nav>
        <span style="color: var(--gray); font-weight: bold;">
          Hi, <?php echo htmlspecialchars($_SESSION['user_name']); ?>
        </span>
        <a href="index.html">Home</a>
        <a href="cart.html" class="cart-link">🛒 Cart <span id="cart-count">0</span></a>
        <a href="logout.php">Logout</a>
      </nav>
    </header>

    <section class="search-filter">
      <div class="search-bar">
        <input type="text" id="search" placeholder="Search by title or author..." onkeyup="filterBooks()" />
        <select id="category" onchange="filterBooks()">
          <option value="">All Categories</option>
          <option value="Programming">Programming</option>
          <option value="Database">Database</option>
          <option value="Fiction">Fiction</option>
          <option value="Design">Design</option>
          <option value="Logistics">Logistics</option>
          <option value="Mathematics">Mathematics</option>
          <option value="Agriculture">Agriculture</option>
          <option value="System">System</option>
        </select>
      </div>
    </section>

   <div class="product-grid" id="productGrid">
  <?php while($row = mysqli_fetch_assoc($result)): 
    // This looks inside your local assets folder
    $imgUrl = "assets/images/" . $row['image_name'];
  ?>
    <div class="product-card" data-category="<?php echo htmlspecialchars($row['category']); ?>">
      <img src="<?php echo $imgUrl; ?>" alt="Book Cover" />
      <h3><?php echo htmlspecialchars($row['title']); ?></h3>
      <p><?php echo htmlspecialchars($row['author']); ?></p>
      <button onclick="addToCart('<?php echo addslashes($row['title']); ?>', '<?php echo addslashes($row['author']); ?>', '<?php echo $imgUrl; ?>')">
        Borrow Book
      </button>
    </div>
  <?php endwhile; ?>
</div>

    <footer>
      <p>&copy; 2026 G7 Book Borrowing System | All Rights Reserved</p>
    </footer>

    <script>
    // 1. CHANGED: Now using 'borrowedBooks' to match cart.html and borrow_detail.html
    let cart = JSON.parse(localStorage.getItem('borrowedBooks')) || [];
    updateCartCount();

    function addToCart(title, author, imagePath) {
        // 2. FIXED: Extracting only the filename (e.g., 'php.png') 
        // This prevents double-paths like 'assets/images/assets/images/php.png'
        const imageName = imagePath.split('/').pop();

        const book = { 
            title: title, 
            author: author, 
            image_name: imageName 
        };

        cart.push(book);

        // 3. CHANGED: Saving to 'borrowedBooks'
        localStorage.setItem('borrowedBooks', JSON.stringify(cart));
        
        // Also update the total count for the header badge
        localStorage.setItem('cartTotal', cart.length);
        
        updateCartCount();
        alert(title + " added to cart!");
    }

    function updateCartCount() {
        const countEl = document.getElementById('cart-count');
        if(countEl) {
            countEl.innerText = cart.length;
        }
    }

    function filterBooks() {
        const searchValue = document.getElementById('search').value.toLowerCase();
        const categoryValue = document.getElementById('category').value;
        const cards = document.getElementsByClassName('product-card');

        for (let card of cards) {
            const title = card.querySelector('h3').innerText.toLowerCase();
            const author = card.querySelector('p').innerText.toLowerCase();
            const category = card.getAttribute('data-category');
            
            const matchesSearch = title.includes(searchValue) || author.includes(searchValue);
            const matchesCategory = categoryValue === "" || category === categoryValue;

            if (matchesSearch && matchesCategory) {
                card.style.display = "flex";
            } else {
                card.style.display = "none";
            }
        }
    }
</script>
  </body>
</html>