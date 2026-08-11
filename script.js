const STORAGE_KEY = "hotCuisineQuest:v1";
const STATUS_CYCLE = ["needed", "bought", "owned"];
const STATUS_LABEL = {
    needed: "Precisa comprar",
    bought: "Comprado",
    owned: "J\u00e1 possui"
};

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

const state = {
    view: "overview",
    currentStep: 0,
    recipeMultiplier: 1,
    itemStatus: {}
};

const viewRoot = document.getElementById("viewRoot");
const journeyChrome = document.getElementById("journeyChrome");
const journeyTracker = document.getElementById("journeyTracker");
const stepContext = document.getElementById("stepContext");
const actionBar = document.getElementById("actionBar");
const btnBack = document.getElementById("btnBack");
const btnPrimary = document.getElementById("btnPrimary");
const btnRestart = document.getElementById("btnRestart");
const mapModal = document.getElementById("mapModal");
const minimapImage = document.getElementById("minimapImage");
const minimapViewport = document.getElementById("minimapViewport");
const mapModalNpc = document.getElementById("mapModalNpc");
const toastEl = document.getElementById("toast");
const appEl = document.getElementById("app");

let toastTimer = null;

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

function isDoneStatus(status) {
    return status === "bought" || status === "owned";
}

function getItemStatus(itemId) {
    return state.itemStatus[itemId] || "needed";
}

function cycleItemStatus(itemId) {
    const current = getItemStatus(itemId);
    const next = STATUS_CYCLE[(STATUS_CYCLE.indexOf(current) + 1) % STATUS_CYCLE.length];
    state.itemStatus[itemId] = next;
    saveState();
    return next;
}

function saveState() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
            view: state.view,
            currentStep: state.currentStep,
            recipeMultiplier: state.recipeMultiplier,
            itemStatus: state.itemStatus
        }));
    } catch (err) {
        /* ignore quota / private mode */
    }
}

function loadState() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        const data = JSON.parse(raw);
        if (data.view) state.view = data.view;
        if (state.view === "checklist") state.view = "prep";
        if (typeof data.currentStep === "number") state.currentStep = data.currentStep;
        if (typeof data.recipeMultiplier === "number") {
            state.recipeMultiplier = Math.min(10, Math.max(1, data.recipeMultiplier));
        }
        if (data.itemStatus && typeof data.itemStatus === "object") {
            state.itemStatus = data.itemStatus;
        }
    } catch (err) {
        /* ignore corrupt storage */
    }
}

function resetProgress() {
    state.view = "overview";
    state.currentStep = 0;
    state.itemStatus = {};
    saveState();
    render();
}

function hasProgress() {
    return Object.keys(state.itemStatus).some((id) => isDoneStatus(state.itemStatus[id]))
        || state.view !== "overview"
        || state.currentStep > 0;
}

function getProgressCounts() {
    const items = getAllQuestItems(state.recipeMultiplier);
    let done = 0;
    items.forEach((entry) => {
        if (isDoneStatus(getItemStatus(entry.id))) done += 1;
    });
    return { done: done, total: items.length };
}

function getQuestStatusLabel() {
    if (state.view === "done") return "Quest conclu\u00edda";
    if (!hasProgress()) return "Quest n\u00e3o iniciada";
    const city = getCityName(steps[state.currentStep]);
    if (city && (state.view === "city" || state.view === "travel")) {
        return "Em andamento \u00b7 " + city;
    }
    if (state.view === "collect") return "Em andamento \u00b7 Coleta";
    if (state.view === "prep") return "Em andamento \u00b7 Prepara\u00e7\u00e3o";
    return "Em andamento";
}

function getActivePhase() {
    switch (state.view) {
        case "prep": return "prep";
        case "city":
        case "travel": return "rota";
        case "collect":
        case "done": return "final";
        default: return null;
    }
}

function showToast(message) {
    toastEl.textContent = message;
    toastEl.hidden = false;
    toastEl.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
        toastEl.classList.remove("is-visible");
        toastEl.hidden = true;
    }, 2200);
}

