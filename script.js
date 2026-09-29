/* ========== CONFIG: edit these ========== */
// WhatsApp number in international format, digits only (no +, spaces or dashes).
// Example: Pakistan 0300 1234567 -> "923001234567"
const WHATSAPP_NUMBER = "923001234567";
const WHATSAPP_MESSAGE = "Hi! I'd like to know more about Stackly.";

// Blog posts: add, remove or edit entries. `url` can point to a full post page.
const POSTS = [
  { title: "How to write a weekly client report in 10 minutes", cat: "Guides",   date: "Sep 18, 2026", excerpt: "A simple structure that clients read to the end.", url: "#", grad: "linear-gradient(135deg,#7b6cff,#2fe0cf)" },
  { title: "Why status meetings keep growing (and how to cut them)", cat: "Teams", date: "Sep 10, 2026", excerpt: "Replace updates with a shared summary.", url: "#", grad: "linear-gradient(135deg,#ff7ab8,#7b6cff)" },
  { title: "Stackly 2.0: what's new this quarter",             cat: "Product",  date: "Sep 2, 2026",  excerpt: "Faster syncing, new report themes and more.", url: "#", grad: "linear-gradient(135deg,#2fe0cf,#3b82f6)" },
  { title: "5 metrics that show a project is healthy",         cat: "Guides",   date: "Aug 24, 2026", excerpt: "Track these before the deadline gets close.", url: "#", grad: "linear-gradient(135deg,#f9a26c,#ff5f8d)" },
  { title: "Onboarding a remote team in their first week",     cat: "Teams",    date: "Aug 12, 2026", excerpt: "A checklist you can copy today.", url: "#", grad: "linear-gradient(135deg,#5eead4,#7b6cff)" },
  { title: "Security at Stackly: how we protect your data",    cat: "Product",  date: "Aug 1, 2026",  excerpt: "Encryption, access controls and audits explained.", url: "#", grad: "linear-gradient(135deg,#3b82f6,#1e1b6b)" }
];

/* ========== WHATSAPP LINKS ========== */
const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
document.querySelectorAll(".wa-link").forEach(a => a.href = waUrl);

/* ========== BLOG RENDER + FILTER ========== */
const postsEl = document.getElementById("posts");
const filtersEl = document.getElementById("filters");
const cats = ["All", ...new Set(POSTS.map(p => p.cat))];
let active = "All";

function renderPosts() {
  postsEl.innerHTML = POSTS.filter(p => active === "All" || p.cat === active).map(p => `
    <article class="card tilt post">
      <div class="post-img" style="--grad:${p.grad}"></div>
      <div class="post-body">
        <div class="post-meta">${p.cat} · ${p.date}</div>
        <h3>${p.title}</h3>
        <p>${p.excerpt}</p>
        <a href="${p.url}">Read article</a>
      </div>
    </article>`).join("");
  bindTilt();
}
function renderFilters() {
  filtersEl.innerHTML = cats.map(c => `<button role="tab" aria-selected="${c === active}" data-c="${c}">${c}</button>`).join("");
}
filtersEl.addEventListener("click", e => {
  const b = e.target.closest("button"); if (!b) return;
  active = b.dataset.c; renderFilters(); renderPosts();
});

/* ========== 3D TILT (cards) ========== */
const canHover = matchMedia("(hover:hover)").matches && !matchMedia("(prefers-reduced-motion:reduce)").matches;
function bindTilt() {
  if (!canHover) return;
  document.querySelectorAll(".tilt:not([data-t])").forEach(el => {
    el.dataset.t = 1;
    el.addEventListener("mousemove", e => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      el.style.setProperty("--ry", (x * 10) + "deg");
      el.style.setProperty("--rx", (-y * 10) + "deg");
    });
    el.addEventListener("mouseleave", () => { el.style.setProperty("--rx", "0deg"); el.style.setProperty("--ry", "0deg"); });
  });
}

/* ========== HERO: mouse-driven 3D stack + orb parallax ========== */
const hero = document.getElementById("home"), stack = document.querySelector(".stack");
if (canHover) hero.addEventListener("mousemove", e => {
  const x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5;
  stack.style.setProperty("--ry", (x * 16) + "deg");
  stack.style.setProperty("--rx", (-y * 10) + "deg");
  document.querySelectorAll(".orb").forEach(o => o.style.transform = `translate(${x * o.dataset.depth}px,${y * o.dataset.depth}px)`);
});

/* ========== MOBILE MENU ========== */
const burger = document.getElementById("burger"), menu = document.getElementById("menu");
burger.addEventListener("click", () => {
  const open = menu.classList.toggle("open");
  burger.setAttribute("aria-expanded", open);
});
menu.addEventListener("click", e => { if (e.target.closest("a")) { menu.classList.remove("open"); burger.setAttribute("aria-expanded", false); } });

/* ========== INIT ========== */
document.getElementById("year").textContent = new Date().getFullYear();
renderFilters(); renderPosts(); bindTilt();
