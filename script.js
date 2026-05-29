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

const hbnProductCatalog = {
  "repair-cream": {
    name: "修护霜",
    category: "屏障修护",
    price: 329,
    image: "repair-cream.png",
    summary: "面向干燥、紧绷与屏障脆弱状态，提供夜间滋养锁护，让肌肤回到稳定秩序。",
    stat: "屏障修护",
    statLabel: "功效焦点",
    statCopy: "舒缓干燥紧绷，提升肌肤稳定感",
    proofTitle: "把修护做成可感知的稳定力",
    claims: ["复配滋养油脂与保湿体系，减少干燥粗糙感", "适合换季、熬夜后与刷酸后的日常修护", "霜体包裹感强，帮助夜间锁住水分"],
    usage: "晚间护肤最后一步取适量，沿面部纹理轻柔推开，干燥区域可局部加厚。",
    step: "作为修护收尾，帮助前序精华停留并形成舒适锁护感。",
    related: ["ceramide-serum", "soothing-serum", "cleanser"],
  },
  "radiance-serum": {
    name: "焕彩精华液",
    category: "光泽管理",
    price: 389,
    image: "radiance-serum.png",
    summary: "针对熬夜暗沉、肤色不匀和光泽不足，建立轻盈高效的日常焕彩步骤。",
    stat: "透亮光泽",
    statLabel: "功效焦点",
    statCopy: "提升肌肤细腻度与光泽表现",
    proofTitle: "让熬夜后的光泽感回到脸上",
    claims: ["轻盈质地适合早晚叠加，不压肤感", "改善暗沉发灰观感，帮助肤色更均匀", "适合与防晒组成日间抗氧化防护路径"],
    usage: "洁面和爽肤后使用 1-2 泵，轻拍至吸收，白天建议叠加防晒。",
    step: "作为精华步骤，优先处理肤色暗沉和光泽不足。",
    related: ["sunscreen", "brightening-milk", "essence-cream"],
  },
  cleanser: {
    name: "洁面乳",
    category: "温和清洁",
    price: 159,
    image: "cleanser.png",
    summary: "日常清洁油脂、汗液与防晒残留，洗后保留柔润肤感，减少清洁后的紧绷。",
    stat: "温和清洁",
    statLabel: "功效焦点",
    statCopy: "洗后不拔干，适合作为功效护肤第一步",
    proofTitle: "先把清洁做温和，后续功效才有秩序",
    claims: ["细腻泡沫带走日常油污和老废角质", "减少过度清洁带来的紧绷不适", "适合晨间清洁与晚间二次清洁"],
    usage: "取适量加水揉搓起泡，按摩面部 30 秒后清水洗净。",
    step: "作为护肤第一步，帮助后续功效产品更均匀地铺展。",
    related: ["essence-lotion", "ceramide-serum", "repair-cream"],
  },
  "night-cream": {
    name: "晚霜",
    category: "夜间修护",
    price: 429,
    image: "night-cream.png",
    summary: "围绕夜间肌肤修护节律，改善熬夜后的干燥、暗沉与粗糙感。",
    stat: "夜间修护",
    statLabel: "功效焦点",
    statCopy: "睡前锁护，醒后肤感更饱满",
    proofTitle: "让夜间护理承担真正的修护价值",
    claims: ["丰润霜体适合夜间集中护理", "帮助改善粗糙和干纹带来的疲惫感", "与精华乳搭配使用，形成弹润修护路径"],
    usage: "晚间精华后使用，取珍珠大小均匀涂抹，干燥部位可重复叠加。",
    step: "作为夜间霜类步骤，帮助完成滋养与锁护。",
    related: ["firming-lotion", "essence-cream", "repair-cream"],
  },
  "essence-lotion": {
    name: "精萃乳",
    category: "焕亮打底",
    price: 299,
    image: "essence-lotion.png",
    summary: "水润轻盈的打底型产品，帮助改善黑黄暗沉，让后续精华路径更顺畅。",
    stat: "水润焕亮",
    statLabel: "功效焦点",
    statCopy: "均匀肤色打底，提升后续吸收感",
    proofTitle: "把焕亮放进每天都能坚持的第一步",
    claims: ["质地清爽，适合晨间快速吸收", "帮助改善肤色不匀和暗沉观感", "与精华乳搭配形成水乳型功效路径"],
    usage: "洁面后取适量轻拍全脸，待吸收后叠加精华或乳霜。",
    step: "作为打底步骤，建立水润、轻盈、可持续的功效路径。",
    related: ["firming-lotion", "brightening-milk", "sunscreen"],
  },
  "firming-lotion": {
    name: "精华乳",
    category: "紧致修护",
    price: 339,
    image: "firming-lotion.png",
    summary: "聚焦细腻、弹润与初老压力，适合希望提升肤感质地的人群。",
    stat: "细腻弹润",
    statLabel: "功效焦点",
    statCopy: "强化弹润支撑，改善粗糙纹理",
    proofTitle: "用乳液质地承接紧致修护需求",
    claims: ["轻润乳感，适合多数肤质日常使用", "改善粗糙纹理，提升细腻触感", "与晚霜或精华霜叠加，增强夜间修护感"],
    usage: "精华水后取 1-2 泵，顺面部轮廓向上涂抹。",
    step: "作为乳液步骤，在轻盈肤感中补充紧致修护。",
    related: ["essence-lotion", "night-cream", "essence-cream"],
  },
  sunscreen: {
    name: "防晒霜",
    category: "日间防护",
    price: 229,
    image: "sunscreen.png",
    summary: "轻盈日间防护产品，帮助减少光老化、暗沉反复和肤色不匀压力。",
    stat: "SPF50+",
    statLabel: "防护指数",
    statCopy: "PA++++，适合日常通勤防护",
    proofTitle: "日间防护，是功效护肤的必要闭环",
    claims: ["轻盈成膜，减少厚重闷感", "帮助降低紫外线带来的暗沉反复", "适合与焕亮产品组成晨间护肤路径"],
    usage: "晨间护肤最后一步使用，出门前 15 分钟均匀涂抹，户外场景及时补涂。",
    step: "作为日间最后一步，保护前序功效成果。",
    related: ["radiance-serum", "essence-lotion", "brightening-milk"],
  },
  "essence-cream": {
    name: "精华霜",
    category: "高阶修护",
    price: 459,
    image: "essence-cream.png",
    summary: "高浓度霜体质地，适合夜间集中修护，改善暗沉、粗糙与干燥后的屏障压力。",
    stat: "夜间强修护",
    statLabel: "功效焦点",
    statCopy: "高阶滋养锁护，提升肌肤饱满感",
    proofTitle: "把霜体做成功效与肤感兼具的夜间样本",
    claims: ["丰润但不粘腻，适合夜间集中护理", "改善干燥粗糙造成的疲惫肤感", "与焕彩精华液搭配，形成光泽修护路径"],
    usage: "晚间精华或乳液后使用，避开眼周，轻柔按压至吸收。",
    step: "作为高阶霜类步骤，完成夜间滋养和锁护。",
    related: ["radiance-serum", "night-cream", "firming-lotion"],
  },
  "brightening-milk": {
    name: "白嫩精华乳",
    category: "均匀肤色",
    price: 369,
    image: "brightening-milk.png",
    summary: "针对黑黄暗沉和肤色不匀，温和焕亮，让肌肤呈现更透净的原生光泽。",
    stat: "96.9%",
    statLabel: "功效认可",
    statCopy: "用户认可美白淡斑真功效",
    proofTitle: "让焕白功效名副其实",
    claims: ["针对黑黄暗沉、顽固痘印与色斑", "质地温和，适合持续型焕亮护理", "白天务必搭配防晒，减少暗沉反复"],
    usage: "早晚使用，取适量均匀涂抹，白天搭配防晒。",
    step: "作为焕亮精华乳步骤，集中处理肤色不匀。",
    related: ["sunscreen", "essence-lotion", "radiance-serum"],
  },
  "ceramide-serum": {
    name: "神经酰胺精华液",
    category: "屏障强韧",
    price: 319,
    image: "ceramide-serum.png",
    summary: "为干燥、敏感、屏障受损状态补充强韧支持，帮助肌肤维持稳定。",
    stat: "强韧屏障",
    statLabel: "功效焦点",
    statCopy: "适合干燥敏感与换季不稳定状态",
    proofTitle: "稳定，是功效护肤的基础条件",
    claims: ["补充屏障护理所需的脂质支持", "帮助改善干燥、粗糙和紧绷", "适合与修护霜组成屏障护理套组"],
    usage: "洁面后或爽肤后使用，轻拍至吸收，再叠加乳霜。",
    step: "作为修护精华步骤，优先处理屏障脆弱状态。",
    related: ["repair-cream", "soothing-serum", "cleanser"],
  },
  "soothing-serum": {
    name: "舒缓修护精华液",
    category: "舒缓稳定",
    price: 359,
    image: "soothing-serum.png",
    summary: "针对换季泛红、熬夜压力与不稳定肤况，帮助肌肤恢复舒适状态。",
    stat: "舒缓泛红",
    statLabel: "功效焦点",
    statCopy: "帮助维持肌肤稳定，减少不适感",
    proofTitle: "把舒缓做成日常可坚持的修护步骤",
    claims: ["适合压力期、换季期与屏障波动期", "轻盈精华质地，减少厚重负担", "与神经酰胺精华液搭配增强稳定感"],
    usage: "洁面后使用，泛红不适区域可局部加量，后续叠加修护霜。",
    step: "作为舒缓精华步骤，帮助肌肤从不稳定回到稳定。",
    related: ["ceramide-serum", "repair-cream", "night-cream"],
  },
};

