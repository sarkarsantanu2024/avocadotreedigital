/* Page interactions: scroll reveal + hero word swap */
document.addEventListener("DOMContentLoaded", () => {
  // Reveal on scroll
  const els = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && els.length) {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("in")),
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
  } else {
    els.forEach((el) => el.classList.add("in"));
  }

  // Partner-logo carousel: continuous auto-scroll + prev/next, seamless loop
  const carousel = document.querySelector("[data-logo-carousel]");
  if (carousel) {
    const viewport = carousel.querySelector(".logo-viewport");
    const track = carousel.querySelector(".logo-track");
    const prev = carousel.querySelector(".logo-prev");
    const next = carousel.querySelector(".logo-next");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const SPEED = 0.6; // px per frame (~36px/s) — Squarespace-like glide
    const STEP = 280; // px moved per prev/next click
    let paused = false;
    let resumeTimer;

    const half = () => track.scrollWidth / 2; // one full logo set

    const wrap = () => {
      const h = half();
      if (h <= 0) return;
      if (viewport.scrollLeft >= h) viewport.scrollLeft -= h;
      else if (viewport.scrollLeft < 0) viewport.scrollLeft += h;
    };

    if (!reduceMotion) {
      const tick = () => {
        if (!paused) {
          viewport.scrollLeft += SPEED;
          wrap();
        }
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }

    const nudge = (dir) => {
      paused = true;
      wrap();
      viewport.scrollBy({ left: dir * STEP, behavior: "smooth" });
      clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => { paused = false; }, 1500);
    };

    next.addEventListener("click", () => nudge(1));
    prev.addEventListener("click", () => nudge(-1));
    carousel.addEventListener("mouseenter", () => { paused = true; });
    carousel.addEventListener("mouseleave", () => { paused = false; });
  }
});
