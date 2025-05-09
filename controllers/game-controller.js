import lobbyStore from '../database/lobbyStore.js';
import { roles } from "../models/constants.js";
import config from "../config/index.js"
import { gameStages } from '../models/constants.js'


export function getRole(io, socket) {
    const lobby = lobbyStore.getLobbyByPlayer(socket.id);
    if (!lobby) return;

    const players = lobby.getPlayerList();
    const player = players.filter(player => player.socketId === socket.id)[0];
    const mafiaPlayers = players.filter(player => player.role === roles.MAFIA && player.socketId != socket.id);
    const sameRolePlayers = player.role === roles.MAFIA ? mafiaPlayers : []
    socket.emit('role_assign', {
        role: player.role,
        sameRolePlayers,
        countdownMs: config.game.roleAssignDurationMs,
        serverTime: Date.now()
    });
};

export function finishRoleAssign(io, socket) {
    const lobby = lobbyStore.getLobbyByPlayer(socket.id);
    if (!lobby) return;

    if (lobby.game.currentStage[1] != gameStages.ROLE_ASSIGN[1]) return;

    lobby.game.nextStage()

    io.to(lobby.lobbyName).emit('prepare_night');
};

