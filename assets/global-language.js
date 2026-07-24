(() => {
  const DESIGN_WIDTH = 1672;
  const DESIGN_HEIGHT = 941;
  const DESIGN_RIGHT = 76;
  const DESIGN_TOP = 48;

  function placeLanguageControl(control) {
    const scale = Math.max(
      window.innerWidth / DESIGN_WIDTH,
      window.innerHeight / DESIGN_HEIGHT
    );
    const stageLeft = (window.innerWidth - DESIGN_WIDTH * scale) / 2;
    const stageTop = (window.innerHeight - DESIGN_HEIGHT * scale) / 2;
    const right = window.innerWidth -
      (stageLeft + (DESIGN_WIDTH - DESIGN_RIGHT) * scale);
    const top = stageTop + DESIGN_TOP * scale;

    control.style.setProperty("right", `${right}px`, "important");
    control.style.setProperty("top", `${top}px`, "important");
    control.style.setProperty("transform", `scale(${scale})`, "important");
    control.style.setProperty("transform-origin", "top right", "important");
  }

  function initializeLanguageControl() {
    const control = document.querySelector(".language-fixed");
    if (!control) return;

    const originalHeader = control.closest(".header");
    if (originalHeader) originalHeader.classList.add("has-fixed-language");

    document.body.appendChild(control);
    placeLanguageControl(control);
    window.addEventListener("resize", () => placeLanguageControl(control), {
      passive: true
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeLanguageControl, {
      once: true
    });
  } else {
    initializeLanguageControl();
  }
})();
