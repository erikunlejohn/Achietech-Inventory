// supermarket-js/sales.js
document.addEventListener("DOMContentLoaded", () => {
  const productSelect = document.getElementById("productSelect");
  const sellForm = document.getElementById("sellForm");
  const saleSummary = document.getElementById("saleSummary");
  const salesTableBody = document.getElementById("salesTableBody");

  // Read/write helpers
  const readProducts = () => JSON.parse(localStorage.getItem("products")) || [];
  const writeProducts = (arr) => localStorage.setItem("products", JSON.stringify(arr));
  const readSales = () => JSON.parse(localStorage.getItem("sales")) || [];
  const writeSales = (arr) => localStorage.setItem("sales", JSON.stringify(arr));
  const readTotalSales = () => parseFloat(localStorage.getItem("totalSales")) || 0;
  const writeTotalSales = (val) => localStorage.setItem("totalSales", val.toString());

  let totalSales = readTotalSales();

  // Populate product dropdown (reads fresh products from localStorage)
  function loadProductsIntoDropdown() {
    const products = readProducts();
    productSelect.innerHTML = `<option value="">-- Choose a Product --</option>`;

    products.forEach((p) => {
      const opt = document.createElement("option");
      opt.value = p.id;
      // show quantity and indicate out-of-stock
      if (Number(p.quantity) <= 0) {
        opt.textContent = `${p.name} (${p.category}) - ₦${Number(p.price).toLocaleString()} [Qty: 0 — out of stock]`;
        opt.disabled = true;
      } else {
        opt.textContent = `${p.name} (${p.category}) - ₦${Number(p.price).toLocaleString()} [Qty: ${p.quantity}]`;
      }
      productSelect.appendChild(opt);
    });
  }

  // Render sales history table
  function renderSalesTable() {
    const sales = readSales();
    salesTableBody.innerHTML = "";
    sales.forEach((sale, i) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${i + 1}</td>
        <td>${sale.name}</td>
        <td>${sale.category}</td>
        <td>${sale.quantity}</td>
        <td>₦${Number(sale.total).toLocaleString()}</td>
        <td>${sale.date}</td>
        <td><button class="delete-sale-btn" data-saleid="${sale.id}">Delete</button></td>
      `;
      salesTableBody.appendChild(tr);
    });
  }

  // Record a sale
  sellForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const selectedId = productSelect.value;
    const qtySold = parseInt(document.getElementById("quantitySold").value, 10);

    if (!selectedId) return alert("Please choose a product.");
    if (!qtySold || qtySold <= 0) return alert("Enter a valid quantity.");

    const products = readProducts();
    const product = products.find((p) => String(p.id) === String(selectedId));
    if (!product) return alert("Product not found.");
    if (Number(product.quantity) < qtySold) return alert(`Only ${product.quantity} available in stock.`);

    // update product stock
    product.quantity = Number(product.quantity) - qtySold;

    // sale record
    const saleTotal = Number(product.price) * qtySold;
    const saleRecord = {
      id: Date.now(), // unique sale id
      productId: product.id,
      name: product.name,
      category: product.category,
      quantity: qtySold,
      total: saleTotal,
      date: new Date().toLocaleString()
    };

    // persist
    const sales = readSales();
    sales.push(saleRecord);
    writeSales(sales);

    totalSales = readTotalSales() + saleTotal;
    writeTotalSales(totalSales);

    writeProducts(products);

    // UI feedback
    saleSummary.innerHTML = `
      <p>✅ Sale recorded: <strong>${qtySold}</strong> x <strong>${product.name}</strong></p>
      <p>Total: ₦${saleTotal.toLocaleString()}</p>
      <p>Remaining stock: ${product.quantity}</p>
    `;

    // refresh UI
    loadProductsIntoDropdown();
    renderSalesTable();
    sellForm.reset();
  });

  // Delete sale handler (delegated)
  salesTableBody.addEventListener("click", (e) => {
    if (!e.target.classList.contains("delete-sale-btn")) return;
    const saleId = e.target.dataset.saleid;
    if (!confirm("Are you sure you want to delete this sale? This will return the sold quantity to stock.")) return;

    const sales = readSales();
    const saleIndex = sales.findIndex((s) => String(s.id) === String(saleId));
    if (saleIndex === -1) return;

    const sale = sales[saleIndex];

    // restore quantity to the product (by productId)
    const products = readProducts();
    const product = products.find((p) => String(p.id) === String(sale.productId));
    if (product) {
      product.quantity = Number(product.quantity) + Number(sale.quantity);
    }

    // update total sales and remove sale
    totalSales = Math.max(0, readTotalSales() - Number(sale.total));
    writeTotalSales(totalSales);

    sales.splice(saleIndex, 1);
    writeSales(sales);
    writeProducts(products);

    // refresh UI
    loadProductsIntoDropdown();
    renderSalesTable();
    saleSummary.innerHTML = `<p>🗑️ Sale deleted and stock restored.</p>`;
  });

  // Initialize
  loadProductsIntoDropdown();
  renderSalesTable();
}); // DOMContentLoaded end




// ======================= DARK MODE (PERSISTENT + SAFE) =======================
(function () {
  const body = document.body;
  const toggleTop = document.getElementById("darkModeToggle");        // top icon
  const toggleSidebar = document.getElementById("sidebarDarkMode");   // sidebar icon

  // Apply saved theme on page load
  if (localStorage.getItem("theme") === "dark") {
    body.classList.add("dark-mode");
  }

  // Toggle function
  function toggleDark() {
    body.classList.toggle("dark-mode");
    localStorage.setItem(
      "theme",
      body.classList.contains("dark-mode") ? "dark" : "light"
    );
  }

  // Event listeners
  toggleTop?.addEventListener("click", toggleDark);
  toggleSidebar?.addEventListener("click", toggleDark);
})();



// ===== SIDEBAR & DARK MODE (kept at file bottom) =====
const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");
const closeSidebar = document.getElementById("closeSidebar");

menuToggle?.addEventListener("click", () => sidebar?.classList.add("active"));
closeSidebar?.addEventListener("click", () => sidebar?.classList.remove("active"));
document.querySelectorAll(".sidebar a").forEach(link => link.addEventListener("click", () => sidebar?.classList.remove("active")));

// Close sidebar when clicking outside
document.addEventListener("click", e => {
  if (sidebar.classList.contains("active") &&
      !sidebar.contains(e.target) &&
      !menuToggle.contains(e.target)) {
    sidebar.classList.remove("active");
  }
});

// Highlight active navbar link
const navLinks = document.querySelectorAll(".nav-links a");
navLinks.forEach(link => {
  if (link.href === window.location.href) {
    link.classList.add("active");
  }
});


// ======================= WELCOME TEXT =======================
function initDashboard() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!currentUser) {
    window.location.href = "../index.html";
    return;
  }

  // Capitalize first letter of username
  const formattedName =
    currentUser.username.charAt(0).toUpperCase() +
    currentUser.username.slice(1).toLowerCase();

  document.getElementById("welcomeText").textContent =
    `Welcome, ${formattedName} (${currentUser.role})`;

  loadDashboardStats();
  setupAutoRefresh();
}

initDashboard();

