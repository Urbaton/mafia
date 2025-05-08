import socket from '../socket.js';

export function initMainMenuHandlers() {
    document.getElementById('ready-button').addEventListener('click', markReady);
    document.getElementById('chat-send').addEventListener('click', sendChatMessage);
    document.getElementById('start-game-button').addEventListener('click', startGame);
    document.getElementById('leave-button').addEventListener('click', leaveLobby);
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