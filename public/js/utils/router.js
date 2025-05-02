import { loadTemplate } from './dom-loader.js';
import { initLobbyHandlers } from '../ccontrollers/lobby.js';
import { initMainMenuHandlers } from '../controllers/main-menu.js';

const screens = {
    lobby: {
        path: '/components/lobby.html',
        init: initLobbyHandlers
    },
    mainMenu: {
        path: '/components/game.html',
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

    const fragment = await loadTemplate(screens[screen]);
    root.appendChild(fragment);

    screens[screen].init();
}
