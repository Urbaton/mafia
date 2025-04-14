function assignRoles(players, settings) {
    const playerList = [...players];

    const totalPlayers = playerList.length;
    const mafiaCount = settings.mafiaCount || Math.floor(totalPlayers / 3);
    const roles = [];

    for (let i = 0; i < mafiaCount; i++) roles.push('mafia');
    if (settings.hasDoctor) roles.push('doctor');
    if (settings.hasDetective) roles.push('detective');

    while (roles.length < totalPlayers) {
        roles.push('villager');
    }

    shuffleArray(roles);

    playerList.forEach((player, index) => {
        player.role = roles[index];
    });
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

module.exports = assignRoles;
