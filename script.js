const stage = document.getElementById("stage");
const toast = document.getElementById("toast");
const languageBox = document.getElementById("languageBox");
const languageButton = document.getElementById("languageButton");

const brandImage = document.getElementById("brandImage");
const heroImage = document.getElementById("heroImage");
const enterImage = document.getElementById("enterImage");
const createImage = document.getElementById("createImage");
const languageImage = document.getElementById("languageImage");

const version = "pixel-button-fixed-1";

const assetMap = {
  "zh-CN": {
    key: "zh_CN",
    saved: "语言已保存",
    noMemorial: "还没有创建纪念，先去创建页面。"
  },
  "zh-TW": {
    key: "zh_TW",
    saved: "語言已保存",
    noMemorial: "還沒有建立紀念，先去建立頁面。"
  },
  en: {
    key: "en",
    saved: "Language saved",
    noMemorial: "No memorial yet. Opening the creation page."
  },
  ja: {
    key: "ja",
    saved: "言語を保存しました",
    noMemorial: "まだ記念ページがありません。作成ページへ移動します。"
  }
};

function resizeStage() {
  const scale = Math.max(window.innerWidth / 1672, window.innerHeight / 941);
  stage.style.transform = `translate(-50%, -50%) scale(${scale})`;
}

window.addEventListener("resize", resizeStage);
resizeStage();

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 1500);
}

function applyLanguage(lang) {
  const data = assetMap[lang] || assetMap["zh-CN"];
  const key = data.key;

  brandImage.src = `assets/brand_${key}.png?v=${version}`;
  heroImage.src = `assets/hero_${key}.png?v=${version}`;
  enterImage.src = `assets/button_enter_${key}.png?v=${version}`;
  createImage.src = `assets/button_create_${key}.png?v=${version}`;
  languageImage.src = `assets/language_${key}.png?v=${version}`;

  document.querySelectorAll(".language-menu button").forEach((button) => {
    button.classList.toggle("active", button.dataset.lang === lang);
  });
}

function hasSavedMemorial() {
  try {
    const draft = JSON.parse(localStorage.getItem("petMemorialDraft"));
    return Boolean(draft && draft.petName);
  } catch (error) {
    return false;
  }
}

function openGarden() {
  const lang = localStorage.getItem("petMemorialLanguage") || "zh-CN";
  const data = assetMap[lang] || assetMap["zh-CN"];

  if (hasSavedMemorial()) {
    window.location.href = "cemetery.html";
    return;
  }

  showToast(data.noMemorial);

  setTimeout(() => {
    window.location.href = "create.html";
  }, 700);
}

document.getElementById("enterGarden").addEventListener("click", openGarden);

document.getElementById("createMemorial").addEventListener("click", () => {
  window.location.href = "create.html";
});

languageButton.addEventListener("click", (event) => {
  event.stopPropagation();
  languageBox.classList.toggle("open");
});

document.querySelectorAll(".language-menu button").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.stopPropagation();

    const lang = button.dataset.lang;
    localStorage.setItem("petMemorialLanguage", lang);
    applyLanguage(lang);
    languageBox.classList.remove("open");

    const data = assetMap[lang] || assetMap["zh-CN"];
    showToast(data.saved);
  });
});

document.addEventListener("click", () => {
  languageBox.classList.remove("open");
});

if (localStorage.getItem("starpawHomeVersion") !== version) {
  localStorage.setItem("starpawHomeVersion", version);
  localStorage.setItem("petMemorialLanguage", "zh-CN");
}

const savedLanguage = localStorage.getItem("petMemorialLanguage") || "zh-CN";
applyLanguage(savedLanguage);
