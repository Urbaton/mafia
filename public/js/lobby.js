function createLobby() {
    const playerName = document.getElementById('player-name').value;
    const lobbyName = document.getElementById('lobby-name').value;
    const lobbyPassword = document.getElementById('lobby-password').value;

    console.log("OUT create_lobby")
    socket.emit('create_lobby', { lobbyName, password: lobbyPassword, playerName });
}

function joinLobby() {
    const playerName = document.getElementById('player-name').value;
    const lobbyName = document.getElementById('lobby-name').value;
    const lobbyPassword = document.getElementById('lobby-password').value;

    console.log("OUT join_lobby")
    socket.emit('join_lobby', { lobbyName, password: lobbyPassword, playerName });
}

function leaveLobby() {
    console.log("OUT leave_lobby")
    socket.emit('leave_lobby');
    switchToLobbyScreen();
}

socket.on('lobby_created', ({ lobbyName, players }) => {
    // TODO отрисовать lobbyName
    console.log("IN lobby_created")
    switchToGameScreen(players);
});

socket.on('lobby_joined', ({ players }) => {
    console.log("IN lobby_joined")
    switchToGameScreen(players);
});

socket.on('new_player', ({ newPlayer, players }) => {
    console.log("IN new_player")
    updatePlayerList(players);
    addChatMessage(`!${newPlayer} joined the lobby`);
});

socket.on('player_ready', ({ players }) => {
    console.log("IN player_ready")
    updatePlayerList(players);
});

socket.on('player_left', ({ playerLeft, players }) => {
    console.log("IN player_ready")
    updatePlayerList(players);
    addChatMessage(`!${playerLeft} left the lobby`);
});

socket.on('new_creator', ({ newCreatorSocketId, newCreatorName }) => {
    if (socket.id === newCreatorSocketId) {
        document.getElementById('settings-section').style.display = 'block';
    }
    addChatMessage(`!${newCreatorName} is owner of lobby now`);
});

socket.on('error', ({ message }) => {
    alert('Ошибка: ' + message);
});
