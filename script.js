/** @format */

// Cart functionality
let cart = JSON.parse(localStorage.getItem("activewear_cart")) || [];
let currentFilter = "all";
let cartModal;

// Sample product data
const products = [
  {
    id: 1,
    name: "Men's Running Shoes",
    price: 129.99,
    collection: "mens",
    badge: "NEW",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
  },
  {
    id: 2,
    name: "Men's Training Shorts",
    price: 49.99,
    collection: "mens",
    badge: null,
    image:
      "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=400&fit=crop",
  },
  {
    id: 3,
    name: "Men's Compression Shirt",
    price: 59.99,
    collection: "mens",
    badge: "SALE",
    image:
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&h=400&fit=crop",
  },
  {
    id: 4,
    name: "Men's Sport Watch",
    price: 199.99,
    collection: "mens-accessories",
    badge: "HOT",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
  },
  {
    id: 5,
    name: "Men's Gym Bag",
    price: 79.99,
    collection: "mens-accessories",
    badge: null,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
  },
  {
    id: 6,
    name: "Men's Water Bottle",
    price: 24.99,
    collection: "mens-accessories",
    badge: null,
    image:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop",
  },
  {
    id: 7,
    name: "Women's Training Leggings",
    price: 79.99,
    collection: "womens",
    badge: "NEW",
    image:
      "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400&h=400&fit=crop",
  },
  {
    id: 8,
    name: "Women's Sports Bra",
    price: 49.99,
    collection: "womens",
    badge: null,
    image:
      "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400&h=400&fit=crop",
  },
  {
    id: 9,
    name: "Women's Running Jacket",
    price: 119.99,
    collection: "womens",
    badge: "SALE",
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop",
  },
  {
    id: 10,
    name: "Women's Yoga Mat",
    price: 49.99,
    collection: "womens-accessories",
    badge: null,
    image:
      "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=400&fit=crop",
  },
  {
    id: 11,
    name: "Women's Fitness Tracker",
    price: 149.99,
    collection: "womens-accessories",
    badge: "HOT",
    image:
      "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&h=400&fit=crop",
  },
  {
    id: 12,
    name: "Women's Headband Set",
    price: 19.99,
    collection: "womens-accessories",
    badge: null,
    image:
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop",
  },
];

// Load products on page load
document.addEventListener("DOMContentLoaded", function () {
  loadProducts();
  updateCartCount();
  initializeScrollEffects();
  initializeContactForm();
  initializeCollectionCards();
  initializeFilterButtons();
  initializeCartModal();
  initializeCartButton();
  initializeHeroSlideshow();
});

// Load products dynamically
function loadProducts(filter = "all") {
  const container = document.getElementById("productsContainer");
  container.innerHTML = "";

  const filteredProducts =
    filter === "all"
      ? products
      : products.filter((p) => p.collection === filter);

  filteredProducts.forEach((product) => {
    const productCard = createProductCard(product);
    container.innerHTML += productCard;
  });

  // Add event listeners to all "Add to Cart" buttons
  document.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const productId = parseInt(this.dataset.productId);
      addToCart(productId);
    });
  });
}

