const products = [
  { id: 1, name: "Laptop", price: 500, image: "https://via.placeholder.com/220x150" },
  { id: 2, name: "Headphones", price: 50, image: "https://via.placeholder.com/220x150" },
  { id: 3, name: "Smartphone", price: 300, image: "https://via.placeholder.com/220x150" },
  { id: 4, name: "Watch", price: 120, image: "https://via.placeholder.com/220x150" },
  { id: 5, name: "Tablet", price: 250, image: "https://via.placeholder.com/220x150" },
  { id: 6, name: "Keyboard", price: 30, image: "https://via.placeholder.com/220x150" },
  { id: 7, name: "Mouse", price: 25, image: "https://via.placeholder.com/220x150" },
  { id: 8, name: "Monitor", price: 200, image: "https://via.placeholder.com/220x150" },
  { id: 9, name: "Printer", price: 150, image: "https://via.placeholder.com/220x150" },
  { id: 10, name: "Camera", price: 400, image: "https://via.placeholder.com/220x150" },
  { id: 11, name: "Speaker", price: 80, image: "https://via.placeholder.com/220x150" },
  { id: 12, name: "Smartwatch", price: 150, image: "https://via.placeholder.com/220x150" },
  { id: 13, name: "External HDD", price: 90, image: "https://via.placeholder.com/220x150" },
  { id: 14, name: "USB Drive", price: 15, image: "https://via.placeholder.com/220x150" },
  { id: 15, name: "Microphone", price: 60, image: "https://via.placeholder.com/220x150" },
  { id: 16, name: "Webcam", price: 70, image: "https://via.placeholder.com/220x150" },
  { id: 17, name: "Router", price: 100, image: "https://via.placeholder.com/220x150" },
  { id: 18, name: "VR Headset", price: 350, image: "https://via.placeholder.com/220x150" },
  { id: 19, name: "Projector", price: 450, image: "https://via.placeholder.com/220x150" },
  { id: 20, name: "Gaming Chair", price: 250, image: "https://via.placeholder.com/220x150" }
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function displayProducts() {
  const container = document.getElementById('products');
  container.innerHTML = '';
  products.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <h4>${p.name}</h4>
      <p>$${p.price}</p>
      <button onclick="addToCart(${p.id})">Add to Cart</button>
    `;
    container.appendChild(card);
  });
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  const item = cart.find(c => c.id === id);
  if (item) item.qty += 1;
  else cart.push({...product, qty: 1});
  saveCart();
  updateCart();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
  updateCart();
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty < 1) removeFromCart(id);
  else {
    saveCart();
    updateCart();
  }
}

function updateCart() {
  const cartItems = document.getElementById('cart-items');
  const totalEl = document.getElementById('total');
  cartItems.innerHTML = '';
  let total = 0;
  cart.forEach(item => {
    total += item.price * item.qty;
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <span>${item.name}</span>
      <span class="qty-controls">
        <button onclick="changeQty(${item.id}, -1)">-</button>
        ${item.qty}
        <button onclick="changeQty(${item.id}, 1)">+</button>
      </span>
      <span>$${(item.price * item.qty).toFixed(2)}</span>
      <button onclick="removeFromCart(${item.id})">x</button>
    `;
    cartItems.appendChild(div);
  });
  totalEl.textContent = total.toFixed(2);
}

function checkout() {
  if (cart.length === 0) {
    alert("Cart is empty");
    return;
  }
  alert("Checkout successful. Total: $" + cart.reduce((sum,i) => sum + i.price*i.qty,0).toFixed(2));
  cart = [];
  saveCart();
  updateCart();
}

// Ensure everything loads after HTML is ready
window.onload = function() {
  displayProducts();
  updateCart();
};
