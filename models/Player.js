class Player {
    constructor(socketId, name) {
        this.socketId = socketId; // id сокета игрока
        this.name = name;         // имя игрока
        this.isReady = false;     // готовность к началу игры
        this.role = null;         // роль в игре (мафия, доктор и т.д.)
        this.isAlive = true;      // жив или мёртв
    }
}

module.exports = Player;
