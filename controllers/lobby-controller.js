import lobbyStore from '../database/lobbyStore.js';

export function leaveLobby(io, socket) {
    const lobby = lobbyStore.getLobbyByPlayer(socket.id);
    if (!lobby) return;

    const wasOwner = (socket.id === lobby.ownerSocketId);

    const playerLeft = lobby.players[socket.id].name;
    lobby.removePlayer(socket.id);
    socket.leave(lobbyName);
    io.to(lobbyName).emit('player_left', { playerLeft, players: lobby.getPlayerLobbyList() });

    if (lobby.isEmpty()) {
        lobbyStore.deleteLobby(lobbyName);
    } else {
        if (wasOwner) {
            const remainingPlayers = lobby.getPlayerList();
            lobby.ownerSocketId = remainingPlayers[0].socketId;

            io.to(lobbyName).emit('new_lobby_owner', {
                newOwnerSocketId: lobby.ownerSocketId,
                newOwnerName: lobby.players[lobby.ownerSocketId].name,
            });
        }
    }
};

export function playerReady(io, socket) {
    const lobby = lobbyStore.getLobbyByPlayer(socket.id);
    if (!lobby) return;

    lobby.players[socket.id].isReady = true;
    io.to(lobbyName).emit('player_ready', { players: lobby.getPlayerLobbyList() });
};
