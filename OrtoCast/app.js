const menuView = document.querySelector("#menuView");
const moduleView = document.querySelector("#moduleView");
const moduleFrame = document.querySelector("#moduleFrame");
const moduleStatus = document.querySelector("#moduleStatus");

const modules = {
  BV: "OrtoCast-BV/?embed=1",
};

window.addEventListener("hashchange", renderRoute);

document.querySelectorAll("[data-module]").forEach((button) => {
  button.addEventListener("click", () => {
    const moduleId = button.dataset.module;
    if (modules[moduleId]) return;
    const title = button.querySelector("strong").textContent;
    moduleStatus.textContent = `El apartado ${title} todavía no está disponible. Ya queda preparado en el menú.`;
  });
});

window.addEventListener("message", (event) => {
  if (event.data?.type === "ortocast:navigate-menu") {
    history.replaceState(null, "", window.location.pathname + window.location.search);
    renderRoute();
  }
});

renderRoute();

function renderRoute() {
  const route = window.location.hash.replace("#", "").toUpperCase();
  if (route === "BV") {
    openModule("BV");
    return;
  }
  closeModule();
}

function openModule(moduleId) {
  document.body.classList.add("module-open");
  menuView.hidden = true;
  moduleView.hidden = false;
  if (!moduleFrame.src.endsWith(modules[moduleId])) {
    moduleFrame.src = modules[moduleId];
  }
}

function closeModule() {
  document.body.classList.remove("module-open");
  menuView.hidden = false;
  moduleView.hidden = true;
  moduleFrame.src = "about:blank";
  moduleStatus.textContent = "El apartado B / V ya se puede abrir.";
}
