import { loadTemplate } from './dom-loader.js';
import { initLobbyHandlers } from '../controllers/lobby-controller/lobby-controller.js';
import { initMainMenuHandlers } from '../controllers/main-menu/main-menu.js';
import { initRoleAssignHandlers } from '../controllers/role-assign/role-assign.js';
import { initNightPrepareHandlers } from '../controllers/night-prepare/night-prepare.js';
import { initMafiaVoteHandlers } from '../controllers/mafia-vote/mafia-vote.js';
import { initMafiaVoteWaitHandlers } from '../controllers/mafia-vote/mafia-vote-wait.js';
import { initDetectiveVoteWaitHandlers } from '../controllers/detective-vote/detective-vote-wait.js';
import { initDetectiveVoteHandlers } from '../controllers/detective-vote/detective-vote.js';
import { initDoctorVoteWaitHandlers } from '../controllers/doctor-vote/doctor-vote-wait.js';
import { initDoctorVoteHandlers } from '../controllers/doctor-vote/doctor-vote.js';
import { initDayPrepareHandlers } from '../controllers/day-prepare/dat-prepare.js';
import { initCitizensVoteHandlers } from '../controllers/citizens-vote/citizens-vote.js';
import { initCitizensVoteResultHandlers } from '../controllers/citizens-vote-result/citizens-vote-result.js';
import { initWaitRoomHandlers } from '../controllers/wait-room/wait-room.js';
import { initGameResultHandlers } from '../controllers/game-result/game-result.js';

const screens = {
    lobby: {
        path: '/components/lobby.html',
        init: initLobbyHandlers
    },
    mainMenu: {
        path: '/components/main-menu.html',
        init: initMainMenuHandlers
    },
    roleAssign: {
        path: '/components/role-assign.html',
        init: initRoleAssignHandlers
    },
    nightPrepare: {
        path: '/components/night-prepare.html',
        init: initNightPrepareHandlers
    },
    mafiaVoteWait: {
        path: '/components/mafia-vote-wait.html',
        init: initMafiaVoteWaitHandlers
    },
    mafiaVote: {
        path: '/components/mafia-vote.html',
        init: initMafiaVoteHandlers
    },
    detectiveVoteWait: {
        path: '/components/detective-vote-wait.html',
        init: initDetectiveVoteWaitHandlers
    },
    detectiveVote: {
        path: '/components/detective-vote.html',
        init: initDetectiveVoteHandlers
    },
    doctorVoteWait: {
        path: '/components/doctor-vote-wait.html',
        init: initDoctorVoteWaitHandlers
    },
    doctorVote: {
        path: '/components/doctor-vote.html',
        init: initDoctorVoteHandlers
    },
    dayPrepare: {
        path: '/components/day-prepare.html',
        init: initDayPrepareHandlers
    },
    citizensVote: {
        path: '/components/citizens-vote.html',
        init: initCitizensVoteHandlers
    },
    citizensVoteResult: {
        path: '/components/citizens-vote-result.html',
        init: initCitizensVoteResultHandlers
    },
    waitRoom: {
        path: '/components/wait-room.html',
        init: initWaitRoomHandlers
    },
    gameOver: {
        path: '/components/game-over.html',
        init: initGameResultHandlers
    },
};

export async function renderWaitRoom(data) {
    await renderScreen(screens.waitRoom, data)
}

export async function renderGameOver(data) {
    await renderScreen(screens.gameOver, data)
}

export async function renderMainMenu() {
    await renderScreen(screens.mainMenu)
}

export async function renderLobby(data) {
    await renderScreen(screens.lobby, data)
}

export async function renderRoleAssign(data) {
    await renderScreen(screens.roleAssign, data)
}

export async function renderNightPrepare(data) {
    await renderScreen(screens.nightPrepare, data)
}

export async function renderMafiaVoteWait(data) {
    await renderScreen(screens.mafiaVoteWait, data)
}

export async function renderMafiaVote(data) {
    await renderScreen(screens.mafiaVote, data)
}

export async function renderDetectiveVoteWait(data) {
    await renderScreen(screens.detectiveVoteWait, data)
}

export async function renderDetectiveVote(data) {
    await renderScreen(screens.detectiveVote, data)
}

export async function renderDoctorVoteWait(data) {
    await renderScreen(screens.doctorVoteWait, data)
}

export async function renderDoctorVote(data) {
    await renderScreen(screens.doctorVote, data)
}

export async function renderDayPrepare(data) {
    await renderScreen(screens.dayPrepare, data)
}

export async function renderCitizensVote(data) {
    await renderScreen(screens.citizensVote, data)
}

export async function renderCitizensVoteResult(data) {
    await renderScreen(screens.citizensVoteResult, data)
}

async function renderScreen(screen, data) {
    const root = document.getElementById('app');
    root.innerHTML = '';
    const fragment = await loadTemplate(screen.path);
    root.appendChild(fragment);

    screen.init(data);
}
