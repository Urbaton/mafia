import Player from './player.js';
import config from '../config/index.js';

class Lobby {
    constructor(lobbyName, password, ownerSocketId, ownerName) {
        this.lobbyName = lobbyName;                 // Название комнаты
        this.password = password;                   // Пароль комнаты
        this.ownerSocketId = ownerSocketId;     // Создатель комнаты
        this.players = {};                          // { socketId: Player }
        this.isGameStarted = false;                 // Флаг старта игры
        this.currentStage = 'lobby';                // 'lobby' | 'day' | 'night'
        this.addPlayer(ownerSocketId, ownerName);    // Создание игрока
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
        return Object.values(this.players);
    }

    getPlayerLobbyList() {
        return Object.values(this.players).map(player => ({
            name: player.name,
            socketId: player.socketId,
            isReady: player.isReady,
            isOwner: this.ownerSocketId === player.socketId,
        }));
    }

    getPlayerGameList() {
        return Object.values(this.players).map(player => ({
            name: player.name,
            socketId: player.socketId,
            role: player.role,
            isAlive: player.isAlive,
        }));
    }

    allPlayersReady() {
        return Object.values(this.players).every(player => player.isReady);
    }

    isFull() {
        return Object.keys(this.players).length >= config.game.maxPlayers;
    }

    isEmpty() {
        return Object.keys(this.players).length === 0;
    }
}

export default Lobby;
