const browser = (window as any)?.browser || (window as any)?.chrome;

const saveButton = document.getElementById('save-btn') as HTMLButtonElement | null;
const autoOpeningSkipCheckbox = document.getElementById('auto-op-skip') as HTMLInputElement | null;
const autoNextEpisodePlayCheckbox = document.getElementById('auto-next-ep-play') as HTMLInputElement | null;
const tokenInput = document.getElementById('tokenInput') as HTMLInputElement | null;

if (browser?.storage?.local) {
    browser.storage.local.get().then((storage: any) => {
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
        const jrcToken = tokenInput?.value || '';
        const autoOpeningSkip = autoOpeningSkipCheckbox?.checked || false;
        const autoNextEpisodePlay = autoNextEpisodePlayCheckbox?.checked || false;

        console.log(autoOpeningSkip);
        console.log(autoNextEpisodePlay);

        browser.storage.local.set({ jrcToken });
        browser.storage.local.set({ autoOpeningSkip });
        browser.storage.local.set({ autoNextEpisodePlay });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const inputValue = tokenInput?.value || '';

    browser.tabs?.query({ active: true, currentWindow: true }, (tabs: any[]) => {
        browser.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: (value: string) => {
                window.postMessage({ type: "EXTENSION_INPUT", value }, "*");
            },
            args: [inputValue]
        });
    });
});