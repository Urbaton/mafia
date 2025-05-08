import Lobby from '../models/lobby.js';
import lobbyStore from '../database/lobbyStore.js';

export function createLobby(io, socket, { lobbyName, password, playerName }){
    if (lobbyStore.lobbyExists(lobbyName)) {
        socket.emit('error', { message: 'Лобби с таким именем уже существует.' });
        return;
    }

    const lobby = new Lobby(lobbyName, password, socket.id, playerName);
    lobbyStore.createLobby(lobby);

    socket.join(lobbyName);
    socket.emit('lobby_created', { lobbyName, players: lobby.getPlayerLobbyList() });
};

export function joinLobby(io, socket, { lobbyName, password, playerName }) {
    const lobby = lobbyStore.getLobby(lobbyName);
    if (!lobby) {
        socket.emit('error', { message: 'Лобби не найдено.' });
        return;
    }
    if (lobby.password !== password) {
        socket.emit('error', { message: 'Неверный пароль.' });
        return;
    }
    if (lobby.isFull()) {
        socket.emit('error', { message: 'Лобби заполнено.' });
        return;
    }
    if (lobby.gameState.isGameStarted) {
        socket.emit('error', { message: 'Невозможно подключиться к начавшейся игре.' });
        return;
    }

    let nameExists = false;
    lobby.getPlayerList().forEach(player => {nameExists = player.name === playerName});
    if (nameExists) {
        socket.emit('error', { message: 'Имя игрока уже занято.' });
        return;
    }

    lobby.addPlayer(socket.id, playerName);
    const allPlayers = lobby.getPlayerLobbyList();
    io.to(lobbyName).emit('new_player', { newPlayer: playerName, players: allPlayers });
    socket.join(lobbyName);
    socket.emit('lobby_joined', { lobbyName, players: allPlayers });
};