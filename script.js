
document.addEventListener('DOMContentLoaded', () => {
  // Навігація між секціями
  const navLinks = document.querySelectorAll('[data-section]');
  const sections = document.querySelectorAll('.tab-section');

  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = link.getAttribute('data-section');

      sections.forEach(s => s.classList.remove('active'));
      document.getElementById(target).classList.add('active');

      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  // ===== Замовлення =====
  const orderForm = document.getElementById('orderForm');
  const ordersTable = document.getElementById('ordersTable').querySelector('tbody');

  let orders = JSON.parse(localStorage.getItem('orders')) || [];

  function renderOrders() {
    ordersTable.innerHTML = '';
    orders.forEach((order, i) => {
      const row = ordersTable.insertRow();
      row.innerHTML = \`
        <td>\${order.id}</td>
        <td>\${order.date}</td>
        <td>\${order.amount}</td>
        <td>\${order.status}</td>
        <td><button data-index="\${i}" class="btn btn-danger btn-sm delete-order">Видалити</button></td>
      \`;
    });
    document.querySelectorAll('.delete-order').forEach(btn => {
      btn.addEventListener('click', () => {
        orders.splice(btn.dataset.index, 1);
        localStorage.setItem('orders', JSON.stringify(orders));
        renderOrders();
      });
    });
  }

  renderOrders();

  orderForm.addEventListener('submit', e => {
    e.preventDefault();
    const order = {
      id: document.getElementById('orderId').value,
      date: document.getElementById('orderDate').value,
      amount: document.getElementById('orderAmount').value,
      status: document.getElementById('orderStatus').value
    };
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    renderOrders();
    orderForm.reset();
  });

  // ===== Транспорт =====
  const transportForm = document.getElementById('transportForm');
  const transportTable = document.getElementById('transportTable').querySelector('tbody');
  let transport = JSON.parse(localStorage.getItem('transport')) || [];

  function renderTransport() {
    transportTable.innerHTML = '';
    transport.forEach((item, i) => {
      const row = transportTable.insertRow();
      row.innerHTML = \`
        <td>\${item.id}</td>
        <td>\${item.model}</td>
        <td>\${item.number}</td>
        <td><button data-index="\${i}" class="btn btn-danger btn-sm delete-vehicle">Видалити</button></td>
      \`;
    });
    document.querySelectorAll('.delete-vehicle').forEach(btn => {
      btn.addEventListener('click', () => {
        transport.splice(btn.dataset.index, 1);
        localStorage.setItem('transport', JSON.stringify(transport));
        renderTransport();
      });
    });
  }

  renderTransport();

  transportForm.addEventListener('submit', e => {
    e.preventDefault();
    const vehicle = {
      id: document.getElementById('vehicleId').value,
      model: document.getElementById('vehicleModel').value,
      number: document.getElementById('vehicleNumber').value
    };
    transport.push(vehicle);
    localStorage.setItem('transport', JSON.stringify(transport));
    renderTransport();
    transportForm.reset();
  });

  // ===== Працівники =====
  const employeeForm = document.getElementById('employeeForm');
  const employeeTable = document.getElementById('employeeTable').querySelector('tbody');
  let employees = JSON.parse(localStorage.getItem('employees')) || [];

  function renderEmployees() {
    employeeTable.innerHTML = '';
    employees.forEach(emp => {
      const row = employeeTable.insertRow();
      row.innerHTML = \`
        <td>\${emp.id}</td>
        <td>\${emp.name}</td>
        <td>\${emp.position}</td>
      \`;
    });
  }

  renderEmployees();

  employeeForm.addEventListener('submit', e => {
    e.preventDefault();
    const emp = {
      id: document.getElementById('empId').value,
      name: document.getElementById('empName').value,
      position: document.getElementById('empPosition').value
    };
    employees.push(emp);
    localStorage.setItem('employees', JSON.stringify(employees));
    renderEmployees();
    employeeForm.reset();
  });

  // ===== Звіти =====
  document.getElementById('generate-report-btn').addEventListener('click', () => {
    const container = document.getElementById('report-container');
    container.innerHTML = '<h5>Звіт по замовленнях</h5>';
    if (!orders.length) {
      container.innerHTML += '<p>Немає замовлень.</p>';
      return;
    }
    const table = document.createElement('table');
    table.className = 'table table-bordered';
    table.innerHTML = '<thead><tr><th>ID</th><th>Дата</th><th>Сума</th><th>Статус</th></tr></thead><tbody>' +
      orders.map(o => \`<tr><td>\${o.id}</td><td>\${o.date}</td><td>\${o.amount}</td><td>\${o.status}</td></tr>\`).join('') +
      '</tbody>';
    container.appendChild(table);
  });

  document.getElementById('download-csv-btn').addEventListener('click', () => {
    let csv = 'ID,Дата,Сума,Статус\n' + orders.map(o => \`\${o.id},\${o.date},\${o.amount},\${o.status}\`).join('\n');
    const blob = new Blob([csv], {type: 'text/csv'});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'orders.csv';
    link.click();
  });

  document.getElementById('download-pdf-btn').addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text('Звіт по замовленнях', 10, 10);
    let y = 20;
    orders.forEach(o => {
      doc.text(\`\${o.id} - \${o.date} - \${o.amount} - \${o.status}\`, 10, y);
      y += 10;
    });
    doc.save('orders.pdf');
  });

  document.getElementById('download-excel-btn').addEventListener('click', () => {
    const ws = XLSX.utils.json_to_sheet(orders);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Orders');
    XLSX.writeFile(wb, 'orders.xlsx');
  });
});
