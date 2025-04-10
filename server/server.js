const express = require('express');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Хранилище для комнат. Для простоты используем объект в памяти.
const rooms = {};

io.on('connection', (socket) => {
  console.log(`Новое подключение: ${socket.id}`);

  // Обработчик создания комнаты
  socket.on('createRoom', ({ roomName, password, userName }) => {
    if (rooms[roomName]) {
      socket.emit('error', { message: 'Комната с таким именем уже существует!' });
      return;
    }
    // Создаем новую комнату
    rooms[roomName] = {
      password,
      users: {}
    };

    // Подключаем сокет к комнате
    socket.join(roomName);
    rooms[roomName].users[socket.id] = userName;

    // Сообщаем клиенту об успешном создании
    socket.emit('roomCreated', { roomName });
    console.log(`Комната "${roomName}" создана пользователем ${userName}`);
  });

  // Обработчик подключения к существующей комнате
  socket.on('joinRoom', ({ roomName, password, userName }) => {
    if (!rooms[roomName]) {
      socket.emit('error', { message: 'Комната не найдена!' });
      return;
    }
    if (rooms[roomName].password !== password) {
      socket.emit('error', { message: 'Неверный пароль!' });
      return;
    }
    // Подключаем сокет к комнате
    socket.join(roomName);
    rooms[roomName].users[socket.id] = userName;

    socket.emit('joinedRoom', { roomName });
    // Уведомляем всех остальных участников комнаты о новом подключении
    socket.to(roomName).emit('userJoined', { userName });
    console.log(`Пользователь ${userName} подключился к комнате "${roomName}"`);
  });

  // Обработчик сообщений чата
  socket.on('chatMessage', ({ roomName, message, userName }) => {
    // Рассылаем сообщение всем участникам комнаты
    io.to(roomName).emit('chatMessage', { userName, message });
    console.log(`Сообщение от ${userName} в комнате "${roomName}": ${message}`);
  });

  // Обработка отключения
  socket.on('disconnect', () => {
    console.log(`Отключение пользователя: ${socket.id}`);
    // При отключении удаляем пользователя из всех комнат, где он состоит
    for (const roomName in rooms) {
      if (rooms[roomName].users[socket.id]) {
        const userName = rooms[roomName].users[socket.id];
        delete rooms[roomName].users[socket.id];
        // Уведомляем остальных пользователей комнаты
        socket.to(roomName).emit('userLeft', { userName });
        // Если комната пуста — удаляем её
        if (Object.keys(rooms[roomName].users).length === 0) {
          delete rooms[roomName];
          console.log(`Комната "${roomName}" закрыта (больше нет пользователей)`);
        }
      }
    }
  });
});

server.listen(3000, () => {
  console.log('Сервер запущен на порту 3000');
});
