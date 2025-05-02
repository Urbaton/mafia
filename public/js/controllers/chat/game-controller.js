import socket from '../socket.js';

export function initMainMenuHandlers() {
    document.getElementById('ready-button').addEventListener('click', markReady);
    document.getElementById('chat-send').addEventListener('click', sendChatMessage);
    document.getElementById('start-game-button').addEventListener('click', startGame);
    document.getElementById('leave-button').addEventListener('click', leaveLobby);
}

function addChatMessage(text) {
    const messages = document.getElementById('chat-messages');
    const div = document.createElement('div');
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}

function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    if (message) {
        socket.emit('send_chat_message', { message });
        input.value = '';
    }
}