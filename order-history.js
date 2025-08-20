window.addEventListener("DOMContentLoaded", () => {
  const orderList = document.getElementById("order-list");
  const orders = JSON.parse(localStorage.getItem("orders")) || [];

  if (orders.length === 0) {
    orderList.innerHTML = "<p>You have no past orders.</p>";
    return;
  }

  orders.reverse().forEach((order, index) => {
    const orderDiv = document.createElement("div");
    orderDiv.className = "order-summary";
    const orderDate = new Date(order.timestamp).toLocaleString();

    orderDiv.innerHTML = `
      <h3>Order #${orders.length - index}</h3>
      <p><strong>Date:</strong> ${orderDate}</p>
      <p><strong>Total:</strong> KSh ${order.total.toLocaleString()}</p>
      <p><strong>Items:</strong> ${order.items.length}</p>
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
});
