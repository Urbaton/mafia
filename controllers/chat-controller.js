const { lobbies } = require('./lobby-controller');

exports.sendMessage = (io, socket, { message }) => {
    for (const lobbyName in lobbies) {
        const lobby = lobbies[lobbyName];
        if (lobby.players[socket.id]) {
            const player = lobby.players[socket.id];

            if (!lobby.isGameStarted) {
                // Игра ещё не началась — можно писать всем
                io.to(lobbyName).emit('chat_message', {
                    sender: player.name,
                    message,
                });
                return;
            }

            // TODO вынести в константу stage
            if (lobby.currentStage === 'day') {
                io.to(lobbyName).emit('chat_message', {
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
            break;
        }
    }
};
