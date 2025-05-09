import lobbyStore from '../database/lobbyStore.js';
import { roles } from "../models/constants.js";
import config from "../config/index.js"
import { gameStages } from '../models/constants.js'


export function getRole(io, socket) {
    const lobby = lobbyStore.getLobbyByPlayer(socket.id);
    if (!lobby) return;

    const players = lobby.getPlayerList();
    const player = players.filter(player => player.socketId === socket.id)[0];
    const mafiaPlayers = players.filter(player => player.role === roles.MAFIA && player.socketId != socket.id);
    const sameRolePlayers = player.role === roles.MAFIA ? mafiaPlayers : []
    socket.emit('role_assign', {
        role: player.role,
        sameRolePlayers,
        countdownMs: config.game.roleAssignDurationMs,
        serverTime: Date.now()
    });
};

function finishStage(io, socket, currentStage) {
    const lobby = lobbyStore.getLobbyByPlayer(socket.id);
    if (!lobby) return;

    if (lobby.game.currentStage[1] != currentStage[1]) return;

    const stage = lobby.game.nextStage()
    console.log(stage)

    io.to(lobby.lobbyName).emit('stage_end');
};

export function finishRoleAssign(io, socket) {
    finishStage(io, socket, gameStages.ROLE_ASSIGN)
};

export function finishNightPrepare(io, socket) {
    finishStage(io, socket, gameStages.NIGHT_PREPARE)
};

export function finishMafiaVote(io, socket) {
    finishStage(io, socket, gameStages.MAFIA_VOTE)
};

export function finishDoctorVote(io, socket) {
    finishStage(io, socket, gameStages.DOCTOR_VOTE)
};

export function finishDetectiveVote(io, socket) {
    finishStage(io, socket, gameStages.DETECTIVE_VOTE)
};

export function finishDayPrepare(io, socket) {
    finishStage(io, socket, gameStages.DAY_PREPARE)
};

export function finishCitizenVote(io, socket) {
    finishStage(io, socket, gameStages.CITIZEN_VOTE)
};

export function finishCitizenVoteResult(io, socket) {
    finishStage(io, socket, gameStages.CITIZEN_VOTE_RESULT)
};

export function mafiaVote(io, socket, data) {

};

export function doctorVote(io, socket, data) {

};

export function detectiveVote(io, socket, data) {

};

export function citizenVote(io, socket, data) {

};

export function processNextStage(io, socket) {
    const lobby = lobbyStore.getLobbyByPlayer(socket.id);
    if (!lobby) return;

    const players = lobby.getPlayerList();
    const player = players.filter(player => player.socketId === socket.id)[0];
    const stage = lobby.game.currentStage;

    if (!player.isAlive) return

    switch (stage[1]) {
        case gameStages.NIGHT_PREPARE[1]:
            processNightPrepareStage(io, socket, lobby)
            break;
        case gameStages.MAFIA_VOTE[1]:
            processMafiaVoteStage(io, socket, lobby)
            break;
        case gameStages.DETECTIVE_VOTE[1]:
            processDetectiveVoteStage(io, socket, lobby)
            break;
        case gameStages.DOCTOR_VOTE[1]:
            processDoctorVoteStage(io, socket, lobby)
            break;
        case gameStages.DAY_PREPARE[1]:
            processDayPrepareStage(io, socket, lobby)
            break;
        case gameStages.CITIZEN_VOTE[1]:
            processCitizenVoteStage(io, socket, lobby)
            break;
        case gameStages.CITIZEN_VOTE_RESULT[1]:
            processCitizenVoteResultStage(io, socket, lobby)
            break;
    };
};

function processNightPrepareStage(io, socket, lobby) {
    io.to(lobby.lobbyName).emit('night_prepare', {
        countdownMs: config.game.prepareNightDurationMs,
        serverTime: Date.now()
    });
};

function processMafiaVoteStage(io, socket, lobby) {

};

function processDetectiveVoteStage(io, socket, lobby) {

};

function processDoctorVoteStage(io, socket, lobby) {

};

function processDayPrepareStage(io, socket, lobby) {

};

function processCitizenVoteStage(io, socket, lobby) {

};

function processCitizenVoteResultStage(io, socket, lobby) {

};

