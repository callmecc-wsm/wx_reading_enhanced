const PAGES = [
  [
    "（第 1 页）在我们家乡的方言中，“过日子”被称为“过响”。我大概五岁的时候，总是听着大人们讨论这些词，却并不理解其中的重量。",
    "（第 1 页）在日常生活中，总是有一些司空见惯的词汇和说法，我们从不去思考背后的意义，直到有一天被迫停下来回望。",
    "（第 1 页）因此，面对那么多乡亲的悲惨故事，我一直以为那只是别人家的命运，直到慢慢意识到，每一个个体都是那段历史的一部分。"
  ],
  [
    "（第 2 页）后来我开始做田野调查，真正走进这些故事的源头。许多长辈并不觉得这些经历有什么特别，只是平静地讲述。",
    "（第 2 页）我发现，对他们来说，最重要的并不是“是否被记住”，而是“能否好好把当下的日子过下去”。",
    "（第 2 页）在这些访谈中，“过响”这个词被一次次提起，它不再只是童年记忆里的模糊声音，而是与具体人、具体生活紧紧绑在一起的线索。"
  ],
  [
    "（第 3 页）当我重新翻回这些记录时，才意识到自己早已被这些故事改变了。它们悄悄塑造了我看待世界的方式。",
    "（第 3 页）也正因如此，我更希望找到一种“寻宝式”的阅读方式，在庞杂的信息中主动寻找对自己真正重要的片段。",
    "（第 3 页）这就是这个多列阅读原型想要验证的：如果我们能一眼看到更多内容，是否就更容易抓住那些值得停下来的句子。"
  ]
];

const contentEl = document.getElementById("content");
const pageIndicatorEl = document.getElementById("page-indicator");
const readerEl = document.getElementById("reader");
const pluginBtn = document.getElementById("plugin-btn");
const popover = document.getElementById("popover");
const modeButtons = Array.from(document.querySelectorAll(".mode-btn"));

let currentPage = 0;
let currentCols = 3;

function renderPage() {
  contentEl.innerHTML = "";
  PAGES[currentPage].forEach((text) => {
    const p = document.createElement("p");
    p.textContent = text;
    contentEl.appendChild(p);
  });
  pageIndicatorEl.textContent = `第 ${currentPage + 1} 页 / 共 ${PAGES.length} 页（模拟）`;
  updateFollowHighlight();
}

function setColumns(n) {
  currentCols = n;
  contentEl.style.columnCount = n;
  modeButtons.forEach((btn) => {
    const cols = Number(btn.dataset.cols);
    btn.classList.toggle("_active", cols === n);
  });
}

function changePage(delta) {
  const total = PAGES.length;
  currentPage = (currentPage + delta + total) % total;
  renderPage();
}

function setupFollowHighlight() {
  readerEl.addEventListener("scroll", () => {
    window.requestAnimationFrame(updateFollowHighlight);
  });
}

function updateFollowHighlight() {
  const paras = Array.from(contentEl.querySelectorAll("p"));
  paras.forEach((p) => p.classList.remove("_active"));

  const viewportTop = readerEl.scrollTop;
  const viewportBottom = viewportTop + readerEl.clientHeight;

  for (const p of paras) {
    const top = p.offsetTop;
    const bottom = top + p.offsetHeight;
    if (bottom > viewportTop && top < viewportBottom) {
      p.classList.add("_active");
      break;
    }
  }
}

function togglePopover() {
  popover.style.display = popover.style.display === "block" ? "none" : "block";
}

function hidePopover() {
  popover.style.display = "none";
}

// 事件绑定

document.getElementById("prev-page").addEventListener("click", () => changePage(-1));
document.getElementById("next-page").addEventListener("click", () => changePage(1));

pluginBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  togglePopover();
});

modeButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const cols = Number(btn.dataset.cols);
    setColumns(cols);
  });
});

document.addEventListener("click", (e) => {
  if (!popover.contains(e.target) && e.target !== pluginBtn) {
    hidePopover();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") hidePopover();
});

renderPage();
setColumns(currentCols);
setupFollowHighlight();
