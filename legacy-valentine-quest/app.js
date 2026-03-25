const screens = [...document.querySelectorAll(".screen")];
const dots = [...document.querySelectorAll(".dot")];

const startBtn = document.getElementById("startBtn");
const quizForm = document.getElementById("quizForm");
const quizFeedback = document.getElementById("quizFeedback");

const huntBtn = document.getElementById("huntBtn");
const huntArea = document.getElementById("huntArea");
const scoreEl = document.getElementById("score");
const timerEl = document.getElementById("timer");
const huntFeedback = document.getElementById("huntFeedback");

const spinBtn = document.getElementById("spinBtn");
const toFinalBtn = document.getElementById("toFinalBtn");
const fortuneWheel = document.getElementById("fortuneWheel");
const fortuneText = document.getElementById("fortuneText");

const prevPhoto = document.getElementById("prevPhoto");
const nextPhoto = document.getElementById("nextPhoto");
const photo = document.getElementById("photo");
const photoCaption = document.getElementById("photoCaption");
const celebrateBtn = document.getElementById("celebrateBtn");
const finalMessage = document.getElementById("finalMessage");
const player = document.getElementById("player");

let currentScreen = 0;
let huntTimer = null;
let spawnTimer = null;
let hasInteracted = false;
let promiseRevealed = false;
const HEART_LIFETIME_MS = 2600;
const HEART_SPAWN_MS = 520;

const photos = Array.from({ length: 20 }, (_, i) => `../assets/${i + 1}.jpg`);

function shuffleInPlace(list) {
  for (let i = list.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
}

shuffleInPlace(photos);

const defaultCoupleCaption = "Every photo of us feels like home to me.";
const defaultHerCaption = "You are the most beautiful part of my world.";
const photoCaptions = {
  "../assets/1.jpg": "You and me, my favorite team forever.",
  "../assets/2.jpg": "With you, every normal day turns special.",
  "../assets/3.jpg": "I look happiest when I am next to you.",
  "../assets/4.jpg": "These moments with you are my real treasure.",
  "../assets/5.jpg": "I would choose this life with you every time.",
  "../assets/6.jpg": "You make love feel peaceful and safe.",
  "../assets/7.jpg": "I am glad I got your number that day, :D",
  "../assets/8.jpg": "You are my comfort and my excitement at once.",
  "../assets/9.jpg": "I still smile every time I see us together.",
  "../assets/10.jpg": "Our story is my favorite story.",
  "../assets/16.jpg": "Your hand in my hand, forever.",
  "../assets/19.jpg": "Thank you for this museum of love you built for us.",
  "../assets/20.jpg": "London!!!",
};

// Replace this placeholder text with your real lifetime promise message.
const LIFETIME_PROMISE_PLACEHOLDER =
  "My Lifetime Promise: I promise you my love, nothing will change in between us. We will always be together, in good and bad times. I will always be there for you, support you, and love you with all my heart. You are my everything, and I am so grateful to have you in my life. I promise to cherish and adore you every day, for the rest of our lives. ❤️";

const expected = {
  herNickname: ["labubu", "wunderschon", "meine wunderschon", "meine labubu", "princess", "my princess", "my love", "bunny"],
  myNickname: ["teddy", "bear", "teddy bear"],
  night: ["all"],
  aboutHer: "all",
};

function ensureMusic() {
  if (hasInteracted || !player) return;
  hasInteracted = true;
  player.volume = 0.9;
  player.play().catch(() => {});
}

function showScreen(index) {
  currentScreen = index;
  screens.forEach((screen, i) => {
    screen.classList.toggle("active", i === index);
  });
  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i <= index);
  });
  if (index === 4) ensureMusic();
}

startBtn.addEventListener("click", () => {
  ensureMusic();
  showScreen(1);
});

quizForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(quizForm);
  const normalize = (value) => String(value || "").trim().toLowerCase();

  const herNickname = normalize(form.get("herNickname"));
  const myNickname = normalize(form.get("myNickname"));
  const night = normalize(form.get("night"));
  const aboutHer = normalize(form.get("aboutHer"));

  const herNicknameOk = expected.herNickname.includes(herNickname);
  const myNicknameOk = expected.myNickname.includes(myNickname);
  const nightOk = expected.night.includes(night);
  const aboutHerOk = expected.aboutHer === aboutHer;
  const ok =
    herNicknameOk &&
    myNicknameOk &&
    nightOk &&
    aboutHerOk;

  if (!ok) {
    quizFeedback.textContent = "Almost there. You know this love story better than that.";
    return;
  }

  quizFeedback.textContent = "Perfect. Level cleared.";
  setTimeout(() => showScreen(2), 550);
});

