const openGiftBtn = document.getElementById("openGiftBtn");
const typedMessage = document.getElementById("typedMessage");
const prevPhoto = document.getElementById("prevPhoto");
const nextPhoto = document.getElementById("nextPhoto");
const photo = document.getElementById("photo");
const photoCaption = document.getElementById("photoCaption");
const photoCount = document.getElementById("photoCount");
const celebrateBtn = document.getElementById("celebrateBtn");
const finalMessage = document.getElementById("finalMessage");
const player = document.getElementById("player");

const letter = [
  "Happy birthday, my love.",
  "I hate that today became a fight because I ordered the wrong flowers and did not think of a good solution in time.",
  "I am sorry for that, and I am sorry I lost my patience and yelled. You deserved softness from me, especially today.",
  "But even with that, nothing in me changed about how deeply I love you.",
  "I made this to remind you that I still see your softness, your beauty, your heart, and the life I want with you.",
  "I hope tonight ends with you feeling adored.",
].join(" ");

const photos = [
  "./assets/21.jpg",
  "./assets/24.jpg",
  "./assets/25.jpg",
  "./assets/29.jpg",
];

const captions = {
  "./assets/21.jpg": "You in your Punjabi outfit on Eid. Beautiful, effortless, unforgettable.",
  "./assets/24.jpg": "The way you saved my name in your phone still melts me every time.",
  "./assets/25.jpg": "The museum gift you handmade for us is one of the sweetest things anyone has ever done for me.",
  "./assets/29.jpg": "Even a Facetime screenshot with you feels worth keeping forever.",
};

let hasInteracted = false;
let typingTimer = null;
let currentPhoto = 0;

function ensureMusic() {
  if (hasInteracted || !player) return;
  hasInteracted = true;
  player.volume = 0.9;
  player.play().catch(() => {});
}

function typeLetter(text) {
  clearInterval(typingTimer);
  typedMessage.textContent = "";
  let index = 0;

  typingTimer = setInterval(() => {
    typedMessage.textContent = text.slice(0, index + 1);
    index += 1;

    if (index >= text.length) {
      clearInterval(typingTimer);
    }
  }, 24);
}

function setPhoto(index) {
  currentPhoto = (index + photos.length) % photos.length;
  const src = photos[currentPhoto];
  photo.src = src;
  photoCaption.textContent = captions[src];
  photoCount.textContent = `Memory ${currentPhoto + 1} of ${photos.length}`;
}

function createSpark() {
  const spark = document.createElement("span");
  spark.className = "spark";
  spark.textContent = ["♥", "✦", "✧", "♥"][Math.floor(Math.random() * 4)];
  spark.style.left = `${12 + Math.random() * 76}%`;
  spark.style.top = `${18 + Math.random() * 64}%`;
  spark.style.animationDelay = `${Math.random() * 0.3}s`;
  document.body.appendChild(spark);

  window.setTimeout(() => {
    spark.remove();
  }, 2600);
}

function celebrate() {
  for (let i = 0; i < 24; i += 1) {
    window.setTimeout(createSpark, i * 55);
  }
}

openGiftBtn.addEventListener("click", () => {
  ensureMusic();
  document.querySelector(".letter-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
  typeLetter(letter);
});

prevPhoto.addEventListener("click", () => setPhoto(currentPhoto - 1));
nextPhoto.addEventListener("click", () => setPhoto(currentPhoto + 1));

celebrateBtn.addEventListener("click", () => {
  ensureMusic();
  finalMessage.textContent =
    "My wish is simple: happy birthday, and please let the rest of your year feel more loved than hurt. I am sorry I ordered the wrong flowers, I am sorry I did not find a good solution in time, and I am sorry I lost my patience and yelled. I still want to love you better than I did today.";
  celebrate();
});

setPhoto(0);
typeLetter(letter);
window.setInterval(() => setPhoto(currentPhoto + 1), 5200);
