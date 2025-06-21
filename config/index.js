import fs from 'fs';
import ini from 'ini';

// Загружаем файл конфигурации
const config = ini.parse(fs.readFileSync('./config/config.ini', 'utf-8'));

// Преобразуем нужные типы
config.server.port = parseInt(config.server.port);
config.server.redisHost = parseInt(config.server.redisHost);

config.game.maxPlayers = parseInt(config.game.maxPlayers);
config.game.minPlayers = parseInt(config.game.minPlayers);
config.game.mafiaDefaultCount = parseInt(config.game.mafiaDefaultCount);

config.game.roleAssignDurationMs = parseInt(config.game.roleAssignDurationMs);
config.game.prepareNightDurationMs = parseInt(config.game.prepareNightDurationMs);
config.game.mafiaVoteDurationMs = parseInt(config.game.mafiaVoteDurationMs);
config.game.detectiveVoteDurationMs = parseInt(config.game.detectiveVoteDurationMs);
config.game.doctorVoteDurationMs = parseInt(config.game.doctorVoteDurationMs);
config.game.prepareDayDurationMs = parseInt(config.game.prepareDayDurationMs);
config.game.citizensVoteDurationMs = parseInt(config.game.citizensVoteDurationMs);
config.game.citizensVoteResultDurationMs = parseInt(config.game.citizensVoteResultDurationMs);
config.game.gameResultDurationMs = parseInt(config.game.gameResultDurationMs);


export default config;
