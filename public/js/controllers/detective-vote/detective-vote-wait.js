import socket from '../socket.js';
import { startTimerEvent } from '../../utils/timer.js'

export function initDetectiveVoteWaitHandlers(data) {
    startTimerEvent(data.countdownMs, data.serverTime, 'finish_detective_vote', socket);
}