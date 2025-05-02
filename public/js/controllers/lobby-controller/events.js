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