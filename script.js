<script>
window.addEventListener('DOMContentLoaded', () => {
  let editingOrderId = null;
  let editingVehicleId = null;
  let editingEmployeeId = null;

  const el = {
    orderForm: document.getElementById('orderForm'),
    orderMessage: document.getElementById('orderMessage'),
    transportForm: document.getElementById('transportForm'),
    transportMessage: document.getElementById('transportMessage'),
    employeeForm: document.getElementById('employeeForm'),
    employeeTableBody: document.querySelector('#employeeTable tbody'),
    searchInput: document.getElementById('searchInput'),
    reportContainer: document.getElementById('report-container'),
    csvBtn: document.getElementById('download-csv-btn'),
    pdfBtn: document.getElementById('download-pdf-btn'),
    excelBtn: document.getElementById('download-excel-btn'),
    genReportBtn: document.getElementById('generate-report-btn')
  };

  function getStorage(key) {
    return JSON.parse(localStorage.getItem(key) || '[]');
  }
  function setStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function generateReport() {
    const employees = getStorage('employees');
    const orders = getStorage('orders');
    const report = employees.map(emp => {
      const count = orders.filter(o => o.employeeId === emp.id).length;
      return { name: emp.name, orders: count };
    });

    const tableHtml = `
      <table class="table table-bordered">
        <thead><tr><th>Працівник</th><th>Кількість замовлень</th></tr></thead>
        <tbody>
          ${report.map(r => `<tr><td>${r.name}</td><td>${r.orders}</td></tr>`).join('')}
        </tbody>
      </table>`;

    el.reportContainer.innerHTML = tableHtml;
    el.reportContainer.dataset.json = JSON.stringify(report);
    el.reportContainer.dataset.csv = [['Працівник','Кількість замовлень'], ...report.map(r => [r.name, r.orders])].map(row => row.join(',')).join('\n');

    [el.csvBtn, el.pdfBtn, el.excelBtn].forEach(btn => btn.classList.remove("d-none"));
  }

  el.genReportBtn?.addEventListener("click", generateReport);

  el.csvBtn?.addEventListener("click", () => {
    const csv = el.reportContainer.dataset.csv;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "report.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  });

  el.pdfBtn?.addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    const report = JSON.parse(el.reportContainer.dataset.json || "[]");
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Звіт — Кількість замовлень по працівниках", 10, 10);
    let y = 20;
    report.forEach(r => {
      doc.text(`${r.name}: ${r.orders}`, 10, y);
      y += 10;
    });
    doc.save("report.pdf");
  });

  el.excelBtn?.addEventListener("click", () => {
    const data = JSON.parse(el.reportContainer.dataset.json || "[]");
    if (!data || data.length === 0) return alert("Немає даних для експорту.");
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Звіт");
    XLSX.writeFile(wb, "report.xlsx");
  });
});
</script>
