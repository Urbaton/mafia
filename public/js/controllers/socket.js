import { addChatMessage } from '../controllers/chat/chat-controller.js';
import { clearTimer } from '../utils/timer.js'
import { updatePlayerList } from './lobby-controller/lobby-controller.js';
import { handleDetectiveResult } from './detective-vote/detective-vote.js';
import {
    renderMainMenu, renderLobby, renderRoleAssign, renderNightPrepare, renderMafiaVote,
    renderMafiaVoteWait, renderDetectiveVote, renderDetectiveVoteWait, renderDoctorVote,
    renderDoctorVoteWait, renderDayPrepare, renderCitizensVote, renderCitizensVoteResult
} from '../utils/router.js';

const socket = io();

//#General events 

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

//#endregion

//#Lobby events 

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

socket.on('new_player', ({ newPlayer, players }) => {
    console.log("IN new_player")
    updatePlayerList(players);
    addChatMessage(`!${newPlayer} joined the lobby`);
});

socket.on('player_ready', ({ players }) => {
    console.log("IN player_ready")
    updatePlayerList(players);
});

socket.on('player_unready', ({ players }) => {
    console.log("IN player_unready")
    updatePlayerList(players);
});


socket.on('player_left', ({ playerLeft, players }) => {
    console.log("IN player_ready")
    updatePlayerList(players);
    addChatMessage(`!${playerLeft} left the lobby`);
});

socket.on('new_lobby_owner', ({ newOwnerSocketId, newOwnerName, players }) => {
    if (socket.id === newOwnerSocketId) {
        document.getElementById('settings-section').style.display = 'block';
    }
    updatePlayerList(players);
    addChatMessage(`!${newOwnerName} is owner of lobby now`);
});

socket.on('game_started', () => {
    console.log("IN game_started")
    socket.emit('get_role');
    console.log("OUT get_role")
});

//#endregion

//#Game events 

socket.on('stage_end', () => {
    console.log("IN stage_end")
    socket.emit('next_stage');
});

socket.on('role_assign', (data) => {
    console.log("IN role_assign")
    console.log(data)
    renderRoleAssign(data)
});

socket.on('night_prepare', (data) => {
    console.log("IN night_prepare")
    clearTimer();
    renderNightPrepare(data);
});

socket.on('mafia_vote', (data) => {
    console.log("IN mafia_vote")
    clearTimer();
    renderMafiaVote(data);
});

socket.on('mafia_vote_wait', (data) => {
    console.log("IN mafia_vote")
    clearTimer();
    renderMafiaVoteWait(data);
});

socket.on('detective_vote', (data) => {
    console.log("IN detective_vote")
    clearTimer();
    renderDetectiveVote(data);
});

socket.on('detective_vote_result', (data) => {
    console.log("IN detective_vote_result")
    handleDetectiveResult(data);
});

socket.on('detective_vote_wait', (data) => {
    console.log("IN detective_vote_wait")
    clearTimer();
    renderDetectiveVoteWait(data);
});

socket.on('doctor_vote', (data) => {
    console.log("IN doctor_vote")
    clearTimer();
    renderDoctorVote(data);
});

socket.on('doctor_vote_wait', (data) => {
    console.log("IN doctor_vote_wait")
    clearTimer();
    renderDoctorVoteWait(data);
});

socket.on('day_prepare', (data) => {
    console.log("IN day_prepare")
    clearTimer();
    renderDayPrepare(data);
});

socket.on('citizen_vote', (data) => {
    console.log("IN day_prepare")
    clearTimer();
    renderCitizensVote(data);
});

socket.on('citizen_vote_result', (data) => {
    console.log("IN citizen_vote_result")
    clearTimer();
    renderCitizensVoteResult(data);
});

socket.on('game_over', (data) => {
    console.log("IN day_prepare")
    clearTimer();
    renderMafiaVoteWait(data);
});

//#endregion

export default socket;