socket.on('chat_message', ({ sender, message }) => {
    addChatMessage(`${sender}: ${message}`);
});