Object.values(hbnProductCatalog).forEach((product) => {
  product.variants = [
    { key: "single", label: "单品正装", note: "适合首次体验", price: product.price },
    { key: "set", label: "功效套组", note: "正装 + 旅行装", price: product.price + 120 },
    { key: "double", label: "囤货双件", note: "双件更划算", price: Math.round(product.price * 1.82) },
  ];
});

const cartStorageKey = "hbn-commerce-cart";

const money = (value) => `¥${Number(value || 0).toLocaleString("zh-CN")}`;

const readCart = () => {
  try {
    return JSON.parse(localStorage.getItem(cartStorageKey)) || [];
  } catch {
    return [];
  }
};

const writeCart = (cart) => {
  localStorage.setItem(cartStorageKey, JSON.stringify(cart));
};

const findVariant = (product, variantKey) =>
  product.variants.find((variant) => variant.key === variantKey) || product.variants[0];

const ensureCartDrawer = () => {
  if (document.querySelector("[data-cart-root]")) return;
  document.body.insertAdjacentHTML(
    "beforeend",
    `<div class="cart-layer" data-cart-root aria-hidden="true">
      <button class="cart-backdrop" type="button" data-cart-close aria-label="关闭购物车"></button>
      <aside class="cart-drawer" aria-label="购物车">
        <div class="cart-head">
          <div>
            <p class="eyebrow">HBN Cart</p>
            <h2>购物车</h2>
          </div>
          <button type="button" data-cart-close>关闭</button>
        </div>
        <div class="cart-items" data-cart-items></div>
        <div class="cart-footer">
          <div><span>商品合计</span><strong data-cart-total>¥0</strong></div>
          <button type="button" class="checkout-button">确认购买</button>
          <button type="button" class="clear-cart" data-cart-action="clear">清空购物车</button>
        </div>
      </aside>
    </div>`
  );
};

