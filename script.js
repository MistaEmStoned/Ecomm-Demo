// ELEMENT REFERENCES
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const cartToggle = document.getElementById('cartToggle');
const cartPanel = document.getElementById('cartPanel');
const closeCartBtn = document.getElementById('closeCartBtn');
const productList = document.getElementById('productList');
const searchInput = document.getElementById('searchInput');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotalEl = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const headerCartCount = document.getElementById('headerCartCount');

let products = [];
let cart = JSON.parse(localStorage.getItem('cart')) || {};

// ---------------- NAV TOGGLE (MOBILE ONLY)
if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('visible');
  });
}

// ---------------- CART TOGGLE
if (cartToggle && cartPanel) {
  cartToggle.addEventListener('click', () => {
    cartPanel.classList.add('visible');
    if (navMenu) navMenu.classList.remove('visible');
  });
}

if (closeCartBtn && cartPanel) {
  closeCartBtn.addEventListener('click', () => {
    cartPanel.classList.remove('visible');
  });
}

// ---------------- LOAD PRODUCTS
fetch('products.json')
  .then(res => res.json())
  .then(data => {
    products = data;
    renderProducts(products);
  })
  .catch(() => {
    if (productList) {
      productList.innerHTML = '<p style="text-align:center; color:red;">Failed to load products.</p>';
    }
  });

// ---------------- RENDER PRODUCTS
function renderProducts(list) {
  if (!productList) return;
  productList.innerHTML = '';
  if(list.length === 0){
    productList.innerHTML = '<p style="grid-column:1/-1; text-align:center;">No products found.</p>';
    return;
  }

  list.forEach(product => {
    const productDiv = document.createElement('article');
    productDiv.className = 'product';
    productDiv.setAttribute('tabindex', '0');
    productDiv.innerHTML = `
      ${product.badge ? `<span class="badge ${product.badge.toLowerCase().replace(/\s/g, '-')}">${product.badge}</span>` : ''}
      <img src="${product.image}" alt="${product.name}" width="100%" loading="lazy" />
      <h3>${product.name}</h3>
      ${product.weight ? `<p class="weight">${product.weight}</p>` : ''}
      ${product.rating ? `<div class="rating" aria-label="Rating ${product.rating} out of 5 stars">${"⭐️".repeat(Math.floor(product.rating))} (${product.rating.toFixed(1)})</div>` : ''}
      <div class="price">₱${product.price.toFixed(2)}</div>
      <button class="add-btn" aria-label="Add ${product.name} to cart" data-id="${product.id}">+</button>
    `;
    productList.appendChild(productDiv);
  });
}

// ---------------- ADD TO CART
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  if (cart[productId]) cart[productId].qty++;
  else cart[productId] = { ...product, qty: 1 };

  updateCart();
  saveCart();
  showCartPanel();
}

// ---------------- RENDER CART
function renderCart() {
  if (!cartItemsContainer) return;
  cartItemsContainer.innerHTML = '';
  const cartEntries = Object.values(cart);

  if(cartEntries.length === 0){
    cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
    if(cartTotalEl) cartTotalEl.textContent = '0.00';
    toggleCartCount(0);
    return;
  }

  let total = 0;
  cartEntries.forEach(item => {
    total += item.price * item.qty;
    const li = document.createElement('li');
    li.className = 'cart-item';
    li.setAttribute('data-id', item.id);
    li.innerHTML = `
      <div>
        <h4>${item.name}</h4>
        <p>₱${item.price.toFixed(2)} × ${item.qty} = ₱${(item.price * item.qty).toFixed(2)}</p>
      </div>
      <div class="qty-controls" role="group" aria-label="Adjust quantity">
        <button class="qty-btn decrease" aria-label="Decrease quantity">-</button>
        <span aria-live="polite" aria-atomic="true">${item.qty}</span>
        <button class="qty-btn increase" aria-label="Increase quantity">+</button>
        <button class="qty-btn remove" aria-label="Remove item">&times;</button>
      </div>
    `;
    cartItemsContainer.appendChild(li);

    // Qty / Remove handlers
    li.querySelector('.decrease')?.addEventListener('click', () => {
      if (cart[item.id].qty > 1) cart[item.id].qty--;
      else delete cart[item.id];
      updateCart();
      saveCart();
    });
    li.querySelector('.increase')?.addEventListener('click', () => {
      cart[item.id].qty++;
      updateCart();
      saveCart();
    });
    li.querySelector('.remove')?.addEventListener('click', () => {
      delete cart[item.id];
      updateCart();
      saveCart();
    });
  });

  if(cartTotalEl) cartTotalEl.textContent = total.toFixed(2);
  toggleCartCount(cartEntries.reduce((acc, i) => acc + i.qty, 0));
}

// ---------------- SAVE CART
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// ---------------- SEARCH FILTER
searchInput?.addEventListener('input', e => {
  const query = e.target.value.trim().toLowerCase();
  const filtered = products.filter(p => p.name.toLowerCase().includes(query));
  renderProducts(filtered);
});

// ---------------- ADD BUTTONS EVENT (DELEGATION)
productList?.addEventListener('click', e => {
  if (e.target.classList.contains('add-btn')) {
    const id = Number(e.target.getAttribute('data-id'));
    addToCart(id);
  }
});

// ---------------- CHECKOUT ALERT
checkoutBtn?.addEventListener('click', () => {
  alert('Checkout functionality coming soon!');
});

// ---------------- SHOW CART
function showCartPanel() {
  cartPanel?.classList.add('visible');
}

// ---------------- TOGGLE CART COUNT
function toggleCartCount(count){
  if (!headerCartCount) return;
  if(count > 0){
    headerCartCount.textContent = count;
    headerCartCount.classList.remove('hidden');
  } else {
    headerCartCount.classList.add('hidden');
  }
}

// ---------------- INITIAL CART RENDER
function updateCart() {
  renderCart();
}

updateCart();
