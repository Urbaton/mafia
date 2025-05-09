export const gameStages = {
    ROLE_ASSIGN: ['ROLE_ASSIGN', 1],
    NIGHT_PREPARE: ['NIGHT_PREPARE', 2],
    MAFIA_VOTE: ['MAFIA_VOTE', 3],
    DETECTIVE_VOTE: ['DETECTIVE_VOTE', 4],
    DOCTOR_VOTE: ['DOCTOR_VOTE', 5],
    DAY_PREPARE: ['DAY_PREPARE', 6],
    CITIZEN_VOTE: ['CITIZEN_VOTE', 7],
    CITIZEN_VOTE_RESULT: ['CITIZEN_VOTE_RESULT', 8],
    GAME_END: ['GAME_END', 9],
};

export const gameStagesArray = Object.values(gameStages);

export const roles = {
    MAFIA: 'MAFIA',
    DOCTOR: 'DOCTOR',
    DETECTIVE: 'DETECTIVE',
    CITIZEN: 'CITIZEN',
};