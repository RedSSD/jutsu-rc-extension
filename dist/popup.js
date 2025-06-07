"use strict";
var _a;
const browser = (window === null || window === void 0 ? void 0 : window.browser) || (window === null || window === void 0 ? void 0 : window.chrome);
const saveButton = document.getElementById('save-btn');
const autoOpeningSkipCheckbox = document.getElementById('auto-op-skip');
const autoNextEpisodePlayCheckbox = document.getElementById('auto-next-ep-play');
const tokenInput = document.getElementById('tokenInput');
if ((_a = browser === null || browser === void 0 ? void 0 : browser.storage) === null || _a === void 0 ? void 0 : _a.local) {
    browser.storage.local.get().then((storage) => {
        if (storage.jrcToken && tokenInput) {
            tokenInput.value = storage.jrcToken;
        }
        if (autoOpeningSkipCheckbox) {
            autoOpeningSkipCheckbox.checked = storage.autoOpeningSkip;
        }
        if (autoNextEpisodePlayCheckbox) {
            autoNextEpisodePlayCheckbox.checked = storage.autoNextEpisodePlay;
        }
    });
}
if (saveButton) {
    saveButton.addEventListener('click', () => {
        const jrcToken = (tokenInput === null || tokenInput === void 0 ? void 0 : tokenInput.value) || '';
        const autoOpeningSkip = (autoOpeningSkipCheckbox === null || autoOpeningSkipCheckbox === void 0 ? void 0 : autoOpeningSkipCheckbox.checked) || false;
        const autoNextEpisodePlay = (autoNextEpisodePlayCheckbox === null || autoNextEpisodePlayCheckbox === void 0 ? void 0 : autoNextEpisodePlayCheckbox.checked) || false;
        console.log(autoOpeningSkip);
        console.log(autoNextEpisodePlay);
        browser.storage.local.set({ jrcToken });
        browser.storage.local.set({ autoOpeningSkip });
        browser.storage.local.set({ autoNextEpisodePlay });
    });
}
document.addEventListener("DOMContentLoaded", () => {
    var _a;
    const inputValue = (tokenInput === null || tokenInput === void 0 ? void 0 : tokenInput.value) || '';
    (_a = browser.tabs) === null || _a === void 0 ? void 0 : _a.query({ active: true, currentWindow: true }, (tabs) => {
        browser.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: (value) => {
                window.postMessage({ type: "EXTENSION_INPUT", value }, "*");
            },
            args: [inputValue]
        });
    });
});
