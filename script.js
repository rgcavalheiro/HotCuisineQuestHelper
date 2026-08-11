let currentStep = 0;
let recipeMultiplier = 1;

/* Origem do PNG composto do TibiaMaps (1 px = 1 sqm) */
const MAP_ORIGIN = { x: 31744, y: 30976 };
const MINIMAP_SCALE = 2;
const WIKI_FILE = "https://tibia.fandom.com/wiki/Special:FilePath/";
const MAP_ICON_SVG = [
    '<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">',
    '<rect x="1" y="2" width="14" height="12" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.4"/>',
    '<path d="M1 7.5h14M8 2v12" stroke="currentColor" stroke-width="1.2" opacity=".55"/>',
    '<circle cx="5.2" cy="5.5" r="1.3" fill="#3d9e4f"/>',
    '<circle cx="11" cy="10" r="1.3" fill="#3a7bd5"/>',
    '<rect x="7" y="8.2" width="2.2" height="2.2" fill="#c45c26"/>',
    '</svg>'
].join('');

const initialScreen = document.getElementById("initialScreen");
const marketScreen = document.getElementById("marketScreen");
const stepContent = document.getElementById("stepContent");
const mapModal = document.getElementById("mapModal");
const minimapImage = document.getElementById("minimapImage");
const minimapViewport = document.getElementById("minimapViewport");
const mapModalNpc = document.getElementById("mapModalNpc");

document.getElementById("recipeRange").addEventListener("input", function () {
    recipeMultiplier = Number(this.value);
    document.getElementById("rangeValue").innerText = this.value;
    updateMarketItems();
});

document.getElementById("startQuest").addEventListener("click", function () {
    showScreen("market");
    updateMarketItems();
});

document.getElementById("backFromMarket").addEventListener("click", function () {
    showScreen("initial");
});

document.getElementById("goToSteps").addEventListener("click", function () {
    showScreen("steps");
    updateStep();
});

document.getElementById("prevStep").addEventListener("click", function () {
    if (currentStep > 0) {
        currentStep--;
        updateStep();
        return;
    }
    showScreen("market");
});

document.getElementById("nextStep").addEventListener("click", function () {
    if (currentStep < steps.length - 1) {
        currentStep++;
        updateStep();
        return;
    }
    alert("Voc\u00ea completou todos os passos!");
});

document.getElementById("restartQuest").addEventListener("click", function () {
    currentStep = 0;
    showScreen("initial");
});

document.getElementById("stepDescription").addEventListener("click", function (event) {
    const button = event.target.closest("[data-npc-map]");
    if (!button) return;
    openMapModal(button.getAttribute("data-npc-map"));
});

mapModal.querySelectorAll("[data-close-modal]").forEach((el) => {
    el.addEventListener("click", closeMapModal);
});

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !mapModal.hidden) {
        closeMapModal();
    }
});

window.addEventListener("resize", function () {
    if (!mapModal.hidden && mapModal.dataset.npc) {
        positionMinimap(mapModal.dataset.npc);
    }
});

function wikiImage(fileName) {
    return WIKI_FILE + encodeURIComponent(fileName);
}

function itemImageUrl(itemName) {
    const file = itemSprites[itemName];
    return file ? wikiImage(file) : "";
}

function npcImageUrl(npcName) {
    return wikiImage(npcName + ".gif");
}

function showScreen(name) {
    initialScreen.style.display = name === "initial" ? "flex" : "none";
    marketScreen.style.display = name === "market" ? "flex" : "none";
    stepContent.style.display = name === "steps" ? "flex" : "none";
    document.getElementById("app").classList.toggle("app--compact", name !== "initial");
}

function renderItemChip(item, qty) {
    const src = itemImageUrl(item);
    const icon = src
        ? '<img class="item-icon" src="' + escapeAttr(src) + '" alt="" width="32" height="32" loading="lazy">'
        : '<span class="item-icon item-icon--empty" aria-hidden="true"></span>';

    return [
        '<div class="item-chip" title="' + escapeAttr(item) + '">',
        icon,
        '<span class="item-qty">' + qty + 'x</span>',
        '<span class="item-name">' + escapeHtml(item) + '</span>',
        '</div>'
    ].join('');
}

function updateMarketItems() {
    document.getElementById("marketGrid").innerHTML = marketItems
        .map((item) => renderItemChip(item.item, item.quantity * recipeMultiplier))
        .join('');
}

