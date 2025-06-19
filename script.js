document.addEventListener('DOMContentLoaded', () => {
  // Перемикання між секціями
  const sections = document.querySelectorAll('.tab-section');
  const links = document.querySelectorAll('[data-section]');

  links.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      sections.forEach(sec => sec.classList.remove('active'));
      document.getElementById(link.dataset.section).classList.add('active');
      links.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  // === ORDERS ===
  const orderForm = document.getElementById('orderForm');
  const orderTable = document.querySelector('#ordersTable tbody');

  function loadOrders() {
    orderTable.innerHTML = '';
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.forEach(order => {
      const row = document.createElement('tr');
      row.innerHTML = `<td>${order.id}</td><td>${order.date}</td><td>${order.amount}</td><td>${order.status}</td>
        <td><button class="btn btn-sm btn-danger" data-id="${order.id}">Видалити</button></td>`;
      orderTable.appendChild(row);
    });
  }

  orderForm.addEventListener('submit', e => {
    e.preventDefault();
    const order = {
      id: document.getElementById('orderId').value,
      date: document.getElementById('orderDate').value,
      amount: document.getElementById('orderAmount').value,
      status: document.getElementById('orderStatus').value
    };
    let orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    orderForm.reset();
    loadOrders();
  });

  orderTable.addEventListener('click', e => {
    if (e.target.tagName === 'BUTTON') {
      const id = e.target.dataset.id;
      let orders = JSON.parse(localStorage.getItem('orders') || '[]');
      orders = orders.filter(o => o.id !== id);
      localStorage.setItem('orders', JSON.stringify(orders));
      loadOrders();
    }
  });

  loadOrders();

  // === TRANSPORT ===
  const transportForm = document.getElementById('transportForm');
  const transportTable = document.querySelector('#transportTable tbody');

  function loadTransport() {
    transportTable.innerHTML = '';
    const list = JSON.parse(localStorage.getItem('transport') || '[]');
    list.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `<td>${item.id}</td><td>${item.brand}</td><td>${item.model}</td><td>${item.year}</td><td>${item.plate}</td>
        <td><button class="btn btn-sm btn-danger" data-id="${item.id}">Видалити</button></td>`;
      transportTable.appendChild(row);
    });
  }

  transportForm.addEventListener('submit', e => {
    e.preventDefault();
    const tr = {
      id: document.getElementById('vehicleId').value,
      brand: document.getElementById('vehicleBrand').value,
      model: document.getElementById('vehicleModel').value,
      year: document.getElementById('vehicleYear').value,
      plate: document.getElementById('vehicleNumber').value
    };
    let list = JSON.parse(localStorage.getItem('transport') || '[]');
    list.push(tr);
    localStorage.setItem('transport', JSON.stringify(list));
    transportForm.reset();
    loadTransport();
  });

  transportTable.addEventListener('click', e => {
    if (e.target.tagName === 'BUTTON') {
      const id = e.target.dataset.id;
      let list = JSON.parse(localStorage.getItem('transport') || '[]');
      list = list.filter(tr => tr.id !== id);
      localStorage.setItem('transport', JSON.stringify(list));
      loadTransport();
    }
  });

  loadTransport();

  // === EMPLOYEES ===
  const employeeForm = document.getElementById('employeeForm');
  const employeeTable = document.querySelector('#employeeTable tbody');

  function loadEmployees() {
    employeeTable.innerHTML = '';
    const list = JSON.parse(localStorage.getItem('employees') || '[]');
    list.forEach(emp => {
      const row = document.createElement('tr');
      row.innerHTML = `<td>${emp.id}</td><td>${emp.name}</td><td>${emp.position}</td><td>${emp.email}</td><td>${emp.phone}</td>
        <td><button class="btn btn-sm btn-danger" data-id="${emp.id}">Видалити</button></td>`;
      employeeTable.appendChild(row);
    });
  }

  employeeForm.addEventListener('submit', e => {
    e.preventDefault();
    const emp = {
      id: document.getElementById('name').value,
      name: document.getElementById('name').value,
      position: document.getElementById('position').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value
    };
    let list = JSON.parse(localStorage.getItem('employees') || '[]');
    list.push(emp);
    localStorage.setItem('employees', JSON.stringify(list));
    employeeForm.reset();
    loadEmployees();
  });

  employeeTable.addEventListener('click', e => {
    if (e.target.tagName === 'BUTTON') {
      const id = e.target.dataset.id;
      let list = JSON.parse(localStorage.getItem('employees') || '[]');
      list = list.filter(emp => emp.id !== id);
      localStorage.setItem('employees', JSON.stringify(list));
      loadEmployees();
    }
  });

  loadEmployees();

  // === REPORTS ===
  const genReportBtn = document.getElementById('generate-report-btn');
  const reportContainer = document.getElementById('report-container');
  const csvBtn = document.getElementById('download-csv-btn');
  const pdfBtn = document.getElementById('download-pdf-btn');
  const excelBtn = document.getElementById('download-excel-btn');

  genReportBtn.addEventListener('click', () => {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    if (orders.length === 0) {
      reportContainer.innerHTML = '<p>Немає даних для звіту.</p>';
      csvBtn.style.display = 'none';
      pdfBtn.style.display = 'none';
      excelBtn.style.display = 'none';
      return;
    }

    let html = `<table class="table table-bordered"><thead><tr>
      <th>ID</th><th>Дата</th><th>Сума</th><th>Статус</th>
    </tr></thead><tbody>`;
    orders.forEach(o => {
      html += `<tr><td>${o.id}</td><td>${o.date}</td><td>${o.amount}</td><td>${o.status}</td></tr>`;
    });
    html += '</tbody></table>';

    reportContainer.innerHTML = html;
    csvBtn.style.display = 'inline-block';
    pdfBtn.style.display = 'inline-block';
    excelBtn.style.display = 'inline-block';
  });

  csvBtn.addEventListener('click', () => {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    let csv = 'ID,Дата,Сума,Статус\n';
    orders.forEach(o => {
      csv += `${o.id},${o.date},${o.amount},${o.status}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'orders_report.csv';
    link.click();
  });

  pdfBtn.addEventListener('click', async () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    doc.setFontSize(14);
    doc.text('Звіт по замовленнях', 20, 20);

    let y = 30;
    orders.forEach((o, i) => {
      doc.text(`${i + 1}. ID: ${o.id}, Дата: ${o.date}, Сума: ${o.amount}, Статус: ${o.status}`, 10, y);
      y += 10;
    });

    doc.save('orders_report.pdf');
  });

  excelBtn.addEventListener('click', () => {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const ws_data = [
      ['ID', 'Дата', 'Сума', 'Статус'],
      ...orders.map(o => [o.id, o.date, o.amount, o.status])
    ];
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    XLSX.utils.book_append_sheet(wb, ws, 'Orders');
    XLSX.writeFile(wb, 'orders_report.xlsx');
  });

  // === EMPLOYEE REPORT ===
  const empReportBtn = document.createElement('button');
  empReportBtn.className = 'btn btn-outline-secondary mt-3';
  empReportBtn.textContent = 'Звіт по працівниках';
  document.getElementById('reports').appendChild(empReportBtn);

  empReportBtn.addEventListener('click', () => {
    const employees = JSON.parse(localStorage.getItem('employees') || '[]');
    if (employees.length === 0) {
      reportContainer.innerHTML = '<p>Немає даних для звіту по працівниках.</p>';
      return;
    }

    let html = `<h4 class="mt-4">Працівники</h4><table class="table table-bordered"><thead><tr>
      <th>ID</th><th>ПІБ</th><th>Посада</th><th>Email</th><th>Телефон</th>
    </tr></thead><tbody>`;
    employees.forEach(e => {
      html += `<tr><td>${e.id}</td><td>${e.name}</td><td>${e.position}</td><td>${e.email}</td><td>${e.phone}</td></tr>`;
    });
    html += '</tbody></table>';
    reportContainer.innerHTML = html;
  });
});
document.getElementById('searchBtn').addEventListener('click', () => {
  const q = document.getElementById('searchInput').value.toLowerCase();
  if (!q) return;

  document.querySelectorAll('.tab-section').forEach(sec => sec.classList.remove('active'));
  let found = false;
  document.querySelectorAll('.tab-section').forEach(sec => {
    if (sec.innerText.toLowerCase().includes(q)) {
      sec.classList.add('active');
      found = true;
    }
  });
  if (!found) alert('⚠️ Нічого не знайдено!');
   renderOrders();
   renderTransport();
  renderEmployees();
});

