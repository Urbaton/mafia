import socket from '../socket.js';
import { renderRoleAssign } from '../../utils/router.js';

let socketInitialized = false;

export function initSocketEvents() {
    if (socketInitialized) return;
    socketInitialized = true;

    socket.on('prepare_night', ({ newPlayer, players }) => {
        console.log("IN prepare_night")
        renderRoleAssign({ role, sameRolePlayers });
    });
}