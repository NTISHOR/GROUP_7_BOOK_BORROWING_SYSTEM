const searchInput = document.getElementById('search');
const categorySelect = document.getElementById('category');
const productGrid = document.getElementById('productGrid');
const products = Array.from(productGrid.getElementsByClassName('product-card'));

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