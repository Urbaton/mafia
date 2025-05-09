import { loadTemplate } from './dom-loader.js';
import { initLobbyHandlers } from '../controllers/lobby-controller/lobby-controller.js';
import { initMainMenuHandlers } from '../controllers/main-menu/main-menu.js';
import { initRoleAssignHandlers } from '../controllers/role-assign/role-assign.js';
import { initNightPrepareHandlers } from '../controllers/night-prepare/night-prepare.js';
import { initMafiaVoteHandlers } from '../controllers/mafia-vote/mafia-vote.js';

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
        init: initMafiaVoteHandlers
    },
    mafiaVote: {
        path: '/components/mafia-vote.html',
        init: initMafiaVoteHandlers
    }
};

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

async function renderScreen(screen, data) {
    const root = document.getElementById('app');
    root.innerHTML = '';
    const fragment = await loadTemplate(screen.path);
    root.appendChild(fragment);

    screen.init(data);
}
