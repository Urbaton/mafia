import socket from '../socket.js';
import {startTimerEvent} from '../../utils/timer.js'

export function initRoleAssignHandlers(data) {
    showRole(data)

    startTimerEvent(data.countdownMs, data.serverTime, 'finish_role_assign', socket);
}

function showRole({role, sameRolePlayers}) {
    // Захватываем элементы по ID
    const page = document.getElementById('role-screen');
    const roleInfo = document.getElementById('role-info');
    const roleText = document.getElementById('player-role-text');
    const roleDescription = document.getElementById('role-description');

    // Очистим все возможные классы (на случай повторных вызовов)
    roleInfo.classList.remove('role-mafia', 'role-doctor', 'role-detective', 'role-citizen');

    switch (role) {
        case 'MAFIA':
            roleInfo.classList.add('role-mafia');
            roleText.textContent = 'Мафия';
            roleDescription.textContent = 'Вы член мафии. Ваша цель — устранить всех мирных жителей. Осторожно: не выдайте себя!';
            showOtherMafias(sameRolePlayers);
            break;
        case 'DOCTOR':
            roleInfo.classList.add('role-doctor');
            roleText.textContent = 'Доктор';
            roleDescription.textContent = 'Вы доктор. Каждую ночь вы можете лечить одного игрока и защищать его от мафии.';
            hideOtherMafias();
            break;
        case 'DETECTIVE':
            roleInfo.classList.add('role-detective');
            roleText.textContent = 'Детектив';
            roleDescription.textContent = 'Вы детектив. Каждую ночь вы можете проверить одного игрока и узнать его роль.';
            hideOtherMafias();
            break;
        case 'CITIZEN':
            roleInfo.classList.add('role-citizen');
            roleText.textContent = 'Мирный житель';
            roleDescription.textContent = 'Вы мирный житель. Ваша задача — вычислить мафию и выжить до конца игры.';
            hideOtherMafias();
            break;
    }
}

function showOtherMafias(otherMafias) {
    const mafiaSection = document.getElementById('mafia-members-section');
    const mafiaList = document.getElementById('mafia-members-list');

    mafiaSection.classList.remove('hidden');
    mafiaList.innerHTML = '';

    otherMafias.forEach(name => {
        const mafia = document.createElement('div');
        mafia.innerHTML = `
<div>
    <img src="../images/avatar.svg">
    <p>мяу</p>
</div>`;
        mafiaList.appendChild(mafia);
    });
}

function hideOtherMafias() {
    const mafiaSection = document.getElementById('mafia-members-section');
    mafiaSection.classList.add('hidden');
}