// Create product card HTML
function createProductCard(product) {
  const collectionName = product.collection
    .replace("-", " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
  return `
        <div class="col-md-6 col-lg-4 col-xl-3">
            <div class="card product-card">
                ${
                  product.badge
                    ? `<span class="product-badge">${product.badge}</span>`
                    : ""
                }
                <img src="${product.image}" alt="${
    product.name
  }" class="product-image-real">
                <div class="card-body">
                    <span class="badge bg-secondary mb-2">${collectionName}</span>
                    <h5 class="card-title fw-bold">${product.name}</h5>
                    <p class="price mb-3">€${product.price.toFixed(2)}</p>
                    <button class="btn btn-primary w-100 add-to-cart-btn" data-product-id="${
                      product.id
                    }">
                        <i class="bi bi-cart-plus"></i> Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Add to cart functionality
function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  if (product) {
    cart.push(product);
    localStorage.setItem("activewear_cart", JSON.stringify(cart));
    updateCartCount();
    updateCartModal();
    showNotification(`${product.name} added to cart!`);
  }
}

// Update cart count
function updateCartCount() {
  const cartCount = document.getElementById("cartCount");
  cartCount.textContent = cart.length;
}

// Initialize cart modal
function initializeCartModal() {
  const cartModalElement = document.getElementById("cartModal");
  cartModal = new bootstrap.Modal(cartModalElement);
  updateCartModal();
}

// Initialize cart button
function initializeCartButton() {
  const cartButton = document.getElementById("cartButton");
  cartButton.addEventListener("click", function (e) {
    e.preventDefault();
    updateCartModal();
    cartModal.show();
  });
}

// Update cart modal
function updateCartModal() {
  const cartModalBody = document.getElementById("cartModalBody");
  const cartTotal = document.getElementById("cartTotal");

  if (cart.length === 0) {
    cartModalBody.innerHTML = `
      <div class="text-center py-5">
        <i class="bi bi-cart-x" style="font-size: 4rem; color: #ccc;"></i>
        <p class="text-muted mt-3">Your cart is empty</p>
      </div>
    `;
    cartTotal.textContent = "€0.00";
    return;
  }

  let total = 0;
  cartModalBody.innerHTML = "";

  cart.forEach((item, index) => {
    total += item.price;
    const collectionName = item.collection
      .replace("-", " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());

    const itemHTML = `
      <div class="cart-item d-flex align-items-center mb-3 pb-3 border-bottom">
        <img src="${item.image}" alt="${
      item.name
    }" class="cart-item-image me-3">
        <div class="flex-grow-1">
          <h6 class="mb-1">${item.name}</h6>
          <small class="text-muted">${collectionName}</small>
          <p class="mb-0 fw-bold mt-1">€${item.price.toFixed(2)}</p>
        </div>
        <button class="btn btn-sm btn-outline-danger" onclick="removeFromCart(${index})">
          <i class="bi bi-trash"></i>
        </button>
      </div>
    `;
    cartModalBody.innerHTML += itemHTML;
  });

  cartTotal.textContent = `€${total.toFixed(2)}`;
}

// Remove from cart
function removeFromCart(index) {
  const removedItem = cart[index];
  cart.splice(index, 1);
  localStorage.setItem("activewear_cart", JSON.stringify(cart));
  updateCartCount();
  updateCartModal();
  showNotification(`${removedItem.name} removed from cart`);
}

// Show notification
function showNotification(message) {
  // Create notification element
  const notification = document.createElement("div");
  notification.className =
    "alert alert-success position-fixed top-0 start-50 translate-middle-x mt-5";
  notification.style.zIndex = "9999";
  notification.innerHTML = `
        <i class="bi bi-check-circle-fill me-2"></i>${message}
    `;

  document.body.appendChild(notification);

  // Remove after 3 seconds
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Scroll effects for navbar
function initializeScrollEffects() {
  window.addEventListener("scroll", function () {
    const navbar = document.querySelector(".navbar");
    if (window.scrollY > 50) {
      navbar.style.padding = "0.5rem 0";
      navbar.style.boxShadow = "0 5px 20px rgba(0, 0, 0, 0.2)";
    } else {
      navbar.style.padding = "1rem 0";
      navbar.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
    }
  });
}

// Contact form handling
function initializeContactForm() {
  const form = document.getElementById("contactForm");
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Simulate form submission
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span class="loading"></span> Sending...';
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.disabled = false;
      form.reset();
      showNotification("Message sent successfully!");
    }, 2000);
  });
}

// Initialize collection cards
function initializeCollectionCards() {
  document.querySelectorAll(".collection-card").forEach((card) => {
    card.addEventListener("click", function () {
      const category = this.dataset.category;
      currentFilter = category;

      // Update filter buttons
      document.querySelectorAll("[data-filter]").forEach((btn) => {
        btn.classList.remove("active");
        if (btn.dataset.filter === category) {
          btn.classList.add("active");
        }
      });

      // Load filtered products
      loadProducts(category);

      // Scroll to products section
      const productsSection = document.getElementById("products");
      const offset = 80;
      const targetPosition = productsSection.offsetTop - offset;
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    });
  });
}

// Initialize filter buttons
function initializeFilterButtons() {
  document.querySelectorAll("[data-filter]").forEach((btn) => {
    btn.addEventListener("click", function () {
      const filter = this.dataset.filter;
      currentFilter = filter;

      // Update active state
      document.querySelectorAll("[data-filter]").forEach((b) => {
        b.classList.remove("active");
      });
      this.classList.add("active");

      // Load filtered products
      loadProducts(filter);
    });
  });
}

// Initialize Hero Slideshow
function initializeHeroSlideshow() {
  const slides = document.querySelectorAll(".hero-slide");
  const indicators = document.querySelectorAll(".hero-indicator");
  const prevBtn = document.getElementById("heroPrev");
  const nextBtn = document.getElementById("heroNext");
  let currentSlide = 0;
  let slideInterval;

  // Function to show specific slide
  function showSlide(index) {
    // Remove active class from all slides and indicators
    slides.forEach((slide) => slide.classList.remove("active"));
    indicators.forEach((indicator) => indicator.classList.remove("active"));

    // Add active class to current slide and indicator
    slides[index].classList.add("active");
    indicators[index].classList.add("active");
    currentSlide = index;
  }

  // Function to go to next slide
  function nextSlide() {
    let next = (currentSlide + 1) % slides.length;
    showSlide(next);
  }

  // Function to go to previous slide
  function prevSlide() {
    let prev = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(prev);
  }

  // Auto-play slideshow
  function startSlideshow() {
    slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
  }

  function stopSlideshow() {
    clearInterval(slideInterval);
  }

  // Event listeners for controls
  nextBtn.addEventListener("click", () => {
    nextSlide();
    stopSlideshow();
    startSlideshow(); // Restart auto-play
  });

  prevBtn.addEventListener("click", () => {
    prevSlide();
    stopSlideshow();
    startSlideshow(); // Restart auto-play
  });

  // Event listeners for indicators
  indicators.forEach((indicator, index) => {
    indicator.addEventListener("click", () => {
      showSlide(index);
      stopSlideshow();
      startSlideshow(); // Restart auto-play
    });
  });

  // Pause slideshow on hover
  const heroSection = document.querySelector(".hero-section");
  heroSection.addEventListener("mouseenter", stopSlideshow);
  heroSection.addEventListener("mouseleave", startSlideshow);

  // Start the slideshow
  startSlideshow();
}

// Update active nav link on scroll
function updateActiveNavLink() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

  window.addEventListener("scroll", () => {
    let current = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop - 200) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });
}

// Initialize active nav link tracking
document.addEventListener("DOMContentLoaded", function () {
  updateActiveNavLink();
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      // Update active state immediately on click
      document.querySelectorAll(".nav-link").forEach((link) => {
        link.classList.remove("active");
      });
      this.classList.add("active");

      const offset = 80;
      const targetPosition = target.offsetTop - offset;
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });

      // Close mobile menu if open
      const navbarCollapse = document.querySelector(".navbar-collapse");
      if (navbarCollapse.classList.contains("show")) {
        navbarCollapse.classList.remove("show");
      }
    }
  });
});
