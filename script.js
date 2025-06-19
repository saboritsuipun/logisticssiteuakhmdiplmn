window.addEventListener('DOMContentLoaded', () => {
let editingOrderId = null;

// Рендер замовлень
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
      document.getElementById('orderMessage').textContent = 'Редагування замовлення...';
    });

    row.querySelector('.delete-btn').addEventListener('click', () => {
      if (confirm('Ви дійсно хочете видалити це замовлення?')) {
        let orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders = orders.filter(o => o.id !== order.id);
        localStorage.setItem('orders', JSON.stringify(orders));
        renderOrders();
        document.getElementById('orderMessage').textContent = 'Замовлення видалено!';
        if (editingOrderId === order.id) {
          editingOrderId = null;
          document.getElementById('orderForm').reset();
        }
      }
    });
  });
}

// Обробка форми додавання/редагування замовлення
document.getElementById('orderForm').addEventListener('submit', e => {
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
    // Оновлення замовлення
    orders = orders.map(order => order.id === editingOrderId ? orderData : order);
    document.getElementById('orderMessage').textContent = 'Замовлення оновлено!';
    editingOrderId = null;
  } else {
    // Перевірка унікальності ID
    if (orders.some(order => order.id === orderData.id)) {
      alert('Замовлення з таким ID вже існує!');
      return;
    }
    orders.push(orderData);
    document.getElementById('orderMessage').textContent = 'Замовлення додано!';
  }

  localStorage.setItem('orders', JSON.stringify(orders));
  renderOrders();
  e.target.reset();
});

// Ініціалізація
window.addEventListener('DOMContentLoaded', () => {
  renderOrders();
});

// Перемикання секцій (як у тебе було)
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

row.querySelector('.edit-btn').addEventListener('click', () => {
  // Заповнюємо форму значеннями з обраного замовлення
  document.getElementById('orderId').value = order.id;
  document.getElementById('orderDate').value = order.date;
  document.getElementById('orderAmount').value = order.amount;
  document.getElementById('orderStatus').value = order.status;

  // Видаляємо старе замовлення (воно буде перезаписане)
  const orders = JSON.parse(localStorage.getItem('orders')) || [];
  const updatedOrders = orders.filter(o => o.id !== order.id);
  localStorage.setItem('orders', JSON.stringify(updatedOrders));

  // Видаляємо рядок з таблиці
  row.remove();
});
// Вставити після інших оголошень або методів
document.addEventListener('DOMContentLoaded', () => {
  const genBtn = document.getElementById('generate-report-btn');
  const downloadBtn = document.getElementById('download-csv-btn');
  const container = document.getElementById('report-container');

  genBtn.addEventListener('click', () => {
    // Отримати дані з localStorage (або іншого джерела)
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const employees = JSON.parse(localStorage.getItem('employees') || '[]');

    // Приклад: побудова звіту – кількість замовлень по працівниках
    const reportData = employees.map(emp => {
      const count = orders.filter(o => o.employeeId === emp.id).length;
      return { name: emp.name, orders: count };
    });

    // Відобразити таблицю в DOM
    let html = `<table border="1"><tr><th>Працівник</th><th>Замовлень</th></tr>`;
    reportData.forEach(r => {
      html += `<tr><td>${r.name}</td><td>${r.orders}</td></tr>`;
    });
    html += `</table>`;
    container.innerHTML = html;

    // Підготувати CSV
    const csv = [
      ['Працівник', 'Замовлень'],
      ...reportData.map(r => [r.name, r.orders])
    ].map(r => r.join(',')).join('\n');

    // Зберігати CSV для завантаження
    container.dataset.csv = csv;
    downloadBtn.style.display = 'inline-block';
  });

  downloadBtn.addEventListener('click', () => {
    const csv = container.dataset.csv;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'report.csv';
    a.click();
    URL.revokeObjectURL(url);
  });
});
});
