const moduleStatus = document.querySelector("#moduleStatus");

document.querySelectorAll("button[data-module]").forEach((button) => {
  button.addEventListener("click", () => {
    const title = button.querySelector("strong").textContent;
    moduleStatus.textContent = `El apartado ${title} todavía no está disponible. Ya queda preparado en el menú.`;
  });
});
