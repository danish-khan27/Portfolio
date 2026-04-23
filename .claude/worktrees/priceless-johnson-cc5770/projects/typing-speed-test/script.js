const PASSAGES = {
  easy: [
    "The cat sat on the mat and looked out the window. It was a sunny day. Birds were singing in the trees and the wind was soft. A small dog ran by the fence. The cat watched and then went back to sleep on the warm rug by the door.",
    "I like to read books in the park when the weather is nice. The grass is soft and green. I bring a snack and a cold drink with me. There are tall trees that give shade. Sometimes a friend walks by and says hello before moving on.",
    "Every morning I wake up and make a cup of tea. I sit by the window and watch the world go by. The bus stops at the corner and people step off. Some go to work and some go to school. I drink my tea slow and plan out my day.",
    "We went to the beach last summer with our family. The water was warm and the sand was hot. We built a big castle near the rocks. My brother dug a deep hole and we filled it with shells. It was one of the best days I can remember.",
    "There is a small shop on the corner of my street. They sell fresh bread and milk and eggs. The man who runs it is kind and always smiles. He knows my name and asks how my day is going. I stop by almost every week to say hi.",
  ],
  medium: [
    "Climate scientists have observed significant changes in ocean temperatures over the past decade, and these shifts affect ecosystems across the globe. Coral reefs, which support roughly a quarter of all marine species, are particularly vulnerable to even small temperature increases.",
    "The new library opened downtown last month, drawing crowds curious about its modern architecture and extensive collection. Visitors can browse thousands of books, attend free workshops, or simply relax in the rooftop garden overlooking the river. Membership is open to everyone in the city.",
    "Software engineers often spend more time reading code than writing it, which is why clear naming conventions matter so much. A well-named function reveals its purpose immediately, while a cryptic abbreviation forces every future reader to dig through implementation details just to understand what is happening.",
    "When you visit a foreign country, the smallest details often leave the strongest impressions: the rhythm of conversation in a crowded market, the smell of unfamiliar spices drifting from a kitchen window, or the way strangers greet each other without making eye contact on a busy train.",
    "Long-distance running requires patience as much as physical endurance. Beginners frequently push too hard in their first weeks and end up injured before they ever build real fitness. The runners who improve steadily are usually the ones willing to slow down, listen to their bodies, and trust the process.",
  ],
  hard: [
    "The archaeological expedition unearthed artifacts that complicated prevailing theories about Bronze Age trade networks. Obsidian from Anatolia, lapis lazuli from Afghanistan, and amber from the Baltic—all discovered in a single Mycenaean tomb—suggested commercial connections far more extensive than previously hypothesized. \"We've underestimated ancient peoples' navigational capabilities and their appetite for luxury goods,\" the lead researcher observed. \"Globalization isn't as modern as we assume.\"",
    "Quantum entanglement, once dismissed by Einstein as \"spooky action at a distance,\" now underpins emerging technologies in cryptography and computing. When two particles become entangled, measuring one instantaneously determines the state of the other—regardless of the distance separating them. This phenomenon, while counterintuitive, has been verified experimentally in laboratories on virtually every continent.",
    "The Gothic cathedral's flying buttresses—those soaring, skeletal arches that brace its outer walls—weren't merely decorative; they enabled medieval architects to pierce previously load-bearing walls with vast stained-glass windows. \"Light became theology,\" wrote one historian, noting how worshippers, bathed in shifting prismatic colors, were meant to glimpse a transcendent realm hovering just beyond the material one.",
    "Behavioral economists have repeatedly demonstrated that humans are far from the rational, self-interested actors classical theory once presumed. We anchor on irrelevant numbers, overweight recent experiences, and consistently choose immediate rewards over substantially larger future ones. Recognizing these systematic biases—rather than pretending they don't exist—is the first step toward designing institutions, policies, and personal habits that actually work.",
    "Composing for a string quartet, Beethoven once remarked, was like \"chiseling music from marble\": every note exposed, every voice essential, no orchestral texture to mask a weak idea. His late quartets—restless, fragmentary, occasionally violent—were considered nearly unplayable in their time. Today, ensembles devote entire careers to deciphering them, and audiences emerge transformed by works that 19th-century critics dismissed as the ravings of a deaf man.",
  ],
};

