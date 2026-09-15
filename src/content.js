const unicodeSymbols = {
    "Digit1": "∧",
    "Digit2": "∨",
    "Digit3": "¬",
    "Digit4": "→",
    "Digit5": "↔",
    "Digit6": "⊕"
};
function insertIntoInputOrTextarea(el, symbol) {
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const value = el.value;
    el.value = value.slice(0, start) + symbol + value.slice(end);
    el.selectionStart = el.selectionEnd = start + symbol.length;
    el.dispatchEvent(new Event("input", { bubbles: true }));
}

function insertIntoContentEditable(symbol) {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    range.deleteContents();
    const textNode = document.createTextNode(symbol);
    range.insertNode(textNode);
    range.setStartAfter(textNode);
    range.setEndAfter(textNode);
    selection.removeAllRanges();
    selection.addRange(range);

    const target = textNode.parentElement || document.activeElement;
    target.dispatchEvent(new InputEvent("input", { bubbles: true, data: symbol, inputType: "insertText" }));
}

function propositions(keyPressed) {
    const symbol = unicodeSymbols[keyPressed];
    const active = document.activeElement;
    if (!active) return;

    if (active.tagName === "TEXTAREA" || active.tagName === "INPUT") {
        insertIntoInputOrTextarea(active, symbol);
    } else if (active.isContentEditable) {
        insertIntoContentEditable(symbol);
    }
}
const arrowKeys = new Set([
    "Digit1",
    "Digit2",
    "Digit3",
    "Digit4",
    "Digit5",
    "Digit6"
]);
const controlKeyListener = (event) => {
    if (event.ctrlKey && arrowKeys.has(event.code)) {
        event.preventDefault();
        propositions(event.code);
    }
};
document.addEventListener("keydown", controlKeyListener);