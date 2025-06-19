// script.js — очищений, коментований і вдосконалений варіант

// Чекаємо на повне завантаження DOM
window.addEventListener('DOMContentLoaded', () => {
  /*====================*
   *   ЗМІННІ ТА ДОСТУП
   *====================*/
  let editingOrderId = null;
  let editingVehicleId = null;

  const elements = {
    // Замовлення
    orderForm: document.getElementById('orderForm'),
    orderMessage: document.getElementById('orderMessage'),
    orderTableBody: document.querySelector('#ordersTable tbody'),

    // Транспорт
    transportForm: document.getElementById('transportForm'),
    transportMessage: document.getElementById('transportMessage'),
    transportTableBody: document.querySelector('#transportTable tbody'),

    // Звіти
    reportContainer: document.getElementById('report-container'),
    csvBtn: document.getElementById('download-csv-btn'),
    pdfBtn: document.getElementById('download-pdf-btn'),
    excelBtn: document.getElementById('download-excel-btn'),
    genReportBtn: document.getElementById('generate-report-btn')
  };

  /*====================*
   *   ЛОКАЛЬНЕ ЗБЕРІГАННЯ
   *====================*/
  const storage = {
    get: (key) => JSON.parse(localStorage.getItem(key)) || [],
    set: (key, data) => localStorage.setItem(key, JSON.stringify(data))
  };

  /*====================*
   *   ЗАМОВЛЕННЯ
   *====================*/
  function renderOrders() {
    const orders = storage.get('orders');
    elements.orderTableBody.innerHTML = '';

    if (orders.length === 0) {
      elements.orderTableBody.innerHTML = `<tr><td colspan="5" class="text-center fst-italic">Немає замовлень</td></tr>`;
      return;
    }

    orders.forEach(order => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${order.id}</td>
        <td>${order.date}</td>
        <td>${order.amount}</td>
        <td>${order.status}</td>
        <td>
          <button class="btn btn-warning btn-sm edit-order">Редагувати</button>
          <button class="btn btn-danger btn-sm delete-order">Видалити</button>
        </td>
      `;
      elements.orderTableBody.appendChild(row);

      row.querySelector('.edit-order').addEventListener('click', () => {
        document.getElementById('orderId').value = order.id;
        document.getElementById('orderDate').value = order.date;
        document.getElementById('orderAmount').value = order.amount;
        document.getElementById('orderStatus').value = order.status;
        editingOrderId = order.id;
        showMessage(elements.orderMessage, 'Редагування замовлення...');
      });

      row.querySelector('.delete-order').addEventListener('click', () => {
        if (confirm('Видалити це замовлення?')) {
          const updated = storage.get('orders').filter(o => o.id !== order.id);
          storage.set('orders', updated);
          renderOrders();
          showMessage(elements.orderMessage, 'Замовлення видалено!');
        }
      });
    });
  }

  if (elements.orderForm) {
    elements.orderForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = {
        id: document.getElementById('orderId').value.trim(),
        date: document.getElementById('orderDate').value.trim(),
        amount: document.getElementById('orderAmount').value.trim(),
        status: document.getElementById('orderStatus').value.trim()
      };

      if (!data.id || !data.date || !data.amount || !data.status) {
        alert('Заповніть усі поля!');
        return;
      }

      let orders = storage.get('orders');

      if (editingOrderId) {
        orders = orders.map(o => o.id === editingOrderId ? data : o);
        showMessage(elements.orderMessage, 'Замовлення оновлено!');
        editingOrderId = null;
      } else {
        if (orders.some(o => o.id === data.id)) {
          alert('Замовлення з таким ID вже існує!');
          return;
        }
        orders.push(data);
        showMessage(elements.orderMessage, 'Замовлення додано!');
      }

      storage.set('orders', orders);
      renderOrders();
      elements.orderForm.reset();
    });
  }

  /*====================*
   *   ТРАНСПОРТ
   *====================*/
  function renderTransport() {
    const list = storage.get('transport');
    elements.transportTableBody.innerHTML = '';

    if (list.length === 0) {
      elements.transportTableBody.innerHTML = `<tr><td colspan="6" class="text-center fst-italic">Немає транспорту</td></tr>`;
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
          <button class="btn btn-warning btn-sm edit-vehicle">Редагувати</button>
          <button class="btn btn-danger btn-sm delete-vehicle">Видалити</button>
        </td>
      `;
      elements.transportTableBody.appendChild(row);

      row.querySelector('.edit-vehicle').addEventListener('click', () => {
        document.getElementById('vehicleId').value = vehicle.id;
        document.getElementById('vehicleBrand').value = vehicle.brand;
        document.getElementById('vehicleModel').value = vehicle.model;
        document.getElementById('vehicleYear').value = vehicle.year;
        document.getElementById('vehicleNumber').value = vehicle.number;
        editingVehicleId = vehicle.id;
        showMessage(elements.transportMessage, 'Редагування транспорту...');
      });

      row.querySelector('.delete-vehicle').addEventListener('click', () => {
        if (confirm('Видалити цей транспорт?')) {
          const updated = storage.get('transport').filter(v => v.id !== vehicle.id);
          storage.set('transport', updated);
          renderTransport();
          showMessage(elements.transportMessage, 'Транспорт видалено!');
        }
      });
    });
  }

  if (elements.transportForm) {
    elements.transportForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = {
        id: document.getElementById('vehicleId').value.trim(),
        brand: document.getElementById('vehicleBrand').value.trim(),
        model: document.getElementById('vehicleModel').value.trim(),
        year: document.getElementById('vehicleYear').value.trim(),
        number: document.getElementById('vehicleNumber').value.trim()
      };

      if (!data.id || !data.brand || !data.model || !data.year || !data.number) {
        alert('Заповніть усі поля транспорту!');
        return;
      }

      let list = storage.get('transport');

      if (editingVehicleId) {
        list = list.map(v => v.id === editingVehicleId ? data : v);
        showMessage(elements.transportMessage, 'Дані транспорту оновлено!');
        editingVehicleId = null;
      } else {
        if (list.some(v => v.id === data.id)) {
          alert('Транспорт з таким ID вже існує!');
          return;
        }
        list.push(data);
        showMessage(elements.transportMessage, 'Транспорт додано!');
      }

      storage.set('transport', list);
      renderTransport();
      elements.transportForm.reset();
    });
  }

  /*====================*
   *   ПОВІДОМЛЕННЯ
   *====================*/
  function showMessage(el, msg) {
    if (!el) return;
    el.textContent = msg;
    setTimeout(() => el.textContent = '', 3000);
  }

  /*====================*
   *   ІНІЦІАЛІЗАЦІЯ
   *====================*/
  renderOrders();
  renderTransport();
});
