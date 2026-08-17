document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.querySelector(".sidebar");

  if (!sidebar) return;

  // =====================================================
  // SUPPORT + KONTOEINSTELLUNGEN AUF JEDER SEITE ERGÄNZEN
  // =====================================================

  const hasSupport = sidebar.querySelector('a[href="support.html"]');
  const hasAccount = sidebar.querySelector('a[href="account.html"]');

  // Gemeinsamen unteren Bereich suchen
  let sidebarBottom = sidebar.querySelector(".sidebar-bottom");

  // Falls die Seite noch keinen unteren Bereich besitzt:
  if (!sidebarBottom) {
    sidebarBottom = document.createElement("div");
    sidebarBottom.className = "sidebar-bottom";
    sidebar.appendChild(sidebarBottom);
  }

  // Support nur ergänzen, wenn noch nicht vorhanden
  if (!hasSupport) {
    const supportLink = document.createElement("a");
    supportLink.href = "support.html";
    supportLink.className = "bottom-link";
    supportLink.textContent = "Support";

    sidebarBottom.appendChild(supportLink);
  }

  // Kontoeinstellungen nur ergänzen, wenn noch nicht vorhanden
  if (!hasAccount) {
    const accountLink = document.createElement("a");
    accountLink.href = "account.html";
    accountLink.className = "bottom-link";
    accountLink.textContent = "Kontoeinstellungen";

    sidebarBottom.appendChild(accountLink);
  }

  // =====================================================
  // MOBILE MENÜ
  // =====================================================

  // Verhindert doppelten Menü-Button
  const oldButton = document.querySelector(".mobile-menu-btn");
  if (oldButton) {
    oldButton.remove();
  }

  const oldOverlay = document.querySelector(".sidebar-overlay");
  if (oldOverlay) {
    oldOverlay.remove();
  }

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

  // =====================================================
  // MENÜ ÖFFNEN
  // =====================================================

  function openMenu() {
    sidebar.classList.add("open");
    menuButton.classList.add("open");
    overlay.classList.add("open");

    menuButton.setAttribute("aria-expanded", "true");
    menuButton.setAttribute("aria-label", "Menü schließen");

    document.body.style.overflow = "hidden";
  }

  // =====================================================
  // MENÜ SCHLIESSEN
  // =====================================================

  function closeMenu() {
    sidebar.classList.remove("open");
    menuButton.classList.remove("open");
    overlay.classList.remove("open");

    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Menü öffnen");

    document.body.style.overflow = "";
  }

  // =====================================================
  // MENÜ UMSCHALTEN
  // =====================================================

  function toggleMenu() {
    if (sidebar.classList.contains("open")) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  menuButton.addEventListener("click", toggleMenu);

  overlay.addEventListener("click", closeMenu);

  // =====================================================
  // LINK ANGEKLICKT -> MENÜ SCHLIESSEN
  // =====================================================

  sidebar.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // =====================================================
  // ESC -> MENÜ SCHLIESSEN
  // =====================================================

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  // =====================================================
  // HANDY -> DESKTOP
  // =====================================================

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      closeMenu();
    }
  });
});