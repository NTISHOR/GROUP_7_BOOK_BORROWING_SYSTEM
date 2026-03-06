const API_BASE_URL = "http://localhost:3000";

const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("search");
const categorySelect = document.getElementById("category");
const cartCountEl = document.getElementById("cart-count");

let nextCursor = null;
let loading = false;

function getToken() {
  return localStorage.getItem("bbs_access_token");
}

/* ---------------- Toast ---------------- */

function showToast(message, type="success") {
  const container = document.getElementById("toast-container");

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = "toastOut 0.3s forwards";
    setTimeout(()=>toast.remove(),300);
  },2000);
}

/* ---------------- Skeleton Loader ---------------- */

function showSkeletons() {
  productGrid.innerHTML = "";

  for(let i=0;i<8;i++){
    const card = document.createElement("div");
    card.className = "skeleton-card";

    card.innerHTML = `
      <div class="skeleton-img"></div>
      <div class="skeleton-text"></div>
      <div class="skeleton-text small"></div>
    `;

    productGrid.appendChild(card);
  }
}

/* ---------------- Categories ---------------- */

async function loadCategories() {
  try {
    const res = await fetch(`${API_BASE_URL}/categories`);
    const json = await res.json();

    const categories = json.data || [];

    categorySelect.innerHTML = `<option value="">All Categories</option>`;

    categories.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat.id;
      option.textContent = cat.name;

      categorySelect.appendChild(option);
    });

  } catch(err) {
    console.error("Category error", err);
  }
}

/* ---------------- Books ---------------- */

async function loadBooks(reset=false) {

  if(loading) return;
  loading = true;

  if(reset){
    nextCursor = null;
    showSkeletons();
  }

  try {

    const q = searchInput.value.trim();
    const categoryId = categorySelect.value;

    const params = new URLSearchParams();
    params.set("limit",12);
    params.set("sort","newest");

    if(q) params.set("q",q);
    if(categoryId) params.set("categoryId",categoryId);
    if(nextCursor) params.set("cursor",nextCursor);

    const res = await fetch(`${API_BASE_URL}/books?${params}`);

    const json = await res.json();

    const books = json.data.items;
    nextCursor = json.data.pageInfo.nextCursor;

    if(reset) productGrid.innerHTML="";

    renderBooks(books);

  } catch(err){
    console.error(err);
    productGrid.innerHTML = `<p>Internal server error</p>`;
  }

  loading = false;
}

/* ---------------- Render books ---------------- */

function renderBooks(books){

  books.forEach(book=>{

    const available = book.availableCopies > 0;

    const card = document.createElement("div");
    card.className="product-card";

    card.innerHTML=`
      <span class="badge ${available?"available":"borrowed"}">
        ${available?"Available":"Borrowed"}
      </span>

      <img src="${book.coverImageUrl||""}">

      <div class="product-info">
        <h3>${book.title}</h3>
        <p>${book.author}</p>

        <button 
        ${!available?"disabled":""}
        data-id="${book.id}">
        ${available?"Borrow Book":"Unavailable"}
        </button>
      </div>
    `;

    const btn = card.querySelector("button");

    if(available){
      btn.addEventListener("click",()=>addToCart(book.id,btn));
    }

    productGrid.appendChild(card);
  });
}

/* ---------------- Add to cart ---------------- */

async function addToCart(bookId,btn){

  const token = getToken();

  if(!token){
    window.location.href="login.html";
    return;
  }

  try{

    const res = await fetch(`${API_BASE_URL}/cart/items`,{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        Authorization:`Bearer ${token}`
      },
      body:JSON.stringify({bookId})
    });

    if(!res.ok) throw new Error("Failed");

    showToast("Book added to cart");

    /* Button change */

    btn.textContent="Added ✓";
    btn.classList.add("added-btn");
    btn.disabled=true;

    /* Cart animation */

    cartCountEl.classList.add("cart-bounce");

    setTimeout(()=>{
      cartCountEl.classList.remove("cart-bounce");
    },400);

    loadCartCount();

  }catch(err){
    showToast("Error adding book","error");
  }
}

/* ---------------- Cart count ---------------- */

async function loadCartCount(){

  const token = getToken();
  if(!token) return;

  try{

    const res = await fetch(`${API_BASE_URL}/cart/count`,{
      headers:{Authorization:`Bearer ${token}`}
    });

    const json = await res.json();

    const count = json.data.count;

    cartCountEl.textContent=count;

  }catch(err){
    console.error(err);
  }
}

/* ---------------- Search ---------------- */

searchInput.addEventListener("input",()=>loadBooks(true));

categorySelect.addEventListener("change",()=>loadBooks(true));

/* ---------------- Infinite scroll ---------------- */

window.addEventListener("scroll",()=>{

  if(window.innerHeight+window.scrollY >= document.body.offsetHeight-200){

    if(nextCursor) loadBooks();

  }
});

/* ---------------- Init ---------------- */

async function init(){

  await loadCategories();
  await loadBooks(true);
  await loadCartCount();

}

init();