function setView(view, options) {
    state.view = view;
    if (options && typeof options.step === "number") {
        state.currentStep = options.step;
    }
    saveState();
    render();
}

/* ---------- Map modal (preserved) ---------- */

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

/* ---------- Render helpers ---------- */

function renderItemRow(entry, options) {
    const opts = options || {};
    const status = getItemStatus(entry.id);
    const src = itemImageUrl(entry.item);
    const icon = src
        ? '<img class="item-icon" src="' + escapeAttr(src) + '" alt="" width="32" height="32" loading="lazy">'
        : '<span class="item-icon item-icon--empty" aria-hidden="true"></span>';
    const mark = isDoneStatus(status) ? "\u2713" : "\u25cb";
    const meta = opts.showMeta && entry.label
        ? '<span class="item-meta">' + escapeHtml(entry.label) + '</span>'
        : "";

    return [
        '<button type="button" class="item-row is-' + status + '" data-item-toggle="' + escapeAttr(entry.id) + '"',
        ' aria-pressed="' + (isDoneStatus(status) ? "true" : "false") + '"',
        ' title="Clique para alternar: ' + STATUS_LABEL[status] + '">',
        '<span class="item-check" aria-hidden="true">' + mark + '</span>',
        icon,
        '<span class="item-qty">' + entry.quantity + '\u00d7</span>',
        '<span class="item-name">' + escapeHtml(entry.item) + '</span>',
        meta,
        '</button>'
    ].join('');
}

function renderNpcCard(npcGroup) {
    const location = npcLocations[npcGroup.npc];
    const place = location ? location.city : "";
    const mapBtn = location
        ? '<button type="button" class="map-btn map-btn--npc" data-npc-map="' +
          escapeAttr(npcGroup.npc) +
          '" title="Ver localiza\u00e7\u00e3o" aria-label="Ver ' +
          escapeAttr(npcGroup.npc) +
          ' no mapa">' + MAP_ICON_SVG +
          '<span>Ver localiza\u00e7\u00e3o</span></button>'
        : "";

    const itemsHtml = npcGroup.items.map((item) => {
        const entry = {
            id: npcItemId(npcGroup.npc, item.item),
            item: item.item,
            quantity: item.quantity * state.recipeMultiplier
        };
        return renderItemRow(entry);
    }).join('');

    const doneCount = npcGroup.items.filter((item) =>
        isDoneStatus(getItemStatus(npcItemId(npcGroup.npc, item.item)))
    ).length;
    const allDone = doneCount === npcGroup.items.length;

    return [
        '<article class="npc-card' + (allDone ? " is-complete" : "") + '">',
        '<div class="npc-persona">',
        '<img class="npc-sprite npc-sprite--hero" src="' + escapeAttr(npcImageUrl(npcGroup.npc)) +
        '" alt="' + escapeAttr(npcGroup.npc) + '" width="112" height="112" loading="lazy">',
        '<h3 class="npc-name">' + escapeHtml(npcGroup.npc) + '</h3>',
        place ? '<p class="npc-place">' + escapeHtml(place) + '</p>' : "",
        '<p class="npc-count">' + doneCount + '/' + npcGroup.items.length + ' itens</p>',
        mapBtn,
        '</div>',
        '<div class="item-list item-list--npc">' + itemsHtml + '</div>',
        '</article>'
    ].join('');
}

function renderCityTrail() {
    const shopping = getShoppingSteps();
    const currentIdx = shopping.findIndex(({ index }) => index === state.currentStep);
    const parts = shopping.map(({ step, index }, i) => {
        const city = getCityName(step);
        let cls = "route-step";
        if (index < state.currentStep) cls += " is-done";
        if (index === state.currentStep) cls += " is-current";
        const sep = i > 0 ? '<span class="route-arrow" aria-hidden="true">\u2192</span>' : "";
        return sep + '<span class="' + cls + '">' + escapeHtml(city) + '</span>';
    }).join('');

    return [
        '<p class="route-progress" aria-label="Rota de cidades">',
        '<span class="route-progress-label">Rota </span>',
        '<span class="route-progress-count">' + (currentIdx + 1) + '/' + shopping.length + '</span>',
        '<span class="route-progress-sep">\u00b7</span>',
        parts,
        '</p>'
    ].join('');
}

