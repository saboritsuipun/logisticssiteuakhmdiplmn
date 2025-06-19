
document.addEventListener("DOMContentLoaded", () => {
  setupNavigation();
  setupOrders();
  setupTransport();
  setupEmployees();
});

function setupNavigation() {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const sectionId = link.getAttribute('data-section');
      document.querySelectorAll('.tab-section').forEach(s => s.classList.remove('active'));
      document.getElementById(sectionId).classList.add('active');
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });
}

function setupOrders() {
  const form = document.getElementById('orderForm');
  const table = document.getElementById('ordersTable').querySelector('tbody');
  const message = document.getElementById('orderMessage');

  function getOrders() {
    return JSON.parse(localStorage.getItem('orders')) || [];
  }
  function saveOrders(data) {
    localStorage.setItem('orders', JSON.stringify(data));
  }
  function render() {
    table.innerHTML = '';
    getOrders().forEach((order, i) => {
      table.innerHTML += \`
        <tr><td>\${order.id}</td><td>\${order.date}</td><td>\${order.amount}</td><td>\${order.status}</td>
        <td><button onclick="deleteOrder(\${i})" class="btn btn-danger btn-sm">Видалити</button></td></tr>
      \`;
    });
  }
  window.deleteOrder = i => {
    const data = getOrders();
    data.splice(i, 1);
    saveOrders(data);
    render();
  };
  form.onsubmit = e => {
    e.preventDefault();
    const data = getOrders();
    data.push({
      id: form.orderId.value,
      date: form.orderDate.value,
      amount: form.orderAmount.value,
      status: form.orderStatus.value
    });
    saveOrders(data);
    render();
    form.reset();
    message.textContent = "Замовлення збережено";
    setTimeout(() => message.textContent = "", 2000);
  };
  render();
}

function setupTransport() {
  const form = document.getElementById('transportForm');
  const table = document.getElementById('transportTable').querySelector('tbody');
  const message = document.getElementById('transportMessage');

  function getTransport() {
    return JSON.parse(localStorage.getItem('transport')) || [];
  }
  function saveTransport(data) {
    localStorage.setItem('transport', JSON.stringify(data));
  }
  function render() {
    table.innerHTML = '';
    getTransport().forEach((item, i) => {
      table.innerHTML += \`
        <tr><td>\${item.id}</td><td>\${item.brand}</td><td>\${item.model}</td><td>\${item.year}</td><td>\${item.number}</td>
        <td><button onclick="deleteVehicle(\${i})" class="btn btn-danger btn-sm">Видалити</button></td></tr>
      \`;
    });
  }
  window.deleteVehicle = i => {
    const data = getTransport();
    data.splice(i, 1);
    saveTransport(data);
    render();
  };
  form.onsubmit = e => {
    e.preventDefault();
    const data = getTransport();
    data.push({
      id: form.vehicleId.value,
      brand: form.vehicleBrand.value,
      model: form.vehicleModel.value,
      year: form.vehicleYear.value,
      number: form.vehicleNumber.value
    });
    saveTransport(data);
    render();
    form.reset();
    message.textContent = "Транспорт збережено";
    setTimeout(() => message.textContent = "", 2000);
  };
  render();
}

function setupEmployees() {
  const form = document.getElementById('employeeForm');
  const table = document.getElementById('employeeTable').querySelector('tbody');
  const message = document.getElementById('employeeMessage');

  function getEmployees() {
    return JSON.parse(localStorage.getItem('employees')) || [];
  }
  function saveEmployees(data) {
    localStorage.setItem('employees', JSON.stringify(data));
  }
  function render() {
    table.innerHTML = '';
    getEmployees().forEach(emp => {
      table.innerHTML += \`
        <tr><td>\${emp.id}</td><td>\${emp.name}</td><td>\${emp.position}</td><td>\${emp.email}</td><td>\${emp.phone}</td></tr>
      \`;
    });
  }
  form.onsubmit = e => {
    e.preventDefault();
    const data = getEmployees();
    data.push({
      id: Date.now(),
      name: form.name.value,
      position: form.position.value,
      email: form.email.value,
      phone: form.phone.value
    });
    saveEmployees(data);
    render();
    form.reset();
    message.textContent = "Працівника додано";
    setTimeout(() => message.textContent = "", 2000);
  };
  render();
}
