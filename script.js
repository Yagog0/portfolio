/* Yago Maba | HTML, CSS e JavaScript, com recursos locais. */
(() => {
  "use strict";
  const $ = (selector) => document.querySelector(selector);
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const intro = $("#intro");
  const skipIntro = $("#skip-intro");
  const replayIntro = $("#replay-intro");
  let introTimer = 0;
  let hideTimer = 0;
  let previousFocus = null;
  let introActive = false;

  $("#year").textContent = new Date().getFullYear();

  const menuButton = $("#menu-toggle");
  const navigation = $("#navigation");
  function setMenu(open) {
    navigation.classList.toggle("is-open", open);
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  }
  menuButton.addEventListener("click", () =>
    setMenu(menuButton.getAttribute("aria-expanded") !== "true"),
  );
  navigation
    .querySelectorAll("a")
    .forEach((link) => link.addEventListener("click", () => setMenu(false)));
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".header")) setMenu(false);
  });
  window
    .matchMedia("(max-width: 760px)")
    .addEventListener("change", () => setMenu(false));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (introActive) finishIntro();
      else if (menuButton.getAttribute("aria-expanded") === "true") {
        setMenu(false);
        menuButton.focus();
      }
    }
    if (introActive && event.key === "Tab") {
      event.preventDefault();
      skipIntro.focus({ preventScroll: true });
    }
  });

  const tabs = [...document.querySelectorAll('[role="tab"]')];
  function activateTab(selected) {
    tabs.forEach((tab) => {
      const active = tab === selected;
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
      document.getElementById(tab.getAttribute("aria-controls")).hidden =
        !active;
    });
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activateTab(tab));
    tab.addEventListener("keydown", (event) => {
      let next;
      if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
      if (event.key === "ArrowLeft")
        next = (index + tabs.length - 1) % tabs.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = tabs.length - 1;
      if (next !== undefined) {
        event.preventDefault();
        activateTab(tabs[next]);
        tabs[next].focus();
      }
    });
  });

  // Uma capa por repositório: mouse, toque e teclado compartilham a seleção.
  const shelf = $("#project-shelf");
  if (shelf) {
    const slots = [...shelf.querySelectorAll(".cd-slot")];
    const touch = window.matchMedia("(hover: none), (pointer: coarse)");
    const repository = $("#shelf-repository");
    const reset = $("#shelf-reset");
    const viewport = $("#shelf-viewport");
    const total = String(slots.length).padStart(2, "0");
    $("#shelf-count").textContent = total + " CDS";
    slots.forEach((slot, index) => {
      slot.dataset.number = String(index + 1).padStart(2, "0");
      slot.querySelector(".cd-catalog").textContent = slot.dataset.number;
    });
    let selected = null;
    let keyboardMode = false;
    let scrollTimer = 0;
    let pressedSlot = null;
    let selectedBeforeTouch = false;
    function updateHint() {
      $("#shelf-hint").textContent = touch.matches
        ? "Toque na lombada para ver a capa. Depois, toque na capa ou em Abrir repositório."
        : "Passe o mouse ou use Tab para ver a capa. Clique para abrir o GitHub.";
    }
    function selectProject(slot, scroll = false) {
      if (selected !== slot) {
        selected?.classList.remove("is-selected");
        selected = slot;
        slot.classList.add("is-selected");
        $("#shelf-title").textContent = slot.dataset.title;
        $("#shelf-description").textContent = slot.dataset.description;
        $("#shelf-stack").textContent =
          slot.dataset.number + " / " + total + "  ·  " + slot.dataset.stack;
        repository.href = slot.querySelector(".cd-link").href;
        repository.setAttribute(
          "aria-label",
          "Abrir repositório de " + slot.dataset.title + " no GitHub, nova aba",
        );
        $("#shelf-link-label").textContent = "Abrir repositório";
        reset.hidden = false;
      }
      if (scroll) {
        clearTimeout(scrollTimer);
        scrollTimer = window.setTimeout(
          () => {
            if (selected === slot) {
              // Move somente a estante, sem deslocar a página durante a leitura.
              const slotBounds = slot.getBoundingClientRect();
              const viewportBounds = viewport.getBoundingClientRect();
              viewport.scrollTo({
                left: viewport.scrollLeft + slotBounds.left - viewportBounds.left
                  - (viewport.clientWidth - slotBounds.width) / 2,
                behavior: motion.matches ? "auto" : "smooth",
              });
            }
          },
          motion.matches ? 0 : 650,
        );
      }
    }
    function closeProject() {
      clearTimeout(scrollTimer);
      selected?.classList.remove("is-selected");
      selected = null;
      $("#shelf-title").textContent = "Escolha um CD.";
      $("#shelf-description").textContent =
        "Da primeira interface aos estudos de back-end, cada projeto guarda uma parte do que venho aprendendo.";
      $("#shelf-stack").textContent = total + " PROJETOS / CÓDIGO ABERTO";
      repository.href = "https://github.com/Yagog0?tab=repositories";
      repository.removeAttribute("aria-label");
      $("#shelf-link-label").textContent = "Ver todos no GitHub";
      reset.hidden = true;
    }
    document.addEventListener("keydown", () => {
      keyboardMode = true;
    });
    document.addEventListener(
      "pointerdown",
      () => {
        keyboardMode = false;
      },
      { passive: true },
    );
    slots.forEach((slot, index) => {
      const link = slot.querySelector(".cd-link");
      slot.addEventListener(
        "pointerdown",
        (event) => {
          if (event.pointerType === "touch" || event.pointerType === "pen") {
            pressedSlot = slot;
            selectedBeforeTouch = selected === slot;
          }
        },
        { passive: true },
      );
      slot.addEventListener("pointerenter", (event) => {
        if (!event.pointerType || event.pointerType === "mouse")
          selectProject(slot);
      });
      link.addEventListener("focus", () => {
        if (!touch.matches || keyboardMode) selectProject(slot, true);
      });
      link.addEventListener("click", (event) => {
        const touchClick =
          event.detail !== 0 &&
          (touch.matches ||
            event.pointerType === "touch" ||
            event.pointerType === "pen");
        const alreadySelected =
          pressedSlot === slot ? selectedBeforeTouch : selected === slot;
        pressedSlot = null;
        if (touchClick && !alreadySelected) {
          event.preventDefault();
          selectProject(slot, true);
        }
      });
      link.addEventListener("keydown", (event) => {
        let next;
        if (event.key === "ArrowRight") next = (index + 1) % slots.length;
        if (event.key === "ArrowLeft")
          next = (index + slots.length - 1) % slots.length;
        if (event.key === "Home") next = 0;
        if (event.key === "End") next = slots.length - 1;
        if (next !== undefined) {
          event.preventDefault();
          selectProject(slots[next], true);
          slots[next].querySelector(".cd-link").focus({ preventScroll: true });
        }
      });
    });
    reset.addEventListener("click", () => {
      closeProject();
      viewport.focus({ preventScroll: true });
    });
    function stepProject(direction) {
      const index = slots.indexOf(selected);
      const next = index < 0
        ? (direction > 0 ? 0 : slots.length - 1)
        : (index + direction + slots.length) % slots.length;
      selectProject(slots[next], true);
    }
    if (slots.length) {
      $("#shelf-previous").hidden = false;
      $("#shelf-next").hidden = false;
      $("#shelf-previous").addEventListener("click", () => stepProject(-1));
      $("#shelf-next").addEventListener("click", () => stepProject(1));
      selectProject(slots[0]);
    }
    shelf.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeProject();
    });
    touch.addEventListener("change", updateHint);
    updateHint();
    shelf.classList.add("shelf-ready");
  }

  $("#copy-email").addEventListener("click", async () => {
    const email = "yagomaba22@hotmail.com";
    let copied = false;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(email);
        copied = true;
      }
    } catch {
      /* Usa a alternativa local se o navegador bloquear a API. */
    }
    if (!copied) {
      const input = document.createElement("textarea");
      input.value = email;
      input.readOnly = true;
      input.style.cssText = "position:fixed;left:-9999px;top:0;opacity:0";
      document.body.append(input);
      input.select();
      try {
        copied = document.execCommand("copy");
      } catch {
        copied = false;
      }
      input.remove();
      $("#copy-email").focus({ preventScroll: true });
    }
    $("#copy-status").textContent = copied
      ? "E-mail copiado."
      : "Selecione o endereço para copiar ou clique para enviar um e-mail.";
  });

  if ("IntersectionObserver" in window && !motion.matches) {
    const observer = new IntersectionObserver(
      (entries, target) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            target.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 },
    );
    document
      .querySelectorAll(".reveal")
      .forEach((element) => observer.observe(element));
    document.body.classList.add("motion-ready");
  }

  function finishIntro() {
    if (!introActive) return;
    introActive = false;
    clearTimeout(introTimer);
    intro.classList.add("is-exiting");
    skipIntro.hidden = true;
    document.body.classList.remove("intro-playing");
    document.querySelector("main").inert = false;
    document.querySelector("header").inert = false;
    document.querySelector("footer").inert = false;
    if (previousFocus && previousFocus !== document.body)
      previousFocus.focus({ preventScroll: true });
    hideTimer = window.setTimeout(() => {
      intro.hidden = true;
    }, 850);
    try {
      window.sessionStorage.setItem("yago-intro-cinematic", "1");
    } catch {
      /* O site também funciona sem armazenamento. */
    }
  }

  function playIntro() {
    if (motion.matches) return;
    clearTimeout(hideTimer);
    clearTimeout(introTimer);
    previousFocus = document.activeElement;
    window.scrollTo({ top: 0, behavior: "instant" });
    intro.hidden = true;
    intro.classList.remove("is-exiting");
    void intro.offsetWidth;
    intro.hidden = false;
    introActive = true;
    document.body.classList.add("intro-playing");
    document.querySelector("main").inert = true;
    document.querySelector("header").inert = true;
    document.querySelector("footer").inert = true;
    skipIntro.hidden = false;
    skipIntro.focus({ preventScroll: true });
    introTimer = window.setTimeout(finishIntro, 2100);
  }
  skipIntro.addEventListener("click", finishIntro);
  replayIntro.addEventListener("click", playIntro);

  replayIntro.hidden = motion.matches;
  motion.addEventListener("change", () => {
    replayIntro.hidden = motion.matches;
    if (motion.matches) {
      finishIntro();
      document.body.classList.remove("motion-ready");
    }
  });
  let introSeen = false;
  try {
    introSeen = window.sessionStorage.getItem("yago-intro-cinematic") === "1";
  } catch {
    /* Armazenamento opcional. */
  }
  if (
    !introSeen &&
    !motion.matches &&
    (!window.location.hash || window.location.hash === "#inicio")
  )
    playIntro();
})();
