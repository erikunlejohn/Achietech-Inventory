// =======================================================
// ===== LOGIN HANDLER =====
// =======================================================
const loginForm = document.getElementById("loginForm");
const msg = document.getElementById("msg");

loginForm?.addEventListener("submit", (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  // ===== ADMIN LOGIN =====
  if (username.toLowerCase() === "admin" && password === "12345") {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("role", "Admin");
    localStorage.setItem("loggedInUser", "admin"); // lowercase consistency
    localStorage.setItem(
      "permissions",
      JSON.stringify({
        permAddProduct: true,
        permEditProduct: true,
        permDeleteProduct: true,
        permViewStock: true,
        permRecordSales: true,
        permDeleteSales: true,
        permViewDashboard: true,
        permManageStaff: true
      })
    );
    window.location.href = "./supermarket-admin/admin.html";
    return;
  }

  // ===== STAFF LOGIN =====
  const staffList = JSON.parse(localStorage.getItem("staffList")) || [];
  const foundStaff = staffList.find(
    (staff) => staff.username === username && staff.password === password
  );

  if (foundStaff) {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("role", foundStaff.role);
    localStorage.setItem("loggedInUser", foundStaff.username);
    localStorage.setItem("permissions", JSON.stringify(foundStaff.permissions));

    // Redirect by role
    switch (foundStaff.role) {
      case "Sales Staff":
        window.location.href = "./supermarket-admin/sales.html";
        break;
      case "Inventory Manager":
        window.location.href = "./supermarket-admin/view-stock.html";
        break;
      default:
        window.location.href = "./supermarket-admin/admin.html";
        break;
    }
  } else {
    msg.textContent = "Invalid username or password!";
    msg.className = "msg error";
  }
});







// =======================================================
// ===== PROTECT PAGES (Prevent access if not logged in) =====
// =======================================================
if (
  !window.location.href.includes("index.html") &&
  !localStorage.getItem("isLoggedIn")
) {
  window.location.href = "../index.html";
}

// =======================================================
// ===== LOGOUT FUNCTION =====
// =======================================================
function logout() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("role");
  localStorage.removeItem("loggedInUser");
  localStorage.removeItem("permissions");
  window.location.href = "../index.html";
}

// =======================================================
// ===== PERMISSION CHECK HELPER =====
// =======================================================
function getPermissions() {
  const role = localStorage.getItem("role");

  if (role === "Admin") {
    // ✅ Admin always full access
    return {
      permAddProduct: true,
      permEditProduct: true,
      permDeleteProduct: true,
      permViewStock: true,
      permRecordSales: true,
      permDeleteSales: true,
      permViewDashboard: true,
      permManageStaff: true
    };
  }

  // For staff users
  return JSON.parse(localStorage.getItem("permissions")) || {};
}


