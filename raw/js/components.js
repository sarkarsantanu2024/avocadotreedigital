/* Shared header + footer, injected into every page to avoid duplication.
   Each page includes <div id="site-header"></div> and <div id="site-footer"></div>. */

(function () {
  const path = location.pathname.split("/").pop() || "index.html";

  const nav = [
    {
      label: "About",
      href: "about.html",
      children: [
        { label: "Story & Team", href: "about.html" },
        { label: "Book a Strategy Call", href: "contact.html" },
        { label: "FAQs", href: "faqs.html" },
      ],
    },
    {
      label: "Services",
      href: "#",
      children: [
        {
          label: "Digital Command Centre",
          href: "digital-command-centre.html",
        },
        { label: "Global Events Engine", href: "global-events-engine.html" },
        { label: "Keyword Community (coming soon)", href: "#", muted: true },
      ],
    },
    {
      label: "We Work With",
      href: "we-work-with.html",
      children: [
        {
          label: "Professional Services",
          href: "we-work-with.html#professional-services",
        },
        {
          label: "Growth Focused Brands",
          href: "we-work-with.html#growth-brands",
        },
        { label: "Government Bodies", href: "we-work-with.html#government" },
        { label: "CMOs With Team Gaps", href: "we-work-with.html#cmos" },
      ],
    },
    { label: "Success Stories", href: "success-stories.html" },
    {
      label: "Deep Dive",
      href: "deep-dive.html",
      children: [
        {
          label: "Learning Notes (Whitepapers)",
          href: "deep-dive.html#whitepapers",
        },
        { label: "Playbooks", href: "deep-dive.html#playbooks" },
        { label: "Webinars & Events", href: "deep-dive.html#webinars" },
      ],
    },
  ];

  const isActive = (href) => href.split("#")[0] === path;

  const logo = `
    <a href="index.html" class="flex items-center gap-2 shrink-0" aria-label="Avocado Tree Digital home">
      <img src="images/logo-avocado-tree.webp" alt="Avocado Tree" class="h-9 w-auto logo-dark" />
    </a>`;

  // Desktop nav
  const desktopItems = nav
    .map((item) => {
      if (item.children) {
        const sub = item.children
          .map(
            (c) =>
              `<a href="${c.href}" class="block px-4 py-2.5 text-sm ${c.muted ? "text-ink-muted" : "text-ink hover:text-avocado-dark"} hover:bg-cream transition">${c.label}</a>`,
          )
          .join("");
        return `
        <div class="has-dropdown relative">
          <a href="${item.href}" class="nav-link inline-flex items-center gap-1 py-2 ${isActive(item.href) ? "text-avocado-dark" : ""}">
            ${item.label}
            <span class="material-symbols-outlined text-[18px]">expand_more</span>
          </a>
          <div class="dropdown absolute left-0 top-full pt-2 w-60">
            <div class="bg-white shadow-xl ring-1 ring-black/5 py-2 overflow-hidden">${sub}</div>
          </div>
        </div>`;
      }
      return `<a href="${item.href}" class="nav-link py-2 ${isActive(item.href) ? "text-avocado-dark" : ""}">${item.label}</a>`;
    })
    .join("");

  // Mobile nav
  const mobileItems = nav
    .map((item) => {
      const top = `<a href="${item.href}" class="block py-3 text-lg font-heading">${item.label}</a>`;
      const sub = item.children
        ? item.children
            .map(
              (c) =>
                `<a href="${c.href}" class="block py-2 pl-4 text-sm ${c.muted ? "text-ink-muted" : "text-ink/70"}">${c.label}</a>`,
            )
            .join("")
        : "";
      return `<div class="border-b border-black/10">${top}${sub ? `<div class="pb-3">${sub}</div>` : ""}</div>`;
    })
    .join("");

  const header = `
  <header class="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-black/5">
    <div class=" px-5 lg:px-8 h-24 flex items-center justify-between gap-6">
      ${logo}
      <nav class="hidden xl:flex items-center gap-5 text-[15px] font-medium text-ink">
        ${desktopItems}
      </nav>
      <div class="flex items-center gap-3">
        <a href="contact.html" class="hidden sm:inline-flex items-center gap-2 btn-avocado-sm">
          Contact
        </a>
        <button id="menu-toggle" class="xl:hidden p-2 -mr-2" aria-label="Open menu">
          <span class="material-symbols-outlined text-3xl">menu</span>
        </button>
      </div>
    </div>
    <div id="mobile-menu" class="hidden xl:hidden border-t border-black/10 bg-white max-h-[80vh] overflow-y-auto">
      <div class="px-5 py-2">${mobileItems}
        <a href="contact.html" class="mt-4 mb-3 inline-flex items-center justify-center w-full btn-avocado">Contact</a>
      </div>
    </div>
  </header>`;

  const fcol = (title, links) => `
    <div>
      <h4 class="text-avocado font-heading font-semibold tracking-wide text-sm uppercase mb-4">${title}</h4>
      <ul class="space-y-2.5 text-sm text-white/70">
        ${links.map((l) => `<li><a href="${l.href}" class="link-underline hover:text-white ${l.muted ? "text-white/40" : ""}">${l.label}</a></li>`).join("")}
      </ul>
    </div>`;

  const footer = `
  <footer class="bg-ink text-white">
    <div class="max-w-content mx-auto px-5 lg:px-8 py-16">
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10">
        ${fcol("About", [
          { label: "Story & Team", href: "about.html" },
          { label: "FAQs", href: "faqs.html" },
        ])}
        ${fcol("Services", [
          {
            label: "Digital Command Centre",
            href: "digital-command-centre.html",
          },
          { label: "Global Events Engine", href: "global-events-engine.html" },
          { label: "Keyword Community (coming soon)", href: "#", muted: true },
        ])}
        ${fcol("Capabilities", [
          { label: "Strategy / Thinking", href: "capabilities.html#strategy" },
          { label: "Tactics / Doing", href: "capabilities.html#tactics" },
          { label: "AI / Team", href: "capabilities.html#ai" },
          { label: "Analytics / Knowing", href: "capabilities.html#analytics" },
        ])}
        ${fcol("We Work With", [
          {
            label: "Professional Services",
            href: "we-work-with.html#professional-services",
          },
          {
            label: "Growth Focused Brands",
            href: "we-work-with.html#growth-brands",
          },
          { label: "Government Bodies", href: "we-work-with.html#government" },
          { label: "CMOs With Team Gaps", href: "we-work-with.html#cmos" },
        ])}
        ${fcol("Deep Dive", [
          { label: "Success Stories", href: "success-stories.html" },
          {
            label: "Learning Notes (Whitepapers)",
            href: "deep-dive.html#whitepapers",
          },
          { label: "Playbooks", href: "deep-dive.html#playbooks" },
          { label: "Webinars & Events", href: "deep-dive.html#webinars" },
        ])}
        <div>
          <h4 class="text-avocado font-heading font-semibold tracking-wide text-sm uppercase mb-4">Connect</h4>
          <ul class="space-y-2.5 text-sm text-white/70">
            <li>Singapore</li>
            <li>India</li>
          </ul>
          <a href="https://www.linkedin.com/" target="_blank" rel="noopener"
             class="mt-5 inline-flex items-center gap-2 btn-avocado-sm">
            <svg viewBox="0 0 24 24" class="w-4 h-4 fill-current"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z"/></svg>
            Follow on LinkedIn
          </a>
        </div>
      </div>

      <div class="mt-14 pt-8 border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div class="max-w-md">
          <img src="images/logo-avocado-tree.webp" alt="Avocado Tree" class="h-9 w-auto logo-light mb-3" />
          <p class="text-sm text-white/55">Your global partner for strategic digital thinking and delivering outcomes.</p>
        </div>
        <div class="text-sm text-white/45 flex items-center gap-6">
          <a href="#" class="link-underline hover:text-white">Terms &amp; Conditions</a>
          <span>&copy; ${new Date().getFullYear()} Avocado Tree Digital</span>
        </div>
      </div>
    </div>
  </footer>`;

  const h = document.getElementById("site-header");
  const f = document.getElementById("site-footer");
  if (h) h.innerHTML = header;
  if (f) f.innerHTML = footer;

  // Mobile menu toggle
  const toggle = document.getElementById("menu-toggle");
  const menu = document.getElementById("mobile-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      menu.classList.toggle("hidden");
      const icon = toggle.querySelector(".material-symbols-outlined");
      icon.textContent = menu.classList.contains("hidden") ? "menu" : "close";
    });
  }
})();
