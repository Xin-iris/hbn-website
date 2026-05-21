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

const aiGroups = [...document.querySelectorAll("[data-ai-group]")];

const aiPlans = {
  "暗沉发黄": {
    title: "焕亮稳肤方案",
    score: 87,
    am: "温和清洁后叠加精萃乳，白天用防晒霜减少光损伤。",
    pm: "夜间使用白嫩精华乳与精华霜，帮助稳定肤况并改善暗沉。",
    products: [
      ["essence-lotion.png", "精萃乳", "焕亮打底 / 水润吸收"],
      ["brightening-milk.png", "白嫩精华乳", "均匀肤色 / 提亮暗沉"],
      ["sunscreen.png", "防晒霜", "日间防护 / 轻盈成膜"],
      ["essence-cream.png", "精华霜", "夜间修护 / 滋养锁护"],
    ],
  },
  "屏障脆弱": {
    title: "舒缓屏障修护方案",
    score: 91,
    am: "减少复杂叠加，以洁面乳、神经酰胺精华液和防晒霜建立日间防护。",
    pm: "夜间优先舒缓修护精华液与修护霜，帮助减轻干燥紧绷感。",
    products: [
      ["cleanser.png", "洁面乳", "温和清洁 / 洗后不拔干"],
      ["ceramide-serum.png", "神经酰胺精华液", "强韧屏障 / 舒缓干燥"],
      ["soothing-serum.png", "舒缓修护精华液", "舒缓泛红 / 稳定肤况"],
      ["repair-cream.png", "修护霜", "屏障修护 / 稳定滋养"],
    ],
  },
  "熬夜黑眼圈": {
    title: "熬夜提亮修护方案",
    score: 85,
    am: "晨间用焕彩精华液提升光泽感，再用防晒霜减少日间氧化压力。",
    pm: "夜间搭配精华乳和修护霜，优先处理熬夜后的暗沉与疲惫肤感。",
    products: [
      ["radiance-serum.png", "焕彩精华液", "透亮光泽 / 细腻肤感"],
      ["firming-lotion.png", "精华乳", "紧致修护 / 细腻弹润"],
      ["soothing-serum.png", "舒缓修护精华液", "舒缓压力 / 稳定肤况"],
      ["repair-cream.png", "修护霜", "屏障修护 / 稳定滋养"],
    ],
  },
  "干纹粗糙": {
    title: "弹润锁水修护方案",
    score: 89,
    am: "晨间用精萃乳补充水润感，叠加防晒霜维持日间稳定。",
    pm: "夜间使用精华乳、晚霜和精华霜，改善粗糙并提升弹润度。",
    products: [
      ["essence-lotion.png", "精萃乳", "焕亮打底 / 水润吸收"],
      ["firming-lotion.png", "精华乳", "紧致修护 / 细腻弹润"],
      ["night-cream.png", "晚霜", "夜间修护 / 弹润饱满"],
      ["essence-cream.png", "精华霜", "高阶修护 / 滋养锁护"],
    ],
  },
};

const getSelectedAiValue = (groupName) => {
  const group = document.querySelector(`[data-ai-group="${groupName}"]`);
  return group?.querySelector(".ai-choice.is-selected")?.dataset.value || "";
};

const updateAiResult = () => {
  const concern = getSelectedAiValue("concern") || "暗沉发黄";
  const skin = getSelectedAiValue("skin") || "混合肌";
  const body = getSelectedAiValue("body") || "睡眠不足";
  const habit = getSelectedAiValue("habit") || "步骤精简";
  const plan = aiPlans[concern] || aiPlans["暗沉发黄"];
  const scoreBonus = body === "状态稳定" ? 4 : body === "压力偏高" ? -2 : 0;
  const score = Math.max(78, Math.min(95, plan.score + scoreBonus));

  const title = document.querySelector("[data-ai-title]");
  const subtitle = document.querySelector("[data-ai-subtitle]");
  const scoreLabel = document.querySelector("[data-ai-score]");
  const meter = document.querySelector(".result-meter span");
  const am = document.querySelector("[data-ai-am]");
  const pm = document.querySelector("[data-ai-pm]");

  if (title) title.textContent = plan.title;
  if (subtitle) subtitle.textContent = `适合${skin}、${concern}、${body}与${habit}人群`;
  if (scoreLabel) scoreLabel.textContent = `${score}%`;
  if (meter) meter.style.setProperty("--value", `${score}%`);
  if (am) am.textContent = plan.am;
  if (pm) pm.textContent = plan.pm;

  const tagMap = {
    "[data-ai-skin]": skin,
    "[data-ai-concern]": concern,
    "[data-ai-body]": body,
    "[data-ai-habit]": habit,
  };

  Object.entries(tagMap).forEach(([selector, value]) => {
    const item = document.querySelector(selector);
    if (item) item.textContent = value;
  });

  document.querySelectorAll(".ai-product-grid article").forEach((card, index) => {
    const product = plan.products[index];
    if (!product) return;
    const [image, name, copy] = product;
    const img = card.querySelector("img");
    const heading = card.querySelector("h3");
    const text = card.querySelector("p");
    if (img) {
      img.src = `./assets/products/items/${image}`;
      img.alt = `HBN ${name}`;
    }
    if (heading) heading.textContent = name;
    if (text) text.textContent = copy;
  });
};

aiGroups.forEach((group) => {
  group.addEventListener("click", (event) => {
    const button = event.target.closest(".ai-choice");
    if (!button) return;
    group.querySelectorAll(".ai-choice").forEach((item) => item.classList.remove("is-selected"));
    button.classList.add("is-selected");
    updateAiResult();
  });
});

if (aiGroups.length) {
  updateAiResult();
}
