import socket from '../socket.js';
import {renderMainMenu} from '../../utils/router.js';
import {sendChatMessage} from '../chat/chat-controller.js';
import GetAvatarByName from "../../utils/name-to-avatar.js";

export function initWaitRoomHandlers(data) {
    document.getElementById('chat-send').addEventListener('click', sendChatMessage);
    document.getElementById('leave-button').addEventListener('click', leaveLobby);

    updateWaitRoomPlayerList(data.players);
}

async function leaveLobby() {
    console.log("SEND leave_lobby")
    socket.emit('leave_lobby');
    renderMainMenu();
}

export function updateWaitRoomPlayerList(players) {
    const list = document.getElementById('players-list');
    list.innerHTML = '';
    players.forEach(player => {
        const avatar = GetAvatarByName(player.name);
        const div = document.createElement('div');
        div.classList.add('player-list-item');
        div.innerHTML = `<img src=${avatar}><p>${player.name}</p>`;
        list.appendChild(div);
    });
}
