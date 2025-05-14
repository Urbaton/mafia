import { leaveLobby, playerReady, playerUnready, startGame } from '../controllers/lobby-controller.js';
import { createLobby, joinLobby } from '../controllers/main-menu-controller.js';
import { sendMessage } from '../controllers/chat-controller.js';
import {
    getRole, finishRoleAssign, finishNightPrepare, finishMafiaVote, processNextStage,
    finishDoctorVote, finishDetectiveVote, finishDayPrepare, finishCitizenVote,
    finishCitizenVoteResult, mafiaVote, doctorVote, detectiveVote, citizenVote
} from '../controllers/game-controller.js';


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
        socket.on('next_stage', () => processNextStage(io, socket));
        socket.on('get_role', () => getRole(io, socket));
        socket.on('finish_role_assign', () => finishRoleAssign(io, socket));
        socket.on('fihish_night_prepare', () => finishNightPrepare(io, socket));
        socket.on('mafia_vote', () => mafiaVote(io, socket, data));
        socket.on('fihish_mafia_vote', () => finishMafiaVote(io, socket));
        socket.on('doctor_vote', () => doctorVote(io, socket, data));
        socket.on('fihish_doctor_vote', () => finishDoctorVote(io, socket));
        socket.on('detective_vote', () => detectiveVote(io, socket, data));
        socket.on('fihish_detective_vote', () => finishDetectiveVote(io, socket));
        socket.on('fihish_day_prepare', () => finishDayPrepare(io, socket));
        socket.on('citizen_vote', () => citizenVote(io, socket, data));
        socket.on('fihish_citizens_vote', () => finishCitizenVote(io, socket));
        socket.on('fihish_citizens_vote_result', () => finishCitizenVoteResult(io, socket));

        // Чат
        socket.on('send_chat_message', (data) => sendMessage(io, socket, data));

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
            leaveLobby(io, socket);
        });
    });
};
