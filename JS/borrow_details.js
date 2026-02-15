const borrowedBooks = JSON.parse(localStorage.getItem("borrowedBooks")) || [];
const LIB_FEE_PER_BOOK = 100;
let currentDeliveryFee = 0;

function updateCalculations() {
  const count = borrowedBooks.length;
  const totalLibFee = count * LIB_FEE_PER_BOOK;
  const finalTotal = totalLibFee + currentDeliveryFee;

  document.getElementById("bookCount").textContent = count;
  document.getElementById("libFeeDisplay").textContent = "₦" + totalLibFee;
  document.getElementById("serviceFee").textContent = "₦" + currentDeliveryFee;
  document.getElementById("totalDisplay").textContent =
    "₦" + finalTotal.toFixed(2);

  localStorage.setItem("lastTotalCharge", finalTotal);
}

function selectOption(element, type) {
  const cards = element.parentElement.querySelectorAll(".option-card");
  cards.forEach((card) => card.classList.remove("active"));
  element.classList.add("active");

  if (type === "delivery") {
    currentDeliveryFee = parseInt(element.dataset.fee || 0);
    updateCalculations();
  }
}

function processOrder() {
  const name = document.getElementById("custName").value.trim();
  const phone = document.getElementById("custPhone").value.trim();
  const btn = document.getElementById("confirmBtn");
  const loader = document.getElementById("loader");
  const btnText = document.getElementById("btnText");

  if (!name || !phone) {
    alert("Please provide your Full Name and Phone Number.");
    return;
  }

  btn.disabled = true;
  btn.classList.add("loading");
  loader.style.display = "inline-block";
  btnText.textContent = "Processing...";

  setTimeout(() => {
    btnText.textContent = "Order Confirmed!";
    localStorage.removeItem("borrowedBooks");
    localStorage.setItem("cartTotal", 0);
    window.location.href = "success.html";
  }, 2800); // shortened for better UX feel
}

updateCalculations();
