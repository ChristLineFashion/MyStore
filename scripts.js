// scripts.js

let cart = [];

// Add product to cart
function addToCart(product) {
    const existingProductIndex = cart.findIndex(item => item.name === product.name);
    if (existingProductIndex > -1) {
        // If the product is already in the cart, update the quantity
        cart[existingProductIndex].quantity += 1;
    } else {
        // Add new product to the cart
        product.quantity = 1;
        cart.push(product);
    }
    updateCartDisplay();
}

// Remove product from cart
function removeFromCart(productName) {
    cart = cart.filter(item => item.name !== productName);
    updateCartDisplay();
}

// Update product quantity
function updateQuantity(productName, quantity) {
    const product = cart.find(item => item.name === productName);
    if (product) {
        product.quantity = quantity;
        if (product.quantity <= 0) {
            removeFromCart(productName);
        } else {
            updateCartDisplay();
        }
    }
}

// Update cart display
function updateCartDisplay() {
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cart-count').innerText = cartCount;

    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <span>${item.name}</span>
            <span>$${item.price}</span>
            <input type="number" value="${item.quantity}" min="1" onchange="updateQuantity('${item.name}', this.value)">
            <button onclick="removeFromCart('${item.name}')">Remove</button>
        `;
        cartItems.appendChild(cartItem);
    });
}

// Handle form submissions
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('.login-container form');
    const checkoutForm = document.querySelector('.checkout-container form');

    // Handle login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            // Simulate backend request
            fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            })
            .then(response => response.json())
            .then(data => {
                alert('Login successful');
            })
            .catch(error => {
                alert('Login failed');
            });
        });
    }

    // Handle checkout form submission
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const cardName = document.getElementById('cardName').value;
            const cardNumber = document.getElementById('cardNumber').value;
            const expiryDate = document.getElementById('expiryDate').value;
            const cvv = document.getElementById('cvv').value;
            // Simulate backend request
            fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cardName, cardNumber, expiryDate, cvv, cart })
            })
            .then(response => response.json())
            .then(data => {
                alert('Checkout successful');
                cart = []; // Clear the cart
                updateCartDisplay();
            })
            .catch(error => {
                alert('Checkout failed');
            });
        });
    }
});

// Example of how to add products to the cart (this would be connected to actual product data)
document.addEventListener('click', function(event) {
    if (event.target && event.target.matches('button')) {
        const productName = event.target.previousElementSibling.previousElementSibling.innerText;
        const productPrice = parseFloat(event.target.previousElementSibling.innerText.replace('$', ''));
        addToCart({ name: productName, price: productPrice });
    }
});
