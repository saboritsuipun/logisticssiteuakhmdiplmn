// Основний скрипт для сайту логістики

window.addEventListener('DOMContentLoaded', () => {
  // === ЗМІННІ ===
  let editingOrderId = null;
  let editingVehicleId = null;

  const el = {
    orderForm: document.getElementById('orderForm'),
    orderMessage: document.getElementById('orderMessage'),
    transportForm: document.getElementById('transportForm'),
    transportMessage: document.getElementById('transportMessage'),
    transportTableBody: document.querySelector('#transportTable tbody'),
    reportContainer: document.getElementById('report-container'),
    csvBtn: document.getElementById('download-csv-btn'),
    pdfBtn: document.getElementById('download-pdf-btn'),
    excelBtn: document.getElementById('download-excel-btn'),
    genReportBtn: document.getElementById('generate-report-btn')
  };

  // === ФУНКЦІЇ ===
  function getStorage(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
  }
  function setStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function renderOrders() {
    const orders = getStorage('orders');
    const tbody = document.querySelector('#ordersTable tbody');
    tbody.innerHTML = '';

    orders.forEach(order => {
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

  function renderTransport() {
    const list = getStorage('transport');
    el.transportTableBody.innerHTML = '';
    if (list.length === 0) {
      el.transportTableBody.innerHTML = '<tr><td colspan="6" class="text-center fst-italic">Немає транспортних засобів</td></tr>';
      return;
    }
    list.forEach(vehicle => {
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
      el.transportTableBody.appendChild(row);

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

  // === ПОДІЇ ===

  el.orderForm?.addEventListener('submit', e => {
    e.preventDefault();
    const order = {
      id: document.getElementById('orderId').value.trim(),
      date: document.getElementById('orderDate').value.trim(),
      amount: document.getElementById('orderAmount').value.trim(),
      status: document.getElementById('orderStatus').value.trim()
    };
    if (!order.id || !order.date || !order.amount || !order.status) {
      alert('Заповніть усі поля!');
      return;
    }
    let list = getStorage('orders');
    if (editingOrderId) {
      list = list.map(o => o.id === editingOrderId ? order : o);
      editingOrderId = null;
      el.orderMessage.textContent = 'Оновлено замовлення!';
    } else {
      if (list.some(o => o.id === order.id)) {
        alert('ID вже існує!');
        return;
      }
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
    if (!vehicle.id || !vehicle.brand || !vehicle.model || !vehicle.year || !vehicle.number) {
      alert('Заповніть усі поля!');
      return;
    }
    let list = getStorage('transport');
    if (editingVehicleId) {
      list = list.map(v => v.id === editingVehicleId ? vehicle : v);
      editingVehicleId = null;
      el.transportMessage.textContent = 'Оновлено транспорт!';
    } else {
      if (list.some(v => v.id === vehicle.id)) {
        alert('ID вже існує!');
        return;
      }
      list.push(vehicle);
      el.transportMessage.textContent = 'Додано транспорт!';
    }
    setStorage('transport', list);
    renderTransport();
    el.transportForm.reset();
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

  // === ІНІЦІАЛІЗАЦІЯ ===
  renderOrders();
  renderTransport();
});
