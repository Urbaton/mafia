const lobbyController = require('../controllers/lobbyController');
const gameController = require('../controllers/gameController');
const chatController = require('../controllers/chatController');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Лобби
    socket.on('create_lobby', (data) => lobbyController.createLobby(io, socket, data));
    socket.on('join_lobby', (data) => lobbyController.joinLobby(io, socket, data));
    socket.on('leave_lobby', () => lobbyController.leaveLobby(io, socket));
    socket.on('ready', () => lobbyController.playerReady(io, socket));

    // Игра
    socket.on('start_game', (data) => gameController.startGame(io, socket, data));
    socket.on('vote_night', (data) => gameController.voteNight(io, socket, data));
    socket.on('vote_day', (data) => gameController.voteDay(io, socket, data));


    // Чат
    socket.on('send_chat_message', (data) => chatController.sendMessage(io, socket, data));

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
      lobbyController.leaveLobby(io, socket);
    });
  });
};
