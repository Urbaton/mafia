import socket from '../socket.js';

export function addChatMessage(text) {
    const messages = document.getElementById('chat-messages');
    const div = document.createElement('div');
    div.textContent = text;
    messages.appendChild(div);
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