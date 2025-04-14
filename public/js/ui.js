function switchToGameScreen(players) {
    document.getElementById('lobby-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
    updatePlayerList(players);


    const isCreator = (socket.id === players[0]?.socketId);
    document.getElementById('settings-section').style.display = isCreator ? 'block' : 'none';
}

function switchToLobbyScreen() {
    document.getElementById('lobby-screen').style.display = 'block';
    document.getElementById('game-screen').style.display = 'none';
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

function addChatMessage(text) {
    const messages = document.getElementById('chat-messages');
    const div = document.createElement('div');
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}

function setStage(stage) {
    const stageInfo = document.getElementById('stage-info');
    stageInfo.textContent = (stage === 'day') ? 'День' : 'Ночь';
}
