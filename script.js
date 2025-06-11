
// Перемикання секцій за натисканням пунктів меню
document.querySelectorAll('nav a[data-section]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    
    // Видаляємо клас active у всіх посилань і секцій
    document.querySelectorAll('nav a[data-section]').forEach(nav => nav.classList.remove('active'));
    document.querySelectorAll('.tab-section').forEach(sec => sec.classList.remove('active'));
    
    // Додаємо active до натиснутого посилання та відповідної секції
    link.classList.add('active');
    const id = link.getAttribute('data-section');
    document.getElementById(id).classList.add('active');
  });
});

// Обробка форми додавання працівника
document.getElementById('employeeForm').addEventListener('submit', e => {
  e.preventDefault();
  document.getElementById('formMessage').textContent = 'Працівника додано!';
  e.target.reset();
});

// Завантаження замовлень з файлу data/orders.json
document.getElementById('loadOrders').addEventListener('click', () => {
  fetch('data/orders.json')
    .then(response => response.json())
    .then(data => {
      const tbody = document.querySelector('#ordersTable tbody');
      tbody.innerHTML = ''; // Очищення таблиці
      data.orders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${order.id}</td>
          <td>${order.date}</td>
          <td>${order.amount}</td>
          <td>${order.status}</td>
        `;
        tbody.appendChild(row);
      });
    })
    .catch(error => {
      console.error('Error loading orders:', error);
    });
});

// Обробка форми додавання нового замовлення
document.getElementById('orderForm').addEventListener('submit', e => {
  e.preventDefault();
  const id = document.getElementById('orderId').value;
  const date = document.getElementById('orderDate').value;
  const amount = document.getElementById('orderAmount').value;
  const status = document.getElementById('orderStatus').value;
  
  const tbody = document.querySelector('#orders
