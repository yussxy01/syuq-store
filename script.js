const CONFIG = {
    storeName: "SyuqStore", 
    ownerName: "ajik", 
    avatar: "image/logo/logo.jpg", 
    instagram: "https://www.instagram.com/mhmdsqrihdzq?rpxt=aXFlN2xqOXllbHIw",
    telegram: "https://t.me/ajiqncem",
    whatsappNumber: "60167005110", 
    adminNumber: "60167005110"
};

const banners = [
    "image/banner/banner1.jpg",
    "image/banner/banner2.jpg",
    "image/banner/banner3.jpg"
];

const products = [
    {
        id: 101,
        name: "XREG ANDROID+IOS",
        image: "image/produk/produk1.jpg",
        desc: "Tersedia berbagai pilihan durasi untuk XREG Android & iOS.",
        variants: [
            { label: "1 JAM", price: "RM1" },
            { label: "3 JAM", price: "RM2" },
            { label: "6 JAM", price: "RM2.80" },
            { label: "12 JAM", price: "RM5" },
            { label: "3 DAY", price: "RM11.20" },
            { label: "7 DAY", price: "RM23" }
        ]
    },
    {
        id: 102,
        name: "DRIP PROXY ANDROID",
        image: "image/produk/produk2.jpg",
        desc: "Tersedia berbagai pilihan durasi untuk Drip Proxy Android.",
        variants: [
            { label: "1 DAY", price: "RM3.70" },
            { label: "3 DAY", price: "RM5.70" },
            { label: "7 DAY", price: "RM13" }
        ]
    },
    {
        id: 103,
        name: "AIMHACK ANDROID+IPHONE",
        image: "image/produk/produk3.jpg",
        desc: "Tersedia berbagai pilihan durasi untuk AimHack Android & iPhone.",
        variants: [
            { label: "1 JAM", price: "RM1.60" },
            { label: "3 JAM", price: "RM2.70" },
            { label: "6 JAM", price: "RM3.40" },
            { label: "12 JAM", price: "RM4.80" },
            { label: "1 DAY", price: "RM5" }
        ]
    },
    {
        id: 104,
        name: "CAPCUT MOD PRO",
        image: "image/produk/produk4.jpg",
        desc: "CapCut Mod Pro siap pakai.",
        variants: [
            { label: "CAPCUT MOD PRO", price: "RM2" }
        ]
    },
    {
        id: 105,
        name: "APK NONTON FILEM GRATIS",
        image: "image/produk/produk5.jpg",
        desc: "APK Nonton Filem Gratis siap pakai.",
        variants: [
            { label: "APK NONTON FILEM", price: "RM2" }
        ]
    }
];

let cart = JSON.parse(localStorage.getItem("cart") || "[]");
let currentProduct = null;
let currentVariant = null;
let bannerInterval = null;

function playSound() {
    const audio = document.getElementById("clickSound");
    if (audio) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
    }
}

function addRipple(e, element) {
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const ripple = document.createElement("span");
    ripple.className = "ripple-effect";
    ripple.style.width = ripple.style.height = size + "px";
    ripple.style.left = e.clientX - rect.left - size / 2 + "px";
    ripple.style.top = e.clientY - rect.top - size / 2 + "px";
    element.style.position = "relative";
    element.style.overflow = "hidden";
    element.appendChild(ripple);
    setTimeout(() => ripple.remove(), 500);
}

document.addEventListener("click", function(e) {
    const target = e.target.closest(".product-card, .feature-item, .social-icon, .btn-buy, .btn-cart, .menu-btn, .cart-badge, .menu-item, .modal-close, .btn-confirm, .variant-btn");
    if (target && !target.closest(".modal-overlay")) {
        playSound();
        addRipple(e, target);
    }
});

function updateCartCount() {
    document.getElementById("cartCount").innerText = cart.reduce((sum, i) => sum + i.qty, 0);
    localStorage.setItem("cart", JSON.stringify(cart));
}

function showToast(message) {
    let toast = document.querySelector(".toast-notification");
    if (!toast) {
        toast = document.createElement("div");
        toast.className = "toast-notification";
        document.body.appendChild(toast);
    }
    toast.innerText = message;
    toast.classList.add("show");
    setTimeout(() => {
        toast.classList.remove("show");
    }, 2000);
}

function addToCart(product, variant) {
    const uniqueId = `${product.id}-${variant.label}`;
    const existing = cart.find(i => i.uniqueId === uniqueId);
    if (existing) {
        existing.qty++;
    } else {
        cart.push({
            uniqueId: uniqueId,
            id: product.id,
            name: product.name,
            variantLabel: variant.label,
            price: variant.price,
            image: product.image,
            qty: 1
        });
    }
    updateCartCount();
    showToast(`${product.name} (${variant.label}) +1`);
}

