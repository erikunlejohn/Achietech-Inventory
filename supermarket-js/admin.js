// ======================= SIDEBAR TOGGLE =======================
const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");
const closeSidebar = document.getElementById("closeSidebar");

menuToggle?.addEventListener("click", () => sidebar.classList.add("active"));
closeSidebar?.addEventListener("click", () => sidebar.classList.remove("active"));

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


// ======================= DARK MODE =======================
const darkModeToggle = document.getElementById("darkModeToggle");
const sidebarDarkMode = document.getElementById("sidebarDarkMode");

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}

darkModeToggle?.addEventListener("click", toggleDarkMode);
sidebarDarkMode?.addEventListener("click", toggleDarkMode);

// ======================= DASHBOARD DATA =======================
function loadDashboardStats() {
  const products = JSON.parse(localStorage.getItem("products")) || [];
  const sales = JSON.parse(localStorage.getItem("sales")) || [];

  // ✅ Total quantity of all items
  const totalItems = products.reduce((sum, p) => sum + (p.quantity || 0), 0);

  // ✅ Total stock value
  const totalValue = products.reduce(
    (sum, p) => sum + (p.price * (p.quantity || 0)),
    0
  );

  // ✅ Total Sales
  const totalSales = sales.reduce(
    (sum, s) => sum + (s.amount || s.total || 0),
    0
  );

  // ✅ Low stock count
  const lowStock = products.filter(p => p.quantity <= 5).length;

  // ✅ Update UI
  document.getElementById("totalItems").textContent = totalItems;
  document.getElementById("totalStockValue").textContent = "₦" + totalValue.toLocaleString();
  document.getElementById("totalSales").textContent = "₦" + totalSales.toLocaleString();
  document.getElementById("lowStockCount").textContent = lowStock;

  // ✅ Recently added products
  const recentList = document.getElementById("recentProductsList");
  if (recentList) {
    recentList.innerHTML = "";
    const recent = [...products].slice(-5).reverse();
    recent.forEach(p => {
      const li = document.createElement("li");
      li.textContent = `${p.name} — ₦${p.price.toLocaleString()} (${p.quantity} pcs)`;
      recentList.appendChild(li);
    });
  }
}

// ======================= AUTO REFRESH LOGIC =======================
function setupAutoRefresh() {
  // Refresh on storage updates (cross-tab)
  window.addEventListener("storage", event => {
    if (["products", "sales"].includes(event.key)) {
      console.log("🔄 Data updated — refreshing dashboard...");
      loadDashboardStats();
    }
  });

  // Refresh when tab regains focus shortly after updates
  window.addEventListener("focus", () => {
    const lastUpdate = localStorage.getItem("lastUpdated");
    if (lastUpdate && Date.now() - lastUpdate < 5000) loadDashboardStats();
  });

  // Live refresh for same-tab localStorage updates
  const originalSetItem = localStorage.setItem;
  localStorage.setItem = function (key, value) {
    originalSetItem.apply(this, arguments);
    if (["products", "sales"].includes(key)) {
      console.log(`⚡ Local update detected for: ${key}`);
      loadDashboardStats();
    }
  };
}

// ======================= AUTH & INIT =======================
function initDashboard() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!currentUser) {
    window.location.href = "../index.html";
    return;
  }

  document.getElementById("welcomeText").textContent =
    `Welcome, ${currentUser.username} (${currentUser.role})`;

  loadDashboardStats();
  setupAutoRefresh();
}

// Initialize dashboard
initDashboard();
