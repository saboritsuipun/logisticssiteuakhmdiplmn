
// Перемикання секцій через пункти меню
document.querySelectorAll('nav a[data-section]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    // Видаляємо клас active від усіх посилань і секцій
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

// Завантаження замовлень з data/orders.json
document.getElementById('loadOrders').addEventListener('click', () => {
  fetch('data/orders.json')
    .then(response => response.json())
    .then(data => {
      const tbody = document.querySelector('#ordersTable tbody');
      tbody.innerHTML = ''; // очищення таблиці
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
  
  const tbody = document.querySelector('#ordersTable tbody');
  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${id}</td>
    <td>${date}</td>
    <td>${amount}</td>
    <td>${status}</td>
  `;
  tbody.appendChild(row);
  
  document.getElementById('orderMessage').textContent = 'Замовлення додано!';
  e.target.reset();
});

// Ініціалізація графіків KPI з даними з data/logistic-data.json
fetch('data/logistic-data.json')
  .then(res => res.json())
  .then(({ daily, statusDistribution }) => {
    const dates = daily.map(item => item.date);
    const counts = daily.map(item => item.ordersProcessed);
    new Chart(document.getElementById('ordersChart'), {
      type: 'line',
      data: {
        labels: dates,
        datasets: [{
          label: 'Опрацьовано замовлень',
          data: counts,
          borderColor: '#007bff',
          backgroundColor: 'rgba(0,123,255,0.1)',
          fill: true,
          tension: 0.3
        }]
      },
      options: { responsive: true, scales: { y: { beginAtZero: true } } }
    });
  
    new Chart(document.getElementById('statusChart'), {
      type: 'pie',
      data: {
        labels: Object.keys(statusDistribution),
        datasets: [{
          data: Object.values(statusDistribution),
          backgroundColor: ['#28a745','#ffc107','#dc3545']
        }]
      },
      options: { responsive: true }
    });
  })
  .catch(console.error);

fetch("data/orders.json")
