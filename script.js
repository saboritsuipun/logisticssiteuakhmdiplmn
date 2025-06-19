// script.js

window.addEventListener('DOMContentLoaded', () => {
  let editingOrderId = null;
  let editingVehicleId = null;
  let editingEmployeeId = null;

  const el = {
    orderForm: document.getElementById('orderForm'),
    orderMessage: document.getElementById('orderMessage'),
    transportForm: document.getElementById('transportForm'),
    transportMessage: document.getElementById('transportMessage'),
    employeeForm: document.getElementById('employeeForm'),
    employeeTableBody: document.querySelector('#employeeTable tbody'),
    searchInput: document.getElementById('searchInput'),
    reportContainer: document.getElementById('report-container'),
    csvBtn: document.getElementById('download-csv-btn'),
    pdfBtn: document.getElementById('download-pdf-btn'),
    excelBtn: document.getElementById('download-excel-btn'),
    genReportBtn: document.getElementById('generate-report-btn')
  };

  function getStorage(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
  }
  function setStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function renderOrders(filter = '') {
    const orders = getStorage('orders');
    const tbody = document.querySelector('#ordersTable tbody');
    tbody.innerHTML = '';

    orders
      .filter(o => o.id.includes(filter) || o.status.includes(filter))
      .forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${order.id}</td>
          <td>${order.date}</td>
          <td>${order.amount}</td>
          <td>${order.status}</td>
          <td>
            <button class="btn btn-sm btn-warning edit-btn">Редагувати</button>
            <button class="btn btn-sm btn-danger delete-btn">Видалити</button>
          </td>
        `;
        tbody.appendChild(row);

        row.querySelector('.edit-btn').addEventListener('click', () => {
          document.getElementById('orderId').value = order.id;
          document.getElementById('orderDate').value = order.date;
          document.getElementById('orderAmount').value = order.amount;
          document.getElementById('orderStatus').value = order.status;
          editingOrderId = order.id;
          el.orderMessage.textContent = 'Редагування замовлення...';
        });

        row.querySelector('.delete-btn').addEventListener('click', () => {
          if (confirm('Видалити це замовлення?')) {
            const updated = orders.filter(o => o.id !== order.id);
            setStorage('orders', updated);
            renderOrders();
            el.orderMessage.textContent = 'Замовлення видалено!';
            if (editingOrderId === order.id) {
              editingOrderId = null;
              el.orderForm.reset();
            }
          }
        });
      });
  }

  function renderTransport(filter = '') {
    const list = getStorage('transport');
    const tbody = document.querySelector('#transportTable tbody');
    tbody.innerHTML = '';

    list
      .filter(v => v.id.includes(filter) || v.brand.includes(filter))
      .forEach(vehicle => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${vehicle.id}</td>
          <td>${vehicle.brand}</td>
          <td>${vehicle.model}</td>
          <td>${vehicle.year}</td>
          <td>${vehicle.number}</td>
          <td>
            <button class="btn btn-sm btn-warning edit-vehicle">Редагувати</button>
            <button class="btn btn-sm btn-danger delete-vehicle">Видалити</button>
          </td>
        `;
        tbody.appendChild(row);

        row.querySelector('.edit-vehicle').addEventListener('click', () => {
          document.getElementById('vehicleId').value = vehicle.id;
          document.getElementById('vehicleBrand').value = vehicle.brand;
          document.getElementById('vehicleModel').value = vehicle.model;
          document.getElementById('vehicleYear').value = vehicle.year;
          document.getElementById('vehicleNumber').value = vehicle.number;
          editingVehicleId = vehicle.id;
          el.transportMessage.textContent = 'Редагування транспорту...';
        });

        row.querySelector('.delete-vehicle').addEventListener('click', () => {
          if (confirm('Видалити транспорт?')) {
            const updated = list.filter(v => v.id !== vehicle.id);
            setStorage('transport', updated);
            renderTransport();
            el.transportMessage.textContent = 'Транспорт видалено!';
            if (editingVehicleId === vehicle.id) {
              editingVehicleId = null;
              el.transportForm.reset();
            }
          }
        });
      });
  }

  function renderEmployees() {
    const employees = getStorage('employees');
    el.employeeTableBody.innerHTML = '';

    employees.forEach(emp => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${emp.id}</td>
        <td>${emp.name}</td>
        <td>${emp.position}</td>
        <td>${emp.email}</td>
        <td>${emp.phone}</td>
      `;
      el.employeeTableBody.appendChild(row);
    });
  }

  function generatePdfReport(data) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('Звіт — Кількість замовлень по працівниках', 10, 10);
    let y = 20;
    data.forEach(r => {
      doc.text(`${r.name}: ${r.orders}`, 10, y);
      y += 10;
    });
    doc.save('report.pdf');
  }

  function generateReport() {
    const orders = getStorage('orders');
    const employees = getStorage('employees');
    const report = employees.map(emp => ({
      name: emp.name,
      orders: orders.filter(o => o.employeeId === emp.id).length
    }));

    el.reportContainer.innerHTML = `
      <table class="table table-bordered">
        <thead><tr><th>Працівник</th><th>Замовлень</th></tr></thead>
        <tbody>${report.map(r => `<tr><td>${r.name}</td><td>${r.orders}</td></tr>`).join('')}</tbody>
      </table>`;

    el.reportContainer.dataset.csv = [['Працівник','Замовлень'], ...report.map(r => [r.name, r.orders])].map(r => r.join(',')).join('\n');
    el.reportContainer.dataset.json = JSON.stringify(report);
    [el.csvBtn, el.pdfBtn, el.excelBtn].forEach(btn => btn.classList.remove('d-none'));
  }

  // Події форм
  el.orderForm?.addEventListener('submit', e => {
    e.preventDefault();
    const order = {
      id: document.getElementById('orderId').value.trim(),
      date: document.getElementById('orderDate').value.trim(),
      amount: document.getElementById('orderAmount').value.trim(),
      status: document.getElementById('orderStatus').value.trim(),
      employeeId: document.getElementById('orderEmployeeId')?.value.trim() || ''
    };
    let list = getStorage('orders');
    if (editingOrderId) {
      list = list.map(o => o.id === editingOrderId ? order : o);
      editingOrderId = null;
      el.orderMessage.textContent = 'Оновлено замовлення!';
    } else {
      list.push(order);
      el.orderMessage.textContent = 'Додано замовлення!';
    }
    setStorage('orders', list);
    renderOrders();
    el.orderForm.reset();
  });

  el.transportForm?.addEventListener('submit', e => {
    e.preventDefault();
    const vehicle = {
      id: document.getElementById('vehicleId').value.trim(),
      brand: document.getElementById('vehicleBrand').value.trim(),
      model: document.getElementById('vehicleModel').value.trim(),
      year: document.getElementById('vehicleYear').value.trim(),
      number: document.getElementById('vehicleNumber').value.trim()
    };
    let list = getStorage('transport');
    if (editingVehicleId) {
      list = list.map(v => v.id === editingVehicleId ? vehicle : v);
      editingVehicleId = null;
      el.transportMessage.textContent = 'Оновлено транспорт!';
    } else {
      list.push(vehicle);
      el.transportMessage.textContent = 'Додано транспорт!';
    }
    setStorage('transport', list);
    renderTransport();
    el.transportForm.reset();
  });

  el.employeeForm?.addEventListener('submit', e => {
    e.preventDefault();
    const employee = {
      id: Math.random().toString(36).slice(2, 8),
      name: document.getElementById('name').value.trim(),
      position: document.getElementById('position').value.trim(),
      email: document.getElementById('email').value.trim(),
      phone: document.getElementById('phone').value.trim()
    };
    const employees = getStorage('employees');
    employees.push(employee);
    setStorage('employees', employees);
    renderEmployees();
    el.employeeForm.reset();
  });

  el.genReportBtn?.addEventListener('click', generateReport);

  el.csvBtn?.addEventListener('click', () => {
    const csv = el.reportContainer.dataset.csv;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'report.csv';
    a.click();
    URL.revokeObjectURL(a.href);
  });

  el.pdfBtn?.addEventListener('click', () => {
    const data = JSON.parse(el.reportContainer.dataset.json);
    generatePdfReport(data);
  });

  el.excelBtn?.addEventListener('click', () => {
    const data = JSON.parse(el.reportContainer.dataset.json);
    if (!data || data.length === 0) {
      alert('Немає даних для експорту.');
      return;
    }
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Звіт');
    XLSX.writeFile(wb, 'report.xlsx');
  });

  document.querySelectorAll('nav a[data-section]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      document.querySelectorAll('.tab-section').forEach(sec => sec.classList.remove('active'));
      document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
      const id = link.getAttribute('data-section');
      document.getElementById(id)?.classList.add('active');
      link.classList.add('active');
    });
  });

  el.searchInput?.addEventListener('input', e => {
    const value = e.target.value.trim().toLowerCase();
    renderOrders(value);
    renderTransport(value);
  });

  renderOrders();
  renderTransport();
  renderEmployees();
});
