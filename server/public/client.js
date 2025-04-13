const socket = io();
let currentRoom = '';
let isOwner = false;

const mainScreen = document.getElementById('mainScreen');
const roomMenu = document.getElementById('roomMenu');
const roomScreen = document.getElementById('roomScreen');
const playersList = document.getElementById('playersList');
const roleInfo = document.getElementById('roleInfo');

// Переход на экран комнаты
function enterRoom(roomName) {
  currentRoom = roomName;
  mainScreen.style.display = 'none';
  roomMenu.style.display = 'none';
  roomScreen.style.display = 'block';
  document.getElementById('roomTitle').textContent = `Комната: ${roomName}`;
}

// Создание/Подключение к комнате
document.getElementById('createRoomBtn').onclick = () => showRoomMenu('create');
document.getElementById('joinRoomBtn').onclick = () => showRoomMenu('join');

function showRoomMenu(action) {
  roomMenu.style.display = 'block';
  document.getElementById('submitRoom').onclick = () => {
    const userName = document.getElementById('userName').value.trim();
    const roomName = document.getElementById('roomName').value.trim();
    const password = document.getElementById('roomPassword').value.trim();
    if (!userName || !roomName || !password) {
      alert('Заполните все поля');
      return;
    }
    if (action === 'create') {
      socket.emit('createRoom', { roomName, password, userName });
    } else {
      socket.emit('joinRoom', { roomName, password, userName });
    }
  };
}

// Обработка событий

socket.on('roomCreated', ({ roomName }) => {
  isOwner = true;
  document.getElementById('startGameSettings').style.display = 'block';
  enterRoom(roomName);
});

socket.on('joinedRoom', ({ roomName }) => {
  isOwner = false;
  document.getElementById('startGameSettings').style.display = 'none';
  enterRoom(roomName);
});

socket.on('userJoined', ({ userName }) => {
  addChatMessage(`Игрок ${userName} подключился к комнате.`);
});

socket.on('userLeft', ({ userName }) => {
  addChatMessage(`Игрок ${userName} покинул комнату.`);
});

socket.on('newOwner', ({ newOwnerName }) => {
  addChatMessage(`Новый владелец комнаты: ${newOwnerName}`);
  if (socket.id === newOwnerName) {
    isOwner = true;
    document.getElementById('startGameSettings').style.display = 'block';
  }
});

socket.on('error', ({ message }) => {
  alert(message);
});

socket.on('gameStartError', ({ message }) => {
  alert(message);
});

socket.on('readyStatusUpdate', ({ ready }) => {
  renderPlayersList(ready);
});

socket.on('chatMessage', ({ userName, message }) => {
  addChatMessage(`${userName}: ${message}`);
});

socket.on('gameStarted', ({ role }) => {
  document.getElementById('startGameSettings').style.display = 'none';
  roleInfo.textContent = `Ваша роль: ${role}`;
  addChatMessage('Игра началась!');
});

// Кнопки действий

document.getElementById('readyBtn').onclick = () => {
  socket.emit('readyToggle', { roomName: currentRoom });
};

document.getElementById('startGameBtn').onclick = () => {
  const settings = {
    mafiaCount: parseInt(document.getElementById('mafiaCount').value),
    hasDoctor: document.getElementById('hasDoctor').checked,
    hasDetective: document.getElementById('hasDetective').checked
  };
  socket.emit('startGame', { roomName: currentRoom, settings });
};

document.getElementById('sendChatBtn').onclick = () => {
  const message = document.getElementById('chatInput').value.trim();
  const userName = document.getElementById('userName').value.trim();
  if (message) {
    socket.emit('chatMessage', { roomName: currentRoom, message, userName });
    document.getElementById('chatInput').value = '';
  }
};

// Вспомогательные функции

function addChatMessage(text) {
  const chatDiv = document.getElementById('chat');
  const p = document.createElement('p');
  p.textContent = text;
  chatDiv.appendChild(p);
  chatDiv.scrollTop = chatDiv.scrollHeight;
}

function renderPlayersList(readyStatuses) {
  playersList.innerHTML = '<h3>Игроки:</h3>';
  for (const socketId in readyStatuses) {
    const div = document.createElement('div');
    div.textContent = `${socketId} - ${readyStatuses[socketId] ? 'Готов' : 'Не готов'}`;
    playersList.appendChild(div);
  }
}
