window.addEventListener('DOMContentLoaded', () => {
  let editingOrderId = null;
  let editingVehicleId = null;

  // ======= Elements =======
  const elements = {
    orderForm: document.getElementById('orderForm'),
    orderTable: document.querySelector('#ordersTable tbody'),
    orderMessage: document.getElementById('orderMessage'),

    transportForm: document.getElementById('transportForm'),
    transportTable: document.querySelector('#transportTable tbody'),
    transportMessage: document.getElementById('transportMessage'),

    employeeForm: document.getElementById('employeeForm'),
    employeeTable: document.querySelector('#employeeTable tbody'),

    reportContainer: document.getElementById('report-container'),
    csvBtn: document.getElementById('download-csv-btn'),
    pdfBtn: document.getElementById('download-pdf-btn'),
    excelBtn: document.getElementById('download-excel-btn'),
    genReportBtn: document.getElementById('generate-report-btn'),
    searchBtn: document.getElementById('searchBtn'),
    searchInput: document.getElementById('searchInput')
  };

  // ======= Storage Utils =======
  const storage = {
    get: key => JSON.parse(localStorage.getItem(key) || '[]'),
    set: (key, val) => localStorage.setItem(key, JSON.stringify(val))
  };

  // ======= Orders =======
  function renderOrders() {
    const orders = storage.get('orders');
    elements.orderTable.innerHTML = orders.length ? '' : `<tr><td colspan="5" class="text-center fst-italic">Немає замовлень</td></tr>`;

    orders.forEach(order => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${order.id}</td>
        <td>${order.date}</td>
        <td>${order.amount}</td>
        <td>${order.status}</td>
        <td>
          <button class="btn btn-sm btn-warning edit">Редагувати</button>
          <button class="btn btn-sm btn-danger delete">Видалити</button>
        </td>`;
      elements.orderTable.appendChild(row);

      row.querySelector('.edit').onclick = () => {
        ['orderId', 'orderDate', 'orderAmount', 'orderStatus'].forEach(id => {
          document.getElementById(id).value = order[id.replace('order', '').toLowerCase()];
        });
        editingOrderId = order.id;
        showMessage(elements.orderMessage, 'Редагування замовлення...');
      };

      row.querySelector('.delete').onclick = () => {
        if (confirm('Видалити це замовлення?')) {
          const updated = orders.filter(o => o.id !== order.id);
          storage.set('orders', updated);
          renderOrders();
          showMessage(elements.orderMessage, 'Замовлення видалено!');
        }
      };
    });
  }

  elements.orderForm.onsubmit = e => {
    e.preventDefault();
    const order = {
      id: orderId.value.trim(),
      date: orderDate.value.trim(),
      amount: orderAmount.value.trim(),
      status: orderStatus.value.trim()
    };
    if (Object.values(order).includes('')) return alert('Заповніть усі поля!');
    let orders = storage.get('orders');
    if (editingOrderId) {
      orders = orders.map(o => o.id === editingOrderId ? order : o);
      showMessage(elements.orderMessage, 'Замовлення оновлено!');
      editingOrderId = null;
    } else {
      if (orders.some(o => o.id === order.id)) return alert('ID вже існує!');
      orders.push(order);
      showMessage(elements.orderMessage, 'Замовлення додано!');
    }
    storage.set('orders', orders);
    renderOrders();
    elements.orderForm.reset();
  };

  // ======= Transport =======
  function renderTransport() {
    const list = storage.get('transport');
    elements.transportTable.innerHTML = list.length ? '' : `<tr><td colspan="6" class="text-center fst-italic">Немає транспорту</td></tr>`;
    list.forEach(vehicle => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${vehicle.id}</td>
        <td>${vehicle.brand}</td>
        <td>${vehicle.model}</td>
        <td>${vehicle.year}</td>
        <td>${vehicle.number}</td>
        <td>
          <button class="btn btn-sm btn-warning edit">Редагувати</button>
          <button class="btn btn-sm btn-danger delete">Видалити</button>
        </td>`;
      elements.transportTable.appendChild(row);

      row.querySelector('.edit').onclick = () => {
        ['vehicleId', 'vehicleBrand', 'vehicleModel', 'vehicleYear', 'vehicleNumber'].forEach(id => {
          document.getElementById(id).value = vehicle[id.replace('vehicle', '').toLowerCase()];
        });
        editingVehicleId = vehicle.id;
        showMessage(elements.transportMessage, 'Редагування транспорту...');
      };

      row.querySelector('.delete').onclick = () => {
        if (confirm('Видалити транспорт?')) {
          const updated = list.filter(v => v.id !== vehicle.id);
          storage.set('transport', updated);
          renderTransport();
          showMessage(elements.transportMessage, 'Транспорт видалено!');
        }
      };
    });
  }

  elements.transportForm.onsubmit = e => {
    e.preventDefault();
    const v = {
      id: vehicleId.value.trim(),
      brand: vehicleBrand.value.trim(),
      model: vehicleModel.value.trim(),
      year: vehicleYear.value.trim(),
      number: vehicleNumber.value.trim()
    };
    if (Object.values(v).includes('')) return alert('Заповніть усі поля!');
    let list = storage.get('transport');
    if (editingVehicleId) {
      list = list.map(vh => vh.id === editingVehicleId ? v : vh);
      editingVehicleId = null;
      showMessage(elements.transportMessage, 'Транспорт оновлено!');
    } else {
      if (list.some(vh => vh.id === v.id)) return alert('ID вже існує!');
      list.push(v);
      showMessage(elements.transportMessage, 'Транспорт додано!');
    }
    storage.set('transport', list);
    renderTransport();
    elements.transportForm.reset();
  };

  // ======= Employees =======
  function renderEmployees() {
    const list = storage.get('employees');
    elements.employeeTable.innerHTML = list.length ? '' : `<tr><td colspan="6" class="text-center fst-italic">Немає працівників</td></tr>`;
    list.forEach(emp => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${emp.id}</td>
        <td>${emp.name}</td>
        <td>${emp.position}</td>
        <td>${emp.email}</td>
        <td>${emp.phone}</td>
        <td><button class="btn btn-sm btn-danger delete">Видалити</button></td>`;
      elements.employeeTable.appendChild(row);

      row.querySelector('.delete').onclick = () => {
        const updated = list.filter(e => e.id !== emp.id);
        storage.set('employees', updated);
        renderEmployees();
      };
    });
  }

  elements.employeeForm.onsubmit = e => {
    e.preventDefault();
    const emp = {
      id: name.value.trim(),
      name: name.value.trim(),
      position: position.value.trim(),
      email: email.value.trim(),
      phone: phone.value.trim()
    };
    if (Object.values(emp).includes('')) return alert('Заповніть усі поля!');
    const list = storage.get('employees');
    list.push(emp);
    storage.set('employees', list);
    elements.employeeForm.reset();
    renderEmployees();
  };

  // ======= Reports =======
  elements.genReportBtn.onclick = () => {
    const orders = storage.get('orders');
    if (!orders.length) {
      elements.reportContainer.innerHTML = '<p>Немає даних для звіту.</p>';
      elements.csvBtn.style.display = elements.pdfBtn.style.display = elements.excelBtn.style.display = 'none';
      return;
    }
    let html = `<table class="table table-bordered"><thead><tr><th>ID</th><th>Дата</th><th>Сума</th><th>Статус</th></tr></thead><tbody>`;
    orders.forEach(o => {
      html += `<tr><td>${o.id}</td><td>${o.date}</td><td>${o.amount}</td><td>${o.status}</td></tr>`;
    });
    html += '</tbody></table>';
    elements.reportContainer.innerHTML = html;
    elements.csvBtn.style.display = elements.pdfBtn.style.display = elements.excelBtn.style.display = 'inline-block';
  };

 elements.csvBtn.onclick = () => {
  const orders = storage.get('orders');
  let csv = 'ID,Дата,Сума,Статус\n';
  orders.forEach(o => {
    csv += `${o.id},${o.date},${o.amount},${o.status}\n`;
  });
  const blob = new Blob([csv], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'orders_report.csv';
  link.click();
};
elements.pdfBtn.onclick = () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const orders = storage.get('orders');

  doc.setFontSize(16);
  doc.text('Звіт по замовленнях', 15, 20);

  let y = 30;
  orders.forEach((o, i) => {
    doc.text(`${i + 1}. ID: ${o.id}, Дата: ${o.date}, Сума: ${o.amount}, Статус: ${o.status}`, 10, y);
    y += 10;
    if (y > 280) {
      doc.addPage();
      y = 20;
    }
  });

  doc.save('orders_report.pdf');
};
elements.excelBtn.onclick = () => {
  const orders = storage.get('orders');
  const ws_data = [
    ['ID', 'Дата', 'Сума', 'Статус'],
    ...orders.map(o => [o.id, o.date, o.amount, o.status])
  ];
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(ws_data);
  XLSX.utils.book_append_sheet(wb, ws, 'Orders');
  XLSX.writeFile(wb, 'orders_report.xlsx');
};


  // ======= Пошук =======
  elements.searchBtn.onclick = () => {
    const q = elements.searchInput.value.toLowerCase();
    if (!q) return;
    const sections = document.querySelectorAll('.tab-section');
    let found = false;
    sections.forEach(sec => {
      sec.classList.remove('active');
      if (sec.innerText.toLowerCase().includes(q)) {
        sec.classList.add('active');
        found = true;
      }
    });
    if (!found) alert('Нічого не знайдено!');
  };

  // ======= Навігація =======
  document.querySelectorAll('[data-section]').forEach(link => {
    link.onclick = e => {
      e.preventDefault();
      document.querySelectorAll('.tab-section').forEach(s => s.classList.remove('active'));
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      document.getElementById(link.dataset.section).classList.add('active');
      link.classList.add('active');
    };
  });

  // ======= Utils =======
  function showMessage(el, msg) {
    el.textContent = msg;
    setTimeout(() => el.textContent = '', 3000);
  }

  // ======= Render All on Load =======
  renderOrders();
  renderTransport();
  renderEmployees();
});
