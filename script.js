// ------------------------------
// Load Cart from LocalStorage
// ------------------------------
function loadCart() {
    let cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : [];
}

// ------------------------------
// Save Cart
// ------------------------------
function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// ------------------------------
// Add to Cart
// ------------------------------
function addToCart(product) {
    let cart = loadCart();
    cart.push(product);
    saveCart(cart);
    alert("محصول به سبد خرید اضافه شد");
}

// ------------------------------
// Display Cart Items
// ------------------------------
function displayCart() {
    let cart = loadCart();
    let container = document.getElementById("cart-items");
    let totalPrice = 0;

    if (cart.length === 0) {
        container.innerHTML = "<p>سبد خرید شما خالی است.</p>";
        document.getElementById("total-price").innerText = 0;
        return;
    }

    container.innerHTML = "";

    cart.forEach((item, index) => {
        totalPrice += item.price;

        container.innerHTML += `
            <div class="cart-item">
                <img src="${item.image}" class="cart-img">
                <div class="cart-info">
                    <h3>${item.name}</h3>
                    <p>${item.price.toLocaleString()} تومان</p>
                </div>
                <button class="remove-btn" onclick="removeItem(${index})">حذف</button>
            </div>
        `;
    });

    document.getElementById("total-price").innerText = totalPrice.toLocaleString();
}

// ------------------------------
// Remove Item
// ------------------------------
function removeItem(index) {
    let cart = loadCart();
    cart.splice(index, 1);
    saveCart(cart);
    displayCart();
}

// ------------------------------
// Auto-run on cart page
// ------------------------------
if (window.location.pathname.includes("cart.html")) {
    displayCart();
}
