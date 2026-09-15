const unicodeSymbols = {
    "Digit1": "∧",
    "Digit2": "\u2228",
    "Digit3": "\u00AC",
    "Digit4": "\u21D2"
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

    if (active && active.tagName === "TEXTAREA" || active && active.tagName === "INPUT") {
        insertIntoInputOrTextarea(active, symbol);
    } else if (active && active.isContentEditable) {
        insertIntoContentEditable(symbol);
    } else {
        navigator.clipboard.writeText(symbol);
    }
}
const arrowKeys = new Set([
    "Digit1",
    "Digit2",
    "Digit3",
    "Digit4"
]);
const controlKeyListener = (event) => {
    if (event.ctrlKey && arrowKeys.has(event.code)) {
        event.preventDefault();
        propositions(event.code);
    }
};
document.addEventListener("keydown", controlKeyListener);