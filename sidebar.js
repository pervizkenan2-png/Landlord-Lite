document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.querySelector(".sidebar");

  if (!sidebar) return;

  // Menü-Button erstellen
  const menuButton = document.createElement("button");
  menuButton.className = "mobile-menu-btn";
  menuButton.setAttribute("type", "button");
  menuButton.setAttribute("aria-label", "Menü öffnen");
  menuButton.setAttribute("aria-expanded", "false");

  menuButton.innerHTML = `
    <span></span>
    <span></span>
    <span></span>
  `;

  // Dunkler Hintergrund
  const overlay = document.createElement("div");
  overlay.className = "sidebar-overlay";

  document.body.appendChild(menuButton);
  document.body.appendChild(overlay);

  function openMenu() {
    sidebar.classList.add("open");
    menuButton.classList.add("open");
    overlay.classList.add("open");

    menuButton.setAttribute("aria-expanded", "true");
    menuButton.setAttribute("aria-label", "Menü schließen");

    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    sidebar.classList.remove("open");
    menuButton.classList.remove("open");
    overlay.classList.remove("open");

    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Menü öffnen");

    document.body.style.overflow = "";
  }

  function toggleMenu() {
    if (sidebar.classList.contains("open")) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  menuButton.addEventListener("click", toggleMenu);
  overlay.addEventListener("click", closeMenu);

  // Nach Klick auf einen Link Menü schließen
  sidebar.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // ESC schließt Menü
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  // Falls vom Handy auf Desktop gewechselt wird
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      closeMenu();
    }
  });
});