window.addEventListener('DOMContentLoaded', () => {
  const el = {
    reportContainer: document.getElementById('report-container'),
    csvBtn: document.getElementById('download-csv-btn'),
    pdfBtn: document.getElementById('download-pdf-btn'),
    excelBtn: document.getElementById('download-excel-btn'),
    genReportBtn: document.getElementById('generate-report-btn')
  };

  function getStorage(key) {
    return JSON.parse(localStorage.getItem(key) || '[]');
  }

  function generateReport() {
    const employees = getStorage('employees');
    const orders = getStorage('orders');
    const transport = getStorage('transport');

    const report = employees.map(emp => {
      const orderCount = orders.filter(o => o.employeeId === emp.id).length;
      const transportCount = transport.filter(t => t.employeeId === emp.id).length;
      return { name: emp.name, orders: orderCount, transport: transportCount };
    });

    const tableHtml = `
      <table class="table table-bordered">
        <thead><tr><th>Працівник</th><th>Замовлень</th><th>Транспорт</th></tr></thead>
        <tbody>
          ${report.map(r => `<tr><td>${r.name}</td><td>${r.orders}</td><td>${r.transport}</td></tr>`).join('')}
        </tbody>
      </table>`;

    el.reportContainer.innerHTML = tableHtml;
    el.reportContainer.dataset.json = JSON.stringify(report);
    el.reportContainer.dataset.csv = [['Працівник', 'Замовлень', 'Транспорт'], ...report.map(r => [r.name, r.orders, r.transport])].map(row => row.join(',')).join('\n');

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
    doc.text("Звіт — Замовлення та транспорт по працівниках", 10, 10);
    let y = 20;
    report.forEach(r => {
      doc.text(`${r.name}: Замовлень — ${r.orders}, Транспорт — ${r.transport}`, 10, y);
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
