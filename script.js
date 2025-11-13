const PAGES = [
  [
    "在开始阅读之前，先想清楚自己希望从书中得到什么，这会让后续的筛选更高效。",
    "把章节当作地标而非必须经过的站点，必要时可以跨章节寻找同一主题的线索。",
    "非虚构作品往往夹杂大量背景信息，建立自己的问题清单就能迅速判断段落价值。",
    "若遇到作者提供的数据或案例，先记录关键词，再决定是否需要深挖原始来源。",
    "阅读速度不等于理解深度，放慢速度的瞬间通常意味着你找到了值得思考的角落。",
    "将每一页视为信息面板，把重点段落像贴纸一样标记在脑海中，方便回顾。",
    "当注意力开始游离时，试着切换列数或翻页，保持阅读节奏的新鲜感。",
    "阅读结束前，快速回望本页的高亮段落，总结此轮扫读的收获。"
  ],
  [
    "第二页聚焦于构建自己的判断系统，它比单纯记笔记更能帮助我们留住洞察。",
    "遇到观点冲突时，不必急于站队，先描摹双方逻辑链条，再决定站在哪一列。",
    "当一个段落连续三句都没有触动你，就大胆跳过，它可能只是情绪化的铺垫。",
    "将阅读器切换到双列模式，你的大脑会自动以更宽的视野扫描信息。",
    "倘若某个段落被高亮，却仍看不出价值，说明你需要重新定义筛选标准。",
    "试着用一句话概括当前列的主题，这个动作能逼迫我们把模糊感捏成具体概念。",
    "将相关段落在脑内连接成链，能帮助你在下一次翻页时更快定位有用信息。",
    "维持一种“随时可以停下整理”的心态，而不是被线性翻页牵着走。"
  ],
  [
    "第三页提供一些实操技巧，帮助你把阅读变成迭代式探索。",
    "先粗略浏览整页，锁定三个最想搞懂的问题，再用 Follow 高亮追踪答案。",
    "当视线在多列间穿梭时，让手指轻触方向键，模拟真实翻页时的节奏。",
    "给自己设定“黄金段落”上限，例如每页不超过五处，逼迫大脑做出取舍。",
    "若某段落出现密集数字或引用，先截图保存，稍后再回到上下文核对。",
    "为不同主题设计颜色标签，即使在 Demo 里也可以想象自己正在整理素材。",
    "保持设备亮度和对比度舒适，柔和的背景能延长你的高效阅读时间。",
    "扫描结束后，利用空白卡片写下此页的反直觉发现，形成自己的知识索引。"
  ],
  [
    "第四页提醒你，任何工具的价值都来自于刻意练习，而非一次性的惊艳体验。",
    "将微信读书视为素材矿井，而这款插件就是你的多列探照灯。",
    "通过持续调整列宽、翻页节奏、高亮策略，你会逐渐摸索出最顺手的寻宝方式。",
    "阅读的目标不是收集所有信息，而是精准捕捉那些能改变决策的洞见。",
    "当你能在几分钟内概述作者的主线，你就拥有了重新组织信息的主动权。",
    "别忘了时常回到单列模式，确保自己仍能沉浸式体验文字的力量。",
    "最终，这种多列扫读的技能会迁移到其他媒介，成为你的思考基建。"
  ]
];

const readerContent = document.getElementById("readerContent");
const readerMain = document.getElementById("readerMain");
const pageIndicator = document.getElementById("pageIndicator");
const modeButtons = document.querySelectorAll(".mode-option");
const fab = document.getElementById("fab");
const popover = document.getElementById("readingPopover");
const pageControlButtons = document.querySelectorAll(".page-controls button");

let currentPage = 0;
let currentColumns = 3;
let popoverOpen = false;
let followScheduled = false;

function renderPage() {
  const paragraphs = PAGES[currentPage] || [];
  readerContent.innerHTML = "";

  paragraphs.forEach((text) => {
    const p = document.createElement("p");
    p.textContent = text;
    readerContent.appendChild(p);
  });

  pageIndicator.textContent = `第 ${currentPage + 1} 页 / 共 ${PAGES.length} 页（模拟）`;
  readerMain.scrollTop = 0;
  updateFollowHighlight();
}

function setColumns(count) {
  currentColumns = count;
  readerContent.style.columnCount = String(count);

  modeButtons.forEach((button) => {
    const isActive = Number(button.dataset.columns) === count;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function changePage(delta) {
  const total = PAGES.length;
  currentPage = (currentPage + delta + total) % total;
  renderPage();
}

function togglePopover() {
  if (popoverOpen) {
    hidePopover();
  } else {
    showPopover();
  }
}

function showPopover() {
  popover.classList.add("is-visible");
  fab.setAttribute("aria-expanded", "true");
  popoverOpen = true;
}

function hidePopover() {
  popover.classList.remove("is-visible");
  fab.setAttribute("aria-expanded", "false");
  popoverOpen = false;
}

function setupFollowHighlight() {
  readerMain.addEventListener("scroll", () => {
    if (followScheduled) return;
    followScheduled = true;
    window.requestAnimationFrame(() => {
      updateFollowHighlight();
      followScheduled = false;
    });
  });
}

function updateFollowHighlight() {
  const paragraphs = readerContent.querySelectorAll("p");
  paragraphs.forEach((p) => p.classList.remove("_active"));

  const top = readerMain.scrollTop;
  const bottom = top + readerMain.clientHeight;

  for (const paragraph of paragraphs) {
    const paraTop = paragraph.offsetTop;
    const paraBottom = paraTop + paragraph.offsetHeight;

    if (paraBottom > top && paraTop < bottom) {
      paragraph.classList.add("_active");
      return;
    }
  }

  if (paragraphs[0]) {
    paragraphs[0].classList.add("_active");
  }
}

modeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const count = Number(button.dataset.columns);
    setColumns(count);
  });
});

pageControlButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const delta = button.dataset.action === "next" ? 1 : -1;
    changePage(delta);
  });
});

fab.addEventListener("click", () => {
  togglePopover();
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    hidePopover();
  }
});

document.addEventListener("pointerdown", (event) => {
  if (!popoverOpen) return;
  const target = event.target;
  if (popover.contains(target) || fab.contains(target)) {
    return;
  }
  hidePopover();
});

renderPage();
setColumns(currentColumns);
setupFollowHighlight();
updateFollowHighlight();
