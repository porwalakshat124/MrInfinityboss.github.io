const menuButton = document.querySelector(".menu-toggle"),
  navigation = document.querySelector("#navigation");
function closeMenu() {
  navigation.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
}
menuButton.addEventListener("click", () => {
  const open = navigation.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(open));
});
navigation
  .querySelectorAll("a")
  .forEach((a) => a.addEventListener("click", closeMenu));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMenu();
});
document.addEventListener("click", (e) => {
  if (!e.target.closest(".nav-shell")) closeMenu();
});
const views = {
  build: {
    title: "Give an idea a working form.",
    copy: "Thoughtful interfaces, connected systems and the details that make software useful.",
  },
  ai: {
    title: "Make technology more personal.",
    copy: "Exploring how voice, local knowledge and AI can become a natural part of everyday work.",
  },
  data: {
    title: "Turn complexity into clarity.",
    copy: "From messy datasets to meaningful patterns. Ask the right question, then make the answer visible.",
  },
};
let activeView = "build";
const tabs = [...document.querySelectorAll("[data-view]")];
function selectView(tab) {
  activeView = tab.dataset.view;
  tabs.forEach((t) => {
    t.setAttribute("aria-selected", String(t === tab));
    t.tabIndex = t === tab ? 0 : -1;
  });
  const panel = document.querySelector("#perspective-copy");
  panel.setAttribute("aria-labelledby", tab.id);
  panel.querySelector("h3").textContent = views[activeView].title;
  panel.querySelector("p").textContent = views[activeView].copy;
  document.querySelector("#perspective-count").textContent =
    `0${tabs.indexOf(tab) + 1} / 03`;
  drawField(performance.now());
}
tabs.forEach((tab, i) => {
  tab.addEventListener("click", () => selectView(tab));
  tab.addEventListener("keydown", (e) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) return;
    e.preventDefault();
    const n =
      e.key === "Home"
        ? 0
        : e.key === "End"
          ? tabs.length - 1
          : (i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
    selectView(tabs[n]);
    tabs[n].focus();
  });
});
const projects = {
  nexus: {
    category: "01 / NATIVE WINDOWS & AI",
    name: "Nexus",
    description:
      "A native Windows companion built around a floating desktop island. Nexus brings multi-model AI conversations, focus tools, notes and system monitoring into one interface. The Windows preview is available as an installer or portable download.",
    stack: "C# · .NET 10 · WPF",
    links: [
      [
        "Download Windows preview",
        "https://github.com/porwalakshat124/nexus-downloads/releases/latest",
      ],
      ["Release notes", "https://github.com/porwalakshat124/nexus-downloads"],
    ],
  },
  luna: {
    category: "02 / PERSONAL INTELLIGENCE",
    name: "Luna",
    description:
      "A personal assistant for Windows, combining voice interaction, local knowledge and desktop workflows. I’m exploring a more connected way to work with a computer, with an Electron interface, Node.js services and SQLite persistence. The website introduces the product and its capabilities.",
    stack: "Electron · Node.js · SQLite",
    links: [["Explore Luna", "https://luna-aiagent.vercel.app/"]],
  },
  deploypilot: {
    category: "03 / DEVELOPER TOOLS",
    name: "DeployPilot",
    description:
      "An AI-assisted deployment pipeline for developers. Follow build stages as they happen and investigate failures with an evidence-based diagnosis. The project brings together a Next.js interface and queue-based processing with BullMQ.",
    stack: "Next.js · BullMQ · CSS",
    links: [
      ["Visit DeployPilot", "https://deploypilot-web.vercel.app/"],
      ["Explore the source", "https://github.com/porwalakshat124/deploypilot"],
    ],
  },
  retailhub: {
    category: "04 / BUSINESS INTELLIGENCE",
    name: "RetailHub",
    description:
      "An end-to-end retail analytics project exploring sales, customer behavior, inventory and promotions. SQL transformations, database modelling and Power BI dashboards bring 25+ business KPIs into a connected analytical view.",
    stack: "PostgreSQL · Power BI · DAX · ETL · Window functions",
    links: [
      [
        "Explore the project",
        "https://github.com/porwalakshat124/RetailHub-Business-Intelligence-Analytics-Platform",
      ],
    ],
  },
};
const dialog = document.querySelector("#project-dialog");
let opener;
document.querySelectorAll("[data-project]").forEach((button) =>
  button.addEventListener("click", () => {
    const p = projects[button.dataset.project];
    opener = button;
    document.querySelector("#dialog-category").textContent = p.category;
    document.querySelector("#dialog-title").textContent = p.name;
    document.querySelector("#dialog-description").textContent = p.description;
    document.querySelector("#dialog-stack").textContent = p.stack;
    const links = document.querySelector("#dialog-links");
    links.replaceChildren();
    p.links.forEach(([label, url], i) => {
      const a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener";
      a.className = i === 0 ? "pill" : "text-link";
      a.textContent = label + " ↗";
      links.append(a);
    });
    dialog.showModal();
  }),
);
document
  .querySelector(".dialog-close")
  .addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (e) => {
  const r = dialog.getBoundingClientRect();
  if (
    e.target === dialog &&
    (e.clientX < r.left ||
      e.clientX > r.right ||
      e.clientY < r.top ||
      e.clientY > r.bottom)
  )
    dialog.close();
});
dialog.addEventListener("close", () => opener?.focus());
const motionButton = document.querySelector("#motion"),
  reduced = matchMedia("(prefers-reduced-motion: reduce)");
