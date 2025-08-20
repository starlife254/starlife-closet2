//admin.js
console.log("✅ admin.js loaded");

window.addEventListener("DOMContentLoaded", () => {
renderStockTable();

  // ✅ Protect Admin Page
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!user || user.email !== "starllife705@gmail.com") {
    alert("⚠️ Admin access only.");
    window.location.href = "index.html";
    return;
  } 

  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const products = JSON.parse(localStorage.getItem("products")) || [];

  // ✅ Dashboard Stats
  document.getElementById("total-orders").textContent = orders.length;
  document.getElementById("total-revenue").textContent = "KSh " + orders.reduce((sum, o) => sum + o.total, 0).toLocaleString();

  // ✅ Orders List
  const orderList = document.getElementById("admin-order-list");
  if (orderList) {
    if (orders.length === 0) {
      orderList.innerHTML = "<p>No orders found.</p>";
    } else {
      orders.slice().reverse().forEach((order, i) => {
        const div = document.createElement("div");
        div.className = "order-summary";
        div.innerHTML = `
          <h3>Order #${orders.length - i}</h3>
          <p><strong>Date:</strong> ${new Date(order.timestamp).toLocaleString()}</p>
          <p><strong>Customer:</strong> ${order.customer.name}</p>
          <p><strong>Total:</strong> KSh ${order.total.toLocaleString()}</p>
          <details>
            <summary>Items</summary>
            <ul>${order.items.map(item => `<li>${item.name} – KSh ${item.price}</li>`).join("")}</ul>
          </details>
          <hr>
        `;
        orderList.appendChild(div);
      });
    }
  }

  // ✅ Users List
  const userList = document.getElementById("user-list");
  if (userList) {
    if (users.length === 0) {
      userList.innerHTML = "<p>No users found.</p>";
    } else {
      const table = document.createElement("table");
      table.innerHTML = `
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${users.map((u, i) => `
            <tr>
              <td>${i + 1}</td>
              <td>${u.name}</td>
              <td>${u.email}</td>
              <td><button onclick="viewUserDetails('${u.email}')">View</button></td>
            </tr>
          `).join("")}
        </tbody>
      `;
      userList.appendChild(table);
    }
  }

  // ✅ Stock Table
function renderStockTable() {
  const products = JSON.parse(localStorage.getItem("products")) || [];
  const stockTableBody = document.querySelector("#stock-table tbody");
  stockTableBody.innerHTML = ""; // clear old rows

  products.forEach(product => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td><img src="${product.image}" width="60" height="60"/></td>
      <td>${product.name}</td>

      <!-- Editable Stock -->
      <td><input type="number" id="stock-${product.id}" value="${product.stock}" min="0" /></td>

      <!-- Editable Price -->
      <td>
        <input type="number" id="price-${product.id}" value="${product.price}" min="0" step="0.01" />
      </td>

      <td>${product.category}</td>

      <!-- Editable Description -->
      <td>
        <textarea id="desc-${product.id}" rows="2" style="width: 100%;">${product.description || ""}</textarea>
      </td>

      <!-- Featured Checkbox -->
      <td>
        <input type="checkbox" ${product.featured ? "checked" : ""} 
          onchange="toggleFeatured(${product.id}, this.checked)" />
      </td>

      <!-- Save Button -->
      <td>
        <button onclick="updateStockPriceAndDescription(${product.id})" class="btn btn-success">Save</button>
      </td>

      <!-- Delete Button -->
      <td>
        <button onclick="deleteProductById(${product.id})" class="btn btn-danger">🗑️</button>
      </td>
    `;
    stockTableBody.appendChild(row);
  });
}




  // ✅ Add/Edit/Delete Products
  const form = document.getElementById("add-product-form");

  let productList = [...products];

  function renderProducts() {
      const productListDiv = document.getElementById("product-list-admin"); // ✅ fix here
        if (!productListDiv) return; // 🚨 Prevent crash if the div is missing

    productListDiv.innerHTML = "";
    if (productList.length === 0) {
      productListDiv.innerHTML = "<p>No products yet.</p>";
      return;
    }

    const table = document.createElement("table");
    table.innerHTML = `
      <tr>
        <th>Image</th>
        <th>Name</th>
        <th>Price</th>
        <th>Stock</th>
        <th>Category</th>
        <th>description</th>
        <th>⭐ Featured</th>
        <th>Actions</th>
      </tr>
    `;

    productList.forEach((product, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td><img src="${product.image}" width="60" height="60"/></td>
        <td>${product.name}</td>
        <td>KSh ${product.price}</td>
        <td>${product.stock}</td>
        <td>${product.category}</td>
        <td>${product.description || "—"}</td> 

        <td>
          <input type="checkbox" ${product.featured ? "checked" : ""} onchange="toggleFeatured(${product.id}, this.checked)" />
        </td>
        <td>
          
          <button onclick="deleteProduct(${index})">🗑️</button>
        </td>
      `;
      table.appendChild(row);
    });

    productListDiv.appendChild(table);
  }

  if (form) {
    form.addEventListener("submit", function handleSubmit(e) {
      e.preventDefault();
      const name = document.getElementById("product-name").value.trim();
      const price = parseFloat(document.getElementById("product-price").value);
      const stock = parseInt(document.getElementById("product-stock").value);
      const category = document.getElementById("product-category").value;
      const description = document.getElementById("product-description").value.trim(); // 🔹 Add this
      const imageFile = document.getElementById("product-image").files[0];
      const featured = document.getElementById("product-featured").checked;

      if (!imageFile) {
        alert("❌ Please upload an image.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const newProduct = {
          id: Date.now(),
          name,
          price,
          stock,
          category,
          description,
          image: reader.result,
          featured
        };
        productList.push(newProduct);
        localStorage.setItem("products", JSON.stringify(productList));
        renderProducts();
        alert("✅ Product added successfully.");
        form.reset();
        document.getElementById("product-featured").checked = false;
      };
      reader.readAsDataURL(imageFile);
    });
  }

  //window.deleteProduct = function (index) {
    //if (confirm("Delete this product?")) {
    //  productList.splice(index, 1);
      //localStorage.setItem("products", JSON.stringify(productList));
    //  renderProducts();
   // }
