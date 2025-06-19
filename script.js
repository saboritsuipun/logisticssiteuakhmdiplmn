window.addEventListener('DOMContentLoaded', () => {
  let editingOrderId = null;
  const reportData = [];

  const elements = {
    orderForm: document.getElementById('orderForm'),
    orderMessage: document.getElementById('orderMessage'),
    reportContainer: document.getElementById('report-container'),
    csvBtn: document.getElementById('download-csv-btn'),
    pdfBtn: document.getElementById('download-pdf-btn'),
    excelBtn: document.getElementById('download-excel-btn'),
    genReportBtn: document.getElementById('generate-report-btn')
  };

  function renderOrders() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
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
          <button class="edit-btn">Редагувати</button>
          <button class="delete-btn">Видалити</button>
        </td>
      `;
      tbody.appendChild(row);

      row.querySelector('.edit-btn').addEventListener('click', () => {
        document.getElementById('orderId').value = order.id;
        document.getElementById('orderDate').value = order.date;
        document.getElementById('orderAmount').value = order.amount;
        document.getElementById('orderStatus').value = order.status;
        editingOrderId = order.id;
        elements.orderMessage.textContent = 'Редагування замовлення...';
      });

      row.querySelector('.delete-btn').addEventListener('click', () => {
        if (confirm('Ви дійсно хочете видалити це замовлення?')) {
          const updatedOrders = orders.filter(o => o.id !== order.id);
          localStorage.setItem('orders', JSON.stringify(updatedOrders));
          renderOrders();
          elements.orderMessage.textContent = 'Замовлення видалено!';
          if (editingOrderId === order.id) {
            editingOrderId = null;
            elements.orderForm.reset();
          }
        }
      });
    });
  }

  elements.orderForm.addEventListener('submit', e => {
    e.preventDefault();
    const orderData = {
      id: document.getElementById('orderId').value.trim(),
      date: document.getElementById('orderDate').value.trim(),
      amount: document.getElementById('orderAmount').value.trim(),
      status: document.getElementById('orderStatus').value.trim()
    };

    if (!orderData.id || !orderData.date || !orderData.amount || !orderData.status) {
      alert('Будь ласка, заповніть усі поля замовлення.');
      return;
    }

    let orders = JSON.parse(localStorage.getItem('orders')) || [];

    if (editingOrderId) {
      orders = orders.map(o => o.id === editingOrderId ? orderData : o);
      elements.orderMessage.textContent = 'Замовлення оновлено!';
      editingOrderId = null;
    } else {
      if (orders.some(o => o.id === orderData.id)) {
        alert('Замовлення з таким ID вже існує!');
        return;
      }
      orders.push(orderData);
      elements.orderMessage.textContent = 'Замовлення додано!';
    }

    localStorage.setItem('orders', JSON.stringify(orders));
    renderOrders();
    e.target.reset();
  });

  // Генерація звіту
  elements.genReportBtn.addEventListener('click', () => {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const employees = JSON.parse(localStorage.getItem('employees') || '[]');

    const report = employees.map(emp => {
      const count = orders.filter(o => o.employeeId === emp.id).length;
      return { name: emp.name, orders: count };
    });

    elements.reportContainer.innerHTML = `
      <table border="1">
        <tr><th>Працівник</th><th>Замовлень</th></tr>
        ${report.map(r => `<tr><td>${r.name}</td><td>${r.orders}</td></tr>`).join('')}
      </table>
    `;

    const csv = [
      ['Працівник', 'Замовлень'],
      ...report.map(r => [r.name, r.orders])
    ].map(row => row.join(',')).join('\n');

    elements.reportContainer.dataset.csv = csv;
    elements.reportContainer.dataset.json = JSON.stringify(report);

    [elements.csvBtn, elements.pdfBtn, elements.excelBtn].forEach(btn => btn.style.display = 'inline-block');
  });

  // Завантаження CSV
  elements.csvBtn.addEventListener('click', () => {
    const csv = elements.reportContainer.dataset.csv;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'report.csv';
    a.click();
    URL.revokeObjectURL(url);
  });

  // Завантаження PDF
  elements.pdfBtn.addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Звіт: Кількість замовлень по працівниках", 10, 10);

    const report = JSON.parse(elements.reportContainer.dataset.json);
    let y = 20;
    report.forEach(r => {
      doc.text(`${r.name}: ${r.orders}`, 10, y);
      y += 10;
    });

    doc.save('report.pdf');
  });

  // Завантаження Excel
  elements.excelBtn.addEventListener('click', () => {
    const report = JSON.parse(elements.reportContainer.dataset.json);
    const ws = XLSX.utils.json_to_sheet(report);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Звіт');
    XLSX.writeFile(wb, 'report.xlsx');
  });

  // Навігація
  document.querySelectorAll('nav a[data-section]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      document.querySelectorAll('nav a[data-section]').forEach(nav => nav.classList.remove('active'));
      document.querySelectorAll('.tab-section').forEach(sec => sec.classList.remove('active'));

      link.classList.add('active');
      const id = link.getAttribute('data-section');
      document.getElementById(id).classList.add('active');
    });
  });

  // Показати таблицю замовлень одразу
  renderOrders();
});

// Генерація та експорт звіту: CSV / PDF / Excel
document.addEventListener('DOMContentLoaded', () => {
  const genBtn = document.getElementById('generate-report-btn');
  const downloadCSV = document.getElementById('download-csv-btn');
  const downloadPDF = document.getElementById('download-pdf-btn');
  const downloadExcel = document.getElementById('download-excel-btn');
  const container = document.getElementById('report-container');
  let reportData = [];

  genBtn?.addEventListener('click', () => {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const employees = JSON.parse(localStorage.getItem('employees') || '[]');

    reportData = employees.map(emp => ({
      name: emp.name,
      orders: orders.filter(o => o.employeeId === emp.id).length
    }));

    container.innerHTML = `
      <table class="table table-bordered">
        <thead><tr><th>Працівник</th><th>Кількість замовлень</th></tr></thead>
        <tbody>
          ${reportData.map(r => `<tr><td>${r.name}</td><td>${r.orders}</td></tr>`).join('')}
        </tbody>
      </table>
    `;

    const csv = [['Працівник','Замовлень'], ...reportData.map(r => [r.name, r.orders])]
      .map(r => r.join(',')).join('\n');

    container.dataset.csv = csv;
    container.dataset.json = JSON.stringify(reportData);

    [downloadCSV, downloadPDF, downloadExcel].forEach(btn => btn.style.display = 'inline-block');
  });

  downloadCSV?.addEventListener('click', () => {
    const blob = new Blob([container.dataset.csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'report.csv';
    link.click();
    URL.revokeObjectURL(link.href);
  });

  downloadPDF?.addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('Звіт — кількість замовлень по працівниках', 10, 10);
    let y = 20;
    JSON.parse(container.dataset.json).forEach(r => {
      doc.text(`${r.name}: ${r.orders}`, 10, y);
      y += 10;
    });
    doc.save('report.pdf');
  });

  downloadExcel?.addEventListener('click', () => {
    const data = JSON.parse(container.dataset.json);
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Звіт');
    XLSX.writeFile(wb, 'report.xlsx');
  });
  renderOrders();
renderTransport();
setupNavigation();
setupSearch();
});
