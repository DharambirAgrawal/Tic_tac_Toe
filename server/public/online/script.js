// Connect to Socket.io server
const socket = io();

// Game variables
let roomId = null;
let playerId = null;
let playerMark = null;
let isMyTurn = false;
let gameActive = false;

// DOM Elements
const screens = {
    welcome: document.getElementById('welcome-screen'),
    waiting: document.getElementById('waiting-screen'),
    game: document.getElementById('game-screen')
};

const elements = {
    createBtn: document.getElementById('create-btn'),
    joinBtn: document.getElementById('join-btn'),
    roomInput: document.getElementById('room-input'),
    roomCode: document.getElementById('room-code'),
    copyBtn: document.getElementById('copy-btn'),
    statusMessage: document.getElementById('status-message'),
    playerX: document.getElementById('player-x'),
    playerO: document.getElementById('player-o'),
    cells: document.querySelectorAll('.cell'),
    playAgainBtn: document.getElementById('play-again-btn'),
    newGameBtn: document.getElementById('new-game-btn'),
    errorModal: document.getElementById('error-modal'),
    errorMessage: document.getElementById('error-message'),
    okBtn: document.getElementById('ok-btn'),
    closeModal: document.querySelector('.close-modal')
};

// Helper Functions
function showScreen(screenId) {
    Object.keys(screens).forEach(key => {
        screens[key].classList.remove('active');
    });

socket.on('gameRestart', (data) => {
    gameActive = true;
    updateBoard(data.board);
    
    isMyTurn = playerMark === data.currentPlayer;
    updateTurnIndicator(data.currentPlayer);
    
    // Disable play again button until game ends
    elements.playAgainBtn.disabled = true;
});

socket.on('playerDisconnected', (data) => {
    gameActive = false;
    elements.statusMessage.textContent = 'Opponent disconnected!';
    elements.playAgainBtn.disabled = true;
    
    // Show error with option to start new game
    showError('Your opponent has disconnected from the game.');
});

socket.on('roomError', (data) => {
    // Re-enable create button if there was an error
    elements.createBtn.disabled = false;
    elements.createBtn.textContent = 'Create New Game';
    
    showError(data.message);
});

socket.on('gameError', (data) => {
    showError(data.message);
});

// Initialize the game
document.addEventListener('DOMContentLoaded', () => {
    showScreen('welcome');
    
    // Handle room code parameter in URL if any
    const urlParams = new URLSearchParams(window.location.search);
    const roomParam = urlParams.get('room');
    
    if (roomParam) {
        elements.roomInput.value = roomParam;
        // Focus and select the room input
        elements.roomInput.focus();
        elements.roomInput.select();
    }
});
    screens[screenId].classList.add('active');
}

function generateRoomId() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function showError(message) {
    elements.errorMessage.textContent = message;
    elements.errorModal.classList.add('active');
}

function closeError() {
    elements.errorModal.classList.remove('active');
}

function updateBoard(board) {
    elements.cells.forEach((cell, index) => {
        // Clear existing classes
        cell.classList.remove('x', 'o', 'win');
        cell.textContent = '';
        
        // Update cell with mark if any
        if (board[index]) {
            cell.textContent = board[index];
            cell.classList.add(board[index].toLowerCase());
        }
    });
}

function updateTurnIndicator(currentPlayer) {
    const isMyTurn = currentPlayer === playerMark;
    
    elements.playerX.querySelector('.player-status').classList.remove('active', 'your-turn');
    elements.playerO.querySelector('.player-status').classList.remove('active', 'your-turn');
    
    if (currentPlayer === 'X') {
        elements.playerX.querySelector('.player-status').classList.add('active');
        if (playerMark === 'X') {
            elements.playerX.querySelector('.player-status').classList.add('your-turn');
        }
    } else {
        elements.playerO.querySelector('.player-status').classList.add('active');
        if (playerMark === 'O') {
            elements.playerO.querySelector('.player-status').classList.add('your-turn');
        }
    }
    
    elements.statusMessage.textContent = isMyTurn ? 'Your turn' : "Opponent's turn";
}

function highlightWinningCells(board, winner) {
    if (!winner) return;
    
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6]             // diagonals
    ];
    
    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            elements.cells[a].classList.add('win');
            elements.cells[b].classList.add('win');
            elements.cells[c].classList.add('win');
            return;
        }
    }
}

// Event Listeners
elements.createBtn.addEventListener('click', () => {
    elements.createBtn.disabled = true;
    elements.createBtn.textContent = 'Creating...';
    const newRoomId = generateRoomId();
    socket.emit('createRoom', newRoomId);
});

elements.joinBtn.addEventListener('click', () => {
    const inputRoomId = elements.roomInput.value.trim().toUpperCase();
    if (inputRoomId) {
        socket.emit('joinRoom', inputRoomId);
    } else {
        showError('Please enter a room code');
    }
});

elements.copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(elements.roomCode.textContent)
        .then(() => {
            elements.copyBtn.textContent = 'Copied!';
            setTimeout(() => {
                elements.copyBtn.textContent = 'Copy';
            }, 2000);
        })
        .catch(err => {
            console.error('Failed to copy room code:', err);
        });
});

elements.cells.forEach(cell => {
    cell.addEventListener('click', () => {
        if (!gameActive || !isMyTurn) return;
        
        const index = cell.getAttribute('data-index');
        
        if (cell.textContent === '') {
            socket.emit('makeMove', { roomId, index: parseInt(index) });
        }
    });
});

elements.playAgainBtn.addEventListener('click', () => {
    socket.emit('playAgain', roomId);
});

elements.newGameBtn.addEventListener('click', () => {
    location.reload();
});

elements.okBtn.addEventListener('click', closeError);
elements.closeModal.addEventListener('click', closeError);

// Socket Event Handlers
socket.on('roomCreated', (data) => {
    roomId = data.roomId;
    playerId = data.playerId;
    playerMark = data.playerMark;
    
    elements.roomCode.textContent = roomId;
    showScreen('waiting');
});

socket.on('roomJoined', (data) => {
    roomId = data.roomId;
    playerId = data.playerId;
    playerMark = data.playerMark;
    
    showScreen('game');
    elements.statusMessage.textContent = 'Connected! Waiting for game to start...';
});

socket.on('gameStart', (data) => {
    gameActive = true;
    updateBoard(data.board);
    
    isMyTurn = playerMark === data.currentPlayer;
    updateTurnIndicator(data.currentPlayer);
    
    showScreen('game');
});

socket.on('gameUpdate', (data) => {
    updateBoard(data.board);
    
    isMyTurn = playerMark === data.currentPlayer;
    updateTurnIndicator(data.currentPlayer);
});

socket.on('gameOver', (data) => {
    gameActive = false;
    updateBoard(data.board);
    
    // Highlight winning cells if there's a winner
    highlightWinningCells(data.board, data.winner);
    
    // Update status message
    if (data.winner) {
        const isWinner = playerMark === data.winner;
        elements.statusMessage.textContent = isWinner ? 'You win! 🎉' : 'You lose! 😞';
    } else {
        elements.statusMessage.textContent = "It's a draw! 🤝";
    }
    
    // Enable play again button
    elements.playAgainBtn.disabled = false;
});