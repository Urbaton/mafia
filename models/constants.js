export const gameStages = {
    ROLE_ASSIGN: 'ROLE_ASSIGN',
    NIGHT_PREPARE: 'NIGHT_PREPARE',
    MAFIA_VOTE: 'MAFIA_VOTE',
    DETECTIVE_VOTE: 'DETECTIVE_VOTE',
    DOCTOR_VOTE: 'DOCTOR_VOTE',
    DAY_PREPARE: 'DAY_PREPARE',
    CITIZEN_VOTE: 'CITIZEN_VOTE',
    CITIZEN_VOTE_RESULT: 'CITIZEN_VOTE_RESULT',
    GAME_END: 'GAME_END',
};

export const gameStagesArray = Object.values(gameStages);

export const roles = {
    MAFIA: 'MAFIA',
    DOCTOR: 'DOCTOR',
    DETECTIVE: 'DETECTIVE',
    CITIZEN: 'CITIZEN',
};