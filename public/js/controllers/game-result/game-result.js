import socket from '../socket.js';
import { startTimerEvent } from '../../utils/timer.js'

export function initGameResultHandlers(data) {

    const gameResult = data.mafiaWin ? "Мафия одержала победу" : "Мирные жители победили";
    const gameResultContainer = document.getElementById('game-result');
    gameResultContainer.innerHTML = gameResult;

    startTimerEvent(data.countdownMs, data.serverTime, 'finish_game_over', socket);
}
