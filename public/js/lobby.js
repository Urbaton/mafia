function createLobby() {
    const playerName = document.getElementById('player-name').value;
    const lobbyName = document.getElementById('lobby-name').value;
    const lobbyPassword = document.getElementById('lobby-password').value;
  
    socket.emit('create_lobby', { lobbyName, password: lobbyPassword, playerName });
  }
  
  function joinLobby() {
    const playerName = document.getElementById('player-name').value;
    const lobbyName = document.getElementById('lobby-name').value;
    const lobbyPassword = document.getElementById('lobby-password').value;
  
    socket.emit('join_lobby', { lobbyName, password: lobbyPassword, playerName });
  }
  
  socket.on('lobby_created', ({ players }) => {
    switchToGameScreen(players);
  });
  
  socket.on('lobby_joined', ({ players }) => {
    switchToGameScreen(players);
  });
  
  socket.on('new_player', ({ players }) => {
    updatePlayerList(players);
  });
  
  socket.on('player_ready', ({ players }) => {
    updatePlayerList(players);
  });
  
  socket.on('player_left', ({ players }) => {
    updatePlayerList(players);
  });
  
  socket.on('error', ({ message }) => {
    alert('Ошибка: ' + message);
  });
  