function switchToGameScreen(players) {
    document.getElementById('lobby-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
    updatePlayerList(players);
}

function updatePlayerList(players) {
    const list = document.getElementById('player-list');
    list.innerHTML = '';
    players.forEach(player => {
        const div = document.createElement('div');
        div.textContent = `${player.name} (${player.isAlive ? 'жив' : 'мертв'})`;
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
    stageInfo.textContent = (stage === 'day') ? 'День: обсуждение' : 'Ночь: мафия действует';
}
