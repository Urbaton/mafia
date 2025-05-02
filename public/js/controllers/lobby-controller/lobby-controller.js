import socket from '../socket.js';
import { initSocketEvents } from './events.js';

export function initLobbyHandlers() {
    document.getElementById('ready-button').addEventListener('click', markReady);
    document.getElementById('chat-send').addEventListener('click', sendChatMessage);
    document.getElementById('start-game-button').addEventListener('click', startGame);
    document.getElementById('leave-button').addEventListener('click', leaveLobby);

    initSocketEvents();
}

function leaveLobby() {
    console.log("SEND leave_lobby")
    socket.emit('leave_lobby');
    switchToLobbyScreen();
}

function updatePlayerList(players) {
    const list = document.getElementById('player-list');
    list.innerHTML = '';
    players.forEach(player => {
        const div = document.createElement('div');
        div.textContent = `${player.name} (${player.isReady ? 'готов' : 'не готов'})`;
        list.appendChild(div);
    });
}