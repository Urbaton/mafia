import { renderLobby } from '../../utils/router.js';

socket.on('lobby_created', ({ lobbyName, players }) => {
    console.log("IN lobby_created")
    console.log(lobbyName, players)
    renderLobby();
});

socket.on('lobby_joined', ({ lobbyName, players }) => {
    console.log("IN lobby_joined")
    console.log(lobbyName, players)
    renderLobby();
});