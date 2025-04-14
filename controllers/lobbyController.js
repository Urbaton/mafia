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
    if (lobbies[lobbyName].isGameStarted) {
        socket.emit('error', { message: 'Невозможно подключиться к начавшейся игре.' });
        return;
    }

    lobby.addPlayer(socket.id, playerName);
    const allPlayers = lobby.getPlayerList();
    io.to(lobbyName).emit('new_player', { newPlayer: playerName, players: allPlayers });
    socket.join(lobbyName);
    socket.emit('lobby_joined', { lobbyName, players: allPlayers });
};

exports.leaveLobby = (io, socket) => {
    for (const lobbyName in lobbies) {
        const lobby = lobbies[lobbyName];
        if (lobby.players[socket.id]) {
            const wasCreator = (socket.id === lobby.creatorSocketId);

            const playerLeftName = lobby.players[socket.id].name;
            lobby.removePlayer(socket.id);
            socket.leave(lobbyName);
            io.to(lobbyName).emit('player_left', { playerLeft: playerLeftName, players: lobby.getPlayerList() });

            if (lobby.isEmpty()) {
                delete lobbies[lobbyName];
            } else {
                if (wasCreator) {
                    const remainingPlayers = Object.keys(lobby.players);
                    lobby.creatorSocketId = remainingPlayers[0];

                    io.to(lobbyName).emit('new_creator', {
                        newCreatorSocketId: lobby.creatorSocketId,
                        newCreatorName: lobby.players[lobby.creatorSocketId].name,
                    });
                }
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

exports.lobbies = lobbies;
