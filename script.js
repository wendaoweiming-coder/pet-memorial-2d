const STORAGE_KEY = "petMemorial2dData";
const LETTERS_KEY = "petMemorial2dLetters";
const PETALS_KEY = "petMemorial2dPetals";

let memorialData = {
  name: "墨墨",
  type: "cat",
  birthDate: "2012-03-15",
  deathDate: "2024-05-20",
  personality: "gentle",
  theme: "night",
  image: "",
  epitaph: "你用一生的陪伴\n把平凡的日子\n变成了永恒的温柔",
  story: "还没有写下回忆。"
};

let letters = [];
let petalCount = 0;
let pendingImage = "";

const sections = {
  home: document.getElementById("homeSection"),
  create: document.getElementById("createSection"),
  memorial: document.getElementById("memorialSection"),
  letters: document.getElementById("lettersSection"),
  gallery: document.getElementById("gallerySection")
};

const memorialForm = document.getElementById("memorialForm");
const petImageInput = document.getElementById("petImage");

const previewPhoto = document.getElementById("previewPhoto");
const previewName = document.getElementById("previewName");
const previewDate = document.getElementById("previewDate");
const previewEpitaph = document.getElementById("previewEpitaph");

const stonePhoto = document.getElementById("stonePhoto");
const stoneName = document.getElementById("stoneName");
const stoneDates = document.getElementById("stoneDates");
const stoneEpitaph = document.getElementById("stoneEpitaph");

const cardName = document.getElementById("cardName");
const cardDates = document.getElementById("cardDates");
const cardText = document.getElementById("cardText");

const petSpirit = document.getElementById("petSpirit");
const petSymbol = document.getElementById("petSymbol");
const petalGround = document.getElementById("petalGround");

const petalButton = document.getElementById("petalButton");
const petalCountEl = document.getElementById("petalCount");

const letterButton = document.getElementById("letterButton");
const letterCountEl = document.getElementById("letterCount");
const letterModal = document.getElementById("letterModal");
const closeLetterModal = document.getElementById("closeLetterModal");
const cancelLetterButton = document.getElementById("cancelLetterButton");
const saveLetterButton = document.getElementById("saveLetterButton");
const letterInput = document.getElementById("letterInput");
const lettersList = document.getElementById("lettersList");

const storyButton = document.getElementById("storyButton");
const storyDisplay = document.getElementById("storyDisplay");
const petButton = document.getElementById("petButton");

const startCreateButton = document.getElementById("startCreateButton");
const viewMemorialButton = document.getElementById("viewMemorialButton");
const resetButton = document.getElementById("resetButton");
const toast = document.getElementById("toast");

function init() {
  loadData();
  applyMemorialData();
  renderLetters();
  renderPetals();
  showOnly("home");

  bindEvents();
}

function bindEvents() {
  document.querySelectorAll(".nav-link").forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.target;
      showOnly(target);
    });
  });

  startCreateButton.addEventListener("click", () => {
    fillForm();
    showOnly("create");
  });

  viewMemorialButton.addEventListener("click", () => {
    showOnly("memorial");
  });

  resetButton.addEventListener("click", () => {
    const ok = window.confirm("确定要重新创建吗？当前页面保存的数据会被清空。");
    if (!ok) return;

    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(LETTERS_KEY);
    localStorage.removeItem(PETALS_KEY);

    memorialData = {
      name: "墨墨",
      type: "cat",
      birthDate: "2012-03-15",
      deathDate: "2024-05-20",
      personality: "gentle",
      theme: "night",
      image: "",
      epitaph: "你用一生的陪伴\n把平凡的日子\n变成了永恒的温柔",
      story: "还没有写下回忆。"
    };

    letters = [];
    petalCount = 0;
    pendingImage = "";

    applyMemorialData();
    renderLetters();
    renderPetals();
    fillForm();
    showOnly("create");
    showToast("已经清空，可以重新创建。");
  });

  petImageInput.addEventListener("change", handleImageUpload);

  memorialForm.addEventListener("submit", (event) => {
    event.preventDefault();
    saveFormData();
    showOnly("memorial");
    showToast("纪念页已经生成。");
  });

  petalButton.addEventListener("click", () => {
    petalCount += 1;
    localStorage.setItem(PETALS_KEY, String(petalCount));
    petalCountEl.textContent = petalCount;
    createFallingPetal();
    showToast("一片花瓣落在了这里。");
  });

  letterButton.addEventListener("click", openLetterModal);
  closeLetterModal.addEventListener("click", closeModal);
  cancelLetterButton.addEventListener("click", closeModal);
  saveLetterButton.addEventListener("click", saveLetter);

  letterModal.addEventListener("click", (event) => {
    if (event.target === letterModal) {
      closeModal();
    }
  });

  storyButton.addEventListener("click", () => {
    showOnly("gallery");
  });

  petButton.addEventListener("click", callPet);
  petSpirit.addEventListener("click", callPet);
}