function spawnHeart() {
  const heart = document.createElement("button");
  heart.type = "button";
  heart.className = "heart";
  heart.textContent = ["💗", "💖", "💘", "💞"][Math.floor(Math.random() * 4)];
  heart.style.left = `${Math.random() * 88}%`;
  heart.style.top = `${Math.random() * 78}%`;

  heart.addEventListener("click", () => {
    const score = Number(scoreEl.textContent) + 1;
    scoreEl.textContent = String(score);
    heart.remove();

    if (score >= 12) {
      finishHeartHunt(true);
    }
  });

  huntArea.appendChild(heart);

  setTimeout(() => heart.remove(), HEART_LIFETIME_MS);
}

function finishHeartHunt(success) {
  clearInterval(huntTimer);
  clearInterval(spawnTimer);
  huntTimer = null;
  spawnTimer = null;

  if (!success) {
    huntFeedback.textContent = "Time up. Hit start and try again.";
    huntBtn.disabled = false;
    return;
  }

  huntFeedback.textContent = "You did it. Cupid is impressed.";
  setTimeout(() => showScreen(3), 650);
}

huntBtn.addEventListener("click", () => {
  huntBtn.disabled = true;
  huntFeedback.textContent = "";
  huntArea.innerHTML = "";
  scoreEl.textContent = "0";
  timerEl.textContent = "18";

  let timeLeft = 18;

  spawnTimer = setInterval(spawnHeart, HEART_SPAWN_MS);
  huntTimer = setInterval(() => {
    timeLeft -= 1;
    timerEl.textContent = String(timeLeft);

    if (timeLeft <= 0) {
      finishHeartHunt(Number(scoreEl.textContent) >= 12);
    }
  }, 1000);
});

spinBtn.addEventListener("click", () => {
  spinBtn.disabled = true;
  promiseRevealed = false;
  toFinalBtn.disabled = true;
  fortuneWheel.classList.add("spinning");
  fortuneText.textContent = "Spinning...";

  setTimeout(() => {
    fortuneText.textContent = LIFETIME_PROMISE_PLACEHOLDER;
    fortuneWheel.classList.remove("spinning");
    promiseRevealed = true;
    toFinalBtn.disabled = false;
    spinBtn.disabled = false;
  }, 2000);
});

toFinalBtn.addEventListener("click", () => {
  if (!promiseRevealed) return;
  showScreen(4);
});

let photoIndex = 0;
function getPhotoCaption(src) {
  if (photoCaptions[src]) return photoCaptions[src];
  const number = Number(src.match(/\/(\d+)\.jpg$/)?.[1] || 0);
  if (number >= 1 && number <= 10) return defaultCoupleCaption;
  return defaultHerCaption;
}

function setPhoto(index) {
  photoIndex = (index + photos.length) % photos.length;
  const current = photos[photoIndex];
  photo.src = current;
  photoCaption.textContent = getPhotoCaption(current);
}

setPhoto(0);

prevPhoto.addEventListener("click", () => setPhoto(photoIndex - 1));
nextPhoto.addEventListener("click", () => setPhoto(photoIndex + 1));

setInterval(() => {
  if (currentScreen === 4) {
    setPhoto(photoIndex + 1);
  }
}, 3200);

function launchBurst() {
  for (let i = 0; i < 22; i += 1) {
    const burst = document.createElement("span");
    burst.className = "burst";
    burst.textContent = ["💞", "💗", "💖", "💘"][i % 4];
    burst.style.left = `${10 + Math.random() * 80}%`;
    burst.style.bottom = `${8 + Math.random() * 12}%`;
    burst.style.animationDelay = `${Math.random() * 0.4}s`;
    document.body.appendChild(burst);
    setTimeout(() => burst.remove(), 2900);
  }
}

celebrateBtn.addEventListener("click", () => {
  ensureMusic();
  finalMessage.textContent = "You are my peace, my joy, and my forever favorite person. ❤️";
  launchBurst();
});
