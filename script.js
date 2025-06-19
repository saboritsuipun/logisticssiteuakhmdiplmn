window.addEventListener('DOMContentLoaded', () => {
  let editingOrderId = null;
  let editingVehicleId = null;

  const elements = {
    orderForm: document.getElementById('orderForm'),
    orderMessage: document.getElementById('orderMessage'),
    orderTableBody: document.querySelector('#ordersTable tbody'),
    transportForm: document.getElementById('transportForm'),
    transportMessage: document.getElementById('transportMessage'),
    transportTableBody: document.querySelector('#transportTable tbody'),
    reportContainer: document.getElementById('report-container'),
    csvBtn: document.getElementById('download-csv-btn'),
    pdfBtn: document.getElementById('download-pdf-btn'),
    excelBtn: document.getElementById('download-excel-btn'),
    genReportBtn: document.getElementById('generate-report-btn')
  };

  const storage = {
    get: key => JSON.parse(localStorage.getItem(key)) || [],
    set: (key, data) => localStorage.setItem(key, JSON.stringify(data))
  };

  function renderOrders() {
    const orders = storage.get('orders');
    elements.orderTableBody.innerHTML = orders.length ? '' : `<tr><td colspan="5" class="text-center fst-italic">Немає замовлень</td></tr>`;

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

      row.querySelector('.edit-order').onclick = () => {
        Object.assign(document.getElementById('orderId'), { value: order.id });
        document.getElementById('orderDate').value = order.date;
        document.getElementById('orderAmount').value = order.amount;
        document.getElementById('orderStatus').value = order.status;
        editingOrderId = order.id;
        showMessage(elements.orderMessage, 'Редагування замовлення...');
      };

      row.querySelector('.delete-order').onclick = () => {
        if (confirm('Видалити це замовлення?')) {
          storage.set('orders', orders.filter(o => o.id !== order.id));
          renderOrders();
          showMessage(elements.orderMessage, 'Замовлення видалено!');
        }
      };
    });
  }

  if (elements.orderForm) {
    elements.orderForm.onsubmit = e => {
      e.preventDefault();
      const data = {
        id: orderId.value.trim(),
        date: orderDate.value.trim(),
        amount: orderAmount.value.trim(),
        status: orderStatus.value.trim()
      };
      if (Object.values(data).includes('')) return alert('Заповніть усі поля!');

      let orders = storage.get('orders');
      if (editingOrderId) {
        orders = orders.map(o => o.id === editingOrderId ? data : o);
        editingOrderId = null;
        showMessage(elements.orderMessage, 'Замовлення оновлено!');
      } else {
        if (orders.some(o => o.id === data.id)) return alert('Замовлення з таким ID вже існує!');
        orders.push(data);
        showMessage(elements.orderMessage, 'Замовлення додано!');
      }
      storage.set('orders', orders);
      renderOrders();
      elements.orderForm.reset();
    };
  }

  function renderTransport() {
    const vehicles = storage.get('transport');
    elements.transportTableBody.innerHTML = vehicles.length ? '' : `<tr><td colspan="6" class="text-center fst-italic">Немає транспорту</td></tr>`;

    vehicles.forEach(vehicle => {
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

      row.querySelector('.edit-vehicle').onclick = () => {
        vehicleId.value = vehicle.id;
        vehicleBrand.value = vehicle.brand;
        vehicleModel.value = vehicle.model;
        vehicleYear.value = vehicle.year;
        vehicleNumber.value = vehicle.number;
        editingVehicleId = vehicle.id;
        showMessage(elements.transportMessage, 'Редагування транспорту...');
      };

      row.querySelector('.delete-vehicle').onclick = () => {
        if (confirm('Видалити цей транспорт?')) {
          storage.set('transport', vehicles.filter(v => v.id !== vehicle.id));
          renderTransport();
          showMessage(elements.transportMessage, 'Транспорт видалено!');
        }
      };
    });
  }

  if (elements.transportForm) {
    elements.transportForm.onsubmit = e => {
      e.preventDefault();
      const data = {
        id: vehicleId.value.trim(),
        brand: vehicleBrand.value.trim(),
        model: vehicleModel.value.trim(),
        year: vehicleYear.value.trim(),
        number: vehicleNumber.value.trim()
      };
      if (Object.values(data).includes('')) return alert('Заповніть усі поля транспорту!');

      let vehicles = storage.get('transport');
      if (editingVehicleId) {
        vehicles = vehicles.map(v => v.id === editingVehicleId ? data : v);
        editingVehicleId = null;
        showMessage(elements.transportMessage, 'Транспорт оновлено!');
      } else {
        if (vehicles.some(v => v.id === data.id)) return alert('Транспорт з таким ID вже існує!');
        vehicles.push(data);
        showMessage(elements.transportMessage, 'Транспорт додано!');
      }
      storage.set('transport', vehicles);
      renderTransport();
      elements.transportForm.reset();
    };
  }

  function showMessage(el, msg) {
    if (!el) return;
    el.textContent = msg;
    setTimeout(() => el.textContent = '', 3000);
  }

  function setupNavigation() {
    const links = document.querySelectorAll('[data-section]');
    const sections = document.querySelectorAll('.tab-section');
    links.forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        links.forEach(l => l.classList.remove('active'));
        sections.forEach(s => s.classList.remove('active'));
        link.classList.add('active');
        const section = document.getElementById(link.dataset.section);
        if (section) section.classList.add('active');
      });
    });
  }

  function setupSearch() {
    const searchInput = document.createElement('input');
    searchInput.placeholder = 'Пошук...';
    searchInput.className = 'form-control w-25 ms-3';
    document.querySelector('header .container').appendChild(searchInput);

    searchInput.addEventListener('input', () => {
      const q = searchInput.value.toLowerCase();
      ['ordersTable', 'transportTable', 'employeeTable'].forEach(id => {
        const table = document.getElementById(id);
        if (!table) return;
        table.querySelectorAll('tbody tr').forEach(row => {
          const txt = row.textContent.toLowerCase();
          row.style.display = txt.includes(q) ? '' : 'none';
        });
      });
    });
  }

  renderOrders();
  renderTransport();
  setupNavigation();
  setupSearch();
});
