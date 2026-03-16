// =====================
//   YAP SIM v2.0
// =====================

// --- UPGRADE DEFINITIONS ---
// Each upgrade: id, name, emoji, description, baseCost, costMult, effectType (ypc/yps), effectAmount
const UPGRADE_DEFS = [
  // YpC upgrades
  { id: "loudmouth",     name: "Loudmouth",          emoji: "📢", desc: "+1 Yap/Click",        baseCost: 50,        costMult: 1.5,  type: "ypc", amount: 1 },
  { id: "bigmouth",      name: "Big Mouth",           emoji: "👄", desc: "+2 Yaps/Click",       baseCost: 200,       costMult: 1.55, type: "ypc", amount: 2 },
  { id: "megaphone",     name: "Megaphone",           emoji: "📣", desc: "+5 Yaps/Click",       baseCost: 1000,      costMult: 1.6,  type: "ypc", amount: 5 },
  { id: "bullhorn",      name: "Bullhorn",            emoji: "🔊", desc: "+10 Yaps/Click",      baseCost: 8000,      costMult: 1.65, type: "ypc", amount: 10 },
  { id: "soundsystem",   name: "Sound System",        emoji: "🎛️", desc: "+25 Yaps/Click",      baseCost: 50000,     costMult: 1.7,  type: "ypc", amount: 25 },
  { id: "stadiumsound",  name: "Stadium Sound",       emoji: "🏟️", desc: "+100 Yaps/Click",     baseCost: 500000,    costMult: 1.75, type: "ypc", amount: 100 },

  // YpS upgrades
  { id: "autoyapper",    name: "Auto-Yapper 3000",    emoji: "🤖", desc: "+1 Yap/Sec",          baseCost: 100,       costMult: 1.5,  type: "yps", amount: 1 },
  { id: "yapbot",        name: "Yap Bot",             emoji: "🦾", desc: "+2 Yaps/Sec",         baseCost: 500,       costMult: 1.55, type: "yps", amount: 2 },
  { id: "yapfarm",       name: "Yap Farm",            emoji: "🌾", desc: "+5 Yaps/Sec",         baseCost: 3000,      costMult: 1.6,  type: "yps", amount: 5 },
  { id: "yapfactory",    name: "Yap Factory",         emoji: "🏭", desc: "+10 Yaps/Sec",        baseCost: 20000,     costMult: 1.65, type: "yps", amount: 10 },
  { id: "yapmine",       name: "Yap Mine",            emoji: "⛏️", desc: "+25 Yaps/Sec",        baseCost: 150000,    costMult: 1.7,  type: "yps", amount: 25 },
  { id: "yapdimension",  name: "Yap Dimension",       emoji: "🌀", desc: "+50 Yaps/Sec",        baseCost: 1000000,   costMult: 1.75, type: "yps", amount: 50 },
  { id: "yaptimetravel", name: "Yap Time Travel",     emoji: "⏳", desc: "+100 Yaps/Sec",       baseCost: 10000000,  costMult: 1.8,  type: "yps", amount: 100 },
  { id: "yapgod",        name: "Yap God Mode",        emoji: "✨", desc: "+500 Yaps/Sec",       baseCost: 100000000, costMult: 2.0,  type: "yps", amount: 500 },
];

// --- STATE ---
function loadState() {
  const counts = {};
  UPGRADE_DEFS.forEach(u => {
    counts[u.id] = Number(localStorage.getItem("upg_" + u.id)) || 0;
  });
  return {
    yaps:         Number(localStorage.getItem("yaps"))         || 0,
    lifetimeYaps: Number(localStorage.getItem("lifetimeYaps")) || 0,
    YpC:          Number(localStorage.getItem("YpC"))          || 1,
    YpS:          Number(localStorage.getItem("YpS"))          || 0,
    counts,
  };
}

let state = loadState();

function save() {
  localStorage.setItem("yaps",         state.yaps);
  localStorage.setItem("lifetimeYaps", state.lifetimeYaps);
  localStorage.setItem("YpC",          state.YpC);
  localStorage.setItem("YpS",          state.YpS);
  UPGRADE_DEFS.forEach(u => {
    localStorage.setItem("upg_" + u.id, state.counts[u.id]);
  });
}

// --- COST FORMULA ---
function upgradeCost(def) {
  return Math.floor(def.baseCost * Math.pow(def.costMult, state.counts[def.id]));
}

// --- NUMBER FORMATTING ---
function fmt(n) {
  if (n >= 1e12) return (n / 1e12).toFixed(2) + " trillion";
  if (n >= 1e9)  return (n / 1e9).toFixed(2)  + " billion";
  if (n >= 1e6)  return (n / 1e6).toFixed(2)  + " million";
  if (n >= 1e3)  return (n / 1e3).toFixed(1)  + "k";
  return Math.floor(n).toString();
}

// --- ELEMENTS ---
const yapsDisplay        = document.getElementById("YapsDisplay");
const lifetimeYapsDisplay= document.getElementById("lifetime-yaps");
const YpCDisplay         = document.getElementById("YpCDisplay");
const YpSDisplay         = document.getElementById("YpSDisplay");
const yapButton          = document.getElementById("yap-btn");
const shopItemsEl        = document.getElementById("shop-items");
const settingsButton     = document.getElementById("settingsButton");
const settingsModal      = document.getElementById("settingsModal");
const closeSettingsButton= document.getElementById("closeSettings");
const clearYapsButton    = document.getElementById("clear");
const newsTickerEl       = document.getElementById("news-ticker");
const fakeVisitorsEl     = document.getElementById("fake-visitors");

