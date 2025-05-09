import socket from '../socket.js';
import { updatePlayerList } from './lobby-controller.js';
import { addChatMessage } from '../chat/chat-controller.js';
import { renderRoleAssign } from '../../utils/router.js';

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

    socket.on('player_unready', ({ players }) => {
        console.log("IN player_unready")
        updatePlayerList(players);
    });


    socket.on('player_left', ({ playerLeft, players }) => {
        console.log("IN player_ready")
        updatePlayerList(players);
        addChatMessage(`!${playerLeft} left the lobby`);
    });

    socket.on('new_lobby_owner', ({ newOwnerSocketId, newOwnerName, players }) => {
        if (socket.id === newOwnerSocketId) {
            document.getElementById('settings-section').style.display = 'block';
        }
        updatePlayerList(players);
        addChatMessage(`!${newOwnerName} is owner of lobby now`);
    });

    socket.on('game_started', () => {
        console.log("IN game_started")
        socket.emit('get_role');
        console.log("OUT get_role")
    });

    socket.on('role_assign', (data) => {
        console.log("IN role_assign")
        console.log(data)
        renderRoleAssign(data)
    });
}