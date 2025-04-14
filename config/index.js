const fs = require('fs');
const ini = require('ini');

// Загружаем файл конфигурации
const config = ini.parse(fs.readFileSync('./config/config.ini', 'utf-8'));

// Преобразуем нужные типы
config.server.port = parseInt(config.server.port);
config.game.maxPlayers = parseInt(config.game.maxPlayers);
config.game.minPlayers = parseInt(config.game.minPlayers);
config.game.mafiaDefaultCount = parseInt(config.game.mafiaDefaultCount);
config.game.dayVotingTimeoutMs = parseInt(config.game.dayVotingTimeoutMs);
config.game.nightVotingTimeoutMs = parseInt(config.game.nightVotingTimeoutMs);

module.exports = config;
