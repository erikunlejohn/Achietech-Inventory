// ===== Demo Admin Credentials =====
const ADMIN_CREDENTIALS = { username: "admin", password: "12345", role: "Admin" };

// ===== DOM Elements =====
const loginForm = document.getElementById("loginForm");
const messageDiv = document.getElementById("message");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

// ===== Check if user already logged in =====
if (localStorage.getItem("isLoggedIn") === "true") {
  redirectToDashboard();
}

// ===== Login Form Submission =====
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  // Reset message
  messageDiv.textContent = "";
  messageDiv.className = "msg";

  // Check admin first
  if (checkAdmin(username, password)) return;

  // Then check staff
  if (checkStaff(username, password)) return;

  // Invalid credentials
  showMessage("Invalid username or password!", "error");
  passwordInput.value = ""; // clear password
});

// ===== Functions =====
function checkAdmin(username, password) {
  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    loginSuccess(ADMIN_CREDENTIALS);
    return true;
  }
  return false;
}

function checkStaff(username, password) {
  const staffList = JSON.parse(localStorage.getItem("staffList")) || [];
  const matchedStaff = staffList.find(staff => staff.username === username && staff.password === password);

  if (matchedStaff) {
    loginSuccess(matchedStaff);
    return true;
  }
  return false;
}

function loginSuccess(user) {
  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("currentUser", JSON.stringify(user));

  showMessage(`Welcome, ${user.username}! Redirecting...`, "success");

  setTimeout(redirectToDashboard, 1000);
}

function redirectToDashboard() {
  // Redirect based on role (can add staff dashboard later)
  window.location.href = "supermarket-admin/admin.html";
}

function showMessage(text, type) {
  messageDiv.textContent = text;
  messageDiv.className = `msg ${type}`;
}
