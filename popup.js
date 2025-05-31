const browser = window?.browser || window?.chrome;
const saveButton = document.getElementById('save-btn')
const autoOpeningSkipCheckbox = document.getElementById('auto-op-skip');
const autoNextEpisodePlayCheckbox = document.getElementById('auto-next-ep-play');

browser.storage.local.get().then((storage) =>{
    if (storage.jrcToken && saveButton) {
        document.getElementById('tokenInput').value = storage.jrcToken;
    }
})

if (saveButton) {
    saveButton.addEventListener('click', function()  {
        let jrcToken = document.getElementById('tokenInput').value;
        let autoOpeningSkip =autoOpeningSkipCheckbox.checked
        let autoNextEpisodePlay = autoNextEpisodePlayCheckbox.checked

        console.log(autoOpeningSkip)
        console.log(autoNextEpisodePlay)

        browser.storage.local.set({jrcToken});
        browser.storage.local.set({autoOpeningSkip})
        browser.storage.local.set({autoNextEpisodePlay})
    });
}

document.addEventListener("DOMContentLoaded", function () {
    const inputField = document.getElementById('tokenInput');
    const sendButton = document.getElementById("sendButton");

    const inputValue = inputField.value;
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: (value) => {
                    window.postMessage({ type: "EXTENSION_INPUT", value }, "*");
                },
                args: [inputValue]
            });
        });
});
