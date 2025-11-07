// =======================================================
// ===== PAGE PERMISSION CHECK (Only Admin can access) =====
// =======================================================
const role = (localStorage.getItem("role") || "").toLowerCase();
const loggedInUser = localStorage.getItem("loggedInUser") || "";

// ✅ Always grant admin access
// if (role === "admin") {
//   console.log("✅ Admin access granted");
// } else {
//   // For non-admin staff, check if they have manage staff permission
//   const staffList = JSON.parse(localStorage.getItem("staffList")) || [];
//   const currentStaff = staffList.find(
//     (s) => s.username.toLowerCase() === loggedInUser.toLowerCase()
//   );
//   const currentPermissions = currentStaff ? currentStaff.permissions : {};

//   if (!currentPermissions.permManageStaff) {
//     alert("Access denied! You do not have permission to view this page.");
//     switch (role) {
//       case "sales staff":
//         window.location.href = "./sales.html";
//         break;
//       case "inventory manager":
//         window.location.href = "./view-stock.html";
//         break;
//       default:
//         window.location.href = "./admin.html";
//         break;
//     }
//   }
// }



// =======================================================
// ===== PREDEFINED ROLES =====
// =======================================================
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

// =======================================================
// ===== DOM ELEMENTS =====
// =======================================================
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

// =======================================================
// ===== UPDATE PERMISSIONS WHEN ROLE IS SELECTED =====
// =======================================================
roleInput.addEventListener("change", () => {
  const selectedRole = predefinedRoles.find(
    (r) => r.name.toLowerCase() === roleInput.value.toLowerCase()
  );

  if (selectedRole) {
    for (let perm in permissionInputs) {
      permissionInputs[perm].checked = selectedRole.permissions[perm];
    }
  } else {
    for (let perm in permissionInputs) {
      permissionInputs[perm].checked = false;
    }
  }
});

// =======================================================
// ===== ADD STAFF HANDLER =====
// =======================================================
addStaffForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const role = roleInput.value.trim();

  if (!username || !password || !role) {
    showToast("Please fill in all fields!", "error");
    return;
  }

  // ✅ Automatically assign predefined permissions based on role
  const selectedRole = predefinedRoles.find(
    (r) => r.name.toLowerCase() === role.toLowerCase()
  );
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

// =======================================================
// ===== DISPLAY STAFF TABLE =====
// =======================================================
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
      .map((key) => key.replace("perm", ""))
      .join(", ");

    const row = `
      <tr>
        <td>${index + 1}</td>
        <td>${staff.username}</td>
        <td>${staff.role}</td>
        <td>${permKeys || "—"}</td>
        <td>${staff.dateAdded}</td>
        <td>
          <button class="delete-btn" onclick="deleteStaff(${staff.id})"><i class="fas fa-trash"></i></button>
        </td>
      </tr>
    `;
    staffTableBody.insertAdjacentHTML("beforeend", row);
  });
}

// =======================================================
// ===== DELETE STAFF =====
// =======================================================
function deleteStaff(id) {
  let staffList = JSON.parse(localStorage.getItem("staffList")) || [];
  staffList = staffList.filter((staff) => staff.id !== id);
  localStorage.setItem("staffList", JSON.stringify(staffList));
  showToast("Staff deleted successfully", "success");
  displayStaffTable();
}

// =======================================================
// ===== CLEAR FORM BUTTON =====
// =======================================================
document.getElementById("clearStaffBtn").addEventListener("click", () => {
  addStaffForm.reset();
  for (let perm in permissionInputs) {
    permissionInputs[perm].checked = false;
  }
});

// =======================================================
// ===== TOAST MESSAGE SYSTEM =====
// =======================================================
function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast-message ${type}`;
  toast.innerHTML = `
    <i class="fa-solid ${
      type === "success" ? "fa-circle-check" : "fa-triangle-exclamation"
    }"></i>
    ${message}
  `;
  toastContainer.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}
document.addEventListener("DOMContentLoaded", () => {
  // ===== ELEMENTS =====
  const menuToggle = document.getElementById("menuToggle");
  const closeSidebar = document.getElementById("closeSidebar");
  const sidebar = document.getElementById("sidebar");

  const darkModeToggle = document.getElementById("darkModeToggle"); // header dark mode
  const sidebarDarkMode = document.getElementById("sidebarDarkMode"); // sidebar dark mode

  const body = document.body;

  // ===== HAMBURGER MENU =====
  menuToggle.addEventListener("click", (e) => {
    e.stopPropagation(); // Prevent outside click from immediately closing
    sidebar.classList.toggle("active");
  });

  closeSidebar.addEventListener("click", () => {
    sidebar.classList.remove("active");
  });

  // Clicking outside closes sidebar
  document.addEventListener("click", (e) => {
    if (
      sidebar.classList.contains("active") &&
      !sidebar.contains(e.target) &&
      !menuToggle.contains(e.target)
    ) {
      sidebar.classList.remove("active");
    }
  });

  // ===== DARK MODE =====
  const toggleDarkMode = () => {
    body.classList.toggle("dark-mode");
    // Save preference in localStorage
    localStorage.setItem("darkMode", body.classList.contains("dark-mode"));
  };

  darkModeToggle.addEventListener("click", toggleDarkMode);
  sidebarDarkMode.addEventListener("click", toggleDarkMode);

  // ===== LOAD DARK MODE PREFERENCE =====
  const darkModePref = localStorage.getItem("darkMode") === "true";
  if (darkModePref) {
    body.classList.add("dark-mode");
  }
});
// Initial display of staff table
displayStaffTable();      


