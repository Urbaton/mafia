import lobbyStore from '../database/lobbyStore.js';

export function sendMessage(io, socket, { message }) {
    const lobby = lobbyStore.getLobbyByPlayer(socket.id);
    if (!lobby) return;

    const player = lobby.players[socket.id];

    if (!lobby.gameState.isGameStarted) {
        io.to(lobby.lobbyName).emit('chat_message', {
            sender: player.name,
            message,
        });
        return;
    }

    // TODO вынести в константу stage
    if (lobby.currentStage === 'day') {
        io.to(lobby.lobbyName).emit('chat_message', {
            sender: player.name,
            message,
        });
    } else if (lobby.currentStage === 'night') {
        // Ночной чат — только мафия
        if (player.role === 'mafia' && player.isAlive) {
            // Перебираем всех игроков
            for (const p of Object.values(lobby.players)) {
                if (p.role === 'mafia' && p.isAlive) {
                    io.to(p.socketId).emit('chat_message', {
                        sender: player.name,
                        message,
                    });
                }
            }
        }
    }
};
