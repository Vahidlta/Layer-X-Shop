/* ------------------------------
   تنظیمات CSV
------------------------------ */
const CSV_URL =
    "https://layerx-csv.lta1vahid.workers.dev/";

let selectedColor = null;

/* ------------------------------
   انتخاب رنگ
------------------------------ */
function selectColor(el, color) {
    selectedColor = color;

    const all = el.parentElement.querySelectorAll(".color-circle");
    all.forEach((c) => c.classList.remove("selected"));

    el.classList.add("selected");
}

/* ------------------------------
   تغییر تعداد
------------------------------ */
function changeQty(btn, amount) {
    const box = btn.parentElement;
    const valueEl = box.querySelector(".qty-value");
    let qty = Number(valueEl.innerText);

    qty += amount;
    if (qty < 1) qty = 1;

    valueEl.innerText = qty;
}

/* ------------------------------
   افزودن به سبد خرید
------------------------------ */
function addToCart(product, qty) {
    if (!selectedColor) return alert("لطفاً رنگ را انتخاب کنید");

    product.color = selectedColor;
    product.qty = Number(qty);

    let cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();

    alert("به سبد خرید اضافه شد");
}

/* ------------------------------
   رنگ‌ها
------------------------------ */
function getColorCode(name) {
    const colors = {
        "سفید": "#ffffff",
        "طوسی": "#bfbfbf",
        "مشکی": "#000000",
        "قرمز": "#ff0000",
        "آبی": "#007bff",
        "سبز": "#00cc66",
        "زرد": "#ffcc00",
        "نارنجی": "#ff8800",
        "طلایی": "#d4af37",
        "نقره‌ای": "#c0c0c0",
    };
    return colors[name] || "#000";
}

/* ------------------------------
   ریسپانسیو
------------------------------ */
function applyMobileLayout() {
    const grid = document.querySelector(".products-grid");
    if (!grid) return;

    const logo = document.querySelector(".logo");
    const nav = document.querySelector(".nav");
    const headerLeft = document.querySelector(".header-left");

    if (window.innerWidth <= 768) {
        grid.style.gridTemplateColumns = "1fr";
        logo.style.height = "32px";
        nav.style.fontSize = "12px";
        nav.style.gap = "10px";
        headerLeft.style.gap = "6px";
    } else {
        grid.style.gridTemplateColumns = "repeat(3, 1fr)";
        logo.style.height = "42px";
        nav.style.fontSize = "14px";
        nav.style.gap = "18px";
        headerLeft.style.gap = "10px";
    }
}

window.addEventListener("load", applyMobileLayout);
window.addEventListener("resize", applyMobileLayout);

/* ------------------------------
   لود CSV فقط در index.html
------------------------------ */
if (window.location.pathname.includes("index.html")) {
    Papa.parse(CSV_URL, {
        download: true,
        header: true,
        complete: function (result) {
            renderProducts(result.data);
        },
    });
}

/* ------------------------------
   ساخت کارت‌های محصول (index)
------------------------------ */
function renderProducts(products) {
    const container = document.getElementById("products");
    if (!container) return;

    products.sort((a, b) => Number(b.id) - Number(a.id));

    container.innerHTML = "";

    products.forEach((p) => {
        if (!p.name) return;

        container.innerHTML += `
            <div class="product-card">

                <div class="status ${p.stock === "موجود" ? "in-stock" : "out-stock"}">
                    ${p.stock}
                </div>

                <img src="${p.image}" class="product-image">

                <div class="color-options">
                    ${p.colors
                        .split(",")
                        .map(
                            (c) => `
                        <div class="color-circle ${c === "سفید" ? "white" : ""}"
                             style="background:${getColorCode(c)}"
                             onclick="selectColor(this, '${c}')"></div>
                    `
                        )
                        .join("")}
                </div>

                <h3 class="product-title">${p.name}</h3>

                <div class="product-info">
                    نوع مواد : ${p.material}<br>
                    ابعاد محصول : ${p.size}<br>
                    توضیحات : ${p.desc}
                </div>

                <p class="product-price">${p.price} تومان</p>

                <div style="display:flex; justify-content:space-between; align-items:center; margin-top:10px;">

                    <button class="btn"
                        onclick='addToCart(${JSON.stringify(
                            p
                        )}, this.parentElement.querySelector(".qty-value").innerText)'>
                        افزودن به سبد خرید
                    </button>

                    <div class="qty-box" style="display:flex; align-items:center; gap:8px;">

                        <button onclick="changeQty(this, -1)">–</button>

                        <span class="qty-value">1</span>

                        <button onclick="changeQty(this, 1)">+</button>

                    </div>

                </div>

            </div>
        `;
    });

    applyMobileLayout();
}