//  };
window.deleteProductById = function (productId) {
  const products = JSON.parse(localStorage.getItem("products")) || [];
  const product = products.find(p => p.id === productId);

  const confirmed = confirm(`❗ Are you sure you want to delete "${product?.name}"? This cannot be undone.`);

  if (!confirmed) return;

  const updated = products.filter(p => p.id !== productId);
  localStorage.setItem("products", JSON.stringify(updated));
  renderStockTable(); // Re-render instantly
  alert(`🗑️ "${product?.name}" has been deleted.`);
};



  window.editProduct = function (index) {
    const product = productList[index];
    document.getElementById("product-name").value = product.name;
    document.getElementById("product-price").value = product.price;
    document.getElementById("product-stock").value = product.stock;
    document.getElementById("product-category").value = product.category;
    document.getElementById("product-description").value = product.description || ""; // ✅ NEW
    document.getElementById("product-image").required = false;

    form.onsubmit = function (e) {
      e.preventDefault();
      product.name = document.getElementById("product-name").value.trim();
      product.price = parseFloat(document.getElementById("product-price").value);
      product.stock = parseInt(document.getElementById("product-stock").value);
      product.category = document.getElementById("product-category").value;
     product.description = document.getElementById("product-description").value.trim(); // ✅ NEW

      const newImage = document.getElementById("product-image").files[0];
      if (newImage) {
        const reader = new FileReader();
        reader.onloadend = () => {
          product.image = reader.result;
          localStorage.setItem("products", JSON.stringify(productList));
          renderProducts();
          alert("✅ Product updated successfully.");
          form.reset();
          form.onsubmit = handleSubmit;
        };
        reader.readAsDataURL(newImage);
      } else {
        localStorage.setItem("products", JSON.stringify(productList));
        renderProducts();
        alert("✅ Product updated successfully.");
        form.reset();
        form.onsubmit = handleSubmit;
      }
    };
  };const lastLogin = localStorage.getItem("adminLastLogin");
