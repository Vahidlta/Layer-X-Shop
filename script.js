const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSrjXH-PDT3MeRA9UGsaJBQwoRfErVtwjifuF7QtFvDcLfwxIki-A7F2FjAD_V5OEDrJSMUrj03aUBT/pub?gid=0&single=true&output=csv";

let selectedColor = null;

/* --- انتخاب رنگ: تبدیل دایره به مربع --- */
function selectColor(el, color) {
    selectedColor = color;

    const all = el.parentElement.querySelectorAll('.color-circle');
    all.forEach(c => {
        c.style.borderRadius = "50%";
        c.style.transform = "scale(1)";
    });

    el.style.borderRadius = "6px";
    el.style.transform = "scale(1.25)";
}

/* --- تغییر تعداد با + و – --- */
function changeQty(btn, amount) {
    const box = btn.parentElement;
    const valueEl = box.querySelector(".qty-value");
    let qty = Number(valueEl.innerText);

    qty += amount;
    if (qty < 1) qty = 1;

    valueEl.innerText = qty;
}

/* --- افزودن به سبد خرید --- */
function addToCart(product, qty) {
    if (!selectedColor) return alert("لطفاً رنگ را انتخاب کنید");

    product.color = selectedColor;
    product.qty = Number(qty);

    let cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));

    alert("به سبد خرید اضافه شد");
}

/* --- رنگ‌ها --- */
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
        "نقره‌ای": "#c0c0c0"
    };
    return colors[name] || "#000";
}

/* --- ریسپانسیو موبایل --- */
function applyMobileLayout() {
    const grid = document.querySelector(".products-grid");
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

/* --- لود CSV --- */
Papa.parse(CSV_URL, {
    download: true,
    header: true,
    complete: function(result) {
        renderProducts(result.data);
    }
});

/* --- ساخت کارت‌ها --- */
function renderProducts(products) {

    products.sort((a, b) => Number(b.id) - Number(a.id));

    const container = document.getElementById("products");
    container.innerHTML = "";

    products.forEach(p => {
        if (!p.name) return;

        container.innerHTML += `
            <div class="product-card">

                <div class="status ${p.stock === 'موجود' ? 'in-stock' : 'out-stock'}">
                    ${p.stock}
                </div>

                <img src="${p.image}" class="product-image">

                <div class="color-options">
                    ${p.colors.split(",").map(c => `
                        <div class="color-circle"
                             style="background:${getColorCode(c)}"
                             onclick="selectColor(this, '${c}')"></div>
                    `).join("")}
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
                        onclick='addToCart(${JSON.stringify(p)}, this.parentElement.querySelector(".qty-value").innerText)'>
                        افزودن به سبد خرید
                    </button>

                    <div class="qty-box" style="display:flex; align-items:center; gap:8px;">

                        <button onclick="changeQty(this, -1)"
                            style="width:24px; height:24px; border-radius:6px; border:none; background:#eee; font-size:16px; cursor:pointer;">
                            –
                        </button>

                        <span class="qty-value" style="min-width:26px; text-align:center; font-size:16px; font-weight:600;">
                            1
                        </span>

                        <button onclick="changeQty(this, 1)"
                            style="width:24px; height:24px; border-radius:6px; border:none; background:#eee; font-size:16px; cursor:pointer;">
                            +
                        </button>

                    </div>

                </div>

            </div>
        `;
    });

    applyMobileLayout();
}
