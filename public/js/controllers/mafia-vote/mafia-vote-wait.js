import socket from '../socket.js';
import { startTimerEvent } from '../../utils/timer.js'

export function initMafiaVoteWaitHandlers(data) {
    startTimerEvent(data.countdownMs, data.serverTime, 'finish_mafia_vote', socket);
}