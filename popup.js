const PAGES = [
  [
    '（第 1 页）在我们家乡的方言中，“过日子”被称为“过响”。我大概五岁的时候，总是听着大人们讨论这些词，却并不理解其中的重量。',
    '（第 1 页）在日常生活中，总是有一些司空见惯的词汇和说法，我们从不去思考背后的意义，直到有一天被迫停下来回望。',
    '（第 1 页）因此，面对那么多乡亲的悲惨故事，我一直以为那只是别人家的命运，直到慢慢意识到，每一个个体都是那段历史的一部分。'
  ],
  [
    '（第 2 页）后来我开始做田野调查，真正走进这些故事的源头。许多长辈并不觉得这些经历有什么特别，只是平静地讲述。',
    '（第 2 页）我发现，对他们来说，最重要的并不是“是否被记住”，而是“能否好好把当下的日子过下去”。',
    '（第 2 页）在这些访谈中，“过响”这个词被一次次提起，它不再只是童年记忆里的模糊声音，而是与具体人、具体生活紧紧绑在一起的线索。'
  ],
  [
    '（第 3 页）当我重新翻回这些记录时，才意识到自己早已被这些故事改变了。它们悄悄塑造了我看待世界的方式。',
    '（第 3 页）也正因如此，我更希望找到一种“寻宝式”的阅读方式，在庞杂的信息中主动寻找对自己真正重要的片段。',
    '（第 3 页）这就是这个多列阅读原型想要验证的：如果我们能一眼看到更多内容，是否就更容易抓住那些值得停下来的句子。'
  ]
];

const readerContent = document.getElementById('readerContent');
const readerMain = document.getElementById('readerMain');
const pageIndicator = document.getElementById('pageIndicator');
const modeButtons = document.querySelectorAll('.mode-option');
const fab = document.getElementById('fab');
const popover = document.getElementById('readingPopover');
const pageControlButtons = document.querySelectorAll('.page-controls button');

let currentPage = 0;
let currentColumns = 3;
let popoverOpen = false;
let followScheduled = false;

function renderPage() {
  const paragraphs = PAGES[currentPage] || [];
  readerContent.innerHTML = '';

  paragraphs.forEach((text) => {
    const p = document.createElement('p');
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
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
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
  popover.classList.add('is-visible');
  fab.setAttribute('aria-expanded', 'true');
  popoverOpen = true;
}

function hidePopover() {
  popover.classList.remove('is-visible');
  fab.setAttribute('aria-expanded', 'false');
  popoverOpen = false;
}

function setupFollowHighlight() {
  readerMain.addEventListener('scroll', () => {
    if (followScheduled) return;
    followScheduled = true;
    window.requestAnimationFrame(() => {
      updateFollowHighlight();
      followScheduled = false;
    });
  });
}

function updateFollowHighlight() {
  const paragraphs = readerContent.querySelectorAll('p');
  paragraphs.forEach((p) => p.classList.remove('_active'));

  const top = readerMain.scrollTop;
  const bottom = top + readerMain.clientHeight;

  for (const paragraph of paragraphs) {
    const paraTop = paragraph.offsetTop;
    const paraBottom = paraTop + paragraph.offsetHeight;

    if (paraBottom > top && paraTop < bottom) {
      paragraph.classList.add('_active');
      return;
    }
  }

  if (paragraphs[0]) {
    paragraphs[0].classList.add('_active');
  }
}

modeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const count = Number(button.dataset.columns);
    setColumns(count);
  });
});

pageControlButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const delta = button.dataset.action === 'next' ? 1 : -1;
    changePage(delta);
  });
});

fab.addEventListener('click', (event) => {
  event.stopPropagation();
  togglePopover();
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    hidePopover();
  }
});

document.addEventListener('pointerdown', (event) => {
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