/* ------------------------------
   CART FUNCTIONS
------------------------------ */

function loadCart() {
    let cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function removeItem(index) {
    let cart = loadCart();
    cart.splice(index, 1);
    saveCart(cart);
    displayCart();
    updateCartCount();
}

function displayCart() {
    const container = document.getElementById("cart-items");
    if (!container) return;

    let cart = loadCart();
    let totalPrice = 0;

    let checkoutBtn = document.getElementById("checkout-btn");

    if (cart.length === 0) {
        container.innerHTML = "<p>سبد خرید شما خالی است.</p>";

        if (checkoutBtn) {
            checkoutBtn.style.pointerEvents = "none";
            checkoutBtn.style.opacity = "0.4";
        }

        document.getElementById("total-price").innerText = 0;
        return;
    }

    if (checkoutBtn) {
        checkoutBtn.style.pointerEvents = "auto";
        checkoutBtn.style.opacity = "1";
    }

    container.innerHTML = "";

    cart.forEach((item, index) => {
        totalPrice += item.price * item.qty;

        container.innerHTML += `
            <div class="cart-item">
                <img src="${item.image}" class="cart-img">
                <div class="cart-info">
                    <h3>${item.name}</h3>
                    <p>${item.price.toLocaleString()} تومان</p>
                    <p>تعداد: ${item.qty}</p>
                    <p>رنگ: ${item.color}</p>
                </div>
                <button class="remove-btn" onclick="removeItem(${index})">حذف</button>
            </div>
        `;
    });

    document.getElementById("total-price").innerText =
        totalPrice.toLocaleString();
}

/* اجرای سبد خرید فقط در cart.html */
if (window.location.pathname.includes("cart.html")) {
    displayCart();
}

/* ------------------------------
   CART BADGE (شمارنده سبد خرید)
------------------------------ */
function updateCartCount() {
    let cart = loadCart();
    let badge = document.getElementById("cart-count");

    if (!badge) return;

    if (cart.length === 0) {
        badge.style.display = "none";
    } else {
        badge.style.display = "inline-block";
        badge.innerText = cart.length;
    }
}

updateCartCount();

/* ------------------------------
   EMAIL VERIFICATION
------------------------------ */

let generatedCode = null;

function sendEmailCode() {
    let email = document.getElementById("email").value.trim();

    if (!email || !email.includes("@") || !email.includes(".")) {
        alert("لطفاً یک ایمیل معتبر وارد کنید");
        return;
    }

    generatedCode = Math.floor(100000 + Math.random() * 900000);

    alert("کد تأیید به ایمیل شما ارسال شد: " + generatedCode);
}

/* ------------------------------
   SUBMIT ORDER (Checkout)
------------------------------ */
function submitOrder() {
    let name = document.getElementById("name").value.trim();
    let phone = document.getElementById("phone").value.trim();
    let email = document.getElementById("email").value.trim();
    let emailCode = document.getElementById("emailCode").value.trim();
    let address = document.getElementById("address").value.trim();
    let shipping = document.getElementById("shipping").value;
    let note = document.getElementById("note").value.trim();

    if (!name || !phone || !email || !address) {
        alert("لطفاً تمام فیلدهای ضروری را پر کنید");
        return;
    }

    let iranMobileRegex = /^(09)(0[0-5]|1[0-9]|2[0-2]|3[0-9]|9[0-9])[0-9]{7}$/;

    if (!iranMobileRegex.test(phone)) {
        alert("شماره موبایل معتبر نیست");
        return;
    }

    if (!email.includes("@") || !email.includes(".")) {
        alert("ایمیل معتبر نیست");
        return;
    }

    if (!generatedCode) {
        alert("لطفاً ابتدا کد تأیید ایمیل را دریافت کنید");
        return;
    }

    if (emailCode != generatedCode) {
        alert("کد تأیید اشتباه است");
        return;
    }

    let cart = loadCart();
    if (cart.length === 0) {
        alert("سبد خرید شما خالی است");
        return;
    }

    let order = {
        name,
        phone,
        email,
        address,
        shipping,
        note,
        cart,
        date: new Date().toLocaleString("fa-IR")
    };

    localStorage.setItem("order", JSON.stringify(order));

    alert("سفارش با موفقیت ثبت شد");
}
