const loader = document.querySelector("[data-loader]");
const header = document.querySelector("[data-header]");
const progress = document.querySelector("[data-progress]");
const cursor = document.querySelector("[data-cursor]");
const menu = document.querySelector("[data-menu]");
const nav = document.querySelector("[data-nav]");

window.addEventListener("load", () => {
  setTimeout(() => loader?.classList.add("done"), 650);
});

const updateChrome = () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  header?.classList.toggle("scrolled", scrollTop > 24);
  if (progress) progress.style.width = `${docHeight > 0 ? (scrollTop / docHeight) * 100 : 0}%`;
};
window.addEventListener("scroll", updateChrome, { passive: true });
updateChrome();

menu?.addEventListener("click", () => {
  nav?.classList.toggle("open");
  document.body.classList.toggle("nav-open", nav?.classList.contains("open"));
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    document.body.classList.remove("nav-open");
  });
});

const currentPage = location.pathname.split("/").pop() || "index.html";
document.querySelectorAll(".main-nav a").forEach((link) => {
  if (link.getAttribute("href") === currentPage) link.classList.add("active");
});

window.addEventListener("mousemove", (event) => {
  if (!cursor) return;
  cursor.style.left = `${event.clientX}px`;
  cursor.style.top = `${event.clientY}px`;
});

document.querySelectorAll("a, button, input, select, textarea").forEach((item) => {
  item.addEventListener("mouseenter", () => cursor?.classList.add("is-active"));
  item.addEventListener("mouseleave", () => cursor?.classList.remove("is-active"));
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold: 0.16 });
document.querySelectorAll(".reveal").forEach((item) => revealObserver.observe(item));

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting || entry.target.dataset.done) return;
    entry.target.dataset.done = "true";
    const target = Number(entry.target.dataset.count || 0);
    const duration = 1000;
    const start = performance.now();
    const tick = (now) => {
      const progressValue = Math.min((now - start) / duration, 1);
      entry.target.textContent = Math.floor(target * progressValue).toString();
      if (progressValue < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}, { threshold: 0.5 });
document.querySelectorAll("[data-count]").forEach((item) => countObserver.observe(item));

document.querySelectorAll("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    document.querySelectorAll("[data-filter]").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    document.querySelectorAll("[data-category]").forEach((card) => {
      const category = card.dataset.category || "";
      card.classList.toggle("is-hidden", filter !== "all" && !category.includes(filter));
    });
  });
});

document.querySelectorAll("[data-form]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const status = form.querySelector("[data-form-status]");
    if (status) status.textContent = "Inquiry captured. ADXverse will review the brief and respond with next steps.";
    form.reset();
  });
});

const loginForm = document.querySelector("[data-admin-login]");
loginForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  document.body.classList.add("admin-unlocked");
});

const quoteForm = document.querySelector("[data-quote-form]");
quoteForm?.addEventListener("input", () => {
  const quantity = Number(quoteForm.querySelector("[name='quantity']")?.value || 0);
  const cost = Number(quoteForm.querySelector("[name='cost']")?.value || 0);
  const margin = Number(quoteForm.querySelector("[name='margin']")?.value || 0);
  const totalCost = quantity * cost;
  const quote = margin >= 100 ? totalCost : totalCost / (1 - margin / 100);
  const output = document.querySelector("[data-quote-output]");
  if (output) output.textContent = quote && Number.isFinite(quote) ? `INR ${Math.round(quote).toLocaleString("en-IN")}` : "INR 0";
});
