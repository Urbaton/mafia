const lobbies = {}; // временное хранилище

const lobbyStore = {
    createLobby(lobby) {
        lobbies[lobby.lobbyName] = lobby;
        return lobby;
    },

    getLobby(lobbyName) {
        return lobbies[lobbyName] || null;
    },

    lobbyExists(lobbyName) {
        return !!lobbies[lobbyName];
    },

    getAllLobbies() {
        return Object.values(lobbies);
    },

    deleteLobby(lobbyName) {
        delete lobbies[lobbyName];
    },

    getLobbyByPlayer(socketId) {
        for (const lobby of Object.values(lobbies)) {
            if (lobby.players[socketId]) return lobby;
        }
        return null;
    },

    getRawMap() {
        return lobbies; // на случай полного доступа
    },
};

export default lobbyStore;