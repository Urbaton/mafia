import socket from '../socket.js';
import { startTimerEvent } from '../../utils/timer.js'
import { sendChatMessage } from '../chat/chat-controller.js';

export function initMafiaVoteHandlers(data) {
    defaultGlobals()

    document.getElementById('confirm-target-button').addEventListener('click', confirmTarget);
    document.getElementById('chat-send').addEventListener('click', sendChatMessage);
    renderTargets(data.players)

    startTimerEvent(data.countdownMs, data.serverTime, 'finish_mafia_vote', socket);
}

let selectedTargetId = null;
let targetConfirmed = false;

export function defaultGlobals() {
    selectedTargetId = null;
    targetConfirmed = false;
}

function renderTargets(players) {
    const list = document.getElementById('target-players-list');
    list.innerHTML = '';

    players.forEach(player => {
        const item = document.createElement('div');
        item.classList.add('player-list-item');
        item.innerHTML = `<img src="../images/avatar.png"><p>${player.name}</p>`;
        item.dataset.socketId = player.socketId;

        item.addEventListener('click', () => {
            if (targetConfirmed) return;
            document.querySelectorAll('.player-list-item').forEach(el => el.classList.remove('selected'));
            item.classList.add('selected');
            selectedTargetId = player.socketId;
            console.log(selectedTargetId)
            document.getElementById('confirm-target-button').disabled = false;
        });

        list.appendChild(item);
    });
}

function confirmTarget() {
    if (!selectedTargetId || targetConfirmed) return;

    targetConfirmed = true

    console.log(`Цель выбрана: ${selectedTargetId}`);

    socket.emit('mafia_vote', { targetId: selectedTargetId });

    console.log()

    const confirmButton = document.getElementById('confirm-target-button')
    confirmButton.disabled = true;
}