/* ---------- Views ---------- */

function renderOverview() {
    const stats = getQuestStats(state.recipeMultiplier);
    const status = getQuestStatusLabel();
    const counts = getProgressCounts();

    return [
        '<section class="view view--overview">',
        '<p class="overview-kicker">Resumo</p>',
        '<h2 class="overview-title">Hot Cuisine Quest</h2>',
        '<p class="overview-stats">',
        '<strong>' + stats.totalItems + '</strong> itens necess\u00e1rios',
        '<span class="dot">\u00b7</span>',
        '<strong>' + stats.cities + '</strong> cidades',
        '<span class="dot">\u00b7</span>',
        '<strong>' + stats.steps + '</strong> etapas',
        '</p>',
        '<dl class="overview-meta">',
        '<div><dt>Status</dt><dd>' + escapeHtml(status) + '</dd></div>',
        '<div><dt>Progresso</dt><dd>' + counts.done + '/' + counts.total + '</dd></div>',
        '</dl>',
        '<div class="recipe-picker">',
        '<label for="recipeRange">Receitas</label>',
        '<div class="recipe-controls">',
        '<input type="range" id="recipeRange" min="1" max="10" value="' + state.recipeMultiplier + '">',
        '<span id="rangeValue" class="recipe-count">' + state.recipeMultiplier + '</span>',
        '</div>',
        '</div>',
        '</section>'
    ].join('');
}

function renderPrep() {
    const items = marketItems.map((entry) => ({
        id: marketItemId(entry.item),
        item: entry.item,
        quantity: entry.quantity * state.recipeMultiplier,
        label: "Market"
    }));
    const done = items.filter((i) => isDoneStatus(getItemStatus(i.id))).length;

    return [
        '<section class="view view--prep">',
        '<div class="view-header">',
        '<h2>Prepara\u00e7\u00e3o no Depot</h2>',
        '<p class="view-sub">Compre no depot antes da rota. ' +
        done + '/' + items.length + ' conclu\u00eddos.</p>',
        '</div>',
        '<div class="item-list item-list--columns">',
        items.map((entry) => renderItemRow(entry)).join(''),
        '</div>',
        '</section>'
    ].join('');
}

function renderCity() {
    const step = steps[state.currentStep];
    if (!step || !Array.isArray(step.description)) {
        return '<section class="view"><p>Etapa inv\u00e1lida.</p></section>';
    }

    const city = getCityName(step);
    const npcCount = countStepNpcs(step);
    const itemCount = countStepItems(step);
    const doneItems = step.description.reduce((sum, npc) => {
        return sum + npc.items.filter((item) =>
            isDoneStatus(getItemStatus(npcItemId(npc.npc, item.item)))
        ).length;
    }, 0);

    return [
        '<section class="view view--city">',
        '<div class="view-header view-header--city">',
        '<p class="city-kicker">Compras</p>',
        '<h2 class="city-title">' + escapeHtml(city) + '</h2>',
        '<p class="view-sub">' + npcCount + ' NPCs \u00b7 ' + itemCount + ' itens \u00b7 ' +
        doneItems + '/' + itemCount + ' conclu\u00eddos</p>',
        '</div>',
        renderCityTrail(),
        '<div class="npc-grid npc-count-' + npcCount + '">',
        step.description.map(renderNpcCard).join(''),
        '</div>',
        '</section>'
    ].join('');
}

function renderTravel() {
    const step = steps[state.currentStep];
    const city = getCityName(step);
    const nextCity = getNextCityName(state.currentStep);
    const transport = step && step.transport ? step.transport : "";

    return [
        '<section class="view view--travel">',
        '<div class="travel-card">',
        '<p class="travel-done">Voc\u00ea terminou suas compras em <strong>' +
        escapeHtml(city) + '</strong>.</p>',
        nextCity
            ? '<p class="travel-next">Pr\u00f3ximo destino: <strong>' + escapeHtml(nextCity) + '</strong>.</p>'
            : "",
        transport
            ? '<p class="travel-tip">' + escapeHtml(transport) + '</p>'
            : "",
        '</div>',
        '</section>'
    ].join('');
}

