document.addEventListener("DOMContentLoaded", () => {
  setupNavigation();
  setupOrders();
  setupTransport();
  setupEmployees();
  setupSearch();
  setupReports();
});

// Перемикання вкладок
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

// === ЗАМОВЛЕННЯ ===
function setupOrders() {
  const form = document.getElementById('orderForm');
  const tableBody = document.querySelector('#ordersTable tbody');
  const msg = document.getElementById('orderMessage');

  const getData = () => JSON.parse(localStorage.getItem('orders')) || [];
  const saveData = data => localStorage.setItem('orders', JSON.stringify(data));

  function render() {
    tableBody.innerHTML = '';
    getData().forEach((o, i) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${o.id}</td><td>${o.date}</td><td>${o.amount}</td><td>${o.status}</td>
        <td>
          <button type="button" class="btn btn-warning btn-sm" onclick="editOrder(${i})">Редагувати</button>
          <button type="button" class="btn btn-danger btn-sm" onclick="deleteOrder(${i})">Видалити</button>
        </td>`;
      tableBody.appendChild(row);
    });
  }

  window.editOrder = i => {
    const data = getData();
    const o = data[i];
    form.orderId.value = o.id;
    form.orderDate.value = o.date;
    form.orderAmount.value = o.amount;
    form.orderStatus.value = o.status;
    form.setAttribute('data-edit', i);
  };

  window.deleteOrder = i => {
    const data = getData();
    data.splice(i, 1);
    saveData(data);
    render();
  };

  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = getData();
    const obj = {
      id: form.orderId.value,
      date: form.orderDate.value,
      amount: form.orderAmount.value,
      status: form.orderStatus.value
    };
    const index = form.getAttribute('data-edit');
    if (index !== null) {
      data[index] = obj;
      form.removeAttribute('data-edit');
    } else {
      data.push(obj);
    }
    saveData(data);
    form.reset();
    render();
    msg.textContent = "Замовлення збережено";
    setTimeout(() => msg.textContent = "", 2000);
  });

  render();
}

// === ТРАНСПОРТ ===
function setupTransport() {
  const form = document.getElementById('transportForm');
  const tableBody = document.querySelector('#transportTable tbody');
  const msg = document.getElementById('transportMessage');

  const getData = () => JSON.parse(localStorage.getItem('transport')) || [];
  const saveData = data => localStorage.setItem('transport', JSON.stringify(data));

  function render() {
    tableBody.innerHTML = '';
    getData().forEach((v, i) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${v.id}</td><td>${v.brand}</td><td>${v.model}</td><td>${v.year}</td><td>${v.number}</td>
        <td>
          <button type="button" class="btn btn-warning btn-sm" onclick="editVehicle(${i})">Редагувати</button>
          <button type="button" class="btn btn-danger btn-sm" onclick="deleteVehicle(${i})">Видалити</button>
        </td>`;
      tableBody.appendChild(row);
    });
  }

  window.editVehicle = i => {
    const data = getData();
    const v = data[i];
    form.vehicleId.value = v.id;
    form.vehicleBrand.value = v.brand;
    form.vehicleModel.value = v.model;
    form.vehicleYear.value = v.year;
    form.vehicleNumber.value = v.number;
    form.setAttribute('data-edit', i);
  };

  window.deleteVehicle = i => {
    const data = getData();
    data.splice(i, 1);
    saveData(data);
    render();
  };

  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = getData();
    const obj = {
      id: form.vehicleId.value,
      brand: form.vehicleBrand.value,
      model: form.vehicleModel.value,
      year: form.vehicleYear.value,
      number: form.vehicleNumber.value
    };
    const index = form.getAttribute('data-edit');
    if (index !== null) {
      data[index] = obj;
      form.removeAttribute('data-edit');
    } else {
      data.push(obj);
    }
    saveData(data);
    form.reset();
    render();
    msg.textContent = "Транспорт збережено";
    setTimeout(() => msg.textContent = "", 2000);
  });

  render();
}

// === ПРАЦІВНИКИ ===
function setupEmployees() {
  const form = document.getElementById('employeeForm');
  const table = document.querySelector('#employeeTable tbody');

  form.addEventListener('submit', e => {
    e.preventDefault();
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>-${Date.now()}</td>
      <td>${form.name.value}</td>
      <td>${form.position.value}</td>
      <td>${form.email.value}</td>
      <td>${form.phone.value}</td>
    `;
    table.appendChild(row);
    form.reset();
  });
}

// === ПОШУК ===
function setupSearch() {
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Пошук...';
  input.className = 'form-control my-3 mx-3';
  document.querySelector('main').prepend(input);

  input.addEventListener('input', () => {
    const val = input.value.toLowerCase();
    ['ordersTable', 'transportTable', 'employeeTable'].forEach(id => {
      const rows = document.querySelectorAll(`#${id} tbody tr`);
      rows.forEach(row => {
        const match = [...row.children].some(td => td.textContent.toLowerCase().includes(val));
        row.style.display = match ? '' : 'none';
      });
    });
  });
}

// === ЗВІТИ ===
function setupReports() {
  document.getElementById('generate-report-btn').addEventListener('click', () => {
    document.getElementById('report-container').innerHTML = '<p>Звіт згенеровано (демо).</p>';
    ['csv', 'pdf', 'excel'].forEach(type =>
      document.getElementById(`download-${type}-btn`).style.display = 'inline-block'
    );
  });
}
