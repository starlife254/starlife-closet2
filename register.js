document.getElementById("register-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  const confirmationCode = Math.floor(100000 + Math.random() * 900000);

  const now = new Date();
  const timeString = now.toLocaleString("en-KE", {
    dateStyle: "short",
    timeStyle: "short"
  });

  // Save temp user info
  const tempUser = { name, email, password, confirmationCode };
  localStorage.setItem("pendingUser", JSON.stringify(tempUser));

  // ✅ Call global function defined in script type=module
  sendConfirmation({
    name,
    email,
    code: confirmationCode,
    time: timeString
  })
    .then(() => {
      alert("✅ Confirmation code sent to your email.");
      window.location.href = "verify.html";
    })
    .catch(error => {
      console.error("❌ EmailJS error:", error);
      alert("❌ Failed to send confirmation code.");
    });
});
