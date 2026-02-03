const { createApp, nextTick } = Vue;

createApp({
  data() {
    return {
      name: "Love",
      loved: false,
      hasInteracted: false,
      // TODO: set to false to enable gate
      unlocked: false,
      gateError: "",
      answers: {
        firstName: "",
        lastName: "",
        herBirthday: "",
        myBirthday: "",
      },
      expected: {
        firstName: "mariam",
        lastName: "ranjbar",
        herBirthday: "2000-03-26",
        myBirthday: "1998-07-23",
      },
      yesMessage: "",
      noClicks: 0,
      noHidden: false,
      noStyle: {
        transform: "translate(0px, 0px)",
      },
      photos: [
        "./assets/photo-1.jpg",
        "./assets/photo-2.jpg",
        "./assets/photo-3.jpg",
        "./assets/photo-4.jpg",
        "./assets/photo-5.jpg",
        "./assets/photo-6.jpg",
        "./assets/photo-7.jpg",
        "./assets/photo-8.jpg",
      ],
      captions: [
        "You light up my life",
        "My favorite adventure",
        "Everyday magic",
        "Always you",
        "Endless laughter",
        "My heart is yours",
        "Together forever",
        "You complete me",
      ],
      notes: [
        "Your smile is the most beautiful thing I see.",
        "Even with miles between us, you’re my closest person.",
        "No pressure, no stress — we’ll be together, inshallah.",
        "I love how we can be weirdos together.",
        "Watching movies/series with you is my favorite pastime.",
        "Our minecraft world is my happy place.",
      ],
      swiper: null,
    };
  },
  mounted() {
    nextTick(() => {
      this.swiper = new Swiper(".swiper", {
        loop: true,
        autoplay: {
          delay: 3500,
          disableOnInteraction: false,
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        effect: "coverflow",
        coverflowEffect: {
          rotate: 15,
          stretch: 0,
          depth: 120,
          modifier: 1,
          slideShadows: false,
        },
      });
    });
    const audio = this.$refs.song;
    if (audio) {
      audio.volume = 0.85;
      audio.addEventListener("loadeddata", () => {
      });
      audio.addEventListener("canplay", () => {
      });
    }
  },
  methods: {
    checkAnswers() {
      const normalize = (value) => value.trim().toLowerCase();
      const ok =
        normalize(this.answers.firstName) === normalize(this.expected.firstName) &&
        normalize(this.answers.lastName) === normalize(this.expected.lastName) &&
        this.answers.herBirthday === this.expected.herBirthday &&
        this.answers.myBirthday === this.expected.myBirthday;

      if (!ok) {
        this.gateError = "Not quite. Try again, love. 💫";
        return;
      }

      this.unlocked = true;
      this.gateError = "";
      this.ensureMusicOnFirstAction();
    },
    sayYes() {
      this.loved = true;
      this.yesMessage = "Best answer ever. You are my forever. 💞";
      this.spawnHearts();
      this.spawnConfetti();
      this.ensureMusicOnFirstAction();
    },
    dodgeNo() {
      if (this.noHidden) return;
      this.noClicks += 1;
      const x = Math.floor(Math.random() * 220) - 110;
      const y = Math.floor(Math.random() * 120) - 60;
      const scale = Math.max(0.2, 1 - this.noClicks * 0.2);
      this.noStyle = {
        transform: `translate(${x}px, ${y}px) scale(${scale})`,
      };
      if (this.noClicks >= 4) {
        this.noHidden = true;
        this.noStyle = {
          transform: "scale(0)",
          opacity: 0,
          pointerEvents: "none",
        };
      }
    },
    ensureMusicOnFirstAction() {
      if (this.hasInteracted) return;
      this.hasInteracted = true;
      const audio = this.$refs.song;
      if (!audio) return;
    },
    spawnHearts() {
      const heartCount = 18;
      for (let i = 0; i < heartCount; i += 1) {
        const heart = document.createElement("div");
        heart.className = "heart-float";
        heart.textContent = ["💗", "💞", "💖", "💘"][i % 4];
        heart.style.left = `${10 + Math.random() * 80}%`;
        heart.style.bottom = `${10 + Math.random() * 15}%`;
        heart.style.animationDelay = `${Math.random() * 0.5}s`;
        document.body.appendChild(heart);

        setTimeout(() => {
          heart.remove();
        }, 4000);
      }
    },
    spawnConfetti() {
      const colors = ["#ff6aa5", "#ffb4d2", "#7cf1d1", "#ffffff"];
      for (let i = 0; i < 40; i += 1) {
        const confetti = document.createElement("div");
        confetti.className = "confetti";
        confetti.style.left = `${10 + Math.random() * 80}%`;
        confetti.style.background = colors[i % colors.length];
        confetti.style.animationDelay = `${Math.random() * 0.4}s`;
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 4200);
      }
    },
  },
}).mount("#app");
