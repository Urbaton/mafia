import { renderMainMenu } from '../utils/router.js';
import { addChatMessage } from '../controllers/chat/chat-controller.js';

const socket = io();

socket.on('connect', () => {
    console.warn('Подключение к серверу установлено');
    renderMainMenu();
});

socket.on('chat_message', ({ sender, message }) => {
    console.log("IN chat_message")
    addChatMessage(`${sender}: ${message}`);
});

socket.on('disconnect', () => {
    console.warn('Подключение к серверу разорвано');
});

socket.on('error', ({ message }) => {
    alert('Ошибка: ' + message);
});

export default socket;