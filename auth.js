// auth.js

const user = JSON.parse(localStorage.getItem("loggedInUser"));

if (!user) {
  alert("⚠️ You must be logged in to access this page.");
  window.location.href = "login.html";
}
