import { leaveLobby, playerReady, playerUnready, startGame } from '../controllers/lobby-controller.js';
// import { startGame, voteNight, voteDay } from '../controllers/game-controller.js';
import { sendMessage } from '../controllers/chat-controller.js';
import { createLobby, joinLobby } from '../controllers/main-menu-controller.js';

export default function (io) {
    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);

        // главное меню
        socket.on('create_lobby', (data) => createLobby(io, socket, data));
        socket.on('join_lobby', (data) => joinLobby(io, socket, data));

        // Лобби
        socket.on('leave_lobby', () => leaveLobby(io, socket));
        socket.on('ready', () => playerReady(io, socket));
        socket.on('unready', () => playerUnready(io, socket));
        socket.on('start_game', (data) => startGame(io, socket, data));

        // Игра
        // 
        // socket.on('vote_night', (data) => voteNight(io, socket, data));
        // socket.on('vote_day', (data) => voteDay(io, socket, data));


        // Чат
        socket.on('send_chat_message', (data) => sendMessage(io, socket, data));

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
            leaveLobby(io, socket);
        });
    });
};