const STORAGE_KEY = "typingSpeedTest.personalBest";

const state = {
  difficulty: "hard",
  mode: "timed",
  passage: "",
  typed: "",
  totalKeystrokes: 0,
  correctKeystrokes: 0,
  errorCount: 0,
  startTime: null,
  isRunning: false,
  isFinished: false,
  timerInterval: null,
  personalBest: null,
};

const els = {};

function $(id) {
  return document.getElementById(id);
}

function loadPersonalBest() {
  const stored = localStorage.getItem(STORAGE_KEY);
  state.personalBest = stored ? parseInt(stored, 10) : null;
  if (Number.isNaN(state.personalBest)) state.personalBest = null;
  renderPersonalBest();
}

function savePersonalBest(wpm) {
  localStorage.setItem(STORAGE_KEY, String(wpm));
  state.personalBest = wpm;
  renderPersonalBest();
}

function renderPersonalBest() {
  if (state.personalBest !== null) {
    els.personalBestText.textContent = `Personal best: ${state.personalBest} WPM`;
  } else {
    els.personalBestText.textContent = "No personal best yet";
  }
}

function pickPassage() {
  const list = PASSAGES[state.difficulty];
  let next = list[Math.floor(Math.random() * list.length)];
  // Avoid showing the exact same passage twice in a row when possible.
  if (next === state.passage && list.length > 1) {
    let attempts = 0;
    while (next === state.passage && attempts < 5) {
      next = list[Math.floor(Math.random() * list.length)];
      attempts++;
    }
  }
  return next;
}

function reset() {
  if (state.timerInterval) {
    clearInterval(state.timerInterval);
    state.timerInterval = null;
  }
  state.passage = pickPassage();
  state.typed = "";
  state.totalKeystrokes = 0;
  state.correctKeystrokes = 0;
  state.errorCount = 0;
  state.startTime = null;
  state.isRunning = false;
  state.isFinished = false;

  els.startBtn.hidden = false;
  els.restartBtn.hidden = true;

  renderPassage();
  updateStats();
}

function escapeHtml(s) {
  switch (s) {
    case "&": return "&amp;";
    case "<": return "&lt;";
    case ">": return "&gt;";
    case '"': return "&quot;";
    case "'": return "&#39;";
    default: return s;
  }
}

function renderPassage() {
  const chars = state.passage;
  const typed = state.typed;
  const cursorPos = state.isFinished ? -1 : typed.length;

  let html = "";
  for (let i = 0; i < chars.length; i++) {
    const expected = chars[i];
    let cls = "char";
    if (i < typed.length) {
      cls += typed[i] === expected ? " correct" : " incorrect";
    }
    if (i === cursorPos) cls += " current";

    let display;
    if (expected === " ") {
      display = "&nbsp;";
    } else if (expected === "\n") {
      display = "<br>";
    } else {
      display = escapeHtml(expected);
    }
    html += `<span class="${cls}">${display}</span>`;
  }
  els.passage.innerHTML = html;
}

function startTimer() {
  state.startTime = Date.now();
  state.isRunning = true;
  state.timerInterval = setInterval(() => {
    updateStats();
    if (state.mode === "timed" && elapsedSeconds() >= 60) {
      finish();
    }
  }, 100);
  els.startBtn.hidden = true;
  els.restartBtn.hidden = false;
}

function elapsedSeconds() {
  if (!state.startTime) return 0;
  return (Date.now() - state.startTime) / 1000;
}

function countCorrectChars() {
  let count = 0;
  const len = Math.min(state.typed.length, state.passage.length);
  for (let i = 0; i < len; i++) {
    if (state.typed[i] === state.passage[i]) count++;
  }
  return count;
}

function calcWPM() {
  const seconds = elapsedSeconds();
  if (seconds <= 0) return 0;
  const correctChars = countCorrectChars();
  const minutes = seconds / 60;
  return Math.max(0, Math.round(correctChars / 5 / minutes));
}

