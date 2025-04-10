import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const PORT = process.env.PORT || 3000;

// __dirname workaround for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create HTTP server
const server = createServer(app);

// Initialize Socket.io
const io = new Server(server);

// Game rooms management
const rooms = {};

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the game page
app.get('/bot', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/bot', 'bot.html'));
});

app.get('/online', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/online', 'index.html'));
});

// Socket.io connection handler
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Create a new game room
    socket.on('createRoom', (roomId) => {
        console.log(`Room created: ${roomId}`);
        
        // Initialize room if it doesn't exist
        if (!rooms[roomId]) {
            rooms[roomId] = {
                players: [socket.id],
                board: Array(9).fill(null),
                currentPlayer: 'X',
                gameStatus: 'waiting' // waiting, playing, finished
            };
            socket.join(roomId);
            socket.emit('roomCreated', { 
                roomId,
                playerId: socket.id,
                playerMark: 'X'
            });
        } else {
            socket.emit('roomError', { message: 'Room already exists!' });
        }
    });

    // Join an existing game room
    socket.on('joinRoom', (roomId) => {
        console.log(`Join request for room: ${roomId}`);
        
        const room = rooms[roomId];
        
        if (!room) {
            socket.emit('roomError', { message: 'Room does not exist!' });
            return;
        }
        
        if (room.players.length >= 2) {
            socket.emit('roomError', { message: 'Room is full!' });
            return;
        }
        
        room.players.push(socket.id);
        room.gameStatus = 'playing';
        socket.join(roomId);
        
        socket.emit('roomJoined', { 
            roomId,
            playerId: socket.id,
            playerMark: 'O'
        });
        
        // Notify all players in the room that the game is starting
        io.to(roomId).emit('gameStart', {
            board: room.board,
            currentPlayer: room.currentPlayer,
            players: room.players
        });
    });

    // Handle player move
    socket.on('makeMove', ({ roomId, index }) => {
        const room = rooms[roomId];
        
        if (!room) {
            socket.emit('gameError', { message: 'Room does not exist!' });
            return;
        }
        
        // Check if it's the player's turn
        const playerIndex = room.players.indexOf(socket.id);
        const playerMark = playerIndex === 0 ? 'X' : 'O';
        
        if (room.currentPlayer !== playerMark) {
            socket.emit('gameError', { message: 'Not your turn!' });
            return;
        }
        
        // Check if the move is valid
        if (room.board[index] !== null) {
            socket.emit('gameError', { message: 'Invalid move!' });
            return;
        }
        
        // Make the move
        room.board[index] = playerMark;
        
        // Check for win or draw
        const winner = checkWinner(room.board);
        const isDraw = !room.board.includes(null) && !winner;
        
        if (winner) {
            room.gameStatus = 'finished';
            io.to(roomId).emit('gameOver', { 
                winner,
                board: room.board
            });
        } else if (isDraw) {
            room.gameStatus = 'finished';
            io.to(roomId).emit('gameOver', { 
                winner: null,
                board: room.board
            });
        } else {
            // Switch players
            room.currentPlayer = room.currentPlayer === 'X' ? 'O' : 'X';
            
            // Update game state for all players
            io.to(roomId).emit('gameUpdate', {
                board: room.board,
                currentPlayer: room.currentPlayer
            });
        }
    });

    // Player requests to play again
    socket.on('playAgain', (roomId) => {
        const room = rooms[roomId];
        
        if (!room) return;
        
        // Reset the game
        room.board = Array(9).fill(null);
        room.currentPlayer = 'X';
        room.gameStatus = 'playing';
        
        io.to(roomId).emit('gameRestart', {
            board: room.board,
            currentPlayer: room.currentPlayer
        });
    });

    // Handle room sharing
    socket.on('getRoomId', (roomId) => {
        socket.emit('roomId', { roomId });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        
        // Find and clean up any rooms the player was in
        for (const roomId in rooms) {
            const room = rooms[roomId];
            const playerIndex = room.players.indexOf(socket.id);
            
            if (playerIndex !== -1) {
                // Notify other player about disconnection
                io.to(roomId).emit('playerDisconnected', {
                    playerId: socket.id
                });
                
                // Remove the room if it's now empty
                if (room.players.length <= 1) {
                    delete rooms[roomId];
                    console.log(`Room deleted: ${roomId}`);
                } else {
                    // Remove the player from the room
                    room.players.splice(playerIndex, 1);
                    room.gameStatus = 'waiting';
                }
            }
        }
    });
});

// Helper function to check for a winner
function checkWinner(board) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6]             // diagonals
    ];
    
    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    
    return null;
}

// Start the server with Socket.io
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});