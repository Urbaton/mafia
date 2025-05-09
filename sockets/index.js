import { leaveLobby, playerReady, playerUnready, startGame } from '../controllers/lobby-controller.js';
import { createLobby, joinLobby } from '../controllers/main-menu-controller.js';
import { sendMessage } from '../controllers/chat-controller.js';
import { getRole } from '../controllers/game-controller.js';


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
        socket.on('get_role', () => getRole(io, socket));
        socket.on('fihish_role_assign', () => getRole(io, socket));
        socket.on('fihish_night_prepare', () => getRole(io, socket));
        socket.on('mafia_vote', () => getRole(io, socket));
        socket.on('fihish_mafia_vote', () => getRole(io, socket));
        socket.on('doctor_vote', () => getRole(io, socket));
        socket.on('fihish_doctor_vote', () => getRole(io, socket));
        socket.on('detective_vote', () => getRole(io, socket));
        socket.on('fihish_detective_vote', () => getRole(io, socket));
        socket.on('fihish_day_prepare', () => getRole(io, socket));
        socket.on('citizen_vote', () => getRole(io, socket));
        socket.on('fihish_citizens_vote', () => getRole(io, socket));
        socket.on('fihish_citizens_vote_result', () => getRole(io, socket));

        // Чат
        socket.on('send_chat_message', (data) => sendMessage(io, socket, data));

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
            leaveLobby(io, socket);
        });
    });
};