function calcAccuracy() {
  if (state.totalKeystrokes === 0) return 100;
  return Math.round((state.correctKeystrokes / state.totalKeystrokes) * 100);
}

function formatTime(seconds) {
  const total = Math.max(0, Math.floor(seconds));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function updateStats() {
  els.wpm.textContent = String(calcWPM());

  const acc = calcAccuracy();
  els.accuracy.textContent = `${acc}%`;
  if (state.totalKeystrokes > 0 && acc < 95) {
    els.accuracy.classList.add("warning");
  } else {
    els.accuracy.classList.remove("warning");
  }

  if (state.mode === "timed") {
    const remaining = 60 - elapsedSeconds();
    els.time.textContent = formatTime(remaining);
  } else {
    els.time.textContent = formatTime(elapsedSeconds());
  }
}

function handleKey(e) {
  if (state.isFinished) return;

  // Ignore modifier-only keys and shortcuts.
  if (e.ctrlKey || e.metaKey || e.altKey) return;

  const key = e.key;

  if (key === "Backspace") {
    if (state.typed.length > 0) {
      state.typed = state.typed.slice(0, -1);
      renderPassage();
      updateStats();
    }
    e.preventDefault();
    return;
  }

  // Only accept printable single characters.
  if (key.length !== 1) return;

  e.preventDefault();

  if (!state.isRunning) {
    startTimer();
  }

  if (state.typed.length >= state.passage.length) return;

  const expected = state.passage[state.typed.length];
  state.typed += key;
  state.totalKeystrokes++;
  if (key === expected) {
    state.correctKeystrokes++;
  } else {
    state.errorCount++;
  }

  // In timed mode, keep appending text so fast typists never run out.
  if (state.mode === "timed" && state.passage.length - state.typed.length < 120) {
    state.passage = state.passage + " " + pickPassage();
  }

  renderPassage();
  updateStats();

  if (state.mode === "passage" && state.typed.length === state.passage.length) {
    finish();
  }
}

function finish() {
  if (state.isFinished) return;
  state.isFinished = true;
  state.isRunning = false;
  if (state.timerInterval) {
    clearInterval(state.timerInterval);
    state.timerInterval = null;
  }
  // Final stat refresh, then snap timer to 0:00 (timed) or final value.
  updateStats();
  if (state.mode === "timed") {
    els.time.textContent = "0:00";
  }
  renderPassage();
  showResults();
}

function showResults() {
  const wpm = calcWPM();
  const acc = calcAccuracy();
  const correctChars = countCorrectChars();
  const incorrectChars = state.errorCount;

  els.resultWpm.textContent = String(wpm);
  els.resultAccuracy.textContent = `${acc}%`;
  els.resultCorrect.textContent = String(correctChars);
  els.resultIncorrect.textContent = String(incorrectChars);

  els.resultsMessage.classList.remove("celebrate");

  const hadPriorBest = state.personalBest !== null;
  const beatBest = hadPriorBest && wpm > state.personalBest;

  if (!hadPriorBest) {
    els.resultsTitle.textContent = "Baseline Established!";
    els.resultsMessage.textContent = `Your personal best is now ${wpm} WPM. Beat it next time!`;
    els.resultsMessage.classList.add("celebrate");
    savePersonalBest(wpm);
  } else if (beatBest) {
    const prev = state.personalBest;
    els.resultsTitle.textContent = "High Score Smashed!";
    els.resultsMessage.textContent = `${wpm} WPM — a new personal best (was ${prev} WPM).`;
    els.resultsMessage.classList.add("celebrate");
    savePersonalBest(wpm);
    fireConfetti();
  } else {
    els.resultsTitle.textContent = "Test Complete";
    els.resultsMessage.textContent = `Personal best is still ${state.personalBest} WPM. Try again!`;
  }

  els.resultsOverlay.hidden = false;
  els.resultsClose.focus();
}

/* ============ Confetti ============ */
let confettiActive = false;
function fireConfetti() {
  const canvas = els.confettiCanvas;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext("2d");

  const colors = ["#facc15", "#60a5fa", "#4ade80", "#f87171", "#a78bfa", "#fb923c"];
  const particles = [];
  const count = 180;

  for (let i = 0; i < count; i++) {
    particles.push({
      x: canvas.width / 2 + (Math.random() - 0.5) * 200,
      y: canvas.height / 3 + (Math.random() - 0.5) * 60,
      vx: (Math.random() - 0.5) * 12,
      vy: -8 - Math.random() * 8,
      w: 6 + Math.random() * 6,
      h: 3 + Math.random() * 4,
      rotation: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.3,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 0,
    });
  }

  if (confettiActive) return;
  confettiActive = true;

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let active = 0;
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35;
      p.vx *= 0.995;
      p.rotation += p.vr;
      p.life++;

      if (p.y < canvas.height + 40 && p.life < 400) {
        active++;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, 1 - p.life / 400);
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
    }
    if (active > 0) {
      requestAnimationFrame(tick);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      confettiActive = false;
    }
  }
  tick();
}

