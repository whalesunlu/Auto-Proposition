const arrowKeys = new Set([
    "Digit1",
    "Digit2",
    "Digit3",
    "Digit4"
]);

const unicodeSymbols = {
    "Digit1": "∧",
    "Digit2": "∨",
    "Digit3": "¬",
    "Digit4": "→"
};

function insertIntoInputOrTextarea(el, symbol) {
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const value = el.value;
    el.value = value.slice(0, start) + symbol + value.slice(end);
    el.selectionStart = el.selectionEnd = start + symbol.length;
    el.dispatchEvent(new Event("input", { bubbles: true }));
}

function propositions(keyPressed) {
    const symbol = unicodeSymbols[keyPressed];
    if (!symbol) return;

    if (document.queryCommandSupported && document.queryCommandSupported("insertText")) {
        document.execCommand("insertText", false, symbol);
        return;
    }

    const active = document.activeElement;
    if (active && (active.tagName === "TEXTAREA" || active.tagName === "INPUT")) {
        insertIntoInputOrTextarea(active, symbol);
    }
};
const conKeyListener = (event) => {
    if (event.ctrlKey && arrowKeys.has(event.code)) {
        event.preventDefault();
        propositions(event.code);
    }
};

document.addEventListener("keydown", conKeyListener);