const renderCart = () => {
  const cart = readCart();
  const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  document.querySelectorAll("[data-cart-count]").forEach((item) => {
    item.textContent = totalCount;
  });

  const itemsRoot = document.querySelector("[data-cart-items]");
  const totalRoot = document.querySelector("[data-cart-total]");
  if (!itemsRoot || !totalRoot) return;

  totalRoot.textContent = money(total);

  if (!cart.length) {
    itemsRoot.innerHTML = `<div class="empty-cart">购物车还没有商品。可以从商城卡片或详情页加入产品。</div>`;
    return;
  }

  itemsRoot.innerHTML = cart
    .map((item) => {
      const product = hbnProductCatalog[item.id];
      if (!product) return "";
      return `<article class="cart-item">
        <img src="./assets/products/items/${product.image}" alt="HBN ${product.name}" />
        <div>
          <h3>${product.name}</h3>
          <p>${item.variantLabel}</p>
          <strong>${money(item.price)}</strong>
        </div>
        <div class="cart-qty">
          <button type="button" data-cart-action="decrease" data-cart-key="${item.key}">-</button>
          <span>${item.qty}</span>
          <button type="button" data-cart-action="increase" data-cart-key="${item.key}">+</button>
        </div>
        <button class="cart-remove" type="button" data-cart-action="remove" data-cart-key="${item.key}">移除</button>
      </article>`;
    })
    .join("");
};