// --- BUILD SHOP ---
function buildShop() {
  shopItemsEl.innerHTML = "";

  const header = (text) => {
    const h = document.createElement("div");
    h.className = "shop-section-header";
    h.textContent = text;
    shopItemsEl.appendChild(h);
  };

  header("⬆ Yaps Per Click");
  UPGRADE_DEFS.filter(u => u.type === "ypc").forEach(renderUpgrade);
  header("⏱ Yaps Per Second");
  UPGRADE_DEFS.filter(u => u.type === "yps").forEach(renderUpgrade);
}

function renderUpgrade(def) {
  const cost = upgradeCost(def);
  const div = document.createElement("div");
  div.className = "shop-item";
  div.id = "item-" + def.id;

  div.innerHTML = `
    <span class="item-emoji">${def.emoji}</span>
    <span class="item-info">
      <span class="item-name">${def.name}</span>
      <span class="item-desc">${def.desc}</span>
    </span>
    <span class="item-right">
      <span class="item-cost">${fmt(cost)} Yaps</span>
      <span class="item-count">owned: ${state.counts[def.id]}</span>
    </span>
  `;

  div.onclick = () => buyUpgrade(def);
  shopItemsEl.appendChild(div);
}

function buyUpgrade(def) {
  const cost = upgradeCost(def);
  if (state.yaps >= cost) {
    state.yaps -= cost;
    state.counts[def.id]++;
    if (def.type === "ypc") state.YpC += def.amount;
    if (def.type === "yps") state.YpS += def.amount;
    save();
    updateUI();
    refreshShop();
  } else {
    // Flash the item red
    const el = document.getElementById("item-" + def.id);
    el.classList.add("cant-afford");
    setTimeout(() => el.classList.remove("cant-afford"), 500);
  }
}

function refreshShop() {
  UPGRADE_DEFS.forEach(def => {
    const el = document.getElementById("item-" + def.id);
    if (!el) return;
    const cost = upgradeCost(def);
    el.querySelector(".item-cost").textContent = fmt(cost) + " Yaps";
    el.querySelector(".item-count").textContent = "owned: " + state.counts[def.id];
    if (state.yaps >= cost) {
      el.classList.add("can-afford");
      el.classList.remove("cant-buy");
    } else {
      el.classList.remove("can-afford");
      el.classList.add("cant-buy");
    }
  });
}

// --- UI UPDATE ---
function updateUI() {
  yapsDisplay.textContent         = fmt(state.yaps);
  lifetimeYapsDisplay.textContent = fmt(state.lifetimeYaps);
  YpCDisplay.textContent          = fmt(state.YpC);
  YpSDisplay.textContent          = fmt(state.YpS);
  refreshShop();
}

// --- YAP BUTTON ---
yapButton.onclick = () => {
  state.yaps         += state.YpC;
  state.lifetimeYaps += state.YpC;
  save();
  updateUI();
  spawnFloaty(state.YpC);
};

// Floating +N on click
function spawnFloaty(n) {
  const el = document.createElement("div");
  el.className = "floaty";
  el.textContent = "+" + fmt(n);
  const btn = yapButton.getBoundingClientRect();
  el.style.left = (btn.left + btn.width / 2 + window.scrollX - 20) + "px";
  el.style.top  = (btn.top  + window.scrollY - 10) + "px";
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 900);
}

// --- SETTINGS ---
settingsButton.onclick     = () => settingsModal.show();
closeSettingsButton.onclick= () => settingsModal.close();
clearYapsButton.onclick = () => {
  if (!confirm("Are you SURE you want to clear all data?? This cannot be undone!!")) return;
  localStorage.clear();
  state = loadState();
  updateUI();
  settingsModal.close();
};

// --- TICK ---
setInterval(() => {
  if (state.YpS > 0) {
    state.yaps         += state.YpS;
    state.lifetimeYaps += state.YpS;
    save();
    updateUI();
  }
}, 1000);

// --- FAKE VISITORS ---
setInterval(() => {
  const v = 280 + Math.floor(Math.random() * 80);
  fakeVisitorsEl.textContent = v;
}, 5000);

// --- NEWS TICKER ---
const newsItems = [
  "Local man yaps for 72 hours straight, sets world record!!",
  "Scientists baffled by new yapping phenomenon sweeping the nation",
  "Yap economy booms as citizens demand more yapping content",
  "Breaking: Yap Farm discovered in remote location, yield astronomical",
  "Auto-Yapper 3000 recalled for being too powerful",
  "New study: yapping linked to increased happiness and productivity",
  "Yap God Mode unlocked by only 3 players worldwide",
  "Stock market replaced entirely by Yap economy, economists stunned",
  "Mayor declares Yapping Awareness Week, yapping increases 400%",
  "Experts warn of Yap bubble, advise continued yapping anyway",
];
let newsIdx = 0;
function rotatNews() {
  newsTickerEl.textContent = newsItems[newsIdx % newsItems.length];
  newsIdx++;
}
rotatNews();
setInterval(rotatNews, 6000);

// --- BOOT ---
buildShop();
updateUI();
