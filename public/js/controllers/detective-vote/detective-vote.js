import socket from '../socket.js';
import { startTimerEvent } from '../../utils/timer.js';

export function initDetectiveVoteHandlers(data) {
    defaultGlobals();

    document.getElementById('confirm-target-button').addEventListener('click', confirmTarget);
    renderTargets(data.players);

    startTimerEvent(data.countdownMs, data.serverTime, 'finish_detective_vote', socket);
}

let selectedTargetId = null;
let targetConfirmed = false;

export function defaultGlobals() {
    selectedTargetId = null;
    targetConfirmed = false;
    const resultBox = document.getElementById('detective-result');
    resultBox.classList.add('hidden');
    resultBox.textContent = '';
    resultBox.classList.remove('success', 'fail');
}

function renderTargets(players) {
    const list = document.getElementById('target-players-list');
    list.innerHTML = '';

    players.forEach(player => {
        const item = document.createElement('div');
        item.classList.add('player-list-item');
        item.innerHTML = `<img src="../images/avatar.svg"><p>${player.name}</p>`;
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

    socket.emit('detective_vote', { targetId: selectedTargetId });

    const confirmButton = document.getElementById('confirm-target-button');
    confirmButton.disabled = true;
    confirmButton.classList.add('btn-disabled-visual');

    const resultBox = document.getElementById('detective-result');
    resultBox.textContent = 'Проверка...';
    resultBox.classList.remove('hidden');
}

export function handleDetectiveResult({ isMafia }) {
    const resultBox = document.getElementById('detective-result');

    if (isMafia) {
        resultBox.textContent = 'Этот игрок — Мафия';
        resultBox.classList.add('fail');
    } else {
        resultBox.textContent = 'Этот игрок — не Мафия';
        resultBox.classList.add('success');
    }
}