let newOrders = [];

if (lastLogin) {
  newOrders = orders.filter(order => new Date(order.timestamp) > new Date(lastLogin));
  if (newOrders.length > 0) {
    const notificationBox = document.getElementById("admin-notification");
    const messageBox = document.getElementById("notification-message");
    const viewBtn = document.getElementById("view-order-btn");

    messageBox.textContent = `📦 You have ${newOrders.length} new order(s) since your last login!`;
    notificationBox.style.display = "block";

    viewBtn.onclick = () => {
      notificationBox.style.display = "none";

      // Scroll to the first new order (assuming order list is reversed)
      const orderList = document.getElementById("admin-order-list");
      if (orderList) {
        const allOrders = orderList.querySelectorAll(".order-summary");
        if (allOrders.length > 0) {
          allOrders[0].scrollIntoView({ behavior: "smooth", block: "start" });
          allOrders[0].style.border = "2px solid #007bff"; // highlight
          setTimeout(() => {
            allOrders[0].style.border = ""; // remove after delay
          }, 4000);
        }
      }
    };
  }
}

// Save current login time
localStorage.setItem("adminLastLogin", new Date().toISOString());


  renderProducts();
  const LOW_STOCK_THRESHOLD = 5;
const lowStockItems = products.filter(p => p.stock < LOW_STOCK_THRESHOLD);

if (lowStockItems.length > 0) {
  const lowStockBox = document.getElementById("low-stock-notification");
  const stockMsg = document.getElementById("low-stock-message");
  const stockBtn = document.getElementById("view-stock-btn");

  stockMsg.textContent = `⚠️ ${lowStockItems.length} product(s) have low stock!`;
  lowStockBox.style.display = "block";

  stockBtn.onclick = () => {
    lowStockBox.style.display = "none";
    const firstLow = document.getElementById(`stock-${lowStockItems[0].id}`);
    if (firstLow) {
      firstLow.scrollIntoView({ behavior: "smooth", block: "center" });
      firstLow.style.border = "3px solid red";
      setTimeout(() => (firstLow.style.border = ""), 3000);
    }
  };
}

  renderCharts(orders, products);
});