function renderCollect() {
    const step = steps[steps.length - 1];
    const items = (step.collect || []).map((entry) => ({
        id: collectItemId(entry.item),
        item: entry.item,
        quantity: entry.quantity * state.recipeMultiplier,
        label: "Coleta"
    }));
    const done = items.filter((i) => isDoneStatus(getItemStatus(i.id))).length;

    return [
        '<section class="view view--collect">',
        '<div class="view-header">',
        '<h2>Coleta final</h2>',
        '<p class="view-sub">' + escapeHtml(step.description) + '</p>',
        '</div>',
        '<div class="collect-note">Leve os corpos ao NPC em at\u00e9 <strong>10 minutos</strong>.</div>',
        '<div class="item-list item-list--collect">',
        items.map((entry) => renderItemRow(entry)).join(''),
        '</div>',
        '<p class="view-sub">' + done + '/' + items.length + ' coletados</p>',
        '</section>'
    ].join('');
}

function renderDone() {
    const counts = getProgressCounts();
    return [
        '<section class="view view--done">',
        '<div class="done-card">',
        '<p class="done-kicker">Miss\u00e3o completa</p>',
        '<h2>Quest finalizada</h2>',
        '<p class="view-sub">Voc\u00ea concluiu a Hot Cuisine Quest. Progresso: ' +
        counts.done + '/' + counts.total + ' itens.</p>',
        '</div>',
        '</section>'
    ].join('');
}

/* ---------- Chrome / CTA ---------- */

function renderJourneyTracker() {
    const active = getActivePhase();
    if (!active) {
        journeyChrome.hidden = true;
        return;
    }
    journeyChrome.hidden = false;

    const phaseOrder = JOURNEY_PHASES.map((p) => p.id);
    const activeIdx = phaseOrder.indexOf(active);

    journeyTracker.innerHTML = JOURNEY_PHASES.map((phase, index) => {
        let cls = "journey-phase";
        if (index < activeIdx) cls += " is-done";
        if (index === activeIdx) cls += " is-current";
        return '<span class="' + cls + '">' + escapeHtml(phase.label) + '</span>';
    }).join('<span class="journey-sep" aria-hidden="true"></span>');

    let context = "";
    if (state.view === "city" || state.view === "travel") {
        const city = getCityName(steps[state.currentStep]);
        context = "Passo " + (state.currentStep + 1) + " de " + steps.length +
            (city ? " \u00b7 " + city : "");
    } else if (state.view === "prep") {
        context = "Passo 1 de " + steps.length + " \u00b7 Depot";
    } else if (state.view === "collect") {
        context = "Passo " + steps.length + " de " + steps.length + " \u00b7 Coleta";
    } else if (state.view === "done") {
        context = "Quest conclu\u00edda";
    }
    stepContext.textContent = context;
}

function cityItemsComplete(stepIndex) {
    const step = steps[stepIndex];
    if (!step || !Array.isArray(step.description)) return true;
    return step.description.every((npc) =>
        npc.items.every((item) => isDoneStatus(getItemStatus(npcItemId(npc.npc, item.item))))
    );
}

