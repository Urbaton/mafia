const socket = io();

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('create-lobby').addEventListener('click', createLobby);
    document.getElementById('join-lobby').addEventListener('click', joinLobby);
    document.getElementById('ready-button').addEventListener('click', markReady);
    document.getElementById('chat-send').addEventListener('click', sendChatMessage);
    document.getElementById('start-game-button').addEventListener('click', startGame);
    document.getElementById('leave-button').addEventListener('click', leaveLobby);
});
