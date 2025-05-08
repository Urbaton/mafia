import socket from '../socket.js';
// import { renderLobby } from '../../utils/router.js';

let socketInitialized = false;

export function initSocketEvents() {
    if (socketInitialized) return;
    socketInitialized = true;

    socket.on('new_player', ({ newPlayer, players }) => {
        console.log("IN new_player")
        updatePlayerList(players);
        addChatMessage(`!${newPlayer} joined the lobby`);
    });

    socket.on('player_ready', ({ players }) => {
        console.log("IN player_ready")
        updatePlayerList(players);
    });

    socket.on('player_left', ({ playerLeft, players }) => {
        console.log("IN player_ready")
        updatePlayerList(players);
        addChatMessage(`!${playerLeft} left the lobby`);
    });

    socket.on('new_lobby_owner', ({ newOwnerSocketId, newOwmerName }) => {
        if (socket.id === newOwnerSocketId) {
            document.getElementById('settings-section').style.display = 'block';
        }
        addChatMessage(`!${newOwmerName} is owner of lobby now`);
    });

    // socket.on('game_started', ({ newOwnerSocketId, newOwmerName }) => {
    //     if (socket.id === newOwnerSocketId) {
    //         document.getElementById('settings-section').style.display = 'block';
    //     }
    //     addChatMessage(`!${newOwmerName} is owner of lobby now`);
    // });
}