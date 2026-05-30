// El índice general contiene enlaces directos y la lógica de instalación de los módulos.
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".card-install-btn").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const card = button.closest(".module-card");
      if (card) {
        const href = card.getAttribute("href");
        window.location.href = href + "?install=1";
      }
    });
  });
});
