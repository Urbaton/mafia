import socket from '../socket.js';
import { initSocketEvents } from './events.js';
import { renderMainMenu } from '../../utils/router.js';
import { sendChatMessage } from '../chat/chat-controller.js';

export function initLobbyHandlers(data) {
    initSocketEvents();
}