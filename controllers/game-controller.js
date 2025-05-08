// import lobbyStore from '../database/lobbyStore';
// import assignRoles from '../utils/role-assigner';
// import Vote from '../models/vote';
// import config from '../config';



// export function startNightVoting(io, lobby) {
//     const mafiaPlayers = Object.values(lobby.players)
//         .filter(player => player.isAlive && player.role === 'mafia');

//     // TODO такого не должно быть
//     // Если мафии нет — пропускаем
//     if (mafiaPlayers.length === 0) {
//         this.endNight(io, lobby, null);
//         return;
//     }

//     // Старт голосования
//     lobby.vote = new Vote(10000, (targetSocketId) => {
//         this.endNight(io, lobby, targetSocketId);
//     });

//     mafiaPlayers.forEach(player => {
//         io.to(player.socketId).emit('start_night_voting', {
//             players: Object.values(lobby.players)
//                 .filter(p => p.isAlive)
//                 .map(p => ({ socketId: p.socketId, name: p.name })),
//         });
//     });
// };

// export function voteNight(io, socket, { targetSocketId }) {
//     for (const lobbyName in lobbies) {
//         const lobby = lobbies[lobbyName];
//         if (lobby.players[socket.id] && lobby.vote) {
//             lobby.vote.addVote(socket.id, targetSocketId);

//             // Если все мафии проголосовали — завершаем досрочно
//             const mafiaAlive = Object.values(lobby.players)
//                 .filter(player => player.isAlive && player.role === 'mafia');

//             if (Object.keys(lobby.vote.votes).length >= mafiaAlive.length) {
//                 lobby.vote.finishVoting();
//             }
//             break;
//         }
//     }
// };

// export function endNight(io, lobby, targetSocketId) {
//     if (targetSocketId && lobby.players[targetSocketId]) {
//         lobby.players[targetSocketId].isAlive = false;

//         io.to(lobby.lobbyName).emit('player_killed', {
//             name: lobby.players[targetSocketId].name,
//         });
//     } else {
//         io.to(lobby.lobbyName).emit('no_kill', { message: 'Ночью никто не погиб.' });
//     }

//     // Начинаем день
//     lobby.currentStage = 'day';
//     io.to(lobby.lobbyName).emit('start_day', {
//         players: Object.values(lobby.players).map(p => ({
//             name: p.name,
//             isAlive: p.isAlive,
//         })),
//     });

//     lobby.vote = null;
// };

// export function startDayVoting(io, lobby) {
//     const alivePlayers = Object.values(lobby.players)
//         .filter(player => player.isAlive);

//     if (alivePlayers.length <= 1) {
//         // Остался один игрок — конец игры
//         this.endGame(io, lobby);
//         return;
//     }

//     // Старт голосования
//     lobby.vote = new Vote(15000, (targetSocketId) => {
//         this.resolveDayVoting(io, lobby, targetSocketId);
//     });

//     alivePlayers.forEach(player => {
//         io.to(player.socketId).emit('start_day_voting', {
//             players: alivePlayers.map(p => ({ socketId: p.socketId, name: p.name })),
//         });
//     });
// };

// export function voteDay(io, socket, { targetSocketId }) {
//     for (const lobbyName in lobbies) {
//         const lobby = lobbies[lobbyName];
//         if (lobby.players[socket.id] && lobby.vote) {
//             lobby.vote.addVote(socket.id, targetSocketId);

//             const alivePlayers = Object.values(lobby.players)
//                 .filter(player => player.isAlive);

//             if (Object.keys(lobby.vote.votes).length >= alivePlayers.length) {
//                 lobby.vote.finishVoting();
//             }
//             break;
//         }
//     }
// };

// export function resolveDayVoting(io, lobby, targetSocketId) {
//     if (targetSocketId && lobby.players[targetSocketId]) {
//         lobby.players[targetSocketId].isAlive = false;

//         io.to(lobby.lobbyName).emit('player_executed', {
//             name: lobby.players[targetSocketId].name,
//         });
//     } else {
//         io.to(lobby.lobbyName).emit('no_execution', { message: 'Никто не был казнён.' });
//     }

//     // Проверяем окончание игры
//     if (this.checkWinCondition(io, lobby)) {
//         return;
//     }

//     // Иначе начинается ночь
//     lobby.currentStage = 'night';
//     io.to(lobby.lobbyName).emit('start_night', {
//         players: Object.values(lobby.players).map(p => ({
//             name: p.name,
//             isAlive: p.isAlive,
//         })),
//     });

//     // Старт голосования мафии
//     this.startNightVoting(io, lobby);

//     lobby.vote = null;
// };

// export function checkWinCondition(io, lobby) {
//     const alivePlayers = Object.values(lobby.players).filter(p => p.isAlive);
//     const aliveMafia = alivePlayers.filter(p => p.role === 'mafia');
//     const aliveVillagers = alivePlayers.filter(p => p.role !== 'mafia');

//     if (aliveMafia.length === 0) {
//         // Победа мирных
//         io.to(lobby.lobbyName).emit('game_over', { winner: 'villagers' });
//         lobby.isGameStarted = false;
//         return true;
//     }

//     if (aliveMafia.length >= aliveVillagers.length) {
//         // Победа мафии
//         io.to(lobby.lobbyName).emit('game_over', { winner: 'mafia' });
//         lobby.isGameStarted = false;
//         return true;
//     }

//     return false;
// };

// export function endGame(io, lobby) {
//     // Если остался один живой игрок — скорее всего, игра окончена
//     io.to(lobby.lobbyName).emit('game_over', { winner: 'unknown' });
//     lobby.isGameStarted = false;
// };
