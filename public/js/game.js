function markReady() {
    socket.emit('ready');
}

socket.on('game_started', ({ role, players }) => {
    alert(`Ваша роль: ${role}`);
    updatePlayerList(players);
    setStage('day');
});

socket.on('start_day', ({ players }) => {
    setStage('day');
    updatePlayerList(players);
});

socket.on('start_day_voting', ({ players }) => {
    startVoting(players, 'day');
});

socket.on('start_night', ({ players }) => {
    setStage('night');
    updatePlayerList(players);
});

socket.on('start_night_voting', ({ players }) => {
    startVoting(players, 'night');
});

socket.on('player_killed', ({ name }) => {
    addChatMessage(`${name} был убит ночью.`);
});

socket.on('player_executed', ({ name }) => {
    addChatMessage(`${name} был казнён днём.`);
});

socket.on('no_kill', ({ message }) => {
    addChatMessage(message);
});

socket.on('no_execution', ({ message }) => {
    addChatMessage(message);
});

socket.on('game_over', ({ winner }) => {
    alert(`Игра окончена! Победили: ${winner}`);
    location.reload(); // Перезагрузка страницы
});

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
