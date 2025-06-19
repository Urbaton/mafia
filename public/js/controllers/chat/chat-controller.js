import socket from '../socket.js';

export function addChatMessage(sender, message, isOwn = false) {
    const messages = document.getElementById('chat-messages');
    const container = document.createElement('div');
    container.className = `chat-message ${isOwn ? 'own-message' : ''}`;

    const senderElement = document.createElement('div');
    senderElement.className = 'chat-sender';
    senderElement.textContent = sender;

    const textElement = document.createElement('div');
    textElement.className = 'chat-text';
    textElement.textContent = message;

    container.appendChild(senderElement);
    container.appendChild(textElement);
    messages.appendChild(container);
    messages.scrollTop = messages.scrollHeight;
}

export function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    if (message) {
        socket.emit('send_chat_message', { message });
        input.value = '';
        console.log("SEND send_chat_message")
    }
}