function initBanner() {
    const container = document.getElementById("bannerSlider");
    if (!container) return;
    container.innerHTML = "";
    banners.forEach((src, idx) => {
        const slide = document.createElement("div");
        slide.className = "banner-slide";
        if (idx === 0) slide.classList.add("active");
        slide.innerHTML = `<img src="${src}" alt="banner" onerror="this.src='image/logo/logo.jpg'">`;
        container.appendChild(slide);
    });
    const dotsDiv = document.createElement("div");
    dotsDiv.className = "banner-dots";
    banners.forEach((_, i) => {
        const dot = document.createElement("span");
        dot.className = "banner-dot";
        if (i === 0) dot.classList.add("active");
        dot.addEventListener("click", () => showBannerSlide(i));
        dotsDiv.appendChild(dot);
    });
    container.appendChild(dotsDiv);
    let current = 0;
    if (bannerInterval) clearInterval(bannerInterval);
    bannerInterval = setInterval(() => {
        current = (current + 1) % banners.length;
        showBannerSlide(current);
    }, 5000);
}

function showBannerSlide(index) {
    const slides = document.querySelectorAll(".banner-slide");
    const dots = document.querySelectorAll(".banner-dot");
    slides.forEach((s, i) => s.classList.toggle("active", i === index));
    dots.forEach((d, i) => d.classList.toggle("active", i === index));
}

function showProductDetail(product) {
    currentProduct = product;
    currentVariant = product.variants[0];
    const modal = document.getElementById("productDetailModal");
    const content = document.getElementById("detailContent");

    const variantButtons = product.variants.map((v, i) => `
        <button class="variant-btn ${i === 0 ? 'active' : ''}" 
            data-label="${v.label}" 
            data-price="${v.price}"
            style="padding:10px 14px; border-radius:12px; border:1px solid ${i === 0 ? '#22d3ee' : '#2a2f38'}; background:${i === 0 ? 'rgba(34,211,238,0.15)' : '#1a1d24'}; color:white; cursor:pointer; font-size:13px;">
            ${v.label} - ${v.price}
        </button>
    `).join("");

    content.innerHTML = `
        <img src="${product.image}" class="detail-image" onerror="this.src='image/logo/logo.jpg'">
        <div class="detail-title">${product.name}</div>
        <div class="detail-desc">${product.desc}</div>
        <div style="margin-top:16px; font-weight:600; font-size:14px;">Pilih Durasi:</div>
        <div id="variantList" style="display:flex; flex-wrap:wrap; gap:8px; margin-top:10px;">
            ${variantButtons}
        </div>
        <div class="detail-price" id="selectedPrice" style="margin-top:16px;">${product.variants[0].price}</div>
        <div class="product-actions" style="margin-top:16px;">
            <button class="btn-buy" style="flex:1;" id="detailBuyBtn">Beli Sekarang</button>
            <button class="btn-cart" style="flex:1;" id="detailCartBtn"><i class="ri-add-line"></i> Keranjang</button>
        </div>
    `;

    modal.classList.add("open");
    document.getElementById("modalOverlay").classList.add("active");

    document.querySelectorAll(".variant-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            document.querySelectorAll(".variant-btn").forEach(b => {
                b.classList.remove("active");
                b.style.border = "1px solid #2a2f38";
                b.style.background = "#1a1d24";
            });
            btn.classList.add("active");
            btn.style.border = "1px solid #22d3ee";
            btn.style.background = "rgba(34,211,238,0.15)";
            currentVariant = { label: btn.dataset.label, price: btn.dataset.price };
            document.getElementById("selectedPrice").innerText = btn.dataset.price;
        });
    });

    document.getElementById("detailBuyBtn").onclick = () => { showPayment(product, currentVariant); closeDetail(); };
    document.getElementById("detailCartBtn").onclick = () => { addToCart(product, currentVariant); closeDetail(); };
}

function closeDetail() {
    document.getElementById("productDetailModal").classList.remove("open");
    document.getElementById("modalOverlay").classList.remove("active");
}

