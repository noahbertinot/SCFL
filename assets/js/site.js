/* SCFL site script: navigation menus, footer year, registration fallback.
   The site works without this file; it only improves keyboard, touch and
   mobile behaviour. */
(function () {
  "use strict";

  var DESKTOP = window.matchMedia("(min-width: 1040px)");
  var nav = document.querySelector(".site-nav");
  var toggle = document.querySelector(".menu-toggle");
  var buttons = Array.prototype.slice.call(document.querySelectorAll(".nav-button"));

  function closeAll(except) {
    buttons.forEach(function (b) {
      if (b !== except) b.setAttribute("aria-expanded", "false");
    });
  }

  // Mobile menu toggle
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("is-open", !open);
      if (!open) {
        // On small screens, open the section that contains the current page
        var current = document.querySelector(".nav-button.is-current");
        if (current && !DESKTOP.matches) current.setAttribute("aria-expanded", "true");
      }
    });
  }

  // Dropdown buttons
  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var open = btn.getAttribute("aria-expanded") === "true";
      if (DESKTOP.matches) closeAll(btn);
      btn.setAttribute("aria-expanded", String(!open));
    });

    btn.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown" && DESKTOP.matches) {
        e.preventDefault();
        btn.setAttribute("aria-expanded", "true");
        var first = btn.nextElementSibling && btn.nextElementSibling.querySelector("a");
        if (first) first.focus();
      }
    });

    var item = btn.parentElement;
    item.addEventListener("focusout", function (e) {
      if (DESKTOP.matches && !item.contains(e.relatedTarget)) {
        btn.setAttribute("aria-expanded", "false");
      }
    });

    // Arrow keys inside an open submenu
    var menu = btn.nextElementSibling;
    if (menu) {
      menu.addEventListener("keydown", function (e) {
        var links = Array.prototype.slice.call(menu.querySelectorAll("a"));
        var i = links.indexOf(document.activeElement);
        if (e.key === "ArrowDown") { e.preventDefault(); links[(i + 1) % links.length].focus(); }
        if (e.key === "ArrowUp") { e.preventDefault(); if (i <= 0) { btn.focus(); } else { links[i - 1].focus(); } }
      });
    }
  });

  // Escape closes the open menu and returns focus to its button
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    var open = buttons.filter(function (b) { return b.getAttribute("aria-expanded") === "true"; })[0];
    if (open) {
      open.setAttribute("aria-expanded", "false");
      open.focus();
    } else if (toggle && toggle.getAttribute("aria-expanded") === "true") {
      toggle.click();
      toggle.focus();
    }
  });

  // Click outside closes desktop menus
  document.addEventListener("click", function (e) {
    if (DESKTOP.matches && nav && !nav.contains(e.target)) closeAll(null);
  });

  // Reset state when crossing the desktop breakpoint
  var onChange = function () {
    closeAll(null);
    if (toggle) toggle.setAttribute("aria-expanded", "false");
    if (nav) nav.classList.remove("is-open");
  };
  if (DESKTOP.addEventListener) DESKTOP.addEventListener("change", onChange);
  else if (DESKTOP.addListener) DESKTOP.addListener(onChange);

  // Footer year
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  // Registration form: if no form service is connected yet, open the
  // visitor's email app with the registration filled in.
  var form = document.querySelector("form[data-mailto]");
  if (form) {
    form.addEventListener("submit", function (e) {
      var action = form.getAttribute("action") || "";
      if (action.indexOf("mailto:") !== 0) return; // a form service is connected
      e.preventDefault();
      if (!form.reportValidity()) return;
      var lines = [];
      Array.prototype.forEach.call(form.elements, function (el) {
        if (!el.name || el.type === "submit") return;
        var label = form.querySelector('label[for="' + el.id + '"]');
        var name = label ? label.textContent.replace(/\s*\*\s*$/, "").trim() : el.name;
        var value = el.tagName === "SELECT" ? el.options[el.selectedIndex].text : el.value;
        lines.push(name + ": " + (value || "—"));
      });
      var to = form.getAttribute("data-mailto");
      var subject = form.getAttribute("data-subject") || "Website enquiry";
      window.location.href = "mailto:" + to +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(lines.join("\n"));
      var done = document.getElementById("form-status");
      if (done) done.textContent = "Your email app should now be open with the registration filled in. Send the email to complete registration.";
    });
  }
})();
