const toast = document.getElementById("toast");
const languageBox = document.getElementById("languageBox");
const languageButton = document.getElementById("languageButton");
const languageText = document.getElementById("languageText");

const labels = {
  "zh-CN": "简体中文",
  "zh-TW": "繁體中文",
  en: "English",
  ja: "日本語"
};

const texts = {
  "zh-CN": {
    brand: "星爪纪念花园",
    title1: "让想念，",
    title2: "有一个安静的地方",
    subtitle: "为离开的爱宠，留下一处可以回来看望的纪念花园。",
    enter: "进入纪念园",
    create: "开始创建",
    saved: "语言已保存",
    noMemorial: "还没有创建纪念，先去创建页面。"
  },
  "zh-TW": {
    brand: "星爪紀念花園",
    title1: "讓想念，",
    title2: "有一個安靜的地方",
    subtitle: "為離開的愛寵，留下一處可以回來看望的紀念花園。",
    enter: "進入紀念園",
    create: "開始建立",
    saved: "語言已保存",
    noMemorial: "還沒有建立紀念，先去建立頁面。"
  },
  en: {
    brand: "Starpaw Memorial Garden",
    title1: "Let remembrance",
    title2: "have a quiet place",
    subtitle: "Create a peaceful memorial garden you can return to for the pet you loved.",
    enter: "Enter Garden",
    create: "Create Memorial",
    saved: "Language saved",
    noMemorial: "No memorial yet. Opening the creation page."
  },
  ja: {
    brand: "星爪メモリアルガーデン",
    title1: "想いが、",
    title2: "静かに帰る場所",
    subtitle: "旅立ったペットのために、また会いに来られる記念の庭を残します。",
    enter: "記念園へ",
    create: "作成する",
    saved: "言語を保存しました",
    noMemorial: "まだ記念ページがありません。作成ページへ移動します。"
  }
};

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 1600);
}

function applyLanguage(lang) {
  const copy = texts[lang] || texts["zh-CN"];

  document.querySelectorAll("[data-i18n]").forEach((item) => {
    const key = item.dataset.i18n;
    if (copy[key]) {
      item.textContent = copy[key];
    }
  });

  languageText.textContent = labels[lang] || labels["zh-CN"];

  document.querySelectorAll(".language-option").forEach((button) => {
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
  const copy = texts[lang] || texts["zh-CN"];

  if (hasSavedMemorial()) {
    window.location.href = "cemetery.html";
    return;
  }

  showToast(copy.noMemorial);

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

document.querySelectorAll(".language-option").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.stopPropagation();

    const lang = button.dataset.lang;
    localStorage.setItem("petMemorialLanguage", lang);
    applyLanguage(lang);
    languageBox.classList.remove("open");

    const copy = texts[lang] || texts["zh-CN"];
    showToast(copy.saved);
  });
});

document.addEventListener("click", () => {
  languageBox.classList.remove("open");
});

const savedLanguage = localStorage.getItem("petMemorialLanguage") || "zh-CN";
applyLanguage(savedLanguage);
