const Player = require('./Player');

class Lobby {
    constructor(lobbyName, password, creatorSocketId) {
        this.lobbyName = lobbyName;                 // Название комнаты
        this.password = password;                   // Пароль комнаты
        this.creatorSocketId = creatorSocketId;     // Создатель комнаты
        this.players = {};                          // { socketId: Player }
        this.isGameStarted = false;                 // Флаг старта игры
        this.currentStage = 'lobby'; // 'lobby' | 'day' | 'night'
    }

    addPlayer(socketId, name) {
        if (this.isFull()) return false;
        this.players[socketId] = new Player(socketId, name);
        return true;
    }

    removePlayer(socketId) {
        delete this.players[socketId];
    }

    getPlayerList() {
        return Object.values(this.players).map(player => ({
            name: player.name,
            socketId: player.socketId,
            isReady: player.isReady,
            isAlive: player.isAlive,
        }));
    }

    allPlayersReady() {
        return Object.values(this.players).every(player => player.isReady);
    }

    isFull() {
        return Object.keys(this.players).length >= 9; // максимум 9 игроков
    }

    isEmpty() {
        return Object.keys(this.players).length === 0;
    }
}

module.exports = Lobby;
