import socket from '../socket.js';
import { startTimerEvent } from '../../utils/timer.js'

export function initNightPrepareHandlers(data) {
    startTimerEvent(data.countdownMs, data.serverTime, 'finish_night_prepare', socket);
}
