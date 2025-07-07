// بيانات مبدئية
let users = [
  { id: "70062", name: "Musab Ali", role: "admin", site: "مسلخ المدينة" },
  { id: "200", name: "User1", role: "user", site: "مسلخ الفرع" }
];

let sites = ["مسلخ المدينة", "مسلخ الفرع"];
let animals = ["خروف", "ماعز", "بقر", "جمل"];
let cuttings = ["تقطيع عادي", "تقطيع خاص"];
let prices = {}; // {animal-cutting : price}

let invoices = [];
let currentUser = null;
let invoiceCounter = 1;

// عناصر الصفحة
const sections = {
  splash: document.getElementById("splash"),
  login: document.getElementById("login"),
  dashboard: document.getElementById("dashboard"),
  dataEntry: document.getElementById("dataEntry"),
  report: document.getElementById("report"),
  settings: document.getElementById("settings")
};

const dom = {
  employeeId: document.getElementById("employeeId"),
  username: document.getElementById("username"),
  siteTitle: document.getElementById("dataEntrySiteTitle"),
  invoiceNumber: document.getElementById("invoiceNumber"),
  phone: document.getElementById("phone"),
  clientName: document.getElementById("clientName"),
  animalType: document.getElementById("animalType"),
  cuttingType: document.getElementById("cuttingType"),
  animalNumber: document.getElementById("animalNumber"),
  stickerNumber: document.getElementById("stickerNumber"),
  quantity: document.getElementById("quantity"),
  unitPrice: document.getElementById("unitPrice"),
  totalPrice: document.getElementById("totalPrice"),
  reportTableBody: document.querySelector("#reportTable tbody"),

  // أزرار
  btnLogin: document.getElementById("btnLogin"),
  btnDataEntry: document.getElementById("btnDataEntry"),
  btnReport: document.getElementById("btnReport"),
  btnLogout: document.getElementById("btnLogout"),
  btnSaveData: document.getElementById("btnSaveData"),
  btnBackToDashboardFromEntry: document.getElementById("btnBackToDashboardFromEntry"),
  btnBackToDashboardFromSettings: document.getElementById("btnBackToDashboardFromSettings"),
};

// دوال أساسية

function initializeApp() {
  showSection("splash");
  setTimeout(() => showSection("login"), 2000);
  fillSelect(dom.animalType, animals);
  fillSelect(dom.cuttingType, cuttings);
  fillSelect(dom.animalNumber, Array.from({ length: 50 }, (_, i) => i + 1));
  fillSelect(dom.stickerNumber, Array.from({ length: 50 }, (_, i) => i + 1));
  fillSelect(dom.quantity, Array.from({ length: 10 }, (_, i) => i + 1));
  updateInvoiceNumber();
  startClock();
}

function showSection(id) {
  Object.values(sections).forEach(sec => sec.classList.remove("active"));
  sections[id].classList.add("active");
}

function fillSelect(select, items) {
  select.innerHTML = "";
  items.forEach(item => {
    let option = document.createElement("option");
    option.value = item;
    option.textContent = item;
    select.appendChild(option);
  });
}

function startClock() {
  const clock = document.getElementById("clock");
  setInterval(() => {
    const now = new Date();
    clock.textContent = now.toLocaleString();
  }, 1000);
}

function login() {
  const empId = dom.employeeId.value.trim();
  const found = users.find(u => u.id === empId);
  if (!found) {
    alert("مستخدم غير موجود");
    return;
  }
  currentUser = found;
  dom.username.textContent = found.name;
  if (found.role === "admin") {
    sections.settings.style.display = "block";
  } else {
    sections.settings.style.display = "none";
  }
  dom.siteTitle.textContent = found.role === "admin" ? "مسؤول النظام" : `الموقع: ${found.site}`;
  showSection("dashboard");
}

function updateInvoiceNumber() {
  dom.invoiceNumber.value = invoiceCounter.toString().padStart(5, "0");
}

function updatePrice() {
  const key = `${dom.animalType.value}-${dom.cuttingType.value}`;
  const price = prices[key] || 0;
  dom.unitPrice.value = price;
  dom.totalPrice.value = price * Number(dom.quantity.value || 1);
}

function saveData() {
  const invoice = {
    site: currentUser.role === "admin" ? "كافة المواقع" : currentUser.site,
    name: dom.clientName.value,
    phone: dom.phone.value,
    invoiceNumber: dom.invoiceNumber.value,
    animalType: dom.animalType.value,
    cuttingType: dom.cuttingType.value,
    animalNumber: dom.animalNumber.value,
    stickerNumber: dom.stickerNumber.value,
    quantity: dom.quantity.value,
    paymentType: document.querySelector('input[name="paymentType"]:checked').value,
    unitPrice: dom.unitPrice.value,
    totalPrice: dom.totalPrice.value,
    date: new Date().toLocaleString(),
  };
  invoices.push(invoice);
  invoiceCounter++;
  updateInvoiceNumber();
  alert("تم حفظ الفاتورة بنجاح!");
}

function loadInvoices() {
  dom.reportTableBody.innerHTML = "";
  invoices.forEach(inv => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${inv.site}</td>
      <td>${inv.name}</td>
      <td>${inv.phone}</td>
      <td>${inv.invoiceNumber}</td>
      <td>${inv.animalType}</td>
      <td>${inv.cuttingType}</td>
      <td>${inv.quantity}</td>
      <td>${inv.paymentType}</td>
      <td>${inv.unitPrice}</td>
      <td>${inv.totalPrice}</td>
      <td>${inv.date}</td>
    `;
    dom.reportTableBody.appendChild(tr);
  });
}

function addSite() {
  const site = prompt("أدخل اسم الموقع:");
  if (site && !sites.includes(site)) {
    sites.push(site);
    alert("تمت إضافة الموقع");
  }
}

function addAnimal() {
  const animal = prompt("أدخل نوع الذبيحة:");
  if (animal && !animals.includes(animal)) {
    animals.push(animal);
    fillSelect(dom.animalType, animals);
    alert("تمت الإضافة");
  }
}

function addCutting() {
  const cutting = prompt("أدخل نوع التقطيع:");
  if (cutting && !cuttings.includes(cutting)) {
    cuttings.push(cutting);
    fillSelect(dom.cuttingType, cuttings);
    alert("تمت الإضافة");
  }
}

function setPrice() {
  const animal = dom.animalType.value;
  const cutting = dom.cuttingType.value;
  const price = prompt(`حدد السعر لـ ${animal} - ${cutting}:`);
  if (price) {
    const key = `${animal}-${cutting}`;
    prices[key] = Number(price);
    alert(`تم تحديد السعر`);
  }
}

// الأحداث
dom.btnLogin.addEventListener("click", login);
dom.btnDataEntry.addEventListener("click", () => showSection("dataEntry"));
dom.btnReport.addEventListener("click", () => {
  loadInvoices();
  showSection("report");
});
dom.btnLogout.addEventListener("click", () => showSection("login"));
dom.btnSaveData.addEventListener("click", saveData);
dom.btnBackToDashboardFromEntry.addEventListener("click", () => showSection("dashboard"));
dom.btnBackToDashboardFromSettings.addEventListener("click", () => showSection("dashboard"));

// تحديث السعر تلقائي
dom.animalType.addEventListener("change", updatePrice);
dom.cuttingType.addEventListener("change", updatePrice);
dom.quantity.addEventListener("change", updatePrice);

// شغل التطبيق
initializeApp();
