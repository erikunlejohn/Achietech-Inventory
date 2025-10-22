// ===== SIDEBAR TOGGLE =====
const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");
const closeSidebar = document.getElementById("closeSidebar");

menuToggle.addEventListener("click", () => {
  sidebar.classList.add("active");
});

closeSidebar.addEventListener("click", () => {
  sidebar.classList.remove("active");
});


// ===== DARK MODE =====
const darkModeToggle = document.getElementById("darkModeToggle");
const sidebarDarkMode = document.getElementById("sidebarDarkMode");

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}

darkModeToggle.addEventListener("click", toggleDarkMode);
sidebarDarkMode.addEventListener("click", toggleDarkMode);

// ===== LOAD DASHBOARD DATA =====
function loadDashboardStats() {
  const products = JSON.parse(localStorage.getItem("products")) || [];

  const totalItems = products.length;
  const totalValue = products.reduce((sum, p) => sum + (p.price * (p.quantity || 1)), 0);
  const lowStock = products.filter(p => p.quantity <= 5).length;

  document.getElementById("totalItems").textContent = totalItems;
  document.getElementById("totalStockValue").textContent = totalValue.toLocaleString();
  document.getElementById("lowStockCount").textContent = lowStock;
}

loadDashboardStats();
