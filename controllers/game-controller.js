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

function finishStage(io, socket, currentStage, callback = null) {
    const lobby = lobbyStore.getLobbyByPlayer(socket.id);
    if (!lobby) return;

    if (lobby.game.currentStage[1] != currentStage[1]) return;
    const stage = lobby.game.nextStage()
    lobby.game.stageStartTime = Date.now()
    console.log(stage)

    if (callback != null)
        callback(lobby)

    io.to(lobby.lobbyName).emit('stage_end');
};

export function finishRoleAssign(io, socket) {
    finishStage(io, socket, gameStages.ROLE_ASSIGN)
};

export function finishNightPrepare(io, socket) {
    finishStage(io, socket, gameStages.NIGHT_PREPARE)
};

export function finishMafiaVote(io, socket) {
    const resultVotes = (lobby) => {
        lobby.game.votes.mafiaVotesResult = lobby.game.getMafiaMostVoted();
    }

    finishStage(io, socket, gameStages.MAFIA_VOTE, resultVotes)
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
    const resultVotes = (lobby) => {
        lobby.game.votes.citizensVotesResult = lobby.game.getCitizensMostVoted();
    }

    finishStage(io, socket, gameStages.CITIZEN_VOTE, resultVotes)
};

export function finishCitizenVoteResult(io, socket) {
    finishStage(io, socket, gameStages.CITIZEN_VOTE_RESULT)
};

export function mafiaVote(io, socket, data) {
    const lobby = lobbyStore.getLobbyByPlayer(socket.id);
    if (!lobby) return;

    lobby.game.votes.mafiaVotes.push(data.targetId);

    if (lobby.game.votes.mafiaVotes.length == lobby.game.mafiaAliveCount) {
        finishMafiaVote(io, socket)
    }
};

export function doctorVote(io, socket, data) {
    const lobby = lobbyStore.getLobbyByPlayer(socket.id);
    if (!lobby) return;

    lobby.game.votes.doctorVote = data.targetId;
};

export function detectiveVote(io, socket, data) {
    const lobby = lobbyStore.getLobbyByPlayer(socket.id);
    if (!lobby) return;

    lobby.game.votes.detectiveVote = data.targetId;

    const target = lobby.players[data.targetId]

    socket.emit("detective_vote_result", { isMafia: target.role[1] == roles.MAFIA[1] })
};

export function citizenVote(io, socket, data) {
    const lobby = lobbyStore.getLobbyByPlayer(socket.id);
    if (!lobby) return;

    lobby.game.votes.citizensVotes.push(data.targetId);

    if (lobby.game.votes.citizensVotes.length == lobby.game.getAlivePlayers().length) {
        finishCitizenVote(io, socket)
    }
};

export function processNextStage(io, socket) {
    const lobby = lobbyStore.getLobbyByPlayer(socket.id);
    if (!lobby) return;

    const gameState = lobby.game.checkGameState()

    if (gameState.gameOver) {
        socket.emit('game_over', {
            countdownMs: config.game.prepareNightDurationMs,
            serverTime: lobby.game.stageStartTime,
            gameState: gameState
        });
    }

    const players = lobby.getPlayerList();
    const player = players.filter(player => player.socketId === socket.id)[0];
    const stage = lobby.game.currentStage;

    if (!player.isAlive) {
        // TODO функция для перекидывания игрока в комнату ожидания: снять роли и добавить роль ожидания
        return
    }

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
    socket.emit('night_prepare', {
        countdownMs: config.game.prepareNightDurationMs,
        serverTime: lobby.game.stageStartTime
    });
};

function processMafiaVoteStage(io, socket, lobby) {
    let player = lobby.players[socket.id];
    let baseData = {
        countdownMs: config.game.mafiaVoteDurationMs,
        serverTime: lobby.game.stageStartTime,
    }
    if (player.role[1] != roles.MAFIA[1]) {
        socket.emit('mafia_vote_wait', baseData);
    } else {
        baseData["players"] = lobby.getPlayerList().filter(x => x.role[1] != roles.MAFIA[1] && x.isAlive).map(player => ({
            name: player.name,
            socketId: player.socketId,
        }));
        socket.emit('mafia_vote', baseData);
    }
};

function processDetectiveVoteStage(io, socket, lobby) {
    let player = lobby.players[socket.id];
    let baseData = {
        countdownMs: config.game.detectiveVoteDurationMs,
        serverTime: lobby.game.stageStartTime,
    }
    if (player.role[1] != roles.DETECTIVE[1]) {
        socket.emit('detective_vote_wait', baseData);
    } else {
        baseData["players"] = lobby.getPlayerList().filter(x => x.role[1] != roles.DETECTIVE[1] && x.isAlive).map(player => ({
            name: player.name,
            socketId: player.socketId,
        }));
        socket.emit('detective_vote', baseData);
    }
};

function processDoctorVoteStage(io, socket, lobby) {
    let player = lobby.players[socket.id];
    let baseData = {
        countdownMs: config.game.doctorVoteDurationMs,
        serverTime: lobby.game.stageStartTime,
    }
    if (player.role[1] != roles.DOCTOR[1]) {
        socket.emit('doctor_vote_wait', baseData);
    } else {
        baseData["players"] = lobby.getPlayerList().filter(x => x.role[1] != roles.DOCTOR[1] && x.isAlive).map(player => ({
            name: player.name,
            socketId: player.socketId,
        }));
        socket.emit('doctor_vote', baseData);
    }
};

function processDayPrepareStage(io, socket, lobby) {
    const mafiaTarget = lobby.game.votes.mafiaVotesResult;
    const doctorTarget = lobby.game.votes.doctorVote;

    let baseData = {
        countdownMs: config.game.detectiveVoteDurationMs,
        serverTime: lobby.game.stageStartTime,
        killedPlayer: null
    }

    if (mafiaTarget !== null && mafiaTarget !== doctorTarget) {
        const player = lobby.players[mafiaTarget];
        killPlayer(lobby, player);

        baseData.killedPlayer = player.name;
    }

    socket.emit("day_prepare", baseData)
};

function processCitizenVoteStage(io, socket, lobby) {
    let baseData = {
        countdownMs: config.game.citizensVoteDurationMs,
        serverTime: lobby.game.stageStartTime,
        players: lobby.getPlayerList().filter(x => x.isAlive && x.socketId != socket.id).map(player => ({
            name: player.name,
            socketId: player.socketId,
        }))
    }
    socket.emit('citizen_vote', baseData);
};

function processCitizenVoteResultStage(io, socket, lobby) {
    const citizensVotesResult = lobby.game.votes.citizensVotesResult;

    let baseData = {
        countdownMs: config.game.citizensVoteResultDurationMs,
        serverTime: lobby.game.stageStartTime,
        killedPlayer: null
    }

    if (citizensVotesResult !== null) {
        const player = lobby.players[citizensVotesResult];
        killPlayer(lobby, player);

        baseData.killedPlayer = player.name;
    }

    socket.emit("citizen_vote_result", baseData)
};

// TODO добавить оставшиеся страницы (победитель, комната ожидания), дописать все методы на беке, добалять в группу по ролям

function killPlayer(lobby, player) {
    if (!player.isAlive) return;

    player.isAlive = false;
    if (player.role[1] == roles.DOCTOR)
        lobby.game.killDoctor()
    else if (player.role[1] == roles.DETECTIVE)
        lobby.game.killDetective()
    else if (player.role[1] == roles.MAFIA)
        lobby.game.killMafia()
}