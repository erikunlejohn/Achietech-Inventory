// ======================= SIDEBAR TOGGLE =======================
const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");
const closeSidebar = document.getElementById("closeSidebar");

menuToggle?.addEventListener("click", () => sidebar.classList.add("active"));
closeSidebar?.addEventListener("click", () => sidebar.classList.remove("active"));

// Close sidebar when clicking outside
document.addEventListener("click", e => {
  if (
    sidebar.classList.contains("active") &&
    !sidebar.contains(e.target) &&
    !menuToggle.contains(e.target)
  ) {
    sidebar.classList.remove("active");
  }
});

// Highlight active navbar link
const navLinks = document.querySelectorAll(".nav-links a");
navLinks.forEach(link => {
  if (link.href === window.location.href) link.classList.add("active");
});

// ======================= DARK MODE (FIXED & PERSISTENT) =======================
(function () {
  const body = document.body;
  const toggleTop = document.getElementById("darkModeToggle");
  const toggleSidebar = document.getElementById("sidebarDarkMode");

  if (localStorage.getItem("theme") === "dark") body.classList.add("dark-mode");

  function toggleDark() {
    body.classList.toggle("dark-mode");
    localStorage.setItem("theme", body.classList.contains("dark-mode") ? "dark" : "light");
  }

  toggleTop?.addEventListener("click", toggleDark);
  toggleSidebar?.addEventListener("click", toggleDark);
})();

// ======================= DASHBOARD DATA =======================
function loadDashboardStats() {
  const products = JSON.parse(localStorage.getItem("products")) || [];
  const sales = JSON.parse(localStorage.getItem("sales")) || [];

  // Total quantity of all items
  const totalItems = products.reduce((sum, p) => sum + (p.quantity || 0), 0);

  // Total stock value
  const totalValue = products.reduce((sum, p) => sum + (p.price * (p.quantity || 0)), 0);

  // Total sales
  const totalSales = sales.reduce((sum, s) => sum + (s.amount || s.total || 0), 0);

  // Low stock items
  const lowStockItems = products.filter(p => p.quantity <= 5);

  // Update UI
  document.getElementById("totalItems").textContent = totalItems;
  document.getElementById("totalStockValue").textContent = "₦" + totalValue.toLocaleString();
  document.getElementById("totalSales").textContent = "₦" + totalSales.toLocaleString();
  document.getElementById("lowStockCount").textContent = lowStockItems.length;

  // Add "View Items" button if low stock exists
  let lowStockCard = document.querySelector("#lowStockCount");
  if (lowStockItems.length > 0) {
    if (!document.getElementById("viewLowStockBtn")) {
      const btn = document.createElement("button");
      btn.textContent = "View Items";
      btn.id = "viewLowStockBtn";
      btn.className = "view-low-stock-btn";
      btn.addEventListener("click", () => openLowStockModal(lowStockItems));
      lowStockCard.parentElement.appendChild(btn);
    }
  } else {
    const existingBtn = document.getElementById("viewLowStockBtn");
    if (existingBtn) existingBtn.remove();
  }

  // Recent products
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

// ======================= LOW STOCK MODAL =======================
const viewLowStockBtn = document.getElementById("viewLowStockBtn");
const lowStockModal = document.getElementById("lowStockModal");
const modalCloseBtn = lowStockModal.querySelector(".close-btn");
const lowStockTableBody = document.querySelector("#lowStockTable tbody");

// Function to populate and show the modal
function openLowStockModal(items) {
  lowStockTableBody.innerHTML = "";

  if (items.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 3;
    cell.textContent = "No low stock items!";
    cell.style.textAlign = "center";
    row.appendChild(cell);
    lowStockTableBody.appendChild(row);
  } else {
    items.forEach(item => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.name}</td>
        <td>${item.category}</td>
        <td class="${item.quantity <= 3 ? 'low-stock-critical' : 'low-stock-warning'}">${item.quantity}</td>
      `;
      lowStockTableBody.appendChild(row);
    });
  }

  lowStockModal.style.display = "block";
}

// Button click event
viewLowStockBtn?.addEventListener("click", () => {
  const products = JSON.parse(localStorage.getItem("products")) || [];
  const lowStockItems = products.filter(p => p.quantity <= 5);
  openLowStockModal(lowStockItems);
});

// Close modal when clicking ×
modalCloseBtn.addEventListener("click", () => {
  lowStockModal.style.display = "none";
});

// Close modal when clicking outside content
window.addEventListener("click", (e) => {
  if (e.target === lowStockModal) {
    lowStockModal.style.display = "none";
  }
});


// ======================= AUTO REFRESH LOGIC =======================
function setupAutoRefresh() {
  window.addEventListener("storage", event => {
    if (["products", "sales"].includes(event.key)) {
      console.log("🔄 Data updated — refreshing dashboard...");
      loadDashboardStats();
    }
  });

  window.addEventListener("focus", () => {
    const lastUpdate = localStorage.getItem("lastUpdated");
    if (lastUpdate && Date.now() - lastUpdate < 5000) loadDashboardStats();
  });

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

  const formattedName =
    currentUser.username.charAt(0).toUpperCase() +
    currentUser.username.slice(1).toLowerCase();

  document.getElementById("welcomeText").textContent =
    `Welcome, ${formattedName} (${currentUser.role})`;

  loadDashboardStats();
  setupAutoRefresh();
}

initDashboard();
