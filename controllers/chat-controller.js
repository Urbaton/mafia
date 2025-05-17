import lobbyStore from '../database/lobbyStore.js';
import { gameStages, roles } from '../models/constants.js';

export function sendMessage(io, socket, { message }) {
    const lobby = lobbyStore.getLobbyByPlayer(socket.id);
    if (!lobby) return;

    const player = lobby.players[socket.id];
    let group = lobby.lobbyName;

    if (lobby.isGameStarted) {
        group = lobby.lobbyNameAlive;

        if (!player.isAlive) {
            group = lobby.lobbyNameDead;
        } else if (lobby.game.currentStage[1] === gameStages.MAFIA_VOTE[1] && player.role == roles.MAFIA) {
            group = lobby.lobbyNameMafia;
        }
    }

    io.to(group).emit('chat_message', {
        sender: player.name,
        message,
    });
};
