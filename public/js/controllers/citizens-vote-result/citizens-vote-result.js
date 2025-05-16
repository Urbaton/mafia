import socket from '../socket.js';
import { startTimerEvent } from '../../utils/timer.js'

export function initCitizensVoteResultHandlers(data) {

    const nightResult = data.killedPlayer !== null ? `Был изгнан ${data.killedPlayer}` : "Никто не был изгнан";
    const nightResultContainer = document.getElementById('citizens-vote-result');
    nightResultContainer.innerHTML = nightResult;

    startTimerEvent(data.countdownMs, data.serverTime, 'finish_citizens_vote_result', socket);
}
