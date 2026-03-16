// Variables
let yaps = Number(localStorage.getItem("yaps")) || 0;
let YpC = Number(localStorage.getItem("YpC")) || 1;
let lifetimeYaps = Number(localStorage.getItem("lifetimeYaps")) || 0;
let YpS = Number(localStorage.getItem("YpS")) || 0;

// Define Elements
const yapsDisplay = document.getElementById("YapsDisplay");
const lifetimeYapsDisplay = document.getElementById("lifetime-yaps"); // FIX: this element now exists in HTML
const YpCDisplay = document.getElementById("YpCDisplay");
const YpSDisplay = document.getElementById("YpSDisplay");
const yapButton = document.getElementById("yap-btn");

const settingsButton = document.getElementById("settingsButton");
const settingsModal = document.getElementById("settingsModal");
const shopButton = document.getElementById("shopButton");
const shopModal = document.getElementById("shopModal");
const closeSettingsButton = document.getElementById("closeSettings");
const clearYapsButton = document.getElementById("clear");
const closeShopButton = document.getElementById("closeShop");

// Functions
function save() {
    localStorage.setItem("yaps", yaps);
    localStorage.setItem("YpC", YpC);
    localStorage.setItem("lifetimeYaps", lifetimeYaps);
    localStorage.setItem("YpS", YpS);
}

function updateUI() {
    yapsDisplay.textContent = yaps;
    lifetimeYapsDisplay.textContent = lifetimeYaps;
    YpCDisplay.textContent = YpC;
    YpSDisplay.textContent = YpS;
}

// Logic Handling
yapButton.onclick = () => {
    yaps += YpC;
    lifetimeYaps += YpC;
    save();
    updateUI();
};

clearYapsButton.onclick = () => {
    yaps = 0;
    lifetimeYaps = 0;
    YpC = 1;
    YpS = 0;
    save();
    updateUI();
    settingsModal.close();
};

settingsButton.onclick = () => {
    settingsModal.show();
};

closeSettingsButton.onclick = () => {
    settingsModal.close();
};

shopButton.onclick = () => {
    shopModal.show();
};

closeShopButton.onclick = () => {
    shopModal.close();
};

// --- SHOP ---

document.getElementById("upgrade1").onclick = () => {
    if (yaps >= 50) {
        yaps -= 50;
        YpC += 1;
        updateUI();
        save();
    } else {
        alert("Not enough Yaps!! Keep yapping!!");
    }
};

document.getElementById("upgrade2").onclick = () => {
    if (yaps >= 100) {
        yaps -= 100;
        YpS += 1;
        updateUI();
        save();
    } else {
        alert("Not enough Yaps!! Keep yapping!!");
    }
};

// Tick Function
setInterval(() => {
    if (YpS > 0) {
        yaps += YpS;
        lifetimeYaps += YpS;
        save();
        updateUI();
    }
}, 1000);

// Run on boot
updateUI();
