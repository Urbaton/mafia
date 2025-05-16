import socket from '../socket.js';
import { startTimerEvent } from '../../utils/timer.js';

export function initDoctorVoteHandlers(data) {
    defaultGlobals();

    document.getElementById('confirm-target-button').addEventListener('click', confirmTarget);
    renderTargets(data.players);

    startTimerEvent(data.countdownMs, data.serverTime, 'finish_doctor_vote', socket);
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
        item.textContent = player.name;
        item.dataset.socketId = player.socketId;

        item.addEventListener('click', () => {
            if (targetConfirmed) return;
            document.querySelectorAll('.player-list-item').forEach(el => el.classList.remove('selected'));
            item.classList.add('selected');
            selectedTargetId = player.socketId;
            document.getElementById('confirm-target-button').disabled = false;
        });

        list.appendChild(item);
    });
}

function confirmTarget() {
    if (!selectedTargetId || targetConfirmed) return;

    targetConfirmed = true;

    const confirmButton = document.getElementById('confirm-target-button');
    confirmButton.disabled = true;

    socket.emit('doctor_vote', { targetId: selectedTargetId });
}