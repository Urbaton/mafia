import { gameStagesArray, gameStages } from './constants.js';
import assignRoles from '../utils/role-assigner.js';

class Game {
    constructor(players, settings) {
        this.players = players;
        this.gameOver = false
        this.currentStage = gameStages.ROLE_ASSIGN;
        this.mafiaCount = settings.mafiaCount;
        this.hasDoctor = settings.hasDoctor;
        this.hasDetective = settings.hasDetective;
        this.mafiaAliveCount = settings.mafiaCount;
        this.doctorAlive = settings.hasDoctor;
        this.detectiveAlive = settings.hasDetective;
        this.votes = {};
        this.defaultVotes()
        assignRoles(players, settings);
    }

    nextStage() {
        if (this.gameOver) {
            this.currentStage = gameStages.GAME_END
            return gameStages.GAME_END
        }

        const next = (this.currentStage[1] + 1) % gameStagesArray.length;
        if (gameStagesArray[next][1] == gameStages.GAME_END[1]) {
            next = (next + 1) % gameStagesArray.length
        }
        if (gameStagesArray[next][1] == gameStages.ROLE_ASSIGN[1]) {
            next = (next + 1) % gameStagesArray.length
        }
        if (gameStagesArray[next][1] == gameStages.DOCTOR_VOTE[1] && !this.hasDoctor) {
            next = (next + 1) % gameStagesArray.length
        }
        if (gameStagesArray[next][1] == gameStages.DETECTIVE_VOTE[1] && !this.hasDetective) {
            next = (next + 1) % gameStagesArray.length
        }

        this.currentStage = gameStagesArray[next]
        return gameStagesArray[next]
    }

    checkGameState() {
        const mafiaWin = isMafiaWin();
        const citizensWin = areCitizensWin();
        this.gameOver = mafiaWin || citizensWin;
        return {
            gameOver: this.gameOver,
            mafiaWin: mafiaWin,
            citizensWin: citizensWin
        }
    }

    isMafiaWin() {
        const alivePlayers = getAlivePlayers();
        return alivePlayers.length - this.mafiaAliveCount <= this.mafiaAliveCount;
    }

    areCitizensWin() {
        return this.mafiaAliveCount === 0;
    }

    killPlayer() {
        this.mafiaCount = Math.max(0, this.mafiaCount - 1);
    }

    killDoctor() {
        this.doctorAlive = false;
    }

    killDetective() {
        this.detectiveAlive = false;
    }

    defaultVotes() {
        this.votes = {
            curVotes: [],
            mafiaVotes: null,
            detectiveVote: null,
            doctorVote: null,
            citizensVotes: null,
        }
    }

    getMostVotedAndClearVotes() {
        if (this.votes.curVotes.length === 0) return null;

        const freqMap = new Map();

        for (const item of this.votes.curVotes) {
            freqMap.set(item, (freqMap.get(item) || 0) + 1);
        }

        let maxFreq = 0;
        const candidates = [];

        for (const [key, count] of freqMap.entries()) {
            if (count > maxFreq) {
                maxFreq = count;
                candidates.length = 0;
                candidates.push(key);
            } else if (count === maxFreq) {
                candidates.push(key);
            }
        }
        this.votes.curVotes = []
        const randomIndex = Math.floor(Math.random() * candidates.length);
        return candidates[randomIndex];
    }

    getAlivePlayers() {
        return this.players.filter(player => player.isAlive)
    }
}

export default Game;