function renderCharts(orders, products) {
  // === Sales per Day (last 7 days) ===
  const dailySales = {};
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const key = date.toISOString().split('T')[0];
    dailySales[key] = 0;
  }

  orders.forEach(order => {
    const dateKey = new Date(order.timestamp).toISOString().split('T')[0];
    if (dailySales[dateKey] !== undefined) {
      dailySales[dateKey] += order.total;
    }
  });

  const salesCtx = document.getElementById("salesChart").getContext("2d");
  new Chart(salesCtx, {
    type: "line",
    data: {
      labels: Object.keys(dailySales),
      datasets: [{
        label: "Sales (KSh)",
        data: Object.values(dailySales),
        borderColor: "#007bff",
        fill: true,
        tension: 0.3
      }]
    }
  });

  // === Product Category Performance ===
  const categoryCounts = {};
  products.forEach(p => {
    const cat = p.category || "Unknown";
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  const categoryCtx = document.getElementById("categoryChart").getContext("2d");
  new Chart(categoryCtx, {
    type: "doughnut",
    data: {
      labels: Object.keys(categoryCounts),
      datasets: [{
        label: "Products per Category",
        data: Object.values(categoryCounts),
        backgroundColor: ["#007bff", "#28a745", "#ffc107"]
      }]
    }
  });

  // === Top-Selling Products ===
  const productSales = {};
  orders.forEach(order => {
    order.items.forEach(item => {
      productSales[item.name] = (productSales[item.name] || 0) + item.quantity;
    });
  });

  const sortedSales = Object.entries(productSales).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const topProductCtx = document.getElementById("topProductsChart").getContext("2d");
  new Chart(topProductCtx, {
    type: "bar",
    data: {
      labels: sortedSales.map(([name]) => name),
      datasets: [{
        label: "Units Sold",
        data: sortedSales.map(([_, qty]) => qty),
        backgroundColor: "#ff6384"
      }]
    }
  });
}

// ✅ Stock Update
window.updateStockPriceAndDescription = function (productId) {
  const stockInput = document.getElementById(`stock-${productId}`);
  const priceInput = document.getElementById(`price-${productId}`);
  const descInput = document.getElementById(`desc-${productId}`);

  const newStock = parseInt(stockInput.value);
  const newPrice = parseFloat(priceInput.value);
  const newDesc = descInput.value.trim();

  if (isNaN(newStock) || newStock < 0) {
    alert("❌ Invalid stock value.");
    return;
  }
  if (isNaN(newPrice) || newPrice < 0) {
    alert("❌ Invalid price value.");
    return;
  }

  const products = JSON.parse(localStorage.getItem("products")) || [];
  const product = products.find(p => p.id === productId);

  if (product) {
    product.stock = newStock;
    product.price = newPrice;
    product.description = newDesc;

    localStorage.setItem("products", JSON.stringify(products));
    alert(`✅ "${product.name}" updated successfully.`);
    renderStockTable(); // Refresh instantly
  }
};


// ✅ Toggle Featured
window.toggleFeatured = function (productId, isChecked) {
  const products = JSON.parse(localStorage.getItem("products")) || [];
  const product = products.find(p => p.id === productId);
  if (product) {
    product.featured = isChecked;
    localStorage.setItem("products", JSON.stringify(products));
    alert(`⭐ "${product.name}" is now ${isChecked ? "featured" : "not featured"}.`);
  }
};

// ✅ View User Details
window.viewUserDetails = function (email) {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  const user = users.find(u => u.email === email);
  const userOrders = orders.filter(o => o.customer.email === email);
  const container = document.getElementById("user-details");

  if (!user) {
    container.innerHTML = "<p>User not found.</p>";
    return;
  }

  const lastOrder = userOrders[0]?.customer || {};
  container.innerHTML = `
    <h3>👤 User Details</h3>
    <p><strong>Name:</strong> ${user.name}</p>
    <p><strong>Email:</strong> ${user.email}</p>
    ${lastOrder.phone ? `<p><strong>Phone:</strong> ${lastOrder.phone}</p>` : ""}
    ${lastOrder.address ? `<p><strong>Address:</strong> ${lastOrder.address}</p>` : ""}
    ${lastOrder.city ? `<p><strong>City:</strong> ${lastOrder.city}</p>` : ""}
    ${lastOrder.county ? `<p><strong>County:</strong> ${lastOrder.county}</p>` : ""}
    <hr>
    <h4>📦 Orders (${userOrders.length})</h4>
  `;

  if (userOrders.length === 0) {
    container.innerHTML += "<p>No orders found.</p>";
    return;
  }

  userOrders.reverse().forEach((order, i) => {
    const div = document.createElement("div");
    div.className = "order-summary";
    div.innerHTML = `
      <p><strong>Order #${i + 1}</strong></p>
      <p><strong>Date:</strong> ${new Date(order.timestamp).toLocaleString()}</p>
      <p><strong>Total:</strong> KSh ${order.total.toLocaleString()}</p>
      <details>
        <summary>Items</summary>
        <ul>
          ${order.items.map(item => `<li>${item.name} – KSh ${item.price}</li>`).join("")}
        </ul>
      </details>
    `;
    container.appendChild(div);
  });
};
