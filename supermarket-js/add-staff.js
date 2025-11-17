// =======================================================
// ===== ADD STAFF PAGE SCRIPT (FIXED & UPDATED) =====
// =======================================================

// ======================= CURRENT USER CHECK =======================
const currentUser = JSON.parse(localStorage.getItem("currentUser"));

// Redirect if not logged in
if (!currentUser) {
  window.location.href = "../index.html";
}

// Only admins can manage staff
if (currentUser.role.toLowerCase() !== "admin") {
  const perms = currentUser.permissions || {};
  if (!perms.permManageStaff) {
    alert("Access denied! You do not have permission to view this page.");
    switch (currentUser.role.toLowerCase()) {
      case "sales staff":
        window.location.href = "./sales.html";
        break;
      case "inventory manager":
        window.location.href = "./view-stock.html";
        break;
      default:
        window.location.href = "./admin.html";
        break;
    }
  }
}

// ======================= PREDEFINED ROLES =======================
const predefinedRoles = [
  {
    name: "Admin",
    permissions: {
      permAddProduct: true,
      permEditProduct: true,
      permDeleteProduct: true,
      permViewStock: true,
      permRecordSales: true,
      permDeleteSales: true,
      permViewDashboard: true,
      permManageStaff: true
    }
  },
  {
    name: "Sales Staff",
    permissions: {
      permAddProduct: false,
      permEditProduct: false,
      permDeleteProduct: false,
      permViewStock: true,
      permRecordSales: true,
      permDeleteSales: false,
      permViewDashboard: true,
      permManageStaff: false
    }
  },
  {
    name: "Inventory Manager",
    permissions: {
      permAddProduct: true,
      permEditProduct: true,
      permDeleteProduct: false,
      permViewStock: true,
      permRecordSales: false,
      permDeleteSales: false,
      permViewDashboard: true,
      permManageStaff: false
    }
  }
];

// ======================= DOM ELEMENTS =======================
const addStaffForm = document.getElementById("addStaffForm");
const roleInput = document.getElementById("roleInput");
const staffDate = document.getElementById("staffDate");
const staffTableBody = document.getElementById("staffTableBody");
const toastContainer = document.getElementById("toastContainer");

// Display today’s date
const today = new Date().toLocaleDateString();
staffDate.textContent = today;

// Map permission checkboxes
const permissionInputs = {
  permAddProduct: document.getElementById("permAddProduct"),
  permEditProduct: document.getElementById("permEditProduct"),
  permDeleteProduct: document.getElementById("permDeleteProduct"),
  permViewStock: document.getElementById("permViewStock"),
  permRecordSales: document.getElementById("permRecordSales"),
  permDeleteSales: document.getElementById("permDeleteSales"),
  permViewDashboard: document.getElementById("permViewDashboard"),
  permManageStaff: document.getElementById("permManageStaff")
};

// ======================= UPDATE PERMISSIONS WHEN ROLE IS SELECTED =======================
roleInput.addEventListener("change", () => {
  const selectedRole = predefinedRoles.find(
    (r) => r.name.toLowerCase() === roleInput.value.toLowerCase()
  );

  for (let perm in permissionInputs) {
    permissionInputs[perm].checked = selectedRole ? selectedRole.permissions[perm] : false;
  }
});

// ======================= ADD STAFF HANDLER =======================
addStaffForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const role = roleInput.value.trim();

  if (!username || !password || !role) {
    showToast("Please fill in all fields!", "error");
    return;
  }

  // Permissions based on role
  const selectedRole = predefinedRoles.find(r => r.name.toLowerCase() === role.toLowerCase());
  const permissions = selectedRole ? selectedRole.permissions : {};

  const newStaff = {
    id: Date.now(),
    username,
    password,
    role,
    permissions,
    dateAdded: today
  };

  let staffList = JSON.parse(localStorage.getItem("staffList")) || [];
  staffList.push(newStaff);
  localStorage.setItem("staffList", JSON.stringify(staffList));

  showToast(`Staff "${username}" added successfully!`, "success");
  addStaffForm.reset();
  displayStaffTable();
});

// ======================= DISPLAY STAFF TABLE =======================
function displayStaffTable() {
  const staffList = JSON.parse(localStorage.getItem("staffList")) || [];
  staffTableBody.innerHTML = "";

  if (staffList.length === 0) {
    staffTableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;">No staff added yet.</td></tr>`;
    return;
  }

  staffList.forEach((staff, index) => {
    const permKeys = Object.keys(staff.permissions)
      .filter((key) => staff.permissions[key])
      .map(key => key.replace("perm", ""))
      .join(", ");

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${staff.username}</td>
      <td>${staff.role}</td>
      <td>${permKeys || "—"}</td>
      <td>${staff.dateAdded}</td>
      <td><button class="delete-btn" data-id="${staff.id}"><i class="fas fa-trash"></i></button></td>
    `;
    staffTableBody.appendChild(row);
  });
}

// ======================= DELETE STAFF (Delegated) =======================
staffTableBody.addEventListener("click", (e) => {
  if (!e.target.closest(".delete-btn")) return;

  const btn = e.target.closest(".delete-btn");
  const id = Number(btn.dataset.id);
  let staffList = JSON.parse(localStorage.getItem("staffList")) || [];
  staffList = staffList.filter(staff => staff.id !== id);
  localStorage.setItem("staffList", JSON.stringify(staffList));
  showToast("Staff deleted successfully", "success");
  displayStaffTable();
});

// ======================= CLEAR FORM BUTTON =======================
document.getElementById("clearStaffBtn").addEventListener("click", () => {
  addStaffForm.reset();
  for (let perm in permissionInputs) permissionInputs[perm].checked = false;
});

// ======================= TOAST SYSTEM =======================
function showToast(message, type = "success") {
  if (!toastContainer) return;
  const toast = document.createElement("div");
  toast.className = `toast-message ${type}`;
  toast.innerHTML = `<i class="fa-solid ${type === "success" ? "fa-circle-check" : "fa-triangle-exclamation"}"></i>${message}`;
  toastContainer.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// ======================= DARK MODE (Persistent + Safe) =======================
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

// ======================= INITIALIZATION =======================
displayStaffTable();
// ===== SIDEBAR & DARK MODE (kept at file bottom) =====
const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");
const closeSidebar = document.getElementById("closeSidebar");

menuToggle?.addEventListener("click", () => sidebar?.classList.add("active"));
closeSidebar?.addEventListener("click", () => sidebar?.classList.remove("active"));
document.querySelectorAll(".sidebar a").forEach(link => link.addEventListener("click", () => sidebar?.classList.remove("active")));

const darkModeToggle = document.getElementById("darkModeToggle");
const sidebarDarkMode = document.getElementById("sidebarDarkMode");
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
}
if (localStorage.getItem("darkMode") === "true") document.body.classList.add("dark-mode");
darkModeToggle?.addEventListener("click", toggleDarkMode);
sidebarDarkMode?.addEventListener("click", toggleDarkMode);
// Close sidebar when clicking outside
document.addEventListener("click", e => {
  if (sidebar.classList.contains("active") &&
      !sidebar.contains(e.target) &&
      !menuToggle.contains(e.target)) {
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


