import socket from '../socket.js';

export function initMainMenuHandlers() {
    document.getElementById('ready-button').addEventListener('click', markReady);
    document.getElementById('chat-send').addEventListener('click', sendChatMessage);
    document.getElementById('start-game-button').addEventListener('click', startGame);
    document.getElementById('leave-button').addEventListener('click', leaveLobby);
}

function markReady() {
    socket.emit('ready');
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

function startVoting(players, type) {
    const voteSection = document.getElementById('vote-section');
    const votePlayers = document.getElementById('vote-players');
    votePlayers.innerHTML = '';

    players.forEach(player => {
        const btn = document.createElement('button');
        btn.textContent = player.name;
        btn.onclick = () => {
            if (type === 'day') {
                socket.emit('vote_day', { targetSocketId: player.socketId });
            } else if (type === 'night') {
                socket.emit('vote_night', { targetSocketId: player.socketId });
            }
            voteSection.style.display = 'none';
        };
        votePlayers.appendChild(btn);
    });

    voteSection.style.display = 'block';
}

function setStage(stage) {
    const stageInfo = document.getElementById('stage-info');
    stageInfo.textContent = (stage === 'day') ? 'День' : 'Ночь';
}