const openCart = () => {
  ensureCartDrawer();
  renderCart();
  document.body.classList.add("cart-open");
  document.querySelector("[data-cart-root]")?.setAttribute("aria-hidden", "false");
};

const closeCart = () => {
  document.body.classList.remove("cart-open");
  document.querySelector("[data-cart-root]")?.setAttribute("aria-hidden", "true");
};

const addToCart = (productId, variantKey = "single", qty = 1) => {
  const product = hbnProductCatalog[productId];
  if (!product) return;
  const variant = findVariant(product, variantKey);
  const key = `${productId}:${variant.key}`;
  const cart = readCart();
  const existing = cart.find((item) => item.key === key);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({
      key,
      id: productId,
      variantKey: variant.key,
      variantLabel: variant.label,
      price: variant.price,
      qty,
    });
  }
  writeCart(cart);
  openCart();
};

let detailProductId = "";
let detailVariantKey = "single";
let detailQty = 1;

const updateDetailPrice = () => {
  const product = hbnProductCatalog[detailProductId];
  if (!product) return;
  const variant = findVariant(product, detailVariantKey);
  const priceRoot = document.querySelector("[data-detail-price]");
  const qtyRoot = document.querySelector("[data-detail-qty]");
  if (priceRoot) priceRoot.textContent = money(variant.price * detailQty);
  if (qtyRoot) qtyRoot.textContent = detailQty;
};

