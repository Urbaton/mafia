import { renderMainMenu } from '../utils/router.js';
import { addChatMessage } from '../controllers/chat/chat-controller.js';
import { clearRoleTimer } from '../../utils/timer.js'
import { renderLobby, renderNightPrepare, renderMafiaVote, renderMafiaVoteWait } from '../utils/router.js';

const socket = io();

socket.on('connect', () => {
    console.warn('Подключение к серверу установлено');
    renderMainMenu();
});

socket.on('chat_message', ({ sender, message }) => {
    console.log("IN chat_message")
    addChatMessage(`${sender}: ${message}`);
});

socket.on('stage_end', () => {
    console.log("IN stage_end")
    socket.emit('next_stage');
});

socket.on('lobby_created', ({ lobbyName, players }) => {
    console.log("IN lobby_created")
    console.log(lobbyName, players)
    renderLobby({ players: players });
});

socket.on('lobby_joined', ({ lobbyName, players }) => {
    console.log("IN lobby_joined")
    console.log(lobbyName, players)
    renderLobby({ players: players });
});

socket.on('night_prepare', (data) => {
    console.log("IN night_prepare")
    clearRoleTimer();
    renderNightPrepare(data);
});

socket.on('mafia_vote', (data) => {
    console.log("IN mafia_vote")
    clearRoleTimer();
    renderMafiaVote(data);
});

socket.on('mafia_vote_wait', (data) => {
    console.log("IN mafia_vote")
    clearRoleTimer();
    renderMafiaVoteWait(data);
});

// socket.on('detective_vote', (data) => {
//     console.log("IN detective_vote")
//     clearRoleTimer();
//     renderMafiaVoteWait(data);
// });

// socket.on('detective_vote_wait', (data) => {
//     console.log("IN detective_vote_wait")
//     clearRoleTimer();
//     renderMafiaVoteWait(data);
// });

// socket.on('doctor_vote', (data) => {
//     console.log("IN doctor_vote")
//     clearRoleTimer();
//     renderMafiaVoteWait(data);
// });

// socket.on('doctor_vote_wait', (data) => {
//     console.log("IN doctor_vote_wait")
//     clearRoleTimer();
//     renderMafiaVoteWait(data);
// });

// socket.on('day_prepare', (data) => {
//     console.log("IN day_prepare")
//     clearRoleTimer();
//     renderMafiaVoteWait(data);
// });

// socket.on('citizen_vote', (data) => {
//     console.log("IN day_prepare")
//     clearRoleTimer();
//     renderMafiaVoteWait(data);
// });

// socket.on('citizen_vote_result', (data) => {
//     console.log("IN day_prepare")
//     clearRoleTimer();
//     renderMafiaVoteWait(data);
// });

// socket.on('game_over', (data) => {
//     console.log("IN day_prepare")
//     clearRoleTimer();
//     renderMafiaVoteWait(data);
// });

socket.on('disconnect', () => {
    console.warn('Подключение к серверу разорвано');
});

socket.on('error', ({ message }) => {
    alert('Ошибка: ' + message);
});

export default socket;