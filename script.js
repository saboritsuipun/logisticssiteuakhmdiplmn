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
  const form = document.getElementById('orderForm');
  const tableBody = document.querySelector('#ordersTable tbody');
  const message = document.getElementById('orderMessage');

  function getData() {
    return JSON.parse(localStorage.getItem('orders')) || [];
  }
  function saveData(data) {
    localStorage.setItem('orders', JSON.stringify(data));
  }
  function render() {
    tableBody.innerHTML = '';
    getData().forEach((order, i) => {
      tableBody.innerHTML += `
        <tr>
          <td>${order.id}</td><td>${order.date}</td><td>${order.amount}</td><td>${order.status}</td>
          <td>
            <button class="btn btn-sm btn-warning" type="button" onclick="editOrder(${i})">Редагувати</button>
            <button class="btn btn-sm btn-danger" type="button" onclick="deleteOrder(${i})">Видалити</button>
          </td>
        </tr>`;
    });
  }
  window.editOrder = i => {
    const data = getData();
    const item = data[i];
    form.orderId.value = item.id;
    form.orderDate.value = item.date;
    form.orderAmount.value = item.amount;
    form.orderStatus.value = item.status;
    form.setAttribute('data-edit-index', i);
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
    const newItem = {
      id: form.orderId.value,
      date: form.orderDate.value,
      amount: form.orderAmount.value,
      status: form.orderStatus.value
    };
    const index = form.getAttribute('data-edit-index');
    if (index !== null) {
      data[index] = newItem;
      form.removeAttribute('data-edit-index');
    } else data.push(newItem);
    saveData(data);
    render();
    form.reset();
    message.textContent = 'Замовлення збережено';
    setTimeout(() => message.textContent = '', 2000);
  });
  render();
}

function setupTransport() {
  const form = document.getElementById('transportForm');
  const tableBody = document.querySelector('#transportTable tbody');
  const message = document.getElementById('transportMessage');

  function getData() {
    return JSON.parse(localStorage.getItem('transport')) || [];
  }
  function saveData(data) {
    localStorage.setItem('transport', JSON.stringify(data));
  }
  function render() {
    tableBody.innerHTML = '';
    getData().forEach((item, i) => {
      tableBody.innerHTML += `
        <tr>
          <td>${item.id}</td><td>${item.brand}</td><td>${item.model}</td><td>${item.year}</td><td>${item.number}</td>
          <td>
            <button class="btn btn-sm btn-warning" type="button" onclick="editVehicle(${i})">Редагувати</button>
            <button class="btn btn-sm btn-danger" type="button" onclick="deleteVehicle(${i})">Видалити</button>
          </td>
        </tr>`;
    });
  }
  window.editVehicle = i => {
    const data = getData();
    const item = data[i];
    form.vehicleId.value = item.id;
    form.vehicleBrand.value = item.brand;
    form.vehicleModel.value = item.model;
    form.vehicleYear.value = item.year;
    form.vehicleNumber.value = item.number;
    form.setAttribute('data-edit-index', i);
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
    const newItem = {
      id: form.vehicleId.value,
      brand: form.vehicleBrand.value,
      model: form.vehicleModel.value,
      year: form.vehicleYear.value,
      number: form.vehicleNumber.value
    };
    const index = form.getAttribute('data-edit-index');
    if (index !== null) {
      data[index] = newItem;
      form.removeAttribute('data-edit-index');
    } else data.push(newItem);
    saveData(data);
    render();
    form.reset();
    message.textContent = 'Транспорт збережено';
    setTimeout(() => message.textContent = '', 2000);
  });
  render();
}

function setupEmployees() {
  const form = document.getElementById('employeeForm');
  const tableBody = document.querySelector('#employeeTable tbody');
  const message = document.createElement('p');
  message.id = 'employeeMessage';
  form.appendChild(message);

  function getData() {
    return JSON.parse(localStorage.getItem('employees')) || [];
  }
  function saveData(data) {
    localStorage.setItem('employees', JSON.stringify(data));
  }
  function render() {
    tableBody.innerHTML = '';
    getData().forEach((item, i) => {
      tableBody.innerHTML += `
        <tr>
          <td>${item.id}</td><td>${item.name}</td><td>${item.position}</td><td>${item.email}</td><td>${item.phone}</td>
        </tr>`;
    });
  }
  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = getData();
    const newItem = {
      id: Date.now(),
      name: form.name.value,
      position: form.position.value,
      email: form.email.value,
      phone: form.phone.value
    };
    data.push(newItem);
    saveData(data);
    render();
    form.reset();
    message.textContent = 'Працівника додано';
    setTimeout(() => message.textContent = '', 2000);
  });
  render();
}

function setupSearch() {
  const input = document.createElement('input');
  input.placeholder = 'Пошук...';
  input.className = 'form-control my-3';
  document.querySelector('main').prepend(input);
  input.addEventListener('input', () => {
    const q = input.value.toLowerCase();
    ['ordersTable', 'transportTable', 'employeeTable'].forEach(id => {
      const rows = document.querySelectorAll(`#${id} tbody tr`);
      rows.forEach(row => {
        row.style.display = [...row.children].some(td => td.textContent.toLowerCase().includes(q)) ? '' : 'none';
      });
    });
  });
}

function setupReports() {
  const btn = document.getElementById('generate-report-btn');
  const csv = document.getElementById('download-csv-btn');
  const pdf = document.getElementById('download-pdf-btn');
  const excel = document.getElementById('download-excel-btn');
  const container = document.getElementById('report-container');

  btn.addEventListener('click', () => {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    let html = '<table class="table table-bordered"><thead><tr><th>ID</th><th>Дата</th><th>Сума</th><th>Статус</th></tr></thead><tbody>';
    orders.forEach(o => {
      html += `<tr><td>${o.id}</td><td>${o.date}</td><td>${o.amount}</td><td>${o.status}</td></tr>`;
    });
    html += '</tbody></table>';
    container.innerHTML = html;
    csv.style.display = pdf.style.display = excel.style.display = 'inline-block';
  });

  csv.addEventListener('click', () => {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const rows = [['ID', 'Дата', 'Сума', 'Статус'], ...orders.map(o => [o.id, o.date, o.amount, o.status])];
    const csvData = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'report.csv';
    a.click();
  });

  pdf.addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text("Звіт по замовленнях", 10, 10);
    doc.autoTable({ html: '#report-container table' });
    doc.save("report.pdf");
  });

  excel.addEventListener('click', () => {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const worksheet = XLSX.utils.json_to_sheet(orders);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
    XLSX.writeFile(workbook, "report.xlsx");
  });
}