function showPayment(product, variant) {
    currentProduct = product;
    currentVariant = variant;
    const modal = document.getElementById("paymentModal");
    const content = document.getElementById("paymentContent");
    content.innerHTML = `
        <div style="text-align:center; padding: 0 10px;">
            <img src="image/qris.png" class="qris-image" onerror="this.src='https://placehold.co/320x320?text=QRIS'">
            <div style="font-size:20px; font-weight:700; margin-top:10px;">${product.name}</div>
            <div style="font-size:14px; color:#8e95a5; margin-top:4px;">Durasi: ${variant.label}</div>
            <div style="font-size:28px; font-weight:800; color:#22d3ee; margin:12px 0;">${variant.price}</div>
            <div class="payment-note">
                <i class="ri-alert-line"></i> WAJIB: Setelah transfer, kirim bukti screenshot ke admin untuk verifikasi.
            </div>
            <button class="btn-confirm" id="confirmWAButton">
                <i class="ri-whatsapp-line"></i> Konfirmasi via WhatsApp
            </button>
        </div>
    `;
    modal.classList.add("open");
    document.getElementById("modalOverlay").classList.add("active");
    document.getElementById("confirmWAButton").onclick = () => {
        const message = `Halo admin, saya ingin konfirmasi pembayaran untuk produk: ${product.name} (${variant.label}) dengan harga ${variant.price}. Terima kasih.`;
        const url = `https://wa.me/${CONFIG.adminNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, "_blank");
    };
}

function closePayment() {
    document.getElementById("paymentModal").classList.remove("open");
    document.getElementById("modalOverlay").classList.remove("active");
}

function showCart() {
    const main = document.getElementById("mainContent");
    if (cart.length === 0) {
        main.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; text-align: center;">
                <i class="ri-shopping-cart-line" style="font-size: 80px; color: #8e95a5; margin-bottom: 20px;"></i>
                <p style="font-size: 16px; color: #8e95a5; margin-bottom: 24px;">Keranjang kosong</p>
                <button id="btnBackToShop" style="width: 200px; padding: 12px 24px; background: var(--accent); border: none; border-radius: 40px; color: white; font-weight: 600; cursor: pointer;">Kembali Belanja</button>
            </div>
        `;
        const backBtn = document.getElementById("btnBackToShop");
        if (backBtn) {
            backBtn.onclick = function(e) {
                e.stopPropagation();
                renderHome();
            };
        }
        return;
    }
    
    main.innerHTML = `
        <div style="padding:20px 0;">
            <div style="display:flex; align-items:center; gap:12px; margin-bottom:20px;">
                <i class="ri-arrow-left-line" id="backHomeFromCart" style="font-size:24px; cursor:pointer;"></i>
                <h2 style="font-size:20px;">Keranjang Belanja</h2>
            </div>
            <div class="cart-items">
                ${cart.map(item => `
                    <div class="cart-item">
                        <div><strong>${item.name}</strong><br><small style="color:#8e95a5;">${item.variantLabel}</small><br><small>${item.price}</small></div>
                        <div style="display:flex; align-items:center; gap:12px;">
                            <button class="cart-qty-minus" data-uid="${item.uniqueId}" style="background:#2a2f38; border:none; width:32px; height:32px; border-radius:16px; cursor:pointer; font-size:16px; color:white;">-</button>
                            <span style="min-width:24px; text-align:center;">${item.qty}</span>
                            <button class="cart-qty-plus" data-uid="${item.uniqueId}" style="background:#2a2f38; border:none; width:32px; height:32px; border-radius:16px; cursor:pointer; font-size:16px; color:white;">+</button>
                            <button class="cart-remove" data-uid="${item.uniqueId}" style="background:#dc2626; border:none; width:32px; height:32px; border-radius:16px; cursor:pointer; color:white;"><i class="ri-delete-bin-line"></i></button>
                        </div>
                    </div>
                `).join('')}
            </div>
            <button class="btn-buy" id="checkoutFromCart" style="width:100%; padding:14px; margin-top:16px;">Checkout Semua</button>
            <button id="backToShopBtn" style="width:100%; padding:14px; margin-top:12px; background:var(--bg-elevated); border:1px solid var(--border); border-radius:40px; color:white; cursor:pointer;">Kembali Belanja</button>
        </div>
    `;
    
    document.getElementById("backHomeFromCart")?.addEventListener("click", () => renderHome());
    document.getElementById("backToShopBtn")?.addEventListener("click", () => renderHome());
    
    document.querySelectorAll(".cart-qty-minus").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const uid = btn.dataset.uid;
            const item = cart.find(i => i.uniqueId === uid);
            if (item.qty > 1) item.qty--;
            else cart = cart.filter(i => i.uniqueId !== uid);
            updateCartCount();
            showCart();
        });
    });
    
    document.querySelectorAll(".cart-qty-plus").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const uid = btn.dataset.uid;
            const item = cart.find(i => i.uniqueId === uid);
            item.qty++;
            updateCartCount();
            showCart();
        });
    });
    
    document.querySelectorAll(".cart-remove").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const uid = btn.dataset.uid;
            cart = cart.filter(i => i.uniqueId !== uid);
            updateCartCount();
            showCart();
        });
    });
    
    document.getElementById("checkoutFromCart")?.addEventListener("click", () => {
        const productList = cart.map(i => `${i.name} (${i.variantLabel}) x${i.qty}`).join(", ");
        
        const modal = document.getElementById("paymentModal");
        const content = document.getElementById("paymentContent");
        content.innerHTML = `
            <div style="text-align:center; padding: 0 10px;">
                <img src="image/qris.png" class="qris-image" onerror="this.src='https://placehold.co/320x320?text=QRIS'">
                <div style="font-size:18px; font-weight:700; margin-top:10px;">Checkout Keranjang</div>
                <div style="font-size:13px; color:#8e95a5; margin:8px 0; word-break:break-word;">${productList}</div>
                <div class="payment-note">
                    <i class="ri-alert-line"></i> WAJIB: Setelah transfer, kirim bukti screenshot ke admin untuk verifikasi.
                </div>
                <button class="btn-confirm" id="confirmCheckoutWAButton">
                    <i class="ri-whatsapp-line"></i> Konfirmasi via WhatsApp
                </button>
            </div>
        `;
        modal.classList.add("open");
        document.getElementById("modalOverlay").classList.add("active");
        
        document.getElementById("confirmCheckoutWAButton").onclick = () => {
            const message = `Halo admin, saya ingin checkout: ${productList}. Mohon panduan pembayaran.`;
            window.open(`https://wa.me/${CONFIG.adminNumber}?text=${encodeURIComponent(message)}`, "_blank");
            document.getElementById("paymentModal").classList.remove("open");
            document.getElementById("modalOverlay").classList.remove("active");
            cart = [];
            updateCartCount();
            renderHome();
            showToast("Checkout berhasil, terima kasih!");
        };
    });
}

