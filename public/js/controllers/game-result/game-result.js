import socket from '../socket.js';
import {startTimerEvent} from '../../utils/timer.js'

export function initGameResultHandlers(data) {

    const gameResult = data.mafiaWin ? "Мафия одержала победу" : "Мирные жители победили";
    const gameResultContainer = document.getElementById('game-result');
    gameResultContainer.innerHTML = gameResult;

    const page = document.querySelector('#day-screen');
    page.style.backgroundColor = data.mafiaWin ? "var(--dark_red)" : "#19C13D";

    const winPlayers = data.winPlayers;
    renderWinPlayers(winPlayers);

    startTimerEvent(data.countdownMs, data.serverTime, 'finish_game_over', socket);
}


function renderWinPlayers(players) {
    const list = document.getElementById('players-list');
    list.innerHTML = '';
    players.forEach(player => {
        const div = document.createElement('div');
        div.classList.add('player-list-item');
        div.innerHTML = `<img src="../images/avatar.svg"><p>${player.isOwner ? '(Я)' : ''} ${player.name}</p>`;
        list.appendChild(div);
    });
}