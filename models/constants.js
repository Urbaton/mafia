export const gameStages = {
    ROLE_ASSIGN: ['ROLE_ASSIGN', 0],
    NIGHT_PREPARE: ['NIGHT_PREPARE', 1],
    MAFIA_VOTE: ['MAFIA_VOTE', 2],
    DETECTIVE_VOTE: ['DETECTIVE_VOTE', 3],
    DOCTOR_VOTE: ['DOCTOR_VOTE', 4],
    DAY_PREPARE: ['DAY_PREPARE', 5],
    CITIZEN_VOTE: ['CITIZEN_VOTE', 6],
    CITIZEN_VOTE_RESULT: ['CITIZEN_VOTE_RESULT', 7],
    GAME_END: ['GAME_END', 8],
};

export const gameStagesArray = Object.values(gameStages);

export const roles = {
    MAFIA: 'MAFIA',
    DOCTOR: 'DOCTOR',
    DETECTIVE: 'DETECTIVE',
    CITIZEN: 'CITIZEN',
};