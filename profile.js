window.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const allUsers = JSON.parse(localStorage.getItem("users")) || [];
  const allOrders = JSON.parse(localStorage.getItem("orders")) || [];

  const orderList = document.getElementById("order-list");
  const userInfoDiv = document.getElementById("user-info");
  const editForm = document.getElementById("edit-profile-form");
  const passwordForm = document.getElementById("change-password-form");

  if (!user) {
    alert("⚠️ Please log in.");
    window.location.href = "login.html";
    return;
  }

  const storedUser = allUsers.find(u => u.email === user.email);

  // ✅ Display User Info
  function renderUserInfo() {
    userInfoDiv.innerHTML = `
      <p><strong>Name:</strong> ${storedUser.name}</p>
      <p><strong>Email:</strong> ${storedUser.email}</p>
      ${storedUser.image ? `<img src="${storedUser.image}" width="100" style="border-radius:50%; margin-top:10px;" />` : ""}
    `;

    // Fill edit form
    if (editForm) {
      document.getElementById("edit-name").value = storedUser.name;
      document.getElementById("edit-email").value = storedUser.email;
    }
  }

  // ✅ Display Order History
  function renderOrders() {
    const myOrders = allOrders.filter(order => order.customer.email === storedUser.email);

    if (myOrders.length === 0) {
      orderList.innerHTML = "<p>You haven’t placed any orders yet.</p>";
      return;
    }

    orderList.innerHTML = "";
    myOrders.reverse().forEach((order, index) => {
      const orderDiv = document.createElement("div");
      const date = new Date(order.timestamp).toLocaleString();

      orderDiv.className = "order-summary";
      orderDiv.innerHTML = `
        <h3>Order #${myOrders.length - index}</h3>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Total:</strong> KSh ${order.total.toLocaleString()}</p>
        <details>
          <summary>View Items</summary>
          <ul>
            ${order.items.map(item => `<li>${item.name} - KSh ${item.price.toLocaleString()}</li>`).join("")}
          </ul>
        </details>
        <hr>
      `;
      orderList.appendChild(orderDiv);
    });
  }

  // ✅ Save updated info to storage
  function saveProfile() {
    const updatedUsers = allUsers.map(u => u.email === storedUser.email ? storedUser : u);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    localStorage.setItem("loggedInUser", JSON.stringify(storedUser));
  }

  // ✅ Handle Edit Profile Form
  if (editForm) {
    editForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("edit-name").value.trim();
      const file = document.getElementById("profile-image").files[0];

      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          storedUser.name = name;
          storedUser.image = reader.result;
          saveProfile();
          renderUserInfo();
          alert("✅ Profile updated.");
        };
        reader.readAsDataURL(file);
      } else {
        storedUser.name = name;
        saveProfile();
        renderUserInfo();
        alert("✅ Profile updated.");
      }
    });
  }

  // ✅ Handle Password Change Form
  if (passwordForm) {
    passwordForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const pass1 = document.getElementById("new-password").value;
      const pass2 = document.getElementById("confirm-password").value;

      if (pass1 !== pass2) {
        alert("❌ Passwords do not match.");
        return;
      }

      storedUser.password = pass1;
      saveProfile();
      passwordForm.reset();
      alert("✅ Password changed.");
    });
  }

  renderUserInfo();
  renderOrders();
});
