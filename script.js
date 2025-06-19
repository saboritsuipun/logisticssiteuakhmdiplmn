window.addEventListener('DOMContentLoaded', () => {
document.addEventListener('DOMContentLoaded', () => {
  // Частина коду для управління замовленнями
  let editingOrderId = null;
  // reportData можливо використовувати як глобальну змінну, але тут вона відокремлена.

  // Елементи замовлень і звітів
  const elements = {
    // Елементи форми замовлень та повідомлень
    orderForm: document.getElementById('orderForm'),
    orderMessage: document.getElementById('orderMessage'),
    // Елементи таблиці замовлень (свій власний контейнер у секції "Замовлення")
    ordersTableBody: document.querySelector('#ordersTable tbody'),
    // Елементи секції звітів
    reportContainer: document.getElementById('report-container'),
    csvBtn: document.getElementById('download-csv-btn'),
    pdfBtn: document.getElementById('download-pdf-btn'),
    excelBtn: document.getElementById('download-excel-btn'),
    genReportBtn: document.getElementById('generate-report-btn')
  };

  /* Функція для відображення таблиці замовлень */
  /* --- Функції для роботи із замовленнями --- */

  // Завантаження замовлень із localStorage
  function getOrders() {
    return JSON.parse(localStorage.getItem('orders')) || [];
  }

  // Збереження замовлень у localStorage
  function saveOrders(orders) {
    localStorage.setItem('orders', JSON.stringify(orders));
  }

  // Відмалювання таблиці замовлень
  function renderOrders() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const tbody = document.querySelector('#ordersTable tbody');
    tbody.innerHTML = '';
    const orders = getOrders();
    elements.ordersTableBody.innerHTML = '';

    if (orders.length === 0) {
      const row = document.createElement('tr');
      row.innerHTML = `<td colspan="5" class="text-center fst-italic">Замовлень немає</td>`;
      elements.ordersTableBody.appendChild(row);
      return;
    }

    orders.forEach(order => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${order.id}</td>
        <td>${order.date}</td>
        <td>${order.amount}</td>
        <td>${parseFloat(order.amount).toFixed(2)}</td>
        <td>${order.status}</td>
        <td>
          <button class="edit-btn">Редагувати</button>
          <button class="delete-btn">Видалити</button>
          <button class="edit-btn btn btn-sm btn-warning">Редагувати</button>
          <button class="delete-btn btn btn-sm btn-danger">Видалити</button>
        </td>
      `;
      tbody.appendChild(row);
      elements.ordersTableBody.appendChild(row);

      // Редагування замовлення
      row.querySelector('.edit-btn').addEventListener('click', () => {
        document.getElementById('orderId').value = order.id;
        document.getElementById('orderDate').value = order.date;
        document.getElementById('orderAmount').value = order.amount;
        document.getElementById('orderStatus').value = order.status;
        editingOrderId = order.id;
        elements.orderMessage.textContent = 'Редагування замовлення...';
      });

      // Видалення замовлення
      row.querySelector('.delete-btn').addEventListener('click', () => {
        if (confirm('Ви дійсно хочете видалити це замовлення?')) {
          const updatedOrders = orders.filter(o => o.id !== order.id);
          localStorage.setItem('orders', JSON.stringify(updatedOrders));
          let ordersUpdated = orders.filter(o => o.id !== order.id);
          saveOrders(ordersUpdated);
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

  /* Обробка форми створення/редагування замовлення */
  elements.orderForm.addEventListener('submit', e => {
  // Обробка форми додавання/редагування замовлення
  elements.orderForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const orderData = {
      id: document.getElementById('orderId').value.trim(),
      date: document.getElementById('orderDate').value.trim(),
      amount: document.getElementById('orderAmount').value.trim(),
      status: document.getElementById('orderStatus').value.trim()
      date: document.getElementById('orderDate').value,
      amount: document.getElementById('orderAmount').value,
      status: document.getElementById('orderStatus').value
    };

    // Є базова валідація
    if (!orderData.id || !orderData.date || !orderData.amount || !orderData.status) {
      alert('Будь ласка, заповніть усі поля замовлення.');
      return;
    }

    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    let orders = getOrders();

    if (editingOrderId) {
      // Оновлення замовлення
      if (editingOrderId !== orderData.id && orders.some(o => o.id === orderData.id)) {
        alert('Замовлення з таким ID вже існує!');
        return;
      }
      orders = orders.map(o => o.id === editingOrderId ? orderData : o);
      elements.orderMessage.textContent = 'Замовлення оновлено!';
      editingOrderId = null;
    } else {
      // Додавання нового замовлення
      if (orders.some(o => o.id === orderData.id)) {
        alert('Замовлення з таким ID вже існує!');
        return;
      }
      orders.push(orderData);
      elements.orderMessage.textContent = 'Замовлення додано!';
    }
    localStorage.setItem('orders', JSON.stringify(orders));

    saveOrders(orders);
    renderOrders();
    e.target.reset();
  });

  /* Функція генерації PDF звіту */
  function generatePdfReport(reportObj) {
  /* --- Функції для роботи із звітами --- */

  // Функція генерації PDF звіту за допомогою jsPDF
  function generatePdfReport(reportData) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('Звіт — Кількість замовлень по працівниках', 10, 10);

    let y = 20;
    reportObj.forEach(r => {
      doc.text(`${r.name}: ${r.orders}`, 10, y);
    reportData.forEach(item => {
      doc.text(`${item.name}: ${item.orders}`, 10, y);
      y += 10;
    });
    doc.save('report.pdf');
  }

  /* Генерація звіту за натисканням кнопки генерування */
  // Генерація звіту за замовленнями по співробітниках
  elements.genReportBtn.addEventListener('click', () => {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const employees = JSON.parse(localStorage.getItem('employees') || '[]');
    /* 
       Для прикладу використаємо дані з localStorage "employees".
       Якщо employees відсутні, можна створити тестовий набір даних.
       Наприклад, перевіримо: якщо data пуста — генеруємо тестові дані.
    */
    let employees = JSON.parse(localStorage.getItem('employees'));
    if (!employees || employees.length === 0) {
      employees = [
        { id: "emp1", name: "Іваненко І.І." },
        { id: "emp2", name: "Петренко П.П." },
        { id: "emp3", name: "Сидоров С.С." }
      ];
      localStorage.setItem('employees', JSON.stringify(employees));
    }
    const orders = getOrders();

    // Формуємо звіт: підрахунок замовлень для кожного співробітника (за employeeId)
    const report = employees.map(emp => {
      const count = orders.filter(o => o.employeeId === emp.id).length;
      return { name: emp.name, orders: count };
    });

    // Вивід звіту в контейнері
    elements.reportContainer.innerHTML = `
      <table border="1" class="table table-bordered">
        <tr><th>Працівник</th><th>Замовлень</th></tr>
        ${report.map(r => `<tr><td>${r.name}</td><td>${r.orders}</td></tr>`).join('')}
      <table class="table table-bordered">
        <thead>
          <tr><th>Працівник</th><th>Замовлень</th></tr>
        </thead>
        <tbody>
          ${report.map(item => `<tr><td>${item.name}</td><td>${item.orders}</td></tr>`).join('')}
        </tbody>
      </table>
    `;

    const csv = [
    // Створення CSV рядка
    const csvContent = [
      ['Працівник', 'Замовлень'],
      ...report.map(r => [r.name, r.orders])
      ...report.map(item => [item.name, item.orders])
    ].map(row => row.join(',')).join('\n');

    elements.reportContainer.dataset.csv = csv;
    elements.reportContainer.dataset.csv = csvContent;
    elements.reportContainer.dataset.json = JSON.stringify(report);

    [elements.csvBtn, elements.pdfBtn, elements.excelBtn].forEach(btn => btn.style.display = 'inline-block');
    // Робимо кнопки експорту видимими
    [elements.csvBtn, elements.pdfBtn, elements.excelBtn].forEach(btn => {
      btn.style.display = 'inline-block';
    });
  });

  /* Експорт звіту у формат CSV */
  // Експорт звіту у формат CSV
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

  /* Експорт звіту у формат PDF із використанням спеціальної функції */
  // Експорт звіту у формат PDF
  elements.pdfBtn.addEventListener('click', () => {
    const report = JSON.parse(elements.reportContainer.dataset.json);
    generatePdfReport(report);
    const reportData = JSON.parse(elements.reportContainer.dataset.json);
    generatePdfReport(reportData);
  });

  /* Експорт звіту у формат Excel за допомогою SheetJS (xlsx) */
  // Експорт звіту у формат Excel (XLSX) за допомогою SheetJS
  elements.excelBtn.addEventListener('click', () => {
    const report = JSON.parse(elements.reportContainer.dataset.json);
    const ws = XLSX.utils.json_to_sheet(report);
    const reportData = JSON.parse(elements.reportContainer.dataset.json);
    const ws = XLSX.utils.json_to_sheet(reportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Звіт');
    XLSX.writeFile(wb, 'report.xlsx');
  });

  /* Навігація по сторінках */
  document.querySelectorAll('nav a[data-section]').forEach(link => {
    link.addEventListener('click', e => {
  /* --- Навігація між секціями --- */
  const navLinks = document.querySelectorAll('nav a[data-section]');
  const tabSections = document.querySelectorAll('.tab-section');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelectorAll('nav a[data-section]').forEach(nav => nav.classList.remove('active'));
      document.querySelectorAll('.tab-section').forEach(sec => sec.classList.remove('active'));
      navLinks.forEach(nav => nav.classList.remove('active'));
      tabSections.forEach(sec => sec.classList.remove('active'));

      link.classList.add('active');
      const id = link.getAttribute('data-section');
      document.getElementById(id).classList.add('active');
      const sectionId = link.getAttribute('data-section');
      document.getElementById(sectionId).classList.add('active');
    });
  });

  /* Одразу показати таблицю замовлень при завантаженні сторінки */
  // Початкове завантаження таблиці замовлень
  renderOrders();
});

/* Альтернативний блок для генерації та експорту звітів (якщо потрібна окрема логіка) */
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
    const report = JSON.parse(container.dataset.json);
    generatePdfReport(report);
  });

  downloadExcel?.addEventListener('click', () => {
    const data = JSON.parse(container.dataset.json);
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Звіт');
    XLSX.writeFile(wb, 'report.xlsx');
  });Add commentMore actions
});
