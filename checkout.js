/** @format */

// Get cart from localStorage
let cart = JSON.parse(localStorage.getItem("activewear_cart")) || [];

// Load cart on page load
document.addEventListener("DOMContentLoaded", function () {
  updateCartCount();
  loadCheckoutItems();
  calculateTotals();
  initializeCheckoutForm();
  initializeCartButton();
});

// Update cart count
function updateCartCount() {
  const cartCount = document.getElementById("cartCount");
  cartCount.textContent = cart.length;
}

// Load checkout items
function loadCheckoutItems() {
  const container = document.getElementById("checkoutCartItems");

  if (cart.length === 0) {
    container.innerHTML = `
            <div class="text-center py-4">
                <i class="bi bi-cart-x" style="font-size: 3rem; color: #ccc;"></i>
                <p class="text-muted mt-3">Your cart is empty</p>
                <a href="index.html" class="btn btn-primary">Start Shopping</a>
            </div>
        `;
    return;
  }

  container.innerHTML = "";

  cart.forEach((item, index) => {
    const itemHTML = `
            <div class="checkout-item d-flex align-items-center mb-3 pb-3 border-bottom">
                <img src="${item.image}" alt="${
      item.name
    }" class="checkout-item-image me-3">
                <div class="flex-grow-1">
                    <h6 class="mb-1">${item.name}</h6>
                    <small class="text-muted">Qty: 1</small>
                </div>
                <div class="text-end">
                    <p class="mb-0 fw-bold">$${item.price.toFixed(2)}</p>
                    <button class="btn btn-sm btn-link text-danger p-0" onclick="removeFromCart(${index})">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        `;
    container.innerHTML += itemHTML;
  });
}

// Calculate totals
function calculateTotals() {
  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
  const shipping = subtotal > 50 ? 0 : 10;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  document.getElementById(
    "checkoutSubtotal"
  ).textContent = `€${subtotal.toFixed(2)}`;
  document.getElementById("checkoutShipping").textContent =
    shipping === 0 ? "FREE" : `€${shipping.toFixed(2)}`;
  document.getElementById("checkoutTax").textContent = `€${tax.toFixed(2)}`;
  document.getElementById("checkoutTotal").textContent = `€${total.toFixed(2)}`;
}

// Remove from cart
function removeFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem("activewear_cart", JSON.stringify(cart));
  updateCartCount();
  loadCheckoutItems();
  calculateTotals();
  showNotification("Item removed from cart");
}

// Initialize checkout form
function initializeCheckoutForm() {
  const form = document.getElementById("checkoutForm");
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (cart.length === 0) {
      showNotification("Your cart is empty", "warning");
      return;
    }

    // Simulate order processing
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span class="loading"></span> Processing...';
    btn.disabled = true;

    setTimeout(() => {
      // Clear cart
      cart = [];
      localStorage.setItem("activewear_cart", JSON.stringify(cart));

      // Show success modal
      const successModal = new bootstrap.Modal(
        document.getElementById("successModal")
      );
      successModal.show();

      btn.innerHTML = originalText;
      btn.disabled = false;
    }, 2000);
  });
}

// Initialize cart button
function initializeCartButton() {
  const cartButton = document.getElementById("cartButton");
  cartButton.addEventListener("click", function (e) {
    e.preventDefault();
    window.location.href = "checkout.html";
  });
}

// Show notification
function showNotification(message, type = "success") {
  const notification = document.createElement("div");
  notification.className = `alert alert-${type} position-fixed top-0 start-50 translate-middle-x mt-5`;
  notification.style.zIndex = "9999";
  notification.innerHTML = `
        <i class="bi bi-${
          type === "success" ? "check-circle-fill" : "exclamation-triangle-fill"
        } me-2"></i>${message}
    `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}