function updateStep() {
    const step = steps[currentStep];
    document.getElementById("stepTitle").innerText = step.title;
    document.getElementById("stepCounter").innerText =
        "Passo " + (currentStep + 1) + " de " + steps.length;

    renderStepProgress();

    const nextBtn = document.getElementById("nextStep");
    nextBtn.textContent = currentStep === steps.length - 1
        ? "Concluir"
        : "Pr\u00f3ximo Passo";

    const descriptionEl = document.getElementById("stepDescription");

    if (Array.isArray(step.description)) {
        const npcCount = step.description.length;
        descriptionEl.className = "step-body step-body--npcs npc-count-" + npcCount;
        descriptionEl.innerHTML = step.description.map((npcGroup) => {
            const hasMap = Boolean(npcLocations[npcGroup.npc]);
            const mapButton = hasMap
                ? '<button type="button" class="map-btn" data-npc-map="' +
                  escapeAttr(npcGroup.npc) +
                  '" title="Ver no mapa" aria-label="Ver ' +
                  escapeAttr(npcGroup.npc) +
                  ' no mapa">' + MAP_ICON_SVG + '</button>'
                : "";

            return [
                '<article class="npc-block">',
                '<header class="npc-heading">',
                '<img class="npc-sprite" src="' + escapeAttr(npcImageUrl(npcGroup.npc)) +
                '" alt="' + escapeAttr(npcGroup.npc) + '" width="48" height="48" loading="lazy">',
                '<span class="npc-name">' + escapeHtml(npcGroup.npc) + '</span>',
                mapButton,
                '</header>',
                '<div class="item-grid item-grid--npc">',
                npcGroup.items.map((item) =>
                    renderItemChip(item.item, item.quantity * recipeMultiplier)
                ).join(''),
                '</div>',
                '</article>'
            ].join('');
        }).join('');
    } else {
        descriptionEl.className = "step-body step-body--narrative";
        let html = '<p class="narrative">' + escapeHtml(step.description) + '</p>';
        if (step.collect && step.collect.length) {
            html += '<div class="item-grid item-grid--collect">' +
                step.collect.map((item) =>
                    renderItemChip(item.item, item.quantity * recipeMultiplier)
                ).join('') +
                '</div>';
        }
        descriptionEl.innerHTML = html;
    }

    if (step.transport) {
        descriptionEl.innerHTML +=
            '<p class="transport-note"><strong>Transporte:</strong> ' +
            escapeHtml(step.transport) + '</p>';
    }
}

function renderStepProgress() {
    const progress = document.getElementById("stepProgress");
    progress.innerHTML = steps.map((_, index) => {
        let cls = "step-dot";
        if (index < currentStep) cls += " is-done";
        if (index === currentStep) cls += " is-current";
        return '<span class="' + cls + '" title="Passo ' + (index + 1) + '"></span>';
    }).join('');
}

function openMapModal(npcName) {
    const location = npcLocations[npcName];
    if (!location) return;

    mapModal.hidden = false;
    mapModal.dataset.npc = npcName;
    document.body.style.overflow = "hidden";

    document.getElementById("mapModalTitle").textContent = npcName;
    document.getElementById("mapModalCity").textContent = location.city;
    document.getElementById("mapCoords").textContent =
        "X: " + location.x + "  Y: " + location.y + "  Z: " + location.z;

    mapModalNpc.hidden = false;
    mapModalNpc.src = npcImageUrl(npcName);
    mapModalNpc.alt = npcName;

    const floor = String(location.z).padStart(2, "0");
    const mapUrl = "https://tibiamaps.github.io/tibia-map-data/floor-" + floor + "-map.png";
    const external = "https://tibiamaps.io/map#" + location.x + "," + location.y + "," + location.z + ":2";
    document.getElementById("mapExternalLink").href = external;

    minimapImage.onload = function () { positionMinimap(npcName); };
    const absoluteUrl = new URL(mapUrl, window.location.href).href;
    if (minimapImage.src !== absoluteUrl) {
        minimapImage.src = mapUrl;
    } else if (minimapImage.complete && minimapImage.naturalWidth) {
        positionMinimap(npcName);
    }
}

function positionMinimap(npcName) {
    const location = npcLocations[npcName];
    if (!location || !minimapViewport) return;

    const viewSize = minimapViewport.clientWidth;
    const pixelX = location.x - MAP_ORIGIN.x;
    const pixelY = location.y - MAP_ORIGIN.y;

    minimapImage.style.width = (minimapImage.naturalWidth * MINIMAP_SCALE) + "px";
    minimapImage.style.height = (minimapImage.naturalHeight * MINIMAP_SCALE) + "px";
    minimapImage.style.transform =
        "translate(" + (viewSize / 2 - pixelX * MINIMAP_SCALE) + "px, " +
        (viewSize / 2 - pixelY * MINIMAP_SCALE) + "px)";
}

function closeMapModal() {
    mapModal.hidden = true;
    delete mapModal.dataset.npc;
    document.body.style.overflow = "";
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function escapeAttr(value) {
    return escapeHtml(value).replace(/'/g, "&#39;");
}

function applyUrlState() {
    const params = new URLSearchParams(window.location.search);
    const screen = params.get("screen");
    const stepParam = params.get("step");

    if (stepParam !== null) {
        const parsed = Number(stepParam);
        if (!Number.isNaN(parsed) && parsed >= 1 && parsed <= steps.length) {
            currentStep = parsed - 1;
        }
    }

    if (screen === "market") {
        showScreen("market");
        updateMarketItems();
        return;
    }

    if (screen === "steps") {
        showScreen("steps");
        updateStep();
        return;
    }

    showScreen("initial");
}

updateMarketItems();
applyUrlState();
