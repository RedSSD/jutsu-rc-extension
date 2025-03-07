const currentUserId = '123'; // Replace with actual user ID
const targetUserId = '456';  // Replace with the target user ID

const socket = new WebSocket('ws://' + window.location.host + '/ws/private_chat/' + currentUserId + '/');

socket.onmessage = function(e) {
    const data = JSON.parse(e.data);
    console.log("Message from user", data.from_user_id, ":", data.message);
};

socket.onclose = function(e) {
    console.error('WebSocket closed unexpectedly');
};

// Send a private message to the target user
function sendMessage(message) {
    socket.send(JSON.stringify({
        'message': message,
        'to_user_id': targetUserId,  // Send to the target user
    }));
}