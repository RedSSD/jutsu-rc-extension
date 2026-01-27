const WS_BASE_URL = `wss://fa43-149-156-51-230.ngrok-free.app/ws/connection/`;
const CHECK_INTERVAL_MS = 1500;

let skipOpeningButton = getSkipOpeningButton();
let nextEpisodeButton = getNextEpisodeButton();


function getSkipOpeningButton() {
    return document.querySelector(
        '[class*="vjs-overlay vjs-overlay-bottom-left vjs-overlay-skip-intro vjs-overlay-background"]'
    )
}

function getNextEpisodeButton() {
    return document.querySelector(
        '[class*="vjs-overlay vjs-overlay-bottom-right vjs-overlay-skip-intro vjs-overlay-background"]'
    )
}

const skipOpeningInterval = setInterval(() => {
    skipOpeningButton = getSkipOpeningButton();
    if (skipOpeningButton && !skipOpeningButton.classList.contains('vjs-hidden')) {

        chrome.storage.local.get('autoOpeningSkip', (result) => {
            if (result.autoOpeningSkip) {
                console.log('Opening Skip');
                skipOpeningButton.click();
            }
        });

        clearInterval(skipOpeningInterval);
    }
}, CHECK_INTERVAL_MS);

const nextEpisodeInterval = setInterval(() => {
    nextEpisodeButton = getNextEpisodeButton();
    if (nextEpisodeButton && !nextEpisodeButton.classList.contains('vjs-hidden')) {

        chrome.storage.local.get('autoNextEpisodePlay', (result) => {
            if (result.autoNextEpisodePlay) {
                console.log('Episode Switch');
                nextEpisodeButton.click();
            }
        });

        clearInterval(nextEpisodeInterval);
    }
}, CHECK_INTERVAL_MS);


startConnection()

function startConnection() {
    chrome.storage.local.get('jrcToken', (result) => {
        const jrcToken = result.jrcToken;
        openWebSocket(jrcToken);
    });
}

function executeCommand(command, video) {
    switch (command.action) {
        case "pause/play":
            video.paused ? video.play() : video.pause();
            break;
        case "V+":
            video.volume = Math.min(video.volume + 0.1, 1); // Ensure max volume is 1
            break;
        case "V-":
            video.volume = Math.max(video.volume - 0.1, 0); // Ensure min volume is 0
            break;
        case "forward":
            video.currentTime = Math.min(video.currentTime+5, video.duration);
            break;
        case "back":
            video.currentTime = Math.max(video.currentTime-5, 0);
            break;
        case "Skip OP":
            skipOpeningButton.click();
            break;
        case "Next EP":
            nextEpisodeButton.click();
            break;
    }
}


function openWebSocket(jrcToken) {

    console.log(jrcToken);

    if (!jrcToken) {
        console.error("WebSocket cannot be opened: jrcToken is not set.");
        return;
    }

    const wsUrl = `${WS_BASE_URL}${jrcToken}/`;
    let socket = new WebSocket(wsUrl);

    socket.onopen = function () {
        console.log("WebSocket connected to room:", jrcToken);
    };

    socket.onmessage = function (event) {
        let message = JSON.parse(event.data);

        let video = document.querySelector("video");
        if (!video) {
            console.log("Error: No video was found.");
            return;
        }

        console.log("Received message:", message);
        executeCommand(message, video);
    };

    socket.onerror = function (error) {
        console.error("WebSocket Error:", error);
    };

    socket.onclose = function () {
        console.log("WebSocket disconnected. Reconnecting in 5s...");
        setTimeout(() => {
            startConnection();
        }, 5000);
    };
}
