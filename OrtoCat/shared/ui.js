export function setupTabs() {
  const tabList = document.querySelector(".tabs");
  const tabs = [...document.querySelectorAll(".tab-button")];
  if (!tabList || !tabs.length) return;

  tabList.setAttribute("role", "tablist");
  tabs.forEach((tab) => {
    const panel = document.querySelector(`#${tab.dataset.view}`);
    tab.setAttribute("role", "tab");
    tab.setAttribute("aria-controls", tab.dataset.view);
    tab.setAttribute("aria-selected", String(tab.classList.contains("is-active")));
    tab.tabIndex = tab.classList.contains("is-active") ? 0 : -1;
    if (panel) {
      panel.setAttribute("role", "tabpanel");
      panel.setAttribute("aria-labelledby", panel.querySelector("h2")?.id || "");
    }
  });

  tabList.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    const currentIndex = tabs.indexOf(document.activeElement);
    if (currentIndex < 0) return;
    event.preventDefault();
    let nextIndex = currentIndex;
    if (event.key === "ArrowLeft") nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % tabs.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = tabs.length - 1;
    tabs[nextIndex].focus();
    tabs[nextIndex].click();
  });
}

export function markSelectedChoice(button) {
  const group = button.closest(".mini-actions");
  if (!group) return;
  group.querySelectorAll("[data-pick]").forEach((candidate) => {
    candidate.setAttribute("aria-pressed", String(candidate === button));
  });
}
