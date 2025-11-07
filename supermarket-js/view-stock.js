// ===== VIEW STOCK PAGE SCRIPT =====
document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ View Stock JS Loaded");

  const stockBody = document.getElementById("stockBody");
  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");

  // ===== Get & Save Helpers =====
  function getProducts() {
    return JSON.parse(localStorage.getItem("products")) || [];
  }

  function saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
    // Mark update time for dashboard
    localStorage.setItem("lastUpdated", Date.now());
  }

  // ===== RENDER TABLE =====
  function renderTable(filteredProducts = getProducts()) {
    stockBody.innerHTML = "";

    if (filteredProducts.length === 0) {
      stockBody.innerHTML = `<tr><td colspan="7" style="text-align:center;">No products found</td></tr>`;
      return;
    }

    filteredProducts.forEach((product, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${index + 1}</td> <!-- Serial Number -->
        <td>${product.name}</td>
        <td>${product.category}</td>
        <td>₦${product.price.toLocaleString()}</td>
        <td>${product.quantity}</td>
        <td>${product.dateAdded || "N/A"}</td>
        <td>
          <button class="edit-btn" data-id="${product.id}">
            <i class="fas fa-edit"></i>
          </button>
          <button class="delete-btn" data-id="${product.id}">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      `;
      stockBody.appendChild(row);
    });

    attachActionButtons();
  }

  // ===== ATTACH EDIT & DELETE EVENTS =====
  function attachActionButtons() {
    const deleteBtns = document.querySelectorAll(".delete-btn");
    const editBtns = document.querySelectorAll(".edit-btn");

    // ===== DELETE BUTTON =====
    deleteBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = e.currentTarget.dataset.id;
        let products = getProducts();
        const product = products.find((p) => String(p.id) === String(id));
        if (!product) return;

        const confirmed = confirm(`🗑️ Are you sure you want to delete "${product.name}"?`);
        if (confirmed) {
          products = products.filter((p) => String(p.id) !== String(id));
          saveProducts(products);
          renderTable(products); // refresh table
          alert(`✅ "${product.name}" deleted successfully.`);
        }
      });
    });

    // ===== EDIT BUTTON =====
    editBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = e.currentTarget.dataset.id;
        let products = getProducts();
        const product = products.find((p) => String(p.id) === String(id));
        if (!product) return;

        const confirmed = confirm(`✏️ Do you want to edit "${product.name}"?`);
        if (confirmed) {
          const newName = prompt("Enter new name:", product.name);
          const newPrice = prompt("Enter new price (₦):", product.price);
          const newQty = prompt("Enter new quantity:", product.quantity);

          if (newName && newPrice && newQty) {
            product.name = newName.trim();
            product.price = parseFloat(newPrice);
            product.quantity = parseInt(newQty);

            const updatedProducts = products.map((p) =>
              String(p.id) === String(id) ? product : p
            );

            saveProducts(updatedProducts);
            renderTable(updatedProducts);
            alert(`✅ "${product.name}" updated successfully.`);
          } else {
            alert("⚠️ Edit cancelled or invalid values provided.");
          }
        }
      });
    });
  }

  // ===== SEARCH FUNCTION =====
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    const products = getProducts();
    const filtered = products.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
    );
    renderTable(filtered);
  });

  // ===== CATEGORY FILTER =====
  categoryFilter.addEventListener("change", () => {
    const products = getProducts();
    const category = categoryFilter.value;
    const filtered =
      category === "All"
        ? products
        : products.filter((p) => p.category === category);
    renderTable(filtered);
  });

  // ===== INITIAL RENDER =====
  renderTable();
});


// ===== SIDEBAR TOGGLE =====
const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");
const closeSidebar = document.getElementById("closeSidebar");

// --- Open sidebar
menuToggle?.addEventListener("click", (e) => {
  e.stopPropagation(); // prevent triggering outside click
  sidebar.classList.add("active");
});

// --- Close with close button
closeSidebar?.addEventListener("click", (e) => {
  e.stopPropagation();
  sidebar.classList.remove("active");
});

// --- Close when any sidebar link is clicked
document.querySelectorAll(".sidebar a").forEach((link) => {
  link.addEventListener("click", () => sidebar.classList.remove("active"));
});

// --- Close when clicking outside the sidebar
document.addEventListener("click", (e) => {
  const isClickInsideSidebar = sidebar.contains(e.target);
  const isMenuButton = menuToggle.contains(e.target);
  if (sidebar.classList.contains("active") && !isClickInsideSidebar && !isMenuButton) {
    sidebar.classList.remove("active");
  }
});


// ===== DARK MODE =====
const darkModeToggle = document.getElementById("darkModeToggle");
const sidebarDarkMode = document.getElementById("sidebarDarkMode");

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
}

// Apply saved mode on load
if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark-mode");
}

darkModeToggle?.addEventListener("click", toggleDarkMode);
sidebarDarkMode?.addEventListener("click", toggleDarkMode);
