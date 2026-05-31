
const TENANTS_URL = window.TENANTS_URL;
const RENT_INCREASE_HISTORY_URL = window.RENT_INCREASE_HISTORY_URL;

function toggleSidebarMenu() {
  const submenu = document.getElementById("submenu");
  const arrow = document.getElementById("menuArrow");

  if (!submenu) return;

  const isOpen = submenu.style.display === "block";

  submenu.style.display = isOpen ? "none" : "block";

  if (arrow) {
    arrow.textContent = isOpen ? "▼" : "▲";
  }
}

document.addEventListener("DOMContentLoaded", () => {

  const token = localStorage.getItem("token");

  if (!token) {
    window.location.replace("./Login.html");
    return;
  }

  const tenantSelect = document.getElementById("tenantSelect");
  const tenantInfo = document.getElementById("tenantInfo");

  const currentRent = document.getElementById("currentRent");
  const increaseType = document.getElementById("increaseType");
  const increasePercent = document.getElementById("increasePercent");
  const newRent = document.getElementById("newRent");
  const effectiveDate = document.getElementById("effectiveDate");
  const reason = document.getElementById("reason");
  const customReason = document.getElementById("customReason");
  const letterText = document.getElementById("letterText");
  const msgEl = document.getElementById("msg");

  const oldRentResult = document.getElementById("oldRentResult");
  const newRentResult = document.getElementById("newRentResult");
  const diffResult = document.getElementById("diffResult");

  const calculateBtn = document.getElementById("calculateBtn");
  const generateBtn = document.getElementById("generateBtn");
  const saveRentBtn = document.getElementById("saveRentBtn");
  const copyBtn = document.getElementById("copyBtn");
  const downloadBtn = document.getElementById("downloadBtn");
  const downloadPdfBtn = document.getElementById("downloadPdfBtn");

  let tenants = [];

  function showMsg(text, type = "error") {
    msgEl.textContent = text;
    msgEl.className = "msg " + type;
  }

  function clearMsg() {
    msgEl.textContent = "";
    msgEl.className = "msg";
  }

  function getTenantId(t) {
    return t._id || t.id;
  }

  function getSelectedTenant() {
    return tenants.find(
      t => String(getTenantId(t)) === String(tenantSelect.value)
    );
  }
let rentHistoryData = [];

async function loadRentIncreaseHistory() {
  const historyList = document.getElementById("historyList");

  try {
    const res = await fetch(RENT_INCREASE_HISTORY_URL, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    });

    if (!res.ok) {
      throw new Error(await res.text());
    }

    rentHistoryData = await res.json();
    renderHistory(rentHistoryData);

  } catch (err) {
    console.error(err);
    historyList.innerHTML = "Historie konnte nicht geladen werden.";
  }
}

function renderHistory() {
 const historySearch = document.getElementById("historySearch");
  const historyFilter = document.getElementById("historyFilter");

    let filtered = rentHistoryData.filter(item => {
    const name = (item.tenantName || "").toLowerCase();

   const matchesFilter = !historyFilter.value || item.tenantName === historyFilter.value;

return matchesFilter;

  const names = [...new Set(rentHistoryData.map(item => item.tenantName).filter(Boolean))];

  const currentFilter = historyFilter.value;

  historyFilter.innerHTML =
    `<option value="">Alle Mieter</option>` +
    names.map(name => `<option value="${name}">${name}</option>`).join("");

  historyFilter.value = currentFilter;

  if (!filtered.length) {
    historyList.innerHTML = "Keine Ergebnisse gefunden.";
    return;
  }

  historyList.innerHTML = filtered.map(item => `
    <div class="history-item">
      <strong>${item.tenantName || "-"}</strong><br>
      Wohnung: ${item.unit || "-"}<br>
      Alte Miete: ${Number(item.oldRent || 0).toFixed(2)} €<br>
      Neue Miete: ${Number(item.newRent || 0).toFixed(2)} €<br>
      Erhöhung: ${Number(item.difference || 0).toFixed(2)} €
      (${Number(item.percent || 0).toFixed(2)} %)<br>
      Gültig ab: ${item.effectiveDate || "-"}
    </div>
  `).join("");
}
  async function loadTenants() {

    try {

      const res = await fetch(TENANTS_URL, {
        headers: {
          Authorization:
            "Bearer " + localStorage.getItem("token")
        }
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      tenants = await res.json();

      tenantSelect.innerHTML =
        '<option value="">— Mieter auswählen —</option>';

      tenants.forEach(t => {

        const option = document.createElement("option");

        option.value = getTenantId(t);

        option.textContent =
          `${t.name || "-"} | ${t.unit || "-"} | ${t.rent || 0} €`;

        tenantSelect.appendChild(option);
      });

      clearMsg();

    } catch (err) {

      console.error(err);

      showMsg("Fehler beim Laden der Mieter.");

    }
  }

  tenantSelect.addEventListener("change", () => {

    const tenant = getSelectedTenant();

    if (!tenant) {
      tenantInfo.innerHTML = "";
      return;
    }

    tenantInfo.innerHTML = `
      <div class="tenant-card">
        <h3>${tenant.name || "-"}</h3>
        <p>Wohnung: ${tenant.unit || "-"}</p>
        <p>Aktuelle Miete: ${Number(tenant.rent || 0).toFixed(2)} €</p>
        <p>Status: ${tenant.status || "-"}</p>
      </div>
    `;

    currentRent.value = tenant.rent || 0;

    calculateRent();
  });

  function calculateRent() {

    const oldRent =
      Number(currentRent.value) || 0;

    let newRentValue =
      Number(newRent.value) || oldRent;

    if (increaseType.value === "percent") {

      const percent =
        Number(increasePercent.value) || 0;

      newRentValue =
        oldRent + (oldRent * percent / 100);

      newRent.value =
        newRentValue.toFixed(2);
    }

    const diff =
      newRentValue - oldRent;

    oldRentResult.textContent =
      oldRent.toFixed(2) + " €";

    newRentResult.textContent =
      newRentValue.toFixed(2) + " €";

    diffResult.textContent =
      diff.toFixed(2) + " €";
  }

  calculateBtn.addEventListener(
    "click",
    calculateRent
  );

  function generateLetter() {

    clearMsg();

    const tenant = getSelectedTenant();

    if (!tenant) {
      showMsg("Bitte zuerst einen Mieter auswählen.");
      return;
    }

    calculateRent();

    const oldRent =
      Number(currentRent.value) || 0;

    const newRentValue =
      Number(newRent.value) || 0;

    if (newRentValue <= oldRent) {
      showMsg(
        "Die neue Miete muss höher sein als die aktuelle Miete."
      );
      return;
    }

    const diff =
      newRentValue - oldRent;

    const percentIncrease =
      ((diff / oldRent) * 100).toFixed(2);

    const today =
      new Date().toLocaleDateString("de-DE");

    const text = `
${today}

An:
${tenant.name || "-"}
Wohnung: ${tenant.unit || "-"}

Betreff: Mieterhöhung gemäß § 558 BGB

Sehr geehrte Damen und Herren,

hiermit möchte ich Sie darüber informieren, dass die monatliche Nettokaltmiete für die oben genannte Wohnung angepasst wird.

Die bisherige monatliche Miete beträgt:
${oldRent.toFixed(2)} €

Die neue monatliche Miete beträgt ab dem ${effectiveDate.value || "-"}:
${newRentValue.toFixed(2)} €

Dies entspricht einer Erhöhung um:
${diff.toFixed(2)} € (${percentIncrease} %)

Begründung der Mieterhöhung:
${reason.value}

${customReason.value || ""}

Die Anpassung erfolgt unter Berücksichtigung der gesetzlichen Regelungen sowie der aktuellen ortsüblichen Vergleichsmiete.

Ich bitte Sie, die neue Miethöhe ab dem oben genannten Zeitpunkt bei Ihren zukünftigen Zahlungen zu berücksichtigen.

Sollte Ihre Zustimmung erforderlich sein, bitte ich Sie höflich um eine schriftliche Bestätigung innerhalb der gesetzlichen Frist.

Für Rückfragen stehe ich Ihnen selbstverständlich gerne zur Verfügung.

Mit freundlichen Grüßen

Vermieter / Hausverwaltung
`;

    letterText.value = text.trim();

    showMsg(
      "Professioneller Mieterhöhungsbrief wurde generiert.",
      "success"
    );
  }

  generateBtn.addEventListener(
    "click",
    generateLetter
  );

  saveRentBtn.addEventListener("click", async () => {
  try {
    const tenant = getSelectedTenant();

    if (!tenant) {
      showMsg("Bitte zuerst einen Mieter auswählen.");
      return;
    }

    const oldRentValue = Number(currentRent.value) || 0;
    const newRentValue = Number(newRent.value) || 0;
    const differenceValue = newRentValue - oldRentValue;

    const percentValue =
      oldRentValue > 0
        ? (differenceValue / oldRentValue) * 100
        : 0;

    await fetch(RENT_INCREASE_HISTORY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token")
      },
      body: JSON.stringify({
        tenantId: getTenantId(tenant),
        tenantName: tenant.name || "",
        unit: tenant.unit || "",
        oldRent: oldRentValue,
        newRent: newRentValue,
        difference: differenceValue,
        percent: percentValue,
        effectiveDate: effectiveDate.value || "",
        reason: reason.value || "",
        customReason: customReason.value || ""
      })
    });

    await loadRentIncreaseHistory();

  } catch (err) {
    console.error(err);
  }
});
rentHistoryData = await res.json();
renderHistory();

} catch (err) {
  console.error(err);
  historyList.innerHTML = "Historie konnte nicht geladen werden.";
}
}

function renderHistory() {
  const historyList = document.getElementById("historyList");
  const historyFilter = document.getElementById("historyFilter");

  let filtered = rentHistoryData.filter(item => {
    const matchesFilter =
      !historyFilter.value || item.tenantName === historyFilter.value;

    return matchesFilter;
  });

  const names = [...new Set(rentHistoryData.map(item => item.tenantName).filter(Boolean))];

  const currentFilter = historyFilter.value;

  historyFilter.innerHTML =
    `<option value="">Alle Mieter</option>` +
    names.map(name => `<option value="${name}">${name}</option>`).join("");

  historyFilter.value = currentFilter;

  if (!filtered.length) {
    historyList.innerHTML = "Keine Ergebnisse gefunden.";
    return;
  }

  historyList.innerHTML = filtered.map(item => `
    <div class="history-item">
      <strong>${item.tenantName || "-"}</strong><br>
      Wohnung: ${item.unit || "-"}<br>
      Alte Miete: ${Number(item.oldRent || 0).toFixed(2)} €<br>
      Neue Miete: ${Number(item.newRent || 0).toFixed(2)} €<br>
      Erhöhung: ${Number(item.difference || 0).toFixed(2)} €
      (${Number(item.percent || 0).toFixed(2)} %)<br>
      Gültig ab: ${item.effectiveDate || "-"}
    </div>
  `).join("");
}
  copyBtn.addEventListener(
    "click",
    async () => {

      try {

        await navigator.clipboard.writeText(
          letterText.value
        );

        showMsg(
          "Text kopiert.",
          "success"
        );

      } catch (err) {

        console.error(err);

        showMsg(
          "Kopieren fehlgeschlagen."
        );
      }
    }
  );

  downloadBtn.addEventListener(
    "click",
    () => {

      const blob = new Blob(
        [letterText.value],
        { type: "text/plain" }
      );

      const url =
        URL.createObjectURL(blob);

      const a =
        document.createElement("a");

      a.href = url;

      a.download =
        "mieterhoehung.txt";

      a.click();

      URL.revokeObjectURL(url);
    }
);

  function downloadPdfLetter() {

    if (!letterText.value.trim()) {
      showMsg(
        "Bitte zuerst einen Brief generieren.");   

      return;
    }

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    const lines =
      doc.splitTextToSize(
        letterText.value,
        180
      );

    doc.setFontSize(12);

    doc.text(lines, 15, 20);

    doc.save("mieterhoehung.pdf");

    showMsg(
      "PDF erfolgreich erstellt.",
      "success"
    );
  }


document.getElementById("historyFilter").addEventListener("change", () => {
  renderHistory(rentHistoryData);
});
  loadTenants();
loadRentIncreaseHistory();
});

