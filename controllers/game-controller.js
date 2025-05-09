import lobbyStore from '../database/lobbyStore.js';
import { roles } from "../models/constants.js";

export function getRole(io, socket) {
    const lobby = lobbyStore.getLobbyByPlayer(socket.id);
    if (!lobby) return;

    const players = lobby.getPlayerList();
    const player = players.filter(player => player.socketId === socket.id)[0];
    const mafiaPlayers = players.filter(player => player.role === roles.MAFIA && player.socketId != socket.id);
    const sameRolePlayers = player.role === roles.MAFIA ? mafiaPlayers : []
    socket.emit('role_assign', { role: player.role, sameRolePlayers, });
};
