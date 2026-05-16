const revealItems = document.querySelectorAll("[data-reveal]");

document.querySelectorAll(".marquee-track").forEach((track) => {
  track.innerHTML += track.innerHTML;
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const updateScrolledState = () => {
  document.body.classList.toggle("is-scrolled", window.scrollY > 36);
};

updateScrolledState();
window.addEventListener("scroll", updateScrolledState, { passive: true });

const sideLinks = [...document.querySelectorAll(".side-anchor-nav a")];
const sideTargets = sideLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if (sideLinks.length && sideTargets.length) {
  const sideObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        sideLinks.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    },
    { rootMargin: "-42% 0px -48% 0px", threshold: 0.01 }
  );

  sideTargets.forEach((target) => sideObserver.observe(target));
}

document.querySelectorAll(".option-row").forEach((row) => {
  row.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    row.querySelectorAll("button").forEach((item) => item.classList.remove("is-selected"));
    button.classList.add("is-selected");
  });
});