function showOnly(name) {
  Object.values(sections).forEach((section) => {
    section.classList.add("hidden");
  });

  if (sections[name]) {
    sections[name].classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function loadData() {
  const savedData = localStorage.getItem(STORAGE_KEY);
  const savedLetters = localStorage.getItem(LETTERS_KEY);
  const savedPetals = localStorage.getItem(PETALS_KEY);

  if (savedData) {
    try {
      memorialData = JSON.parse(savedData);
    } catch (error) {
      console.warn("纪念页数据读取失败。");
    }
  }

  if (savedLetters) {
    try {
      letters = JSON.parse(savedLetters);
    } catch (error) {
      letters = [];
    }
  }

  if (savedPetals) {
    petalCount = Number(savedPetals) || 0;
  }
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(memorialData));
}

function fillForm() {
  document.getElementById("petName").value = memorialData.name || "";
  document.getElementById("petType").value = memorialData.type || "cat";
  document.getElementById("birthDate").value = memorialData.birthDate || "";
  document.getElementById("deathDate").value = memorialData.deathDate || "";
  document.getElementById("petPersonality").value = memorialData.personality || "gentle";
  document.getElementById("themeTone").value = memorialData.theme || "night";
  document.getElementById("epitaph").value = memorialData.epitaph || "";
  document.getElementById("story").value = memorialData.story === "还没有写下回忆。" ? "" : memorialData.story || "";
}

function saveFormData() {
  const name = document.getElementById("petName").value.trim() || "未命名";
  const type = document.getElementById("petType").value;
  const birthDate = document.getElementById("birthDate").value;
  const deathDate = document.getElementById("deathDate").value;
  const personality = document.getElementById("petPersonality").value;
  const theme = document.getElementById("themeTone").value;
  const epitaph = document.getElementById("epitaph").value.trim() || "谢谢你来过我的生命。";
  const story = document.getElementById("story").value.trim() || "还没有写下回忆。";

  memorialData = {
    name,
    type,
    birthDate,
    deathDate,
    personality,
    theme,
    image: pendingImage || memorialData.image || "",
    epitaph,
    story
  };

  saveData();
  applyMemorialData();
}

function handleImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function () {
    pendingImage = reader.result;
    setPhoto(previewPhoto, pendingImage, getPetFallback(memorialData.type));
    showToast("照片已选择，生成纪念页后会保存。");
  };

  reader.readAsDataURL(file);
}

function applyMemorialData() {
  const name = memorialData.name || "未命名";
  const dateText = getDateText(memorialData.birthDate, memorialData.deathDate);
  const epitaphText = memorialData.epitaph || "谢谢你来过我的生命。";
  const fallback = getPetFallback(memorialData.type);

  previewName.textContent = name;
  previewDate.textContent = dateText;
  previewEpitaph.innerHTML = textToLines(epitaphText);
  setPhoto(previewPhoto, memorialData.image, fallback);

  stoneName.textContent = name;
  stoneDates.textContent = dateText;
  stoneEpitaph.innerHTML = textToLines(epitaphText);
  setPhoto(stonePhoto, memorialData.image, fallback);

  cardName.textContent = name;
  cardDates.textContent = dateText;
  cardText.textContent = getCardText(memorialData.personality);

  storyDisplay.textContent = memorialData.story || "还没有写下回忆。";
  petSymbol.textContent = getPetSymbol(memorialData.type);

  applyTheme(memorialData.theme);
  petalCountEl.textContent = petalCount;
  letterCountEl.textContent = letters.length;
}

function setPhoto(container, image, fallback) {
  if (!container) return;

  if (image) {
    container.innerHTML = `<img src="${image}" alt="宠物照片">`;
  } else {
    container.innerHTML = `<span>${fallback}</span>`;
  }
}

function getDateText(birthDate, deathDate) {
  const birth = formatDate(birthDate) || "未知";
  const death = formatDate(deathDate) || "未知";
  return `${birth} — ${death}`;
}

function formatDate(value) {
  if (!value) return "";
  return value.replaceAll("-", ".");
}

function textToLines(text) {
  return escapeHTML(text).replaceAll("\n", "<br>");
}

