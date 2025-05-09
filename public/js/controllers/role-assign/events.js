import socket from '../socket.js';
import { renderRoleAssign } from '../../utils/router.js';
import { roleTimer } from './role-assign.js';

let socketInitialized = false;

export function initSocketEvents() {
    if (socketInitialized) return;
    socketInitialized = true;

    socket.on('prepare_night', () => {
        console.log("IN prepare_night")
        if (roleTimer !== null) {
            clearTimeout(roleTimer);
            roleTimer = null;
            console.log('Таймер остановлен по команде сервера');
        }
        renderRoleAssign({ role, sameRolePlayers });
    });
}