function getPrimaryAction() {
    switch (state.view) {
        case "overview":
            return {
                label: hasProgress()
                    ? "Continuar quest \u2192"
                    : "Come\u00e7ar prepara\u00e7\u00e3o \u2192",
                action: "start"
            };
        case "prep":
            return { label: "Come\u00e7ar compras \u2192", action: "toRoute" };
        case "city": {
            const complete = cityItemsComplete(state.currentStep);
            const step = steps[state.currentStep];
            if (complete) {
                if (step.transport) {
                    return { label: "Concluir compras \u2192", action: "toTravel" };
                }
                return { label: "Ir para coleta \u2192", action: "toCollect" };
            }
            return { label: "Concluir cidade \u2192", action: "forceTravel", soft: true };
        }
        case "travel": {
            const nextCity = getNextCityName(state.currentStep);
            return {
                label: nextCity ? "Ir para " + nextCity + " \u2192" : "Continuar \u2192",
                action: "nextCity"
            };
        }
        case "collect":
            return { label: "Finalizar quest \u2192", action: "finish" };
        case "done":
            return { label: "Recome\u00e7ar", action: "restart" };
        default:
            return { label: "Continuar", action: "noop" };
    }
}

function updateActionBar() {
    if (state.view === "overview") {
        actionBar.hidden = false;
        btnBack.hidden = true;
        btnRestart.hidden = !hasProgress();
        const primary = getPrimaryAction();
        btnPrimary.textContent = primary.label;
        btnPrimary.dataset.action = primary.action;
        btnPrimary.classList.toggle("btn-primary--soft", Boolean(primary.soft));
        return;
    }

    actionBar.hidden = false;
    btnBack.hidden = false;
    btnRestart.hidden = state.view === "done";

    const primary = getPrimaryAction();
    btnPrimary.textContent = primary.label;
    btnPrimary.dataset.action = primary.action;
    btnPrimary.classList.toggle("btn-primary--soft", Boolean(primary.soft));
}

function handlePrimary() {
    const action = btnPrimary.dataset.action;
    switch (action) {
        case "start":
            if (hasProgress() && state.view === "overview") {
                resumeQuest();
            } else {
                setView("prep", { step: 0 });
            }
            break;
        case "toRoute":
            setView("city", { step: 1 });
            break;
        case "toTravel":
            setView("travel");
            break;
        case "forceTravel": {
            const step = steps[state.currentStep];
            if (step.transport) {
                setView("travel");
            } else {
                setView("collect", { step: steps.length - 1 });
            }
            break;
        }
        case "nextCity": {
            const next = state.currentStep + 1;
            if (next >= steps.length - 1 || getStepPhase(next) === "collect") {
                setView("collect", { step: steps.length - 1 });
            } else {
                setView("city", { step: next });
            }
            break;
        }
        case "toCollect":
            setView("collect", { step: steps.length - 1 });
            break;
        case "finish":
            setView("done");
            break;
        case "restart":
            resetProgress();
            break;
        default:
            break;
    }
}

function resumeQuest() {
    if (getStepPhase(state.currentStep) === "collect" || state.currentStep >= steps.length - 1) {
        setView("collect", { step: steps.length - 1 });
        return;
    }
    if (state.currentStep >= 1 && getStepPhase(state.currentStep) === "shop") {
        setView("city");
        return;
    }
    if (Object.keys(state.itemStatus).length > 0) {
        setView("prep", { step: 0 });
        return;
    }
    setView("prep", { step: 0 });
}

function handleBack() {
    switch (state.view) {
        case "prep":
            setView("overview");
            break;
        case "city":
            if (state.currentStep <= 1) {
                setView("prep");
            } else {
                const prev = state.currentStep - 1;
                const prevStep = steps[prev];
                if (prevStep && prevStep.transport) {
                    setView("travel", { step: prev });
                } else {
                    setView("city", { step: prev });
                }
            }
            break;
        case "travel":
            setView("city");
            break;
        case "collect":
            setView("city", { step: steps.length - 2 });
            break;
        case "done":
            setView("collect", { step: steps.length - 1 });
            break;
        default:
            setView("overview");
    }
}

function render() {
    appEl.classList.toggle("app--compact", state.view !== "overview");
    appEl.classList.toggle("app--overview", state.view === "overview");

    let html = "";
    switch (state.view) {
        case "overview": html = renderOverview(); break;
        case "prep": html = renderPrep(); break;
        case "city": html = renderCity(); break;
        case "travel": html = renderTravel(); break;
        case "collect": html = renderCollect(); break;
        case "done": html = renderDone(); break;
        default: html = renderOverview();
    }

    viewRoot.innerHTML = html;
    renderJourneyTracker();
    updateActionBar();
}

