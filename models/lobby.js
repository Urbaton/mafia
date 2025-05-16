import Player from './player.js';
import Game from './game.js';
import config from '../config/index.js';

class Lobby {
    constructor(lobbyName, password, ownerSocketId, ownerName) {
        this.lobbyName = lobbyName;
        this.lobbyNameAlive = lobbyName + "Alive";
        this.lobbyNameDead = lobbyName + "Dead";
        this.lobbyNameMafia = lobbyName + "Mafia";
        this.isGameStarted = false;
        this.password = password;
        this.ownerSocketId = ownerSocketId;
        this.players = {};   // { socketId: Player }
        this.game = null;
        this.addPlayer(ownerSocketId, ownerName);
    }

    startGame(settings) {
        this.game = new Game(this.getPlayerList(), settings);
    }

    endGame() {
        this.game = null;
        this.isGameStarted = false;
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
