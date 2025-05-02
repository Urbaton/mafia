import { renderMainMenu } from '../utils/router.js';

const socket = io();

socket.on('connect', () => {
    console.warn('Подключение к серверу установлено');
    renderMainMenu();
});

socket.on('disconnect', () => {
    console.warn('Подключение к серверу разорвано');
});

socket.on('error', ({ message }) => {
    alert('Ошибка: ' + message);
});

export default socket;