function escapeHTML(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getPetFallback(type) {
  const map = {
    cat: "🐈",
    dog: "🐕",
    rabbit: "🐇",
    bird: "🕊️",
    hamster: "🐹",
    other: "🐾"
  };

  return map[type] || "🐾";
}

function getPetSymbol(type) {
  const map = {
    cat: "🐈",
    dog: "🐕",
    rabbit: "🐇",
    bird: "🕊️",
    hamster: "🐹",
    other: "🐾"
  };

  return map[type] || "🐾";
}

function getCardText(personality) {
  const name = memorialData.name || "它";

  const map = {
    gentle: `${name}还在这个安静的地方，像从前一样，温柔地陪着你。`,
    lively: `${name}好像还在花园里跑来跑去，等你轻轻叫它的名字。`,
    proud: `${name}还是那个有点高冷的小家伙，只是把想念藏得很轻。`,
    brave: `${name}一直很勇敢，也把很多温暖留在了你的生命里。`,
    sleepy: `${name}像从前一样，在月光下面安静地睡着。`
  };

  return map[personality] || `${name}还在这个安静的地方，被想念，也被温柔地记住。`;
}

function applyTheme(theme) {
  document.body.classList.remove("theme-warm", "theme-green", "theme-sakura");

  if (theme === "warm") {
    document.body.classList.add("theme-warm");
  }

  if (theme === "green") {
    document.body.classList.add("theme-green");
  }

  if (theme === "sakura") {
    document.body.classList.add("theme-sakura");
  }
}

function renderPetals() {
  petalGround.innerHTML = "";
  petalCountEl.textContent = petalCount;

  const visiblePetals = Math.min(petalCount, 32);

  for (let i = 0; i < visiblePetals; i += 1) {
    createSettledPetal();
  }
}

function createFallingPetal() {
  const petal = document.createElement("div");
  petal.className = "petal";

  const startLeft = random(15, 85);
  const settleLeft = random(18, 62);
  const settleBottom = random(82, 165);
  const rotate = random(-60, 160);

  petal.style.left = `${startLeft}%`;
  petal.style.top = "-30px";
  petal.style.animationDuration = `${random(2400, 3400)}ms`;

  petalGround.appendChild(petal);

  petal.addEventListener("animationend", () => {
    petal.style.animation = "none";
    petal.style.top = "auto";
    petal.style.left = `${settleLeft}%`;
    petal.style.bottom = `${settleBottom}px`;
    petal.style.transform = `rotate(${rotate}deg)`;
  });

  while (petalGround.children.length > 42) {
    petalGround.removeChild(petalGround.firstElementChild);
  }
}

function createSettledPetal() {
  const petal = document.createElement("div");
  petal.className = "petal";

  petal.style.animation = "none";
  petal.style.left = `${random(18, 64)}%`;
  petal.style.top = "auto";
  petal.style.bottom = `${random(82, 165)}px`;
  petal.style.transform = `rotate(${random(-80, 160)}deg)`;
  petal.style.opacity = `${random(55, 95) / 100}`;

  petalGround.appendChild(petal);
}

function openLetterModal() {
  letterInput.value = "";
  letterModal.classList.remove("hidden");
  setTimeout(() => {
    letterInput.focus();
  }, 80);
}

function closeModal() {
  letterModal.classList.add("hidden");
}

function saveLetter() {
  const text = letterInput.value.trim();

  if (!text) {
    showToast("先写一句话再保存。");
    return;
  }

  const letter = {
    text,
    time: new Date().toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    })
  };

  letters.unshift(letter);
  localStorage.setItem(LETTERS_KEY, JSON.stringify(letters));

  renderLetters();
  closeModal();
  showToast("留言已经留下。");
}

function renderLetters() {
  letterCountEl.textContent = letters.length;

  if (!letters.length) {
    lettersList.innerHTML = `<div class="empty-note">还没有留言。</div>`;
    return;
  }

  lettersList.innerHTML = letters
    .map((letter) => {
      return `
        <div class="letter-item">
          ${escapeHTML(letter.text).replaceAll("\n", "<br>")}
          <span class="letter-time">${escapeHTML(letter.time)}</span>
        </div>
      `;
    })
    .join("");
}

function callPet() {
  const name = memorialData.name || "它";
  const messages = [
    `${name}好像听见了你的声音。`,
    `${name}轻轻靠近了一点。`,
    `月光里，${name}安静地看着你。`,
    `${name}还在这里。`
  ];

  petSpirit.animate(
    [
      { transform: "translateY(0) scale(1)" },
      { transform: "translateY(-18px) scale(1.08)" },
      { transform: "translateY(0) scale(1)" }
    ],
    {
      duration: 900,
      easing: "ease-in-out"
    }
  );

  showToast(messages[random(0, messages.length - 1)]);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.remove("hidden");

  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    toast.classList.add("hidden");
  }, 2200);
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

init();
