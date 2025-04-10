// public/script.js
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const boardElement = document.getElementById('board');
    const cells = document.querySelectorAll('.cell');
    const statusElement = document.getElementById('status');
    const restartButton = document.getElementById('restart');
    const playAsXButton = document.getElementById('play-as-x');
    const playAsOButton = document.getElementById('play-as-o');
    const difficultySelect = document.getElementById('difficulty');
    const playerScoreElement = document.getElementById('player-score');
    const tiesElement = document.getElementById('ties');
    const aiScoreElement = document.getElementById('ai-score');

    // Game state
    let gameBoard = initialState();
    let isGameActive = true;
    let playerMark = X;
    let aiMark = O;
    let waitingForAI = false;
    let scores = {
        player: 0,
        ties: 0,
        ai: 0
    };

    // Initialize the game
    initGame();

    // Event Listeners
    restartButton.addEventListener('click', resetGame);

    playAsXButton.addEventListener('click', () => {
        playerMark = X;
        aiMark = O;
        playAsXButton.classList.add('active');
        playAsOButton.classList.remove('active');
        resetGame();
    });

    playAsOButton.addEventListener('click', () => {
        playerMark = O;
        aiMark = X;
        playAsXButton.classList.remove('active');
        playAsOButton.classList.add('active');
        resetGame();
    });

    difficultySelect.addEventListener('change', resetGame);

    cells.forEach(cell => {
        cell.addEventListener('click', () => handleCellClick(cell));
    });

    // Functions
    function initGame() {
        // If player is O, AI goes first
        updateBoardDisplay();
        if (playerMark === O) {
            makeAIMove();
        } else {
            updateStatus();
        }
    }

    function resetGame() {
        // Remove all marks and animations
        cells.forEach(cell => {
            cell.className = 'cell';
        });

        // Remove win lines if any
        const winLines = document.querySelectorAll('.win-line');
        winLines.forEach(line => line.remove());

        // Remove game over overlay if any
        const gameOverElement = document.querySelector('.game-over');
        if (gameOverElement) {
            gameOverElement.remove();
        }

        // Reset game state
        gameBoard = initialState();
        isGameActive = true;
        waitingForAI = false;

        // Start the game
        initGame();
    }

    function handleCellClick(cell) {
        if (!isGameActive || waitingForAI) return;

        const index = cell.getAttribute('data-index').split('-');
        const row = parseInt(index[0]);
        const col = parseInt(index[1]);

        // Check if cell is empty
        if (gameBoard[row][col] !== EMPTY) return;

        // Make player move
        makeMove([row, col], playerMark);

        // Check game status
        if (!checkGameStatus()) {
            // AI's turn
            waitingForAI = true;
            // Add small delay for better UX
            setTimeout(() => {
                makeAIMove();
                waitingForAI = false;
            }, 500);
        }
    }

    function makeMove(action, mark) {
        const [row, col] = action;
        gameBoard[row][col] = mark;
        updateBoardDisplay();
    }

    function makeAIMove() {
        if (!isGameActive) return;

        const difficulty = difficultySelect.value;
        const aiAction = getAIMove(gameBoard, difficulty);

        if (aiAction) {
            makeMove(aiAction, aiMark);
            checkGameStatus();
        }
    }

    function checkGameStatus() {
        const gameWinner = winner(gameBoard);
        const isTerminal = terminal(gameBoard);

        if (gameWinner !== null || isTerminal) {
            isGameActive = false;

            if (gameWinner === playerMark) {
                updateStatus(`You win!`);
                showWinLine(gameWinner);
                scores.player++;
                playerScoreElement.textContent = scores.player;
            } else if (gameWinner === aiMark) {
                updateStatus(`AI wins!`);
                showWinLine(gameWinner);
                scores.ai++;
                aiScoreElement.textContent = scores.ai;
            } else {
                updateStatus(`It's a tie!`);
                scores.ties++;
                tiesElement.textContent = scores.ties;
            }
            
            return true;
        }

        updateStatus();
        return false;
    }

    function updateStatus(message) {
        if (!message) {
            const currentPlayerMark = player(gameBoard);
            if (currentPlayerMark === playerMark) {
                statusElement.textContent = `Your turn (${playerMark})`;
            } else {
                statusElement.textContent = `AI's turn (${aiMark})`;
            }
        } else {
            statusElement.textContent = message;
        }
    }

    function updateBoardDisplay() {
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                const cellValue = gameBoard[row][col];
                const cellElement = document.querySelector(`[data-index="${row}-${col}"]`);
                
                // Remove existing classes
                cellElement.classList.remove('x', 'o');
                
                // Add class based on cell value
                if (cellValue === X) {
                    cellElement.classList.add('x');
                } else if (cellValue === O) {
                    cellElement.classList.add('o');
                }
            }
        }
    }

    function showWinLine(winningMark) {
        const winPatterns = [
            // Rows
            { cells: [[0,0], [0,1], [0,2]], type: 'horizontal', top: '16.7%' },
            { cells: [[1,0], [1,1], [1,2]], type: 'horizontal', top: '50%' },
            { cells: [[2,0], [2,1], [2,2]], type: 'horizontal', top: '83.3%' },
            
            // Columns
            { cells: [[0,0], [1,0], [2,0]], type: 'vertical', left: '16.7%' },
            { cells: [[0,1], [1,1], [2,1]], type: 'vertical', left: '50%' },
            { cells: [[0,2], [1,2], [2,2]], type: 'vertical', left: '83.3%' },
            
            // Diagonals
            { cells: [[0,0], [1,1], [2,2]], type: 'diagonal-1' },
            { cells: [[0,2], [1,1], [2,0]], type: 'diagonal-2' }
        ];

        // Find the winning pattern
        let winPattern = null;
        for (const pattern of winPatterns) {
            const [a, b, c] = pattern.cells;
            if (
                gameBoard[a[0]][a[1]] === winningMark &&
                gameBoard[b[0]][b[1]] === winningMark &&
                gameBoard[c[0]][c[1]] === winningMark
            ) {
                winPattern = pattern;
                break;
            }
        }

        if (!winPattern) return;

        // Create and show the win line
        const winLine = document.createElement('div');
        winLine.classList.add('win-line', winPattern.type);
        
        if (winPattern.type === 'horizontal') {
            winLine.style.top = winPattern.top;
        } else if (winPattern.type === 'vertical') {
            winLine.style.left = winPattern.left;
        } else if (winPattern.type === 'diagonal-1') {
            winLine.style.animation = 'win-line-animation-diagonal-1 0.5s forwards';
        } else if (winPattern.type === 'diagonal-2') {
            winLine.style.animation = 'win-line-animation-diagonal-2 0.5s forwards';
        }
        
        boardElement.appendChild(winLine);
        
        // Show game over animation after a slight delay
        setTimeout(() => {
            const gameOver = document.createElement('div');
            gameOver.classList.add('game-over');
            gameOver.textContent = winningMark === playerMark ? 'You Win!' : 'AI Wins!';
            boardElement.appendChild(gameOver);
            
            // Small delay before showing the overlay
            setTimeout(() => {
                gameOver.classList.add('show');
            }, 100);
        }, 800);
    }
});