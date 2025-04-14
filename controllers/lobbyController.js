const Lobby = require('../models/Lobby');

const lobbies = {};

exports.createLobby = (io, socket, { lobbyName, password, playerName }) => {
    if (lobbies[lobbyName]) {
        socket.emit('error', { message: 'Лобби с таким именем уже существует.' });
        return;
    }

    const lobby = new Lobby(lobbyName, password, socket.id);
    lobby.addPlayer(socket.id, playerName);
    lobbies[lobbyName] = lobby;

    socket.join(lobbyName);

    socket.emit('lobby_created', { lobbyName, players: lobby.getPlayerList() });
};

exports.joinLobby = (io, socket, { lobbyName, password, playerName }) => {
    const lobby = lobbies[lobbyName];
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

    lobby.addPlayer(socket.id, playerName);
    socket.join(lobbyName);

    io.to(lobbyName).emit('new_player', { newPlayer: playerName, players: lobby.getPlayerList() });
    socket.emit('lobby_joined', { lobbyName, players: lobby.getPlayerList() });
};

exports.leaveLobby = (io, socket) => {
    for (const lobbyName in lobbies) {
        const lobby = lobbies[lobbyName];
        if (lobby.players[socket.id]) {
            lobby.removePlayer(socket.id);
            socket.leave(lobbyName);

            // TODO при отключении создателя комнаты, создателем становится другой 
            if (lobby.isEmpty()) {
                delete lobbies[lobbyName];
            } else {
                io.to(lobbyName).emit('player_left', { players: lobby.getPlayerList() });
            }
            break;
        }
    }
};

exports.playerReady = (io, socket) => {
    for (const lobbyName in lobbies) {
        const lobby = lobbies[lobbyName];
        if (lobby.players[socket.id]) {
            lobby.players[socket.id].isReady = true;
            io.to(lobbyName).emit('player_ready', { players: lobby.getPlayerList() });
            break;
        }
    }
};

// Чтобы использовать lobbies из других контроллеров
exports.lobbies = lobbies;
