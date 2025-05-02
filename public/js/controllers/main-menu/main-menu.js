import socket from '../socket.js';

export function initMainMenuHandlers() {
    document.getElementById('create-lobby')?.addEventListener('click', createLobby);
    document.getElementById('join-lobby')?.addEventListener('click', joinLobby);
}

function createLobby() {
    const [playerName, lobbyName, lobbyPassword] = getDataFromMenuForm();

    console.log("SEND create_lobby")
    socket.emit('create_lobby', { lobbyName, lobbyPassword, playerName });
}

function joinLobby() {
    const [playerName, lobbyName, lobbyPassword] = getDataFromMenuForm();

    console.log("SEND join_lobby")
    socket.emit('join_lobby', { lobbyName, password: lobbyPassword, playerName });
}

function getDataFromMenuForm() {
    const playerName = document.getElementById('player-name').value;
    const lobbyName = document.getElementById('lobby-name').value;
    const lobbyPassword = document.getElementById('lobby-password').value;
    
    return playerName, lobbyName, lobbyPassword;
}
