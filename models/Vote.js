class Vote {
    constructor(timeoutDuration, onComplete) {
        this.votes = {}; // { voterSocketId: targetSocketId }
        this.timeout = null;
        this.onComplete = onComplete;

        // Автоматическое завершение голосования через timeoutDuration
        this.timeout = setTimeout(() => {
            this.finishVoting();
        }, timeoutDuration);
    }

    addVote(voterSocketId, targetSocketId) {
        this.votes[voterSocketId] = targetSocketId;
    }

    finishVoting() {
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
        this.onComplete(this.calculateResult());
    }

    calculateResult() {
        const count = {};
        for (const target of Object.values(this.votes)) {
            count[target] = (count[target] || 0) + 1;
        }

        // Выбираем цель с максимальным количеством голосов
        let maxVotes = 0;
        let candidates = [];

        for (const [targetSocketId, voteCount] of Object.entries(count)) {
            if (voteCount > maxVotes) {
                maxVotes = voteCount;
                candidates = [targetSocketId];
            } else if (voteCount === maxVotes) {
                candidates.push(targetSocketId);
            }
        }

        // Если несколько кандидатов с равным числом голосов — выбираем случайного
        if (candidates.length > 0) {
            const randomIndex = Math.floor(Math.random() * candidates.length);
            return candidates[randomIndex];
        }

        return null; // Никто не выбран
    }
}

module.exports = Vote;
