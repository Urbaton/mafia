import { loadTemplate } from './dom-loader.js';
import { initLobbyHandlers } from '../controllers/lobby-controller/lobby-controller.js';
import { initMainMenuHandlers } from '../controllers/main-menu/main-menu.js';

const screens = {
    lobby: {
        path: '/components/lobby.html',
        init: initLobbyHandlers
    },
    mainMenu: {
        path: '/components/main-menu.html',
        init: initMainMenuHandlers
    }
};

export async function renderMainMenu() {
    renderScreen(screens.mainMenu)
}

export async function renderLobby() {
    renderScreen(screens.lobby)
}

async function renderScreen(screen) {
    const root = document.getElementById('app');
    root.innerHTML = '';
    const fragment = await loadTemplate(screen.path);
    root.appendChild(fragment);

    screen.init();
}
