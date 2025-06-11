
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