/* ============ Setup ============ */
function setActive(group, value, attr) {
  for (const btn of group.querySelectorAll("button")) {
    btn.classList.toggle("active", btn.dataset[attr] === value);
  }
}

function updateSubtitle() {
  els.subtitle.textContent =
    state.mode === "timed"
      ? "Type as fast as you can in 60 seconds"
      : "Type the entire passage as fast as you can";
}

function init() {
  els.subtitle = $("subtitle");
  els.personalBestText = $("personal-best-text");
  els.wpm = $("wpm");
  els.accuracy = $("accuracy");
  els.time = $("time");
  els.passage = $("passage");
  els.startBtn = $("start-btn");
  els.restartBtn = $("restart-btn");
  els.difficultyGroup = $("difficulty-group");
  els.modeGroup = $("mode-group");
  els.resultsOverlay = $("results-overlay");
  els.resultsTitle = $("results-title");
  els.resultsMessage = $("results-message");
  els.resultWpm = $("result-wpm");
  els.resultAccuracy = $("result-accuracy");
  els.resultCorrect = $("result-correct");
  els.resultIncorrect = $("result-incorrect");
  els.resultsClose = $("results-close");
  els.confettiCanvas = $("confetti-canvas");

  loadPersonalBest();
  updateSubtitle();
  reset();

  els.startBtn.addEventListener("click", () => {
    els.passage.focus();
    els.startBtn.hidden = true;
    els.restartBtn.hidden = false;
  });

  els.restartBtn.addEventListener("click", () => {
    reset();
    els.passage.focus();
  });

  els.passage.addEventListener("click", () => {
    if (state.isFinished) return;
    els.passage.focus();
  });

  els.difficultyGroup.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-difficulty]");
    if (!btn) return;
    state.difficulty = btn.dataset.difficulty;
    setActive(els.difficultyGroup, state.difficulty, "difficulty");
    reset();
  });

  els.modeGroup.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-mode]");
    if (!btn) return;
    state.mode = btn.dataset.mode;
    setActive(els.modeGroup, state.mode, "mode");
    updateSubtitle();
    reset();
  });

  els.resultsClose.addEventListener("click", () => {
    els.resultsOverlay.hidden = true;
    reset();
  });

  els.resultsOverlay.addEventListener("click", (e) => {
    if (e.target === els.resultsOverlay) {
      els.resultsOverlay.hidden = true;
      reset();
    }
  });

  document.addEventListener("keydown", (e) => {
    // If results are open, allow Escape / Enter to close.
    if (!els.resultsOverlay.hidden) {
      if (e.key === "Escape" || e.key === "Enter") {
        e.preventDefault();
        els.resultsOverlay.hidden = true;
        reset();
      }
      return;
    }
    handleKey(e);
  });

  window.addEventListener("resize", () => {
    if (els.confettiCanvas) {
      els.confettiCanvas.width = window.innerWidth;
      els.confettiCanvas.height = window.innerHeight;
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
