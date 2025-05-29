const WS_BASE_URL = ``;

let roomName = "";
let socket = null;

if (roomName) {
    openWebSocket();
}
/*window.addEventListener("message", function (event) {
    if (event.source !== window) return; // Ensure the message is from the same page

    if (event.data.type === "EXTENSION_INPUT") {
        console.log("Received input from extension:", event.data.value);
        roomName = event.data.value;
        console.log(roomName);
        // Open WebSocket only if roomName is valid and not empty
        if (roomName) {
            openWebSocket();
        }
    }
});*/

function openWebSocket() {
    if (!roomName) {
        console.error("WebSocket cannot be opened: roomName is not set.");
        return;
    }

    const wsUrl = `${WS_BASE_URL}${roomName}/`;
    socket = new WebSocket(wsUrl);

    // ✅ WebSocket connection opened
    socket.onopen = function () {
        console.log("WebSocket connected to room:", roomName);
    };

    // ✅ Handle incoming messages
    socket.onmessage = function (event) {
        let data = JSON.parse(event.data);
        console.log("Received action:", data);

        let video = document.querySelector("video");
        if (!video) {
            console.log("Error: No video was found.");
            return;
        }

        console.log("Received message:", data);
        switch (data.action) {
            case "pause/play":
                video.paused ? video.play() : video.pause();
                break;
            case "V+":
                video.volume = Math.min(video.volume + 0.1, 1); // Ensure max volume is 1
                break;
            case "V-":
                video.volume = Math.max(video.volume - 0.1, 0); // Ensure min volume is 0
                break;
        }
    };

    // ✅ Handle WebSocket errors
    socket.onerror = function (error) {
        console.error("WebSocket Error:", error);
    };

    // ✅ Handle WebSocket disconnection (with auto-reconnect)
    socket.onclose = function () {
        console.log("WebSocket disconnected. Reconnecting in 5s...");
        setTimeout(() => {
            openWebSocket();
        }, 5000);
    };
}