function showGuide() {
    const main = document.getElementById("mainContent");
    main.innerHTML = `
        <div style="padding:20px 0;">
            <div style="display:flex; align-items:center; gap:12px; margin-bottom:24px;">
                <i class="ri-arrow-left-line" id="backHomeGuide" style="font-size:24px; cursor:pointer;"></i>
                <h2 style="font-size:20px;">Panduan Belanja</h2>
            </div>
            <div style="background:#1a1d24; border-radius:24px; padding:24px;">
                <div style="margin-bottom:20px;"><span style="background:#06b6d4; width:28px; height:28px; display:inline-flex; align-items:center; justify-content:center; border-radius:14px; margin-right:12px;">1</span> Pilih produk yang ingin dibeli</div>
                <div style="margin-bottom:20px;"><span style="background:#06b6d4; width:28px; height:28px; display:inline-flex; align-items:center; justify-content:center; border-radius:14px; margin-right:12px;">2</span> Pilih durasi/varian yang diinginkan</div>
                <div style="margin-bottom:20px;"><span style="background:#06b6d4; width:28px; height:28px; display:inline-flex; align-items:center; justify-content:center; border-radius:14px; margin-right:12px;">3</span> Klik "Beli Sekarang" atau tambah ke keranjang</div>
                <div style="margin-bottom:20px;"><span style="background:#06b6d4; width:28px; height:28px; display:inline-flex; align-items:center; justify-content:center; border-radius:14px; margin-right:12px;">4</span> Scan QRIS dan lakukan pembayaran sesuai nominal</div>
                <div style="margin-bottom:20px;"><span style="background:#06b6d4; width:28px; height:28px; display:inline-flex; align-items:center; justify-content:center; border-radius:14px; margin-right:12px;">5</span> Klik "Konfirmasi via WhatsApp" dan kirim bukti transfer</div>
                <div><span style="background:#06b6d4; width:28px; height:28px; display:inline-flex; align-items:center; justify-content:center; border-radius:14px; margin-right:12px;">6</span> Produk akan dikirim dalam 2-15 menit setelah verifikasi</div>
            </div>
        </div>
    `;
    document.getElementById("backHomeGuide")?.addEventListener("click", () => renderHome());
}

