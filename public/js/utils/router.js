import { loadTemplate } from './dom-loader.js';
import { initLobbyHandlers } from '../controllers/lobby-controller/lobby-controller.js';
import { initMainMenuHandlers } from '../controllers/main-menu/main-menu.js';
import { initRoleAssignHandlers } from '../controllers/role-assign/role-assign.js';

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

async function renderScreen(screen, data) {
    const root = document.getElementById('app');
    root.innerHTML = '';
    const fragment = await loadTemplate(screen.path);
    root.appendChild(fragment);

    screen.init(data);
}