const initProductDetail = () => {
  const detailRoot = document.querySelector("[data-product-detail]");
  if (!detailRoot) return;

  const params = new URLSearchParams(window.location.search);
  detailProductId = params.get("id") || "essence-lotion";
  const product = hbnProductCatalog[detailProductId] || hbnProductCatalog["essence-lotion"];
  detailProductId = Object.entries(hbnProductCatalog).find(([, value]) => value === product)?.[0] || "essence-lotion";

  document.title = `HBN ${product.name} | 产品详情`;
  document.querySelector("[data-detail-image]").src = `./assets/products/items/${product.image}`;
  document.querySelector("[data-detail-image]").alt = `HBN ${product.name}`;
  document.querySelector("[data-detail-category]").textContent = product.category;
  document.querySelector("[data-detail-name]").textContent = product.name;
  document.querySelector("[data-detail-summary]").textContent = product.summary;
  document.querySelector("[data-detail-stat]").textContent = product.stat;
  document.querySelector("[data-detail-stat-label]").textContent = product.statLabel;
  document.querySelector("[data-detail-stat-copy]").textContent = product.statCopy;
  document.querySelector("[data-detail-proof-title]").textContent = product.proofTitle;
  document.querySelector("[data-detail-usage]").textContent = product.usage;
  document.querySelector("[data-detail-step]").textContent = product.step;

  document.querySelector("[data-variant-options]").innerHTML = product.variants
    .map(
      (variant, index) =>
        `<button type="button" class="variant-choice ${index === 0 ? "is-selected" : ""}" data-variant-key="${variant.key}">
          <strong>${variant.label}</strong>
          <span>${variant.note}</span>
          <em>${money(variant.price)}</em>
        </button>`
    )
    .join("");

  document.querySelector("[data-detail-claims]").innerHTML = product.claims
    .map((claim, index) => `<article><span>0${index + 1}</span><p>${claim}</p></article>`)
    .join("");

  document.querySelector("[data-related-products]").innerHTML = product.related
    .map((id) => {
      const related = hbnProductCatalog[id];
      return `<article class="related-card">
        <a href="./product-detail.html?id=${id}">
          <img src="./assets/products/items/${related.image}" alt="HBN ${related.name}" />
          <h3>${related.name}</h3>
          <p>${related.category}</p>
          <strong>${money(related.price)}</strong>
        </a>
        <button type="button" data-add-to-cart data-product-id="${id}">加入购物车</button>
      </article>`;
    })
    .join("");

  detailVariantKey = product.variants[0].key;
  detailQty = 1;
  updateDetailPrice();
};

if (document.querySelector("[data-cart-open]") || document.querySelector("[data-add-to-cart]") || document.querySelector("[data-product-detail]")) {
  ensureCartDrawer();
  renderCart();
}

initProductDetail();

document.addEventListener("click", (event) => {
  const cartOpen = event.target.closest("[data-cart-open]");
  if (cartOpen) {
    openCart();
    return;
  }

  if (event.target.closest("[data-cart-close]")) {
    closeCart();
    return;
  }

  const addButton = event.target.closest("[data-add-to-cart]");
  if (addButton) {
    addToCart(addButton.dataset.productId, addButton.dataset.variantKey || "single", 1);
    return;
  }

  const variantButton = event.target.closest("[data-variant-key]");
  if (variantButton) {
    detailVariantKey = variantButton.dataset.variantKey;
    document.querySelectorAll("[data-variant-key]").forEach((button) => button.classList.remove("is-selected"));
    variantButton.classList.add("is-selected");
    updateDetailPrice();
    return;
  }

  if (event.target.closest("[data-qty-minus]")) {
    detailQty = Math.max(1, detailQty - 1);
    updateDetailPrice();
    return;
  }

  if (event.target.closest("[data-qty-plus]")) {
    detailQty += 1;
    updateDetailPrice();
    return;
  }

  if (event.target.closest("[data-detail-add]")) {
    addToCart(detailProductId, detailVariantKey, detailQty);
    return;
  }

  const checkoutButton = event.target.closest(".checkout-button");
  if (checkoutButton) {
    checkoutButton.textContent = "已生成购买清单";
    setTimeout(() => {
      checkoutButton.textContent = "确认购买";
    }, 1800);
    return;
  }

  const cartActionButton = event.target.closest("[data-cart-action]");
  if (!cartActionButton) return;

  const action = cartActionButton.dataset.cartAction;
  const key = cartActionButton.dataset.cartKey;
  let cart = readCart();

  if (action === "clear") {
    cart = [];
  } else if (action === "remove") {
    cart = cart.filter((item) => item.key !== key);
  } else if (action === "increase") {
    cart = cart.map((item) => (item.key === key ? { ...item, qty: item.qty + 1 } : item));
  } else if (action === "decrease") {
    cart = cart
      .map((item) => (item.key === key ? { ...item, qty: item.qty - 1 } : item))
      .filter((item) => item.qty > 0);
  }

  writeCart(cart);
  renderCart();
});
