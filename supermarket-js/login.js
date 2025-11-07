// ===== login.js =====

// Demo admin credentials (you can change these)
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "12345";

// Select elements
const loginForm = document.getElementById("loginForm");
const messageDiv = document.getElementById("message");

// Check if user is already logged in
if (localStorage.getItem("isLoggedIn") === "true") {
  window.location.href = "supermarket-admin/admin.html";
}

// Handle login form submission
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  messageDiv.textContent = "";
  messageDiv.className = "msg";

  // ===== 1️⃣ Check admin credentials =====
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("currentUser", JSON.stringify({ username, role: "Admin" }));

    messageDiv.textContent = "Login successful! Redirecting...";
    messageDiv.classList.add("success");

    setTimeout(() => {
      window.location.href = "supermarket-admin/admin.html";
    }, 1000);
    return;
  }

  // ===== 2️⃣ Check staff credentials in localStorage =====
  const staffList = JSON.parse(localStorage.getItem("staffList")) || [];
  const matchedStaff = staffList.find(
    (staff) => staff.username === username && staff.password === password
  );

  if (matchedStaff) {
    // Save login info
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("currentUser", JSON.stringify(matchedStaff));

    messageDiv.textContent = `Welcome, ${matchedStaff.username}! Redirecting...`;
    messageDiv.classList.add("success");

    // Redirect based on role (you can customize this if you have different dashboards)
    setTimeout(() => {
      window.location.href = "supermarket-admin/admin.html";
    }, 1000);
  } else {
    // ===== 3️⃣ Invalid credentials =====
    messageDiv.textContent = "Invalid username or password!";
    messageDiv.classList.add("error");
  }
});
