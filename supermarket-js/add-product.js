// ===== SIDEBAR TOGGLE =====
const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");
const closeSidebar = document.getElementById("closeSidebar");

// Open sidebar
menuToggle?.addEventListener("click", () => sidebar.classList.add("active"));

// Close sidebar
closeSidebar?.addEventListener("click", () => sidebar.classList.remove("active"));

// Close sidebar when clicking outside
document.addEventListener("click", e => {
  if (sidebar.classList.contains("active") &&
      !sidebar.contains(e.target) &&
      !menuToggle.contains(e.target)) {
    sidebar.classList.remove("active");
  }
});


// ===== DARK MODE =====
const darkModeToggle = document.getElementById("darkModeToggle");
const sidebarDarkMode = document.getElementById("sidebarDarkMode");

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}

darkModeToggle.addEventListener("click", toggleDarkMode);
sidebarDarkMode.addEventListener("click", toggleDarkMode);

// ===== ADD PRODUCT FORM HANDLING =====
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

  // Get existing products from localStorage
  const products = JSON.parse(localStorage.getItem("products")) || [];

  // Generate a unique incremental ID
  const nextId = products.length > 0 ? Math.max(...products.map(p => p.id || 0)) + 1 : 1;


 // Create new product object
const newProduct = {
  id: Date.now(), // ensures unique ID for editing/deleting
  name,
  category,
  price,
  quantity,
  dateAdded: new Date().toISOString().split("T")[0] // formatted YYYY-MM-DD
};


  // Add new product to array
  products.push(newProduct);

  // Save updated list back to localStorage
  localStorage.setItem("products", JSON.stringify(products));

  // Update dashboard auto-refresh timestamp
  localStorage.setItem("lastUpdated", Date.now());

  // Confirmation message
  alert("✅ Product added successfully!");

  // Reset form
  e.target.reset();
});
document.addEventListener("DOMContentLoaded", () => {
  // ===== WELCOME TEXT =====
  const welcomeText = document.getElementById("welcomeText");
  const loggedInUser = localStorage.getItem("loggedInUser") || "Admin";

  // Capitalize first letter (optional)
  const displayName = loggedInUser.charAt(0).toUpperCase() + loggedInUser.slice(1);

  welcomeText.textContent = `Welcome, ${displayName} 👋`;
});
