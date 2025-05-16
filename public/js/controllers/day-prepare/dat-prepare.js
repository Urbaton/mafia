import socket from '../socket.js';
import { startTimerEvent } from '../../utils/timer.js'

export function initDayPrepareHandlers(data) {

    const nightResult = data.killedPlayer !== null ? `Был убит ${data.killedPlayer}` : "Этой ночью выжили все";
    const nightResultContainer = document.getElementById('night-result');
    nightResultContainer.innerHTML = nightResult;

    startTimerEvent(data.countdownMs, data.serverTime, 'finish_day_prepare', socket);
}
