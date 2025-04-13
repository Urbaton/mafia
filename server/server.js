const express = require('express');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const rooms = {};
const MAX_PLAYERS = 9;

const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    console.log(`Новое подключение: ${socket.id}`);

    // Создание комнаты
    socket.on('createRoom', ({ roomName, password, userName }) => {
        if (rooms[roomName]) {
            socket.emit('error', { message: 'Комната с таким именем уже существует!' });
            return;
        }
        rooms[roomName] = {
            password,
            users: {},
            owner: socket.id,
            ready: {},
            roles: {},
            gameSettings: {},
            phase: 'waiting',
            votes: {}
        };
        socket.join(roomName);
        rooms[roomName].users[socket.id] = userName;
        rooms[roomName].ready[socket.id] = false;
        socket.emit('roomCreated', { roomName });
        console.log(`Комната "${roomName}" создана пользователем ${userName}`);
    });

    // Присоединение к комнате
    socket.on('joinRoom', ({ roomName, password, userName }) => {
        const room = rooms[roomName];
        if (!room) {
            socket.emit('error', { message: 'Комната не найдена!' });
            return;
        }
        if (room.password !== password) {
            socket.emit('error', { message: 'Неверный пароль!' });
            return;
        }
        if (Object.keys(room.users).length >= MAX_PLAYERS) {
            socket.emit('error', { message: 'Комната заполнена!' });
            return;
        }
        socket.join(roomName);
        room.users[socket.id] = userName;
        room.ready[socket.id] = false;
        socket.emit('joinedRoom', { roomName });
        socket.to(roomName).emit('userJoined', { userName });
        console.log(`Пользователь ${userName} подключился к комнате "${roomName}"`);
    });

    // Сообщение в чат
    socket.on('chatMessage', ({ roomName, message, userName }) => {
        io.to(roomName).emit('chatMessage', { userName, message });
    });

    // Переключение готовности
    socket.on('readyToggle', ({ roomName }) => {
        const room = rooms[roomName];
        if (!room) return;
        room.ready[socket.id] = !room.ready[socket.id];
        io.to(roomName).emit('readyStatusUpdate', { ready: room.ready });
    });

    // Начало игры
    socket.on('startGame', ({ roomName, settings }) => {
        const room = rooms[roomName];
        if (!room) return;
        if (socket.id !== room.owner) {
            socket.emit('error', { message: 'Только владелец может начать игру!' });
            return;
        }
        if (Object.values(room.ready).some(ready => !ready)) {
            socket.emit('gameStartError', { message: 'Не все игроки готовы!' });
            return;
        }
        room.phase = 'night';
        room.gameSettings = settings;
        assignRoles(room);  // Назначаем роли игрокам
        for (const playerId of Object.keys(room.users)) {
            const playerRole = room.roles[playerId];
            io.to(playerId).emit('gameStarted', { role: playerRole });
        }
    });

    // Отключение игрока
    socket.on('disconnect', () => {
        console.log(`Отключение пользователя: ${socket.id}`);
        for (const roomName in rooms) {
            const room = rooms[roomName];
            if (room.users[socket.id]) {
                const userName = room.users[socket.id];
                delete room.users[socket.id];
                delete room.ready[socket.id];
                delete room.roles[socket.id];
                delete room.votes[socket.id];

                if (room.owner === socket.id) {
                    const remainingUsers = Object.keys(room.users);
                    if (remainingUsers.length > 0) {
                        room.owner = remainingUsers[0];
                        io.to(roomName).emit('newOwner', {
                            newOwnerId: remainingUsers[0],
                            newOwnerName: room.users[remainingUsers[0]]
                        });
                    }
                }

                socket.to(roomName).emit('userLeft', { userName });

                if (Object.keys(room.users).length === 0) {
                    delete rooms[roomName];
                    console.log(`Комната "${roomName}" закрыта`);
                }
            }
        }
    });
});

// Простейшая функция назначения ролей
function assignRoles(room) {
    const playerIds = Object.keys(room.users);
    let rolesArray = [];

    for (let i = 0; i < room.gameSettings.mafiaCount; i++) rolesArray.push('mafia');
    if (room.gameSettings.hasDoctor) rolesArray.push('doctor');
    if (room.gameSettings.hasDetective) rolesArray.push('detective');
    while (rolesArray.length < playerIds.length) rolesArray.push('civilian');

    shuffle(rolesArray);

    playerIds.forEach((id, idx) => {
        room.roles[id] = rolesArray[idx];
    });
}

// Перемешивание массива (простое)
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

server.listen(3000, () => {
    console.log('Сервер запущен на порту 3000');
});
