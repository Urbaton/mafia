import socket from '../socket.js';
import { startTimerEvent } from '../../utils/timer.js'

export function initDoctorVoteWaitHandlers(data) {
    startTimerEvent(data.countdownMs, data.serverTime, 'finish_doctor_vote', socket);
}