/* ---------- Events ---------- */

btnPrimary.addEventListener("click", handlePrimary);
btnBack.addEventListener("click", handleBack);
btnRestart.addEventListener("click", function () {
    if (confirm("Recome\u00e7ar a quest? Seu progresso marcado ser\u00e1 apagado.")) {
        resetProgress();
    }
});

viewRoot.addEventListener("click", function (event) {
    const toggle = event.target.closest("[data-item-toggle]");
    if (toggle) {
        const id = toggle.getAttribute("data-item-toggle");
        const next = cycleItemStatus(id);
        const all = getAllQuestItems(state.recipeMultiplier);
        const entry = all.find((item) => item.id === id);
        if (entry && isDoneStatus(next)) {
            const verb = next === "owned" ? "j\u00e1 possui" : "comprado";
            showToast("\u2713 " + entry.quantity + "\u00d7 " + entry.item + " \u2014 " + verb);
        }
        render();
        return;
    }

    const mapBtn = event.target.closest("[data-npc-map]");
    if (mapBtn) {
        openMapModal(mapBtn.getAttribute("data-npc-map"));
    }
});

viewRoot.addEventListener("input", function (event) {
    if (event.target.id !== "recipeRange") return;
    state.recipeMultiplier = Number(event.target.value);
    const label = document.getElementById("rangeValue");
    if (label) label.textContent = event.target.value;
    saveState();
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

/* ---------- Theme (lights off) ---------- */

const THEME_KEY = "hotCuisineTheme:v1";
const themeToggle = document.getElementById("themeToggle");

function applyTheme(theme) {
    const dark = theme === "dark";
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
    if (themeToggle) {
        themeToggle.setAttribute("aria-pressed", dark ? "true" : "false");
        themeToggle.title = dark ? "Acender a luz" : "Apagar a luz";
        const icon = themeToggle.querySelector(".theme-toggle-icon");
        const label = themeToggle.querySelector(".theme-toggle-label");
        if (icon) icon.textContent = dark ? "\u2600" : "\u263E";
        if (label) label.textContent = dark ? "Acender a luz" : "Apagar a luz";
    }
}

function loadTheme() {
    let theme = "light";
    try {
        const saved = localStorage.getItem(THEME_KEY);
        if (saved === "dark" || saved === "light") theme = saved;
    } catch (err) { /* ignore */ }
    applyTheme(theme);
}

function toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
    const next = current === "dark" ? "light" : "dark";
    try {
        localStorage.setItem(THEME_KEY, next);
    } catch (err) { /* ignore */ }
    applyTheme(next);
}

if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
}

function applyUrlState() {
    const params = new URLSearchParams(window.location.search);
    const screen = params.get("screen");
    const stepParam = params.get("step");

    if (stepParam !== null) {
        const parsed = Number(stepParam);
        if (!Number.isNaN(parsed) && parsed >= 1 && parsed <= steps.length) {
            state.currentStep = parsed - 1;
        }
    }

    if (!screen) return;

    if (screen === "overview" || screen === "home") {
        state.view = "overview";
        return;
    }
    if (screen === "market" || screen === "prep") {
        state.view = "prep";
        return;
    }
    if (screen === "checklist") {
        state.view = "prep";
        return;
    }
    if (screen === "steps" || screen === "city") {
        if (getStepPhase(state.currentStep) === "collect") {
            state.view = "collect";
        } else if (getStepPhase(state.currentStep) === "shop") {
            state.view = "city";
        } else {
            state.view = "prep";
        }
        return;
    }
    if (screen === "travel") {
        state.view = "travel";
        return;
    }
    if (screen === "collect") {
        state.view = "collect";
        state.currentStep = steps.length - 1;
        return;
    }
    if (screen === "done") {
        state.view = "done";
        state.currentStep = steps.length - 1;
    }
}

loadTheme();
loadState();
applyUrlState();
render();
