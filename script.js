// Основний JavaScript для логістичної системи

document.addEventListener("DOMContentLoaded", () => {
  setupNavigation();
  setupOrders();
  setupTransport();
  setupEmployees();
  setupSearch();
  setupReports();
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
  const orderForm = document.getElementById('orderForm');
  const ordersTableBody = document.querySelector('#ordersTable tbody');
  const orderMessage = document.getElementById('orderMessage');

  function getOrders() {
    return JSON.parse(localStorage.getItem('orders')) || [];
  }

  function saveOrders(orders) {
    localStorage.setItem('orders', JSON.stringify(orders));
  }

  function renderOrders() {
    ordersTableBody.innerHTML = '';
    getOrders().forEach((order, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${order.id}</td>
        <td>${order.date}</td>
        <td>${order.amount}</td>
        <td>${order.status}</td>
        <td>
          <button class="btn btn-sm btn-warning" onclick="editOrder(${index})">Редагувати</button>
          <button class="btn btn-sm btn-danger" onclick="deleteOrder(${index})">Видалити</button>
        </td>
      `;
      ordersTableBody.appendChild(row);
    });
  }

  window.editOrder = function(index) {
    const orders = getOrders();
    const order = orders[index];
    document.getElementById('orderId').value = order.id;
    document.getElementById('orderDate').value = order.date;
    document.getElementById('orderAmount').value = order.amount;
    document.getElementById('orderStatus').value = order.status;
    orderForm.setAttribute('data-edit-index', index);
  };

  window.deleteOrder = function(index) {
    const orders = getOrders();
    orders.splice(index, 1);
    saveOrders(orders);
    renderOrders();
  };

  orderForm.addEventListener('submit', e => {
    e.preventDefault();
    const orders = getOrders();
    const id = document.getElementById('orderId').value;
    const date = document.getElementById('orderDate').value;
    const amount = document.getElementById('orderAmount').value;
    const status = document.getElementById('orderStatus').value;

    const newOrder = { id, date, amount, status };
    const editIndex = orderForm.getAttribute('data-edit-index');

    if (editIndex !== null) {
      orders[editIndex] = newOrder;
      orderForm.removeAttribute('data-edit-index');
    } else {
      orders.push(newOrder);
    }

    saveOrders(orders);
    renderOrders();
    orderForm.reset();
    orderMessage.textContent = 'Замовлення збережено';
    setTimeout(() => orderMessage.textContent = '', 2000);
  });

  renderOrders();
}

function setupTransport() {
  const transportForm = document.getElementById('transportForm');
  const transportTableBody = document.querySelector('#transportTable tbody');
  const transportMessage = document.getElementById('transportMessage');

  function getTransport() {
    return JSON.parse(localStorage.getItem('transport')) || [];
  }

  function saveTransport(transport) {
    localStorage.setItem('transport', JSON.stringify(transport));
  }

  function renderTransport() {
    transportTableBody.innerHTML = '';
    getTransport().forEach((vehicle, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${vehicle.id}</td>
        <td>${vehicle.brand}</td>
        <td>${vehicle.model}</td>
        <td>${vehicle.year}</td>
        <td>${vehicle.number}</td>
        <td>
          <button class="btn btn-sm btn-warning" onclick="editVehicle(${index})">Редагувати</button>
          <button class="btn btn-sm btn-danger" onclick="deleteVehicle(${index})">Видалити</button>
        </td>
      `;
      transportTableBody.appendChild(row);
    });
  }

  window.editVehicle = function(index) {
    const vehicles = getTransport();
    const vehicle = vehicles[index];
    document.getElementById('vehicleId').value = vehicle.id;
    document.getElementById('vehicleBrand').value = vehicle.brand;
    document.getElementById('vehicleModel').value = vehicle.model;
    document.getElementById('vehicleYear').value = vehicle.year;
    document.getElementById('vehicleNumber').value = vehicle.number;
    transportForm.setAttribute('data-edit-index', index);
  };

  window.deleteVehicle = function(index) {
    const vehicles = getTransport();
    vehicles.splice(index, 1);
    saveTransport(vehicles);
    renderTransport();
  };

  transportForm.addEventListener('submit', e => {
    e.preventDefault();
    const vehicles = getTransport();
    const id = document.getElementById('vehicleId').value;
    const brand = document.getElementById('vehicleBrand').value;
    const model = document.getElementById('vehicleModel').value;
    const year = document.getElementById('vehicleYear').value;
    const number = document.getElementById('vehicleNumber').value;

    const newVehicle = { id, brand, model, year, number };
    const editIndex = transportForm.getAttribute('data-edit-index');

    if (editIndex !== null) {
      vehicles[editIndex] = newVehicle;
      transportForm.removeAttribute('data-edit-index');
    } else {
      vehicles.push(newVehicle);
    }

    saveTransport(vehicles);
    renderTransport();
    transportForm.reset();
    transportMessage.textContent = 'Транспорт збережено';
    setTimeout(() => transportMessage.textContent = '', 2000);
  });

  renderTransport();
}

function setupEmployees() {
  const employeeForm = document.getElementById('employeeForm');
  employeeForm.addEventListener('submit', e => {
    e.preventDefault();
    alert('Працівника додано (лише візуально, без збереження)');
    employeeForm.reset();
  });
}

function setupSearch() {
  const search = document.createElement('input');
  search.type = 'text';
  search.placeholder = 'Пошук...';
  search.className = 'form-control my-3';
  document.querySelector('main').prepend(search);

  search.addEventListener('input', () => {
    const value = search.value.toLowerCase();
    ['ordersTable', 'transportTable', 'employeeTable'].forEach(id => {
      const table = document.getElementById(id);
      if (table) {
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
          row.style.display = [...row.children].some(cell =>
            cell.textContent.toLowerCase().includes(value)
          ) ? '' : 'none';
        });
      }
    });
  });
}

function setupReports() {
  // Проста заглушка
  document.getElementById('generate-report-btn').addEventListener('click', () => {
    document.getElementById('report-container').innerHTML = '<p>Звіт згенеровано (макет).</p>';
    document.getElementById('download-csv-btn').style.display = 'inline-block';
    document.getElementById('download-pdf-btn').style.display = 'inline-block';
    document.getElementById('download-excel-btn').style.display = 'inline-block';
  });
}
