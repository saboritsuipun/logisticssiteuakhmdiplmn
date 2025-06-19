document.addEventListener("DOMContentLoaded", () => {
  // Перемикання вкладок
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll(".tab-section");

  navLinks.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const target = link.getAttribute("data-section");

      navLinks.forEach(l => l.classList.remove("active"));
      sections.forEach(s => s.classList.remove("active"));

      link.classList.add("active");
      document.getElementById(target).classList.add("active");
    });
  });

  // ======== ЗАМОВЛЕННЯ ========
  const orderForm = document.getElementById("orderForm");
  const ordersTable = document.getElementById("ordersTable").querySelector("tbody");

  let orders = JSON.parse(localStorage.getItem("orders")) || [];

  function renderOrders() {
    ordersTable.innerHTML = "";
    orders.forEach((order, i) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${order.id}</td>
        <td>${order.date}</td>
        <td>${order.amount}</td>
        <td>${order.status}</td>
        <td>
          <button class="btn btn-sm btn-warning me-1" onclick="editOrder(${i})">Редагувати</button>
          <button class="btn btn-sm btn-danger" onclick="deleteOrder(${i})">Видалити</button>
        </td>
      `;
      ordersTable.appendChild(row);
    });
  }

  window.editOrder = index => {
    const order = orders[index];
    document.getElementById("orderId").value = order.id;
    document.getElementById("orderDate").value = order.date;
    document.getElementById("orderAmount").value = order.amount;
    document.getElementById("orderStatus").value = order.status;
    orders.splice(index, 1);
    renderOrders();
  };

  window.deleteOrder = index => {
    orders.splice(index, 1);
    saveOrders();
    renderOrders();
  };

  orderForm.addEventListener("submit", e => {
    e.preventDefault();
    const order = {
      id: document.getElementById("orderId").value,
      date: document.getElementById("orderDate").value,
      amount: document.getElementById("orderAmount").value,
      status: document.getElementById("orderStatus").value,
    };
    orders.push(order);
    saveOrders();
    orderForm.reset();
    renderOrders();
  });

  function saveOrders() {
    localStorage.setItem("orders", JSON.stringify(orders));
  }

  renderOrders();

  // ======== ТРАНСПОРТ ========
  const transportForm = document.getElementById("transportForm");
  const transportTable = document.getElementById("transportTable").querySelector("tbody");
  let transportData = JSON.parse(localStorage.getItem("transport")) || [];

  function renderTransport() {
    transportTable.innerHTML = "";
    transportData.forEach((item, i) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.id}</td>
        <td>${item.model}</td>
        <td>${item.number}</td>
        <td>
          <button class="btn btn-sm btn-danger" onclick="deleteVehicle(${i})">Видалити</button>
        </td>
      `;
      transportTable.appendChild(row);
    });
  }

  window.deleteVehicle = index => {
    transportData.splice(index, 1);
    saveTransport();
    renderTransport();
  };

  transportForm.addEventListener("submit", e => {
    e.preventDefault();
    const vehicle = {
      id: document.getElementById("vehicleId").value,
      model: document.getElementById("vehicleModel").value,
      number: document.getElementById("vehicleNumber").value,
    };
    transportData.push(vehicle);
    saveTransport();
    transportForm.reset();
    renderTransport();
  });

  function saveTransport() {
    localStorage.setItem("transport", JSON.stringify(transportData));
  }

  renderTransport();

  // ======== ПРАЦІВНИКИ ========
  const employeeForm = document.getElementById("employeeForm");
  const employeeTable = document.getElementById("employeeTable").querySelector("tbody");
  let employees = JSON.parse(localStorage.getItem("employees")) || [];

  function renderEmployees() {
    employeeTable.innerHTML = "";
    employees.forEach(emp => {
      const row = document.createElement("tr");
      row.innerHTML = `<td>${emp.id}</td><td>${emp.name}</td><td>${emp.position}</td>`;
      employeeTable.appendChild(row);
    });
  }

  employeeForm.addEventListener("submit", e => {
    e.preventDefault();
    const employee = {
      id: document.getElementById("empId").value,
      name: document.getElementById("empName").value,
      position: document.getElementById("empPosition").value,
    };
    employees.push(employee);
    localStorage.setItem("employees", JSON.stringify(employees));
    employeeForm.reset();
    renderEmployees();
  });

  renderEmployees();

  // ======== ЗВІТИ ========
  const reportBtn = document.getElementById("generate-report-btn");
  const csvBtn = document.getElementById("download-csv-btn");
  const pdfBtn = document.getElementById("download-pdf-btn");
  const excelBtn = document.getElementById("download-excel-btn");
  const reportContainer = document.getElementById("report-container");

  reportBtn.addEventListener("click", () => {
    if (orders.length === 0) {
      reportContainer.innerHTML = "<p>Даних для звіту немає.</p>";
      return;
    }
    let html = `<table class="table table-bordered"><thead><tr><th>ID</th><th>Дата</th><th>Сума</th><th>Статус</th></tr></thead><tbody>`;
    orders.forEach(o => {
      html += `<tr><td>${o.id}</td><td>${o.date}</td><td>${o.amount}</td><td>${o.status}</td></tr>`;
    });
    html += "</tbody></table>";
    reportContainer.innerHTML = html;
  });

  csvBtn.addEventListener("click", () => {
    let csv = "ID,Дата,Сума,Статус\n";
    orders.forEach(o => {
      csv += `${o.id},${o.date},${o.amount},${o.status}\n`;
    });
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "report.csv";
    a.click();
  });

  pdfBtn.addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text("Звіт по замовленнях", 10, 10);
    let y = 20;
    orders.forEach(o => {
      doc.text(`${o.id} | ${o.date} | ${o.amount} | ${o.status}`, 10, y);
      y += 10;
    });
    doc.save("report.pdf");
  });

  excelBtn.addEventListener("click", () => {
    const ws = XLSX.utils.json_to_sheet(orders);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Звіт");
    XLSX.writeFile(wb, "report.xlsx");
  });
});

