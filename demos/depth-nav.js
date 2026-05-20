// Depth progression: midwater → midnight → abyss → hadal
//
// Per-depth config: DEPTH_SECTION_CONFIG
//   setup  — which JS features run (markup, letter tags, pointer/gaze, CSS vars)
//   effects — timing values for JS-driven animations (null = none for that depth)
//
// CSS text effects live in index.css under #midwater, #midnight, #abyss, #hadal.

const DEPTH_ORDER = ["midwater", "midnight", "abyss", "hadal"];
const RESURFACE_STEP = "resurface";
const DEPTH_DESCEND_DELAY_MS = 30000;
const DESCEND_SWIM_O_MAX = 4;

const DEPTH_NEXT_LABEL = {
    midnight: "Descend to midnight",
    abyss: "Descend to the abyss",
    hadal: "Descend to the hadal zone",
    resurface: "Resurface"
};

const DEPTH_SECTION_CONFIG = {
    midwater: {
        setup: {
            buildMarkup: true,
            tagLetters: true,
            midwaterHover: true,
            pointerEffects: false,
            gazeEffects: true,
            applyEffectVars: false
        },
        effects: {
            highlightHoldMs: 600,
            highlightMinWordLetters: 7,
            wordDwellMs: 3000,
            wordVanishDurationMs: 1200,
            wormStaggerMs: 42,
            wormDurationMs: 300
        }
    },
    midnight: {
        setup: {
            buildMarkup: true,
            tagLetters: true,
            pointerEffects: true,
            gazeEffects: true,
            applyEffectVars: true
        },
        effects: {
            wordFlickerChance: 0.45,
            vowelBlinkDelayMs: 700,
            pbdqGrowDelayMs: 1500,
            pbdqGrowDurationMs: 4500,
            symbolSwimDurationMs: 5000,
            ghGiantScale: 110,
            ghGiantBlur: "3.5px"
        }
    },
    abyss: {
        setup: {
            buildMarkup: true,
            tagLetters: false,
            shyEffects: true,
            pointerEffects: false,
            gazeEffects: false,
            applyEffectVars: false
        },
        effects: {
            shyRadiusPx: 80,
            shyFleeDurationMs: 3200,
            shyFleeChance: 1 / 70,
            shyChainRadiusPx: 52,
            shyStillThresholdPx: 40,
            shyStillStartMs: 1000,
            shyStillRampMs: 8000,
            shyStillMinLight: 0.04,
            shyStillMaxLight: 0.12,
            shyStillColorDark: [2, 0, 30],
            shyStillColorLight: [175, 184, 218]
        }
    },
    hadal: {
        setup: {
            buildMarkup: true,
            tagLetters: true,
            hadalHueEffects: true,
            hadalClumpEffects: true,
            pointerEffects: false,
            gazeEffects: false,
            applyEffectVars: false
        },
        effects: null
    }
};

let depthDescendTimer = null;
let currentDepthId = null;

function getDepthSectionConfig(depthId) {
    return DEPTH_SECTION_CONFIG[depthId] || DEPTH_SECTION_CONFIG.midwater;
}

function getDepthSectionSetup(depthId) {
    return getDepthSectionConfig(depthId).setup;
}

function getDepthSectionSetupFor(section) {
    return section ? getDepthSectionSetup(section.id) : null;
}

function depthSectionHasSetup(section, key) {
    let setup = getDepthSectionSetupFor(section);
    return !!(setup && setup[key]);
}

function getActiveDepthId() {
    return document.documentElement.dataset.depth || currentDepthId || "midwater";
}

function getDepthEffects() {
    let effects = getDepthSectionConfig(getActiveDepthId()).effects;
    if (effects) return effects;
    return DEPTH_SECTION_CONFIG.midnight.effects;
}

function applyDepthEffectVars(depthId) {
    let effects = getDepthSectionConfig(depthId).effects;
    if (!effects) return;

    let root = document.documentElement;
    root.style.setProperty("--gh-giant-scale", String(effects.ghGiantScale));
    root.style.setProperty("--gh-giant-blur", effects.ghGiantBlur || "4px");
    root.style.setProperty("--pbdq-grow-duration", (effects.pbdqGrowDurationMs / 1000) + "s");
    root.style.setProperty("--symbol-swim-duration", (effects.symbolSwimDurationMs / 1000) + "s");
}

function getNextDepthId(depthId) {
    let index = DEPTH_ORDER.indexOf(depthId);
    if (index === -1) return null;
    if (index >= DEPTH_ORDER.length - 1) return RESURFACE_STEP;
    return DEPTH_ORDER[index + 1];
}

function isResurfaceStep(stepId) {
    return stepId === RESURFACE_STEP;
}

function getDescendSwimCount(fromDepthId) {
    let index = DEPTH_ORDER.indexOf(fromDepthId);
    if (index === -1) return DESCEND_SWIM_O_MAX;
    return Math.max(1, DESCEND_SWIM_O_MAX - index);
}

function updateDepthDescendSwimOs(button, count) {
    let ring = button.querySelector(".depth-descend__swim-ring");
    if (!ring) return;
    let os = ring.querySelectorAll(".depth-descend__swim-o");
    for (let i = 0; i < os.length; i++) {
        if (i < count) {
            os[i].hidden = false;
            let angle = (360 / count) * i;
            os[i].style.setProperty("--swim-angle", angle + "deg");
        } else {
            os[i].hidden = true;
        }
    }
}

function hideDepthDescendButton() {
    let button = document.getElementById("depthDescend");
    if (!button) return;
    button.hidden = true;
    button.classList.remove("visible");
    button.removeAttribute("data-next-depth");
    button.removeAttribute("data-from-depth");
}

function showDepthDescendButton(nextDepthId, fromDepthId) {
    let button = document.getElementById("depthDescend");
    if (!button || !nextDepthId) return;
    let label = DEPTH_NEXT_LABEL[nextDepthId] || "Next";
    button.setAttribute("aria-label", label);
    button.dataset.nextDepth = nextDepthId;
    button.dataset.fromDepth = fromDepthId || "";
    updateDepthDescendSwimOs(button, getDescendSwimCount(fromDepthId));
    button.hidden = false;
    button.classList.add("visible");
}

function clearDepthDescendTimer() {
    if (depthDescendTimer) {
        clearTimeout(depthDescendTimer);
        depthDescendTimer = null;
    }
    hideDepthDescendButton();
}

function scheduleDepthDescendButton(depthId) {
    clearDepthDescendTimer();
    let next = getNextDepthId(depthId);
    if (!next) return;

    depthDescendTimer = setTimeout(function () {
        depthDescendTimer = null;
        if (document.documentElement.dataset.depth !== depthId) return;
        showDepthDescendButton(next, depthId);
    }, DEPTH_DESCEND_DELAY_MS);
}

function initDepthNavigation() {
    let button = document.getElementById("depthDescend");
    if (button) {
        button.addEventListener("click", function () {
            let next = button.dataset.nextDepth;
            if (!next) return;
            if (isResurfaceStep(next)) {
                if (typeof showResurface === "function") showResurface();
                return;
            }
            if (DEPTH_ORDER.indexOf(next) !== -1) showDepthSection(next);
        });
    }
}

initDepthNavigation();
