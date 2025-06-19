import socket from '../socket.js';

export function initMainMenuHandlers() {
    document.getElementById('create-lobby')?.addEventListener('click', createLobby);
    document.getElementById('join-lobby')?.addEventListener('click', joinLobby);
}

function createLobby() {
    const [playerName, lobbyName, password] = getDataFromMenuForm();

    window.myName = playerName;

    console.log("SEND create_lobby")
    socket.emit('create_lobby', { lobbyName, password, playerName });
}

function joinLobby() {
    const [playerName, lobbyName, password] = getDataFromMenuForm();

    window.myName = playerName;

    console.log("SEND join_lobby")
    socket.emit('join_lobby', { lobbyName, password, playerName });
}

function getDataFromMenuForm() {
    const playerName = document.getElementById('player-name').value;
    const lobbyName = document.getElementById('lobby-name').value;
    const password = document.getElementById('lobby-password').value;

    return [playerName, lobbyName, password];
}
