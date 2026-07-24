(() => {
  const DESIGN_WIDTH = 1672;
  const DESIGN_HEIGHT = 941;
  const DESIGN_RIGHT = 76;
  const DESIGN_TOP = 48;
  const LANGUAGE_WIDTH = 158;
  const CONTROL_GAP = 12;

  function layoutMetrics() {
    const scale = Math.max(
      window.innerWidth / DESIGN_WIDTH,
      window.innerHeight / DESIGN_HEIGHT
    );
    const stageLeft = (window.innerWidth - DESIGN_WIDTH * scale) / 2;
    const stageTop = (window.innerHeight - DESIGN_HEIGHT * scale) / 2;
    return { scale, stageLeft, stageTop };
  }

  function placeLanguageControl(control) {
    const { scale, stageLeft, stageTop } = layoutMetrics();
    const right = window.innerWidth -
      (stageLeft + (DESIGN_WIDTH - DESIGN_RIGHT) * scale);
    const top = stageTop + DESIGN_TOP * scale;

    control.style.setProperty("right", `${right}px`, "important");
    control.style.setProperty("top", `${top}px`, "important");
    control.style.setProperty("transform", `scale(${scale})`, "important");
    control.style.setProperty("transform-origin", "top right", "important");
  }

  function placeBackControl(control) {
    if (!control) return;
    const { scale, stageLeft, stageTop } = layoutMetrics();
    const designRight =
      DESIGN_RIGHT + LANGUAGE_WIDTH + CONTROL_GAP;
    const right = window.innerWidth -
      (stageLeft + (DESIGN_WIDTH - designRight) * scale);
    const top = stageTop + DESIGN_TOP * scale;

    control.style.setProperty("position", "fixed", "important");
    control.style.setProperty("right", `${right}px`, "important");
    control.style.setProperty("top", `${top}px`, "important");
    control.style.setProperty("left", "auto", "important");
    control.style.setProperty("transform", `scale(${scale})`, "important");
    control.style.setProperty("transform-origin", "top right", "important");
    control.style.setProperty("z-index", "79", "important");
  }

  function initializeLanguageControl() {
    const control = document.querySelector(".language-fixed");
    if (!control) return;

    const originalHeader = control.closest(".header");
    const backControl = originalHeader
      ? originalHeader.querySelector(
          '.top-actions > a.pixel-button[href="index.html"]'
        )
      : null;
    if (originalHeader) originalHeader.classList.add("has-fixed-language");

    document.body.appendChild(control);
    if (backControl) {
      backControl.classList.add("global-back-fixed");
      document.body.appendChild(backControl);
    }
    placeLanguageControl(control);
    placeBackControl(backControl);
    window.addEventListener(
      "resize",
      () => {
        placeLanguageControl(control);
        placeBackControl(backControl);
      },
      { passive: true }
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeLanguageControl, {
      once: true
    });
  } else {
    initializeLanguageControl();
  }
})();
