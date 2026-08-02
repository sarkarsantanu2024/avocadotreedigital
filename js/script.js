// sticky nav
const nav = document.getElementById("nav");
addEventListener("scroll", () =>
  nav.classList.toggle("scrolled", scrollY > 30),
);

// (A) <-> (H) toggle - the signature
const ah = document.getElementById("ah");
const reduce = matchMedia("(prefers-reduced-motion:reduce)").matches;
if (!reduce) {
  let showH = true;
  setInterval(() => {
    showH = !showH;
    ah.textContent = showH ? "H" : "A";
  }, 2600);
}
document.getElementById("toggle").addEventListener("mouseenter", () => {
  ah.textContent = ah.textContent === "A" ? "H" : "A";
});

// scroll reveal
const io = new IntersectionObserver(
  (es) => {
    es.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12 },
);
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

// ---- gated pricing ----
const grid = document.getElementById("priceGrid");
const successModal = document.getElementById("successModal");
const successClose = document.getElementById("successClose");
const gForm = document.getElementById("gateForm");
const gErr = document.getElementById("gateErr");
const uRow = document.getElementById("unlockedRow");
const submitButton = gForm.querySelector('button[type="submit"]');
const pricingUnlockKey = "atdPricingUnlocked";

function pricingWasUnlocked() {
  try {
    return localStorage.getItem(pricingUnlockKey) === "true";
  } catch {
    return false;
  }
}

function rememberPricingUnlock() {
  try {
    localStorage.setItem(pricingUnlockKey, "true");
  } catch {
    // Storage may be unavailable in privacy-restricted browsers.
  }
}

if (pricingWasUnlocked()) {
  grid.classList.remove("locked");
  uRow.hidden = false;
} else {
  grid.classList.add("locked");
}

async function submitGateForm(data) {
  const res = await fetch("/api/form-submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const json = await res.json().catch(() => null);
    throw new Error(json?.error || "Failed to submit form");
  }
  return res.json();
}

gForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const f = new FormData(gForm);
  const name = (f.get("name") || "").toString().trim();
  const email = (f.get("email") || "").toString().trim();
  const company = (f.get("company") || "").toString().trim();
  const emailOk = gForm.elements.email.validity.valid;

  if (!name || !company || !emailOk) {
    gErr.textContent = !name
      ? "Please enter your name."
      : !emailOk
        ? "Please enter a valid work email."
        : "Please enter your company.";
    return;
  }

  gErr.textContent = "";
  submitButton.disabled = true;
  submitButton.textContent = "Saving your details...";

  try {
    await submitGateForm({ name, email, company });
    rememberPricingUnlock();
    grid.classList.remove("locked");
    successModal.hidden = false;
    uRow.hidden = false;
  } catch (err) {
    console.error(err);
    gErr.textContent =
      "Sorry, we could not submit your request. Please try again later.";
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Unlock pricing & download guide";
  }
});

function closeSuccessModal() {
  if (successModal.hidden) return;
  successModal.hidden = true;
  uRow.scrollIntoView({ behavior: "smooth", block: "center" });
}

successClose.addEventListener("click", closeSuccessModal);
successModal.addEventListener("click", (e) => {
  if (e.target === successModal) closeSuccessModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeSuccessModal();
});
// count-up stats
const cio = new IntersectionObserver(
  (es) => {
    es.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target,
        to = +el.dataset.to,
        suf = el.dataset.suffix || "",
        pre = el.textContent.trim().startsWith("+") ? "+" : "";
      let n = 0,
        step = Math.max(1, Math.round(to / 28));
      const t = setInterval(() => {
        n += step;
        if (n >= to) {
          n = to;
          clearInterval(t);
        }
        el.textContent = pre + n + suf;
      }, 26);
      cio.unobserve(el);
    });
  },
  { threshold: 0.5 },
);
document.querySelectorAll(".num").forEach((el) => cio.observe(el));

// back to top
const backToTop = document.getElementById("backToTop");
const updateBackToTop = () => {
  backToTop.classList.toggle("visible", window.scrollY > 500);
};
window.addEventListener("scroll", updateBackToTop, { passive: true });
backToTop.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: reduce ? "auto" : "smooth",
  });
});
updateBackToTop();