function renderHome() {
    const main = document.getElementById("mainContent");
    main.innerHTML = `
        <div class="profile-section">
            <img src="${CONFIG.avatar}" class="profile-avatar" onerror="this.src='image/logo/logo.jpg'">
            <div class="profile-info">
                <h2>${CONFIG.storeName}</h2>
                <p><span class="status-badge"></span> Online & Terpercaya</p>
                <div class="social-links">
                    <a href="${CONFIG.instagram}" target="_blank" class="social-icon"><i class="ri-instagram-line"></i></a>
                    <a href="${CONFIG.telegram}" target="_blank" class="social-icon"><i class="ri-telegram-line"></i></a>
                    <a href="https://wa.me/${CONFIG.whatsappNumber}" target="_blank" class="social-icon"><i class="ri-whatsapp-line"></i></a>
                </div>
            </div>
        </div>
        <div class="banner-slider" id="bannerSlider"></div>
        <div class="marquee">
            <div class="marquee-text">PROMO SPESIAL CASHBACK 10 UNTUK PEMBELIAN PERTAMA   GARANSI 100 AMAN   LAYANAN 24 JAM   HUBUNGI ADMIN JIKA ADA KENDALA</div>
        </div>
        <div class="section-title"><i class="ri-shopping-bag-3-line"></i> Produk Kami</div>
        <div class="products-grid" id="productsGrid"></div>
        <div class="feature-grid">
            <div class="feature-item"><i class="ri-flashlight-line feature-icon"></i><div class="feature-text"><h5>Proses Cepat</h5><p>2-5 menit</p></div></div>
            <div class="feature-item"><i class="ri-shield-check-line feature-icon"></i><div class="feature-text"><h5>Garansi 100</h5><p>Refund jika gagal</p></div></div>
            <div class="feature-item"><i class="ri-customer-service-2-line feature-icon"></i><div class="feature-text"><h5>Support 24/7</h5><p>Admin siap bantu</p></div></div>
        </div>
        <div class="promo-card"><h4>PROMO CASHBACK 10</h4><p>Khusus pengguna baru transaksi pertama</p><i class="ri-discount-line promo-deco"></i></div>
    `;

    const grid = document.getElementById("productsGrid");
    grid.innerHTML = products.map(p => `
        <div class="product-card" data-id="${p.id}">
            <img src="${p.image}" class="product-image" onerror="this.src='image/logo/logo.jpg'">
            <div class="product-title">${p.name}</div>
            <div class="product-price">${p.variants.length} Pilihan Durasi</div>
            <div class="product-actions">
                <button class="btn-buy" data-id="${p.id}">Beli</button>
                <button class="btn-cart" data-id="${p.id}"><i class="ri-add-line"></i> Detail</button>
            </div>
        </div>
    `).join("");

    document.querySelectorAll(".product-card").forEach(card => {
        card.addEventListener("click", (e) => {
            if (e.target.classList.contains("btn-buy") || e.target.classList.contains("btn-cart")) return;
            const id = parseInt(card.dataset.id);
            const product = products.find(p => p.id === id);
            if (product) showProductDetail(product);
        });
    });

    document.querySelectorAll(".btn-buy").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            const product = products.find(p => p.id === id);
            if (product) showProductDetail(product);
        });
    });

    document.querySelectorAll(".btn-cart").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            const product = products.find(p => p.id === id);
            if (product) showProductDetail(product);
        });
    });

    initBanner();
}

function initMenu() {
    const menuBtn = document.getElementById("menuBtn");
    const sidebar = document.getElementById("menuSidebar");
    const overlay = document.getElementById("modalOverlay");
    const closeMenu = document.getElementById("closeMenu");
    
    function openMenu() {
        sidebar.classList.add("open");
        overlay.classList.add("active");
    }
    
    function closeMenuPanel() {
        sidebar.classList.remove("open");
        overlay.classList.remove("active");
    }
    
    menuBtn.addEventListener("click", openMenu);
    closeMenu.addEventListener("click", closeMenuPanel);
    overlay.addEventListener("click", closeMenuPanel);
    
    document.querySelectorAll(".menu-item").forEach(item => {
        item.addEventListener("click", () => {
            const nav = item.dataset.nav;
            if (nav === "home") renderHome();
            else if (nav === "cart") showCart();
            else if (nav === "guide") showGuide();
            closeMenuPanel();
            document.getElementById("storeNameHeader").innerText = CONFIG.storeName;
        });
    });
}

function initModals() {
    document.getElementById("closeDetail").addEventListener("click", closeDetail);
    document.getElementById("closePayment").addEventListener("click", closePayment);
    
    const cartBadge = document.getElementById("cartBadge");
    if (cartBadge) {
        cartBadge.addEventListener("click", (e) => {
            e.stopPropagation();
            e.preventDefault();
            showCart();
        });
    }
}

document.getElementById("storeNameHeader").innerText = CONFIG.storeName;
renderHome();
initMenu();
initModals();
updateCartCount();
