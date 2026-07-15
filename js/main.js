const envelopeIntro = document.getElementById("envelopeIntro");
const openEnvelopeBtn = document.getElementById("openEnvelopeBtn");
const heroCoupleStage = document.getElementById("heroCoupleStage");
const heroCard = document.querySelector(".hero-card");

function createPetalEffect() {
  if (document.querySelector(".petal-layer")) {
    return;
  }

  const petalLayer = document.createElement("div");
  petalLayer.className = "petal-layer";
  petalLayer.setAttribute("aria-hidden", "true");

  // ivory / sage / champagne petal tones
  const petalColors = [
    "rgba(253, 251, 246, 0.92)",
    "rgba(196, 181, 154, 0.82)",
    "rgba(159, 170, 139, 0.72)",
    "rgba(239, 231, 216, 0.88)"
  ];

  const petalCount = window.matchMedia("(max-width: 520px)").matches ? 16 : 28;

  for (let i = 0; i < petalCount; i += 1) {
    const petal = document.createElement("span");
    petal.className = "falling-petal";
    petal.style.setProperty("--x", `${Math.random() * 100}%`);
    petal.style.setProperty("--size", `${8 + Math.random() * 10}px`);
    petal.style.setProperty("--duration", `${8 + Math.random() * 8}s`);
    petal.style.setProperty("--delay", `${Math.random() * -14}s`);
    petal.style.setProperty("--drift", `${-80 + Math.random() * 160}px`);
    petal.style.setProperty("--rotate", `${Math.random() * 180}deg`);
    petal.style.setProperty("--opacity", `${0.32 + Math.random() * 0.36}`);
    petal.style.setProperty("--petal-color", petalColors[i % petalColors.length]);
    petalLayer.appendChild(petal);
  }

  document.body.appendChild(petalLayer);
}

function createHeroParticles() {
  if (!heroCoupleStage || heroCoupleStage.querySelector(".hero-dust-particle")) {
    return;
  }

  const particleCount = window.matchMedia("(max-width: 520px)").matches ? 12 : 18;

  for (let i = 0; i < particleCount; i += 1) {
    const particle = document.createElement("span");
    particle.className = "hero-dust-particle";
    particle.setAttribute("aria-hidden", "true");
    particle.style.setProperty("--particle-x", `${12 + Math.random() * 76}%`);
    particle.style.setProperty("--particle-y", `${12 + Math.random() * 74}%`);
    particle.style.setProperty("--particle-size", `${3 + Math.random() * 4}px`);
    particle.style.setProperty("--particle-duration", `${3.8 + Math.random() * 3.8}s`);
    particle.style.setProperty("--particle-delay", `${Math.random() * -5}s`);
    particle.style.setProperty("--particle-drift", `${-22 + Math.random() * 44}px`);
    heroCoupleStage.appendChild(particle);
  }
}

createHeroParticles();

function addHeroMouseMotion() {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion || !heroCoupleStage) {
    return;
  }

  const coupleImage = heroCoupleStage.querySelector(".hero-couple-img");

  heroCoupleStage.addEventListener("mousemove", (event) => {
    const rect = heroCoupleStage.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;

    if (coupleImage) {
      coupleImage.style.transform = `translate3d(${x * 8}px, ${y * -7}px, 0) rotate(${x * 1.2}deg)`;
    }

    heroCoupleStage.style.setProperty("--mouse-x", `${50 + x * 8}%`);
    heroCoupleStage.style.setProperty("--mouse-y", `${50 + y * 8}%`);
  });

  heroCoupleStage.addEventListener("mouseleave", () => {
    if (coupleImage) {
      coupleImage.style.transform = "";
    }
  });

  if (heroCard) {
    heroCard.addEventListener("mousemove", (event) => {
      const rect = heroCard.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      heroCard.style.transform = `rotateX(${y * -1.8}deg) rotateY(${x * 1.8}deg)`;
    });

    heroCard.addEventListener("mouseleave", () => {
      heroCard.style.transform = "";
    });
  }
}

addHeroMouseMotion();

// ---- Envelope open sequence (tap the wax seal) ----
if (envelopeIntro && openEnvelopeBtn) {
  document.body.classList.add("intro-active");

  openEnvelopeBtn.addEventListener("click", () => {
    openEnvelopeBtn.disabled = true;

    // 1. crack the seal + open the flap + lift the letter (CSS driven)
    envelopeIntro.classList.add("opening");

    // prepare the petals underneath (kept hidden until the reveal)
    createPetalEffect();

    // once the seal has cracked, the flap has opened and the card has lifted,
    // dissolve the whole intro (card + veil) together so the opened card is
    // never left sitting on top of the loaded page.
    setTimeout(() => {
      envelopeIntro.classList.add("opened");
      envelopeIntro.classList.add("hide");
      envelopeIntro.setAttribute("aria-hidden", "true");

      document.body.classList.remove("intro-active");
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });

      document.body.classList.add("petals-active");
    }, 2300);

    // safety: guarantee the intro is fully removed from view
    setTimeout(() => {
      envelopeIntro.style.display = "none";
    }, 3200);
  }, { once: true });
}

const weddingDate = new Date("2026-08-19T09:00:00+05:30").getTime();

function updateCountdown() {
  const now = new Date().getTime();
  const distance = weddingDate - now;

  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) {
    return;
  }

  if (distance <= 0) {
    daysEl.textContent = "00";
    hoursEl.textContent = "00";
    minutesEl.textContent = "00";
    secondsEl.textContent = "00";
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  daysEl.textContent = String(days).padStart(2, "0");
  hoursEl.textContent = String(hours).padStart(2, "0");
  minutesEl.textContent = String(minutes).padStart(2, "0");
  secondsEl.textContent = String(seconds).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);

const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("active");
    }
  });
}, { threshold: 0.14 });

revealElements.forEach((element) => revealObserver.observe(element));

// Add to Calendar — builds a real .ics file the guest can open in
// Apple Calendar, Google Calendar, or Outlook.
const addCalendarBtn = document.getElementById("addCalendar");

if (addCalendarBtn) {
  addCalendarBtn.addEventListener("click", (event) => {
    event.preventDefault();

    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Gaveen and Thakshila//Wedding//EN",
      "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      "UID:gaveen-thakshila-wedding-2026@invitation",
      "DTSTAMP:20260101T000000Z",
      "DTSTART;TZID=Asia/Colombo:20260819T090000",
      "DTEND;TZID=Asia/Colombo:20260819T163000",
      "SUMMARY:Gaveen & Thakshila Wedding",
      "DESCRIPTION:Join us as we celebrate our wedding day. Poruwa Ceremony at 09.09 AM.",
      "LOCATION:Peradeniya Royal Rest House (Queen's Ballroom)\\, Peradeniya\\, Sri Lanka",
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Gaveen-and-Thakshila-Wedding.ics";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  });
}
