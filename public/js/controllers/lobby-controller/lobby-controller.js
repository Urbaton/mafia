import socket from '../socket.js';
import { renderMainMenu } from '../../utils/router.js';
import { sendChatMessage } from '../chat/chat-controller.js';

export function initLobbyHandlers(data) {
    document.getElementById('ready-button').addEventListener('click', markReady);
    document.getElementById('chat-send').addEventListener('click', sendChatMessage);
    document.getElementById('start-game-button').addEventListener('click', startGame);
    document.getElementById('leave-button').addEventListener('click', leaveLobby);

    updatePlayerList(data.players);
    showSettings(data.players);
}

function markReady() {
    console.log("SEND ready")
    socket.emit('ready');
    makeUnReadyButton();
}

function markUnready() {
    console.log("SEND unready")
    socket.emit('unready');
    makeReadyButton();
}

function startGame() {
    const mafiaCount = parseInt(document.getElementById('mafia-count').value);
    const hasDoctor = document.getElementById('has-doctor').checked;
    const hasDetective = document.getElementById('has-detective').checked;
    socket.emit('start_game', {
        mafiaCount,
        hasDoctor,
        hasDetective
    });
}

async function leaveLobby() {
    console.log("SEND leave_lobby")
    socket.emit('leave_lobby');
    renderMainMenu();
}

function makeReadyButton() {
    const button = document.getElementById('ready-button');
    button.textContent = 'Готов';
    button.classList.remove('ready-button-red');
    button.classList.add('ready-button-green');
    button.removeEventListener('click', markUnready);
    button.addEventListener('click', markReady);
}

function makeUnReadyButton() {
    const button = document.getElementById('ready-button');
    button.textContent = 'Не готов';
    button.classList.remove('ready-button-green');
    button.classList.add('ready-button-red');
    button.removeEventListener('click', markReady);
    button.addEventListener('click', markUnready);
}

export function updatePlayerList(players) {
    const list = document.getElementById('players-list');
    list.innerHTML = '';
    players.forEach(player => {
        const div = document.createElement('div');
        div.textContent = `${player.isOwner ? '👑' : ''} ${player.name} (${player.isReady ? 'готов' : 'не готов'})`;
        list.appendChild(div);
    });

    const playersCount = document.getElementById('players-count');
    playersCount.innerHTML = `${players.length}`;
}

function showSettings(players) {
    players.forEach(player => {
        if (player.socketId === socket.id && player.isOwner) {
            document.getElementById('settings-section').style.display = 'block';
        }
    });
}