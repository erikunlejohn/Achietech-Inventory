

// ======================= SIDEBAR TOGGLE =======================
const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");
const closeSidebar = document.getElementById("closeSidebar");

// Open sidebar
menuToggle?.addEventListener("click", () => sidebar.classList.add("active"));

// Close sidebar
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


// ======================= ADD PRODUCT FORM HANDLING =======================
document.getElementById("addProductForm").addEventListener("submit", function (e) {
  e.preventDefault();

  // Get form values
  const name = document.getElementById("productName").value.trim();
  const category = document.getElementById("category").value;
  const price = parseFloat(document.getElementById("price").value);
  const quantity = parseInt(document.getElementById("quantity").value);

  if (!name || !category || isNaN(price) || isNaN(quantity)) {
    alert("⚠️ Please fill out all fields correctly.");
    return;
  }

  // Get existing products
  const products = JSON.parse(localStorage.getItem("products")) || [];

  // Create new product object
  const newProduct = {
    id: Date.now(), // Unique ID
    name,
    category,
    price,
    quantity,
    dateAdded: new Date().toISOString().split("T")[0] // YYYY-MM-DD
  };

  // Add to list
  products.push(newProduct);

  // Save
  localStorage.setItem("products", JSON.stringify(products));

  // Dashboard auto-refresh
  localStorage.setItem("lastUpdated", Date.now());

  alert("✅ Product added successfully!");

  // Reset form
  e.target.reset();
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

