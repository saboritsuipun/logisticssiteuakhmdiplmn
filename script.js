
function validateForm() {
  const email = document.getElementById("email").value;
  if (!email.includes("@")) {
    alert("Введіть коректну електронну адресу.");
    return false;
  }
  return true;
}

// Простий скрипт для обробки форми контакту
document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  // Зчитування даних форми
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const message = document.getElementById('message').value;
  
  // Вивід даних у консоль - тут можна зробити AJAX запит або показати повідомлення
  console.log("Name:", name);
  console.log("Email:", email);
  console.log("Message:", message);
  
  alert('Ваше повідомлення надіслано! Дякуємо!');
  
  // Очищення форми
  e.target.reset();
});

function showSection(sectionId) {
  document.querySelectorAll("main section").forEach(section => {
    section.classList.remove("active");
  });
  document.getElementById(sectionId).classList.add("active");
}

document.getElementById("employeeForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const position = document.getElementById("position").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const message = document.getElementById("formMessage");

  if (!name || !position || !email || !phone) {
    message.style.color = "red";
    message.textContent = "Будь ласка, заповніть усі поля.";
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    message.style.color = "red";
    message.textContent = "Невірний email.";
    return;
  }

  const digitsOnly = phone.replace(/\D/g, "");
  if (digitsOnly.length < 10) {
    message.style.color = "red";
    message.textContent = "Номер телефону має бути не менше 10 цифр.";
    return;
  }

  message.style.color = "green";
  message.textContent = "Працівника додано (імітація).";
  this.reset();
});

// Після існуючої обробки contactForm
// Завантажуємо дані і рендеримо графіки
fetch('data/logistic-data.json')
  .then(res => res.json())
  .then(({ daily, statusDistribution }) => {
    // 1) Лінійний графік: замовлень за датами
    const dates  = daily.map(item => item.date);
    const counts = daily.map(item => item.ordersProcessed);

    new Chart(
      document.getElementById('ordersChart'),
      {
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
        options: {
          responsive: true,
          scales: {
            y: { beginAtZero: true }
          }
        }
      }
    );

    // 2) Кругова діаграма: статуси замовлень
    new Chart(
      document.getElementById('statusChart'),
      {
        type: 'pie',
        data: {
          labels: Object.keys(statusDistribution),
          datasets: [{
            data: Object.values(statusDistribution),
            backgroundColor: ['#28a745','#ffc107','#dc3545']
          }]
        },
        options: { responsive: true }
      }
    );
  })
  .catch(err => console.error('Error loading logistic data:', err));

document.querySelectorAll('nav a[data-section]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const id = link.getAttribute('data-section');
    document.querySelectorAll('.tab-section').forEach(sec => {
      sec.classList.toggle('active', sec.id === id);
    });
  });
});

document.getElementById('employeeForm').addEventListener('submit', e => {
  e.preventDefault();
  document.getElementById('formMessage').textContent = 'Працівника додано!';
  e.target.reset();
});

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
       
