const browser = window?.browser || window?.chrome;
const saveButton = document.getElementById('save-btn')

browser.storage.local.get().then((storage) =>{
    if (storage.jrcToken) {
        document.getElementById('tokenInput').value = storage.jrcToken;
    }
})

saveButton.addEventListener('click', function()  {
    const jrcToken = document.getElementById('tokenInput').value;
    browser.storage.local.set({jrcToken});
});
