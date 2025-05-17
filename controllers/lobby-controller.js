import lobbyStore from '../database/lobbyStore.js';
import { roles } from '../models/constants.js';
import config from '../config/index.js';

export function leaveLobby(io, socket) {
    const lobby = lobbyStore.getLobbyByPlayer(socket.id);
    if (!lobby) return;

    const wasOwner = (socket.id === lobby.ownerSocketId);

    const playerLeft = lobby.players[socket.id];
    lobby.removePlayer(socket.id);
    socket.leave(lobby.lobbyName);
    socket.leave(lobby.lobbyNameAlive);
    socket.leave(lobby.lobbyNameMafia);
    socket.leave(lobby.lobbyNameDead);

    if (!lobby.isGameStarted)
        io.to(lobby.lobbyName).emit('player_left', { playerLeft: playerLeft.name, players: lobby.getPlayerLobbyList() });

    if (lobby.isEmpty()) {
        lobbyStore.deleteLobby(lobby.lobbyName);
    } else {
        if (wasOwner) {
            const remainingPlayers = lobby.getPlayerList();
            const newOwner = remainingPlayers[0];
            lobby.ownerSocketId = newOwner.socketId;

            if (!lobby.isGameStarted) {
                io.to(lobby.lobbyName).emit('new_lobby_owner', {
                    newOwnerSocketId: lobby.ownerSocketId,
                    newOwnerName: newOwner.name,
                    players: lobby.getPlayerLobbyList()
                });
            }
        }
    }

    if (!lobby.isGameStarted || !playerLeft.isAlive) return;

    if (playerLeft.role === roles.MAFIA) {
        lobby.game.killMafia();
    }

    if (playerLeft.role === roles.DOCTOR) {
        lobby.game.killDoctor();
    }

    if (playerLeft.role === roles.DETECTIVE) {
        lobby.game.killDetective();
    }
};

export function playerReady(io, socket) {
    const lobby = lobbyStore.getLobbyByPlayer(socket.id);
    if (!lobby) return;

    lobby.players[socket.id].isReady = true;
    io.to(lobby.lobbyName).emit('player_ready', { players: lobby.getPlayerLobbyList() });
};

export function playerUnready(io, socket) {
    const lobby = lobbyStore.getLobbyByPlayer(socket.id);
    if (!lobby) return;

    lobby.players[socket.id].isReady = false;
    io.to(lobby.lobbyName).emit('player_unready', { players: lobby.getPlayerLobbyList() });
};

export function startGame(io, socket, settings) {
    const lobby = lobbyStore.getLobbyByPlayer(socket.id);
    if (!lobby) return;

    if (lobby.ownerSocketId != socket.id) {
        return
    }

    if (!lobby.allPlayersReady()) {
        socket.emit('error', { message: 'Не все игроки готовы.' });
        return;
    }

    const players = lobby.getPlayerList();
    if (players.length < config.game.minPlayers) {
        socket.emit('error', { message: 'Недостаточно игроков.' });
        return;
    }

    if (!checkSettings(settings, players.length)) {
        socket.emit('error', { message: 'Некорректные настройки игры.' });
        return;
    }

    lobby.startGame(settings);

    io.to(lobby.lobbyName).emit('game_started');

    console.log(`Game started in lobby: ${lobby.lobbyName}`);
};

function checkSettings(settings, playersCount) {
    if (!settings) {
        return false;
    }

    if (settings.mafiaCount < 1 || settings.mafiaCount > 2) {
        return false;
    }

    if (playersCount === 4 && settings.mafiaCount == 2) {
        return false;
    }

    return true;
}