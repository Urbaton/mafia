import { createClient } from 'redis';
import Lobby from '../models/lobby.js';
import Player from '../models/player.js';

const redis = createClient({ url: 'redis://localhost:6379' });
redis.on('error', err => console.error('Redis Error', err));

const lobbies = {};
const evictTimers = {};
const SECONDS_TTL = 60 * 10; // время, через которое лобби удалится, если комната никак не менялась

// Функция, создающая таймер удаления
function scheduleEvict(name, seconds) {
    if (evictTimers[name]) clearTimeout(evictTimers[name]);
    evictTimers[name] = setTimeout(() => {
        delete lobbies[name];
        removePersist(name);
        delete evictTimers[name];
    }, seconds * 1000);
}

function persist(lobby) {
    const key = `lobby:${lobby.lobbyName}`;
    const data = {
        lobbyName:     lobby.lobbyName,
        password:      lobby.password,
        ownerSocketId: lobby.ownerSocketId,
        isGameStarted: lobby.isGameStarted,
        players: Object.fromEntries(
            Object.entries(lobby.players).map(([id, p]) => [id, {
                socketId:    p.socketId,
                name:        p.name,
                isReady:     p.isReady,
                role:        p.role,
                isAlive:     p.isAlive,
                isInWaitRoom:p.isInWaitRoom
            }])
        )
    };
    redis.set(key, JSON.stringify(data), { EX: SECONDS_TTL });
    redis.sAdd('lobbies', lobby.lobbyName);
    scheduleEvict(lobby.lobbyName, SECONDS_TTL);
}

function removePersist(lobbyName) {
    redis.del(`lobby:${lobbyName}`);
    redis.sRem('lobbies', lobbyName);
}

async function loadLobby(name) {
    const json = await redis.get(`lobby:${name}`);
    if (!json) return false;
    const obj = JSON.parse(json);
    const lobby = new Lobby(obj.lobbyName, obj.password, obj.ownerSocketId, obj.ownerSocketId);
    lobby.isGameStarted = obj.isGameStarted;
    lobby.players = {};
    for (const [id, p] of Object.entries(obj.players)) {
        const pl = new Player(p.socketId, p.name);
        pl.isReady      = p.isReady;
        pl.role         = p.role;
        pl.isAlive      = p.isAlive;
        pl.isInWaitRoom = p.isInWaitRoom;
        lobby.players[id] = pl;
    }
    lobbies[name] = lobby;

    const ttl = await redis.ttl(`lobby:${name}`);
    if (ttl > 0)
        scheduleEvict(name, ttl);
    return true;
}

(async () => {
    await redis.connect();
    const names = await redis.sMembers('lobbies');
    await Promise.all(names.map(async name => {
        const ok = await loadLobby(name);
        if (!ok) {
            await redis.sRem('lobbies', name);
        }
    }));
})();

const lobbyStore = {
    createLobby(lobby) {
        lobbies[lobby.lobbyName] = lobby;
        persist(lobby);
        return lobby;
    },

    getLobby(lobbyName) {
        return lobbies[lobbyName] || null;
    },

    lobbyExists(lobbyName) {
        return Boolean(lobbies[lobbyName]);
    },

    getAllLobbies() {
        return Object.values(lobbies);
    },

    deleteLobby(lobbyName) {
        delete lobbies[lobbyName];
        removePersist(lobbyName);
        if (evictTimers[lobbyName]) {
            clearTimeout(evictTimers[lobbyName]);
            delete evictTimers[lobbyName];
        }
    },

    getLobbyByPlayer(socketId) {
        return Object.values(lobbies).find(l => l.players[socketId]) || null;
    },

    getRawMap() {
        return lobbies;
    }
};

export default lobbyStore;
