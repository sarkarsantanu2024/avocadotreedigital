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
grid.classList.add("locked");
const gate = document.getElementById("gate");
const gateIntro = document.getElementById("gateIntro");
const gateSuccess = document.getElementById("gateSuccess");
const successClose = document.getElementById("successClose");
const successDownload = document.getElementById("successDownload");
const gForm = document.getElementById("gateForm");
const gErr = document.getElementById("gateErr");
const uRow = document.getElementById("unlockedRow");
const submitButton = gForm.querySelector('button[type="submit"]');

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
  const emailOk = /^[^s@]+@[^s@]+.[^s@]+$/.test(email);

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
    grid.classList.remove("locked");
    gate.classList.add("success");
    gateIntro.hidden = true;
    gForm.hidden = true;
    gateSuccess.hidden = false;
    uRow.hidden = false;
    successDownload.click();
  } catch (err) {
    console.error(err);
    gErr.textContent =
      "Sorry, we could not submit your request. Please try again later.";
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Unlock pricing & download guide";
  }
});

successClose.addEventListener("click", () => {
  gate.classList.remove("success");
  uRow.scrollIntoView({ behavior: "smooth", block: "center" });
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
