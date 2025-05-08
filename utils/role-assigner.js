import { roles } from '../models/constants.js';

function assignRoles(players, settings) {
    const playerList = [...players];

    const totalPlayers = playerList.length;
    const mafiaCount = settings.mafiaCount || Math.floor(totalPlayers / 3);
    const playersRoles = [];

    for (let i = 0; i < mafiaCount; i++) playersRoles.push(roles.MAFIA);
    if (settings.hasDoctor) playersRoles.push(roles.DOCTOR);
    if (settings.hasDetective) playersRoles.push(roles.DETECTIVE);

    while (playersRoles.length < totalPlayers) {
        playersRoles.push(roles.CITIZEN);
    }

    shuffleArray(playersRoles);

    playerList.forEach((player, index) => {
        player.role = playersRoles[index];
        player.isAlive = true;
    });
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

export default assignRoles;
