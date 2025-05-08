import socket from '../socket.js';
import { renderLobby } from '../../utils/router.js';

let socketInitialized = false;

export function initSocketEvents() {
    if (socketInitialized) return;
    socketInitialized = true;

    socket.on('lobby_created', ({ lobbyName, players }) => {
        console.log("IN lobby_created")
        console.log(lobbyName, players)
        renderLobby({players: players});
    });

    socket.on('lobby_joined', ({ lobbyName, players }) => {
        console.log("IN lobby_joined")
        console.log(lobbyName, players)
        renderLobby({players: players});
    });
}