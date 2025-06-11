
function validateForm() {
  const email = document.getElementById("email").value;
  if (!email.includes("@")) {
    alert("Введіть коректну електронну адресу.");
    return false;
  }
  return true;
}