let motion = !reduced.matches;
try {
  if (localStorage.getItem("ap-motion") === "off") motion = false;
} catch {}
let frame = 0,
  inView = true;
const canvas = document.querySelector("#field"),
  ctx = canvas.getContext("2d");
let cw = 500,
  ch = 340;
function drawField(time) {
  if (!ctx) return;
  ctx.clearRect(0, 0, cw, ch);
  const t = motion ? time * 0.00035 : 0;
  for (let y = 0; y < 23; y++)
    for (let x = 0; x < 35; x++) {
      let px = x / 34 - 0.5,
        py = y / 22 - 0.5,
        wave = Math.sin(x * 0.28 + t) * Math.cos(y * 0.3 + t) * 13;
      if (activeView === "ai") {
        const theta = (x / 34) * Math.PI * 2,
          rad = (y / 22) * Math.min(cw * 0.37, ch * 0.42);
        px = (Math.cos(theta + t * 0.15) * rad) / cw;
        py = (Math.sin(theta + t * 0.15) * rad) / ch;
        wave = Math.sin(theta * 3 + t) * 7;
      } else if (activeView === "data")
        wave = Math.sin(x * 0.23 + t) * 27 + Math.cos(y * 0.4) * 5;
      ctx.fillStyle = `rgba(188,167,133,${0.24 + (Math.sin(x * 0.1 + y * 0.15 + t) + 1) * 0.14})`;
      ctx.beginPath();
      ctx.arc(
        cw / 2 + px * cw * 0.83,
        ch / 2 + py * ch * 0.66 + wave,
        1,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    }
}
function animate(t) {
  drawField(t);
  if (motion && inView && !document.hidden)
    frame = requestAnimationFrame(animate);
}
function updateMotion() {
  document.documentElement.classList.toggle("motion-off", !motion);
  document.dispatchEvent(new Event("portfolio-motion"));
  motionButton.setAttribute("aria-pressed", String(motion));
  motionButton.textContent = motion ? "Ⅱ MOTION ON" : "▷ MOTION OFF";
  cancelAnimationFrame(frame);
  drawField(performance.now());
  if (motion && inView && !document.hidden)
    frame = requestAnimationFrame(animate);
}
function sizeCanvas() {
  const r = canvas.getBoundingClientRect();
  cw = r.width;
  ch = r.height;
  const d = Math.min(devicePixelRatio || 1, 2);
  canvas.width = cw * d;
  canvas.height = ch * d;
  ctx.setTransform(d, 0, 0, d, 0, 0);
  drawField(performance.now());
}
motionButton.addEventListener("click", () => {
  motion = !motion;
  try {
    localStorage.setItem("ap-motion", motion ? "on" : "off");
  } catch {}
  updateMotion();
});
reduced.addEventListener("change", (e) => {
  motion = !e.matches;
  updateMotion();
});
new ResizeObserver(sizeCanvas).observe(canvas);
new IntersectionObserver(([entry]) => {
  inView = entry.isIntersecting;
  updateMotion();
}).observe(canvas);
document.addEventListener("visibilitychange", updateMotion);
sizeCanvas();
updateMotion();

// Reassemble the portrait from image fragments, then let it dissolve into dust.
// The original image stays available when motion is disabled or canvas fails.
const portrait = document.querySelector(".portrait");
const portraitImage = portrait.querySelector("img");
const dust = document.createElement("canvas");
dust.className = "portrait-dust";
dust.setAttribute("aria-hidden", "true");
portrait.append(dust);
const dustContext = dust.getContext("2d");
let dustFrame = 0,
  dustVisible = true,
  dustReady = false,
  dustTime = 0,
  dustLast = 0;
let dustWidth = 0,
  dustHeight = 0,
  fragments = [];
const smooth = (value) => {
  const t = Math.max(0, Math.min(1, value));
  return t * t * (3 - 2 * t);
};
function sizePortrait() {
  if (!dustContext || !portraitImage.naturalWidth) return;
  dustWidth = portrait.clientWidth;
  dustHeight = portrait.clientHeight;
  const ratio = Math.min(devicePixelRatio || 1, 1.5);
  dust.width = Math.round(dustWidth * ratio);
  dust.height = Math.round(dustHeight * ratio);
  dustContext.setTransform(ratio, 0, 0, ratio, 0, 0);
  const tile = dustWidth < 500 ? 7 : 8;
  const scale =
    Math.max(
      dustWidth / portraitImage.naturalWidth,
      dustHeight / portraitImage.naturalHeight,
    ) * 1.15;
  const offsetX = (portraitImage.naturalWidth * scale - dustWidth) / 2;
  const offsetY = (portraitImage.naturalHeight * scale - dustHeight) / 2;
  fragments = [];
  for (let y = 0; y < dustHeight; y += tile)
    for (let x = 0; x < dustWidth; x += tile) {
      const seed =
        Math.abs(Math.sin(x * 12.9898 + y * 78.233) * 43758.5453) % 1;
      fragments.push({
        x,
        y,
        tile,
        sx: (x + offsetX) / scale,
        sy: (y + offsetY) / scale,
        sw: tile / scale,
        delay: seed * 0.32 + (1 - y / dustHeight) * 0.35,
        dx: (seed - 0.35) * 220,
        dy: -70 - seed * 160,
      });
    }
  dustReady = true;
  portrait.classList.add("dust-ready");
  drawPortrait();
  syncPortrait();
}
function drawPortrait() {
  if (!dustReady) return;
  dustContext.clearRect(0, 0, dustWidth, dustHeight);
  // Initial assembly, followed by a readable hold / dissolve / re-form cycle.
  const cycle = Math.max(0, dustTime - 3) % 12;
  const amount =
    dustTime < 3
      ? 1 - smooth(dustTime / 3)
      : cycle < 3
        ? 0
        : cycle < 6
          ? smooth((cycle - 3) / 3)
          : cycle < 9
            ? 1 - smooth((cycle - 6) / 3)
            : 0;
  for (const p of fragments) {
    const scatter = smooth((amount - p.delay * 0.48) / 0.66);
    const size = p.tile * (1 - scatter * 0.78);
    dustContext.globalAlpha = 1 - scatter * 0.78;
    dustContext.drawImage(
      portraitImage,
      p.sx,
      p.sy,
      p.sw,
      p.sw,
      p.x + p.dx * scatter,
      p.y + p.dy * scatter,
      size + 0.4,
      size + 0.4,
    );
  }
  dustContext.globalAlpha = 1;
}
function animatePortrait(time) {
  if (!motion || !dustVisible || document.hidden) {
    dustLast = 0;
    return;
  }
  if (!dustLast) dustLast = time;
  if (time - dustLast >= 32) {
    dustTime += Math.min((time - dustLast) / 1000, 0.1);
    dustLast = time;
    drawPortrait();
  }
  dustFrame = requestAnimationFrame(animatePortrait);
}
function syncPortrait() {
  cancelAnimationFrame(dustFrame);
  dustLast = 0;
  if (dustReady && motion && dustVisible && !document.hidden)
    dustFrame = requestAnimationFrame(animatePortrait);
}
if (dustContext) {
  new ResizeObserver(sizePortrait).observe(portrait);
  new IntersectionObserver(([entry]) => {
    dustVisible = entry.isIntersecting;
    syncPortrait();
  }).observe(portrait);
  portraitImage.addEventListener("load", sizePortrait, { once: true });
  if (portraitImage.complete) sizePortrait();
  document.addEventListener("portfolio-motion", syncPortrait);
  document.addEventListener("visibilitychange", syncPortrait);
}

// Reveal each section as it enters the viewport; keyboard focus reveals it too.
const revealObserver = new IntersectionObserver(
  (entries) =>
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        revealObserver.unobserve(entry.target);
      }
    }),
  { threshold: 0.12 },
);
document
  .querySelectorAll(
    ".section-heading, .about-copy, .perspective, .project, .skills-grid, .experience-list, .education, .contact > h2",
  )
  .forEach((element, index) => {
    element.classList.add("scroll-reveal");
    element.style.setProperty("--reveal-delay", `${(index % 2) * 100}ms`);
    element.addEventListener("focusin", () =>
      element.classList.add("revealed"),
    );
    revealObserver.observe(element);
  });
