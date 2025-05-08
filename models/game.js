import { gameStagesArray, gameStages } from './constants.js';
import assignRoles from '../utils/role-assigner.js';

class Game {
    constructor(players, settings) {
        this.players = players;
        this.isStarted = true;
        this.gameOver = false
        this.currentStage = 0;
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
            this.currentStage = gameStagesArray.length - 1
            return gameStages.GAME_END
        }

        const next = (this.currentStage + 1) % gameStagesArray.length;
        if (gameStagesArray[next] == gameStages.GAME_END) {
            next = (next + 1) % gameStagesArray.length
        }
        if (gameStagesArray[next] == gameStages.ROLE_ASSIGN) {
            next = (next + 1) % gameStagesArray.length
        }
        if (gameStagesArray[next] == gameStages.DOCTOR_VOTE && !this.doctorAlive) {
            next = (next + 1) % gameStagesArray.length
        }
        if (gameStagesArray[next] == gameStages.DETECTIVE_VOTE && !this.detectiveAlive) {
            next = (next + 1) % gameStagesArray.length
        }

        this.currentStage = next
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
            mafiaVotes: [],
            mafiaVotesResult: "",
            detectiveVote: "",
            doctorVote: "",
            citizensVotes: [],
            citizensVotesResult: "",
        }
    }

    getAlivePlayers() {
        return this.players.filter(player => player.isAlive)
    }
}

export default Game;
