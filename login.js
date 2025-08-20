document.getElementById("login-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    alert("❌ Invalid email or password.");
    return;
  }

  localStorage.setItem("loggedInUser", JSON.stringify(user));
  alert(`✅ Welcome back, ${user.name}!`);
  window.location.href = "index.html"; // or dashboard.html
});
