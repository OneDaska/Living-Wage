const cities = {
  accra: {
    name: "Accra / Tema",
    expected: 3600,
    living: 3840.11,
    actual: 2865.98,
    coverage: 74.6,
    gap: 974.13,
    statement: "Actual salary leaves the largest monthly shortfall among the four markets."
  },
  takoradi: {
    name: "Takoradi",
    expected: 3200,
    living: 2682.56,
    actual: 2320.71,
    coverage: 86.5,
    gap: 361.85,
    statement: "Salary expectations exceed the benchmark, but actual pay still falls short."
  },
  kumasi: {
    name: "Kumasi",
    expected: 3400,
    living: 2596.77,
    actual: 2136.27,
    coverage: 82.3,
    gap: 460.5,
    statement: "The widest expectation-to-pay gap appears in Kumasi."
  },
  cape: {
    name: "Cape Coast",
    expected: 3100,
    living: 2210.34,
    actual: 1920.15,
    coverage: 86.9,
    gap: 290.19,
    statement: "The lowest living-wage benchmark still sits above median actual pay."
  }
};

const currency = (value) =>
  "GHS " + Math.round(value).toLocaleString("en-GH", { maximumFractionDigits: 0 });

const elements = {
  label: document.querySelector("#city-label"),
  statement: document.querySelector("#city-statement"),
  coverage: document.querySelector("#coverage-value"),
  ring: document.querySelector("#coverage-ring"),
  expected: document.querySelector("#expected-value"),
  living: document.querySelector("#living-value"),
  actual: document.querySelector("#actual-value"),
  gap: document.querySelector("#gap-value"),
  expectedBar: document.querySelector("#expected-bar"),
  livingBar: document.querySelector("#living-bar"),
  actualBar: document.querySelector("#actual-bar")
};

document.querySelectorAll(".city-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    const selected = cities[tab.dataset.city];
    const max = Math.max(selected.expected, selected.living, selected.actual);
    document.querySelectorAll(".city-tab").forEach((item) => {
      const active = item === tab;
      item.classList.toggle("active", active);
      item.setAttribute("aria-selected", String(active));
    });

    elements.label.textContent = selected.name;
    elements.statement.textContent = selected.statement;
    elements.coverage.textContent = selected.coverage.toFixed(1) + "%";
    elements.ring.style.setProperty("--coverage", selected.coverage);
    elements.expected.textContent = currency(selected.expected);
    elements.living.textContent = currency(selected.living);
    elements.actual.textContent = currency(selected.actual);
    elements.gap.textContent = currency(selected.gap);
    elements.expectedBar.style.width = (selected.expected / max) * 100 + "%";
    elements.livingBar.style.width = (selected.living / max) * 100 + "%";
    elements.actualBar.style.width = (selected.actual / max) * 100 + "%";
  });
});

const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
menuToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open menu");
  });
});


const gatedDownloadLinks = document.querySelectorAll("[data-download-gate]");
const downloadModal = document.querySelector("#download-modal");
const downloadForm = document.querySelector("#download-form");
const downloadName = document.querySelector("#download-name");
const downloadEmail = document.querySelector("#download-email");
const downloadError = document.querySelector("#download-form-error");
const closeDownloadButtons = document.querySelectorAll("[data-close-download]");
let activeDownloadUrl = "./assets/ghana-living-wage-report-2025.pdf";
let downloadTrigger = null;

const openDownloadModal = (trigger) => {
  downloadTrigger = trigger;
  activeDownloadUrl = trigger.href;
  downloadError.textContent = "";
  downloadModal.hidden = false;
  document.body.classList.add("modal-open");
  window.setTimeout(() => downloadName.focus(), 50);
};

const closeDownloadModal = () => {
  downloadModal.hidden = true;
  document.body.classList.remove("modal-open");
  downloadForm.reset();
  downloadError.textContent = "";
  downloadTrigger?.focus();
};

gatedDownloadLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    openDownloadModal(link);
  });
});

closeDownloadButtons.forEach((button) => {
  button.addEventListener("click", closeDownloadModal);
});

downloadForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const nameIsValid = downloadName.value.trim().length >= 2;
  const emailIsValid =
    downloadEmail.validity.valid &&
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(downloadEmail.value.trim());

  if (!nameIsValid) {
    downloadError.textContent = "Please enter your full name.";
    downloadName.focus();
    return;
  }

  if (!emailIsValid) {
    downloadError.textContent = "Please enter a valid email address.";
    downloadEmail.focus();
    return;
  }

  const temporaryLink = document.createElement("a");
  temporaryLink.href = activeDownloadUrl;
  temporaryLink.download = "ghana-living-wage-report-2025.pdf";
  document.body.appendChild(temporaryLink);
  temporaryLink.click();
  temporaryLink.remove();
  closeDownloadModal();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !downloadModal.hidden) {
    closeDownloadModal();
  }
});
