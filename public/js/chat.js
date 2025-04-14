function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    if (message) {
        socket.emit('send_chat_message', { message });
        input.value = '';
    }
}

socket.on('chat_message', ({ sender, message }) => {
    addChatMessage(`${sender}: ${message}`);
});
