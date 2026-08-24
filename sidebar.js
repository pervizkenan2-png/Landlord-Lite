document.addEventListener("DOMContentLoaded", function () {
    const sidebar = document.querySelector(".sidebar");

    if (!sidebar) return;

    // Bereich ganz unten erstellen
    let bottom = sidebar.querySelector(".sidebar-bottom");

    if (!bottom) {
        bottom = document.createElement("div");
        bottom.className = "sidebar-bottom";
        sidebar.appendChild(bottom);
    }

    // Support hinzufügen, falls noch nicht vorhanden
    if (!sidebar.querySelector('a[href="support.html"]')) {
        const support = document.createElement("a");
        support.href = "support.html";
        support.className = "bottom-link";
        support.innerHTML = "<span>❓</span><span>Support</span>";
        bottom.appendChild(support);
    }

    // Kontoeinstellungen hinzufügen, falls noch nicht vorhanden
    if (!sidebar.querySelector('a[href="account.html"]')) {
        const account = document.createElement("a");
        account.href = "account.html";
        account.className = "bottom-link";
        account.innerHTML = "<span>⚙️</span><span>Kontoeinstellungen</span>";
        bottom.appendChild(account);
    }


    // Handy-Menü
    let menuButton = document.querySelector(".mobile-menu-btn");

    if (!menuButton) {
        menuButton = document.createElement("button");
        menuButton.type = "button";
        menuButton.className = "mobile-menu-btn";
        menuButton.innerHTML = "<span></span><span></span><span></span>";
        document.body.appendChild(menuButton);
    }

    let overlay = document.querySelector(".sidebar-overlay");

    if (!overlay) {
        overlay = document.createElement("div");
        overlay.className = "sidebar-overlay";
        document.body.appendChild(overlay);
    }

    function closeMenu() {
        sidebar.classList.remove("open");
        menuButton.classList.remove("open");
        overlay.classList.remove("open");
        document.body.style.overflow = "";
    }

    menuButton.addEventListener("click", function () {
        const isOpen = sidebar.classList.toggle("open");

        menuButton.classList.toggle("open", isOpen);
        overlay.classList.toggle("open", isOpen);

        document.body.style.overflow = isOpen ? "hidden" : "";
    });

    overlay.addEventListener("click", closeMenu);
});