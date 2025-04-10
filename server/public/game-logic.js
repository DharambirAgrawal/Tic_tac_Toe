/**
 * Tic Tac Toe Bot
 */

const X = "X";
const O = "O";
const EMPTY = null;

/**
 * Returns starting state of the board.
 */
function initialState() {
    return [
        [EMPTY, EMPTY, EMPTY],
        [EMPTY, EMPTY, EMPTY],
        [EMPTY, EMPTY, EMPTY]
    ];
}

/**
 * Returns player who has the next turn on a board.
 */
function player(board) {
    let noX = 0;
    let noO = 0;
    
    for (let row of board) {
        for (let cell of row) {
            if (cell === X) {
                noX++;
            }
            if (cell === O) {
                noO++;
            }
        }
    }
    
    if (noX > noO) {
        return O;
    } else {
        return X;
    }
}

/**
 * Returns set of all possible actions (i, j) available on the board.
 */
function actions(board) {
    const possibleMoves = [];
    
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
            if (board[row][col] === EMPTY) {
                possibleMoves.push([row, col]);
            }
        }
    }
    
    return possibleMoves;
}

/**
 * Returns the board that results from making move (i, j) on the board.
 */
function result(board, action) {
    const possibleActions = actions(board);
    
    // Check if action is valid
    const isValid = possibleActions.some(([row, col]) => 
        row === action[0] && col === action[1]
    );
    
    if (!isValid) {
        throw new Error("Invalid Action");
    }
    
    // Create a deep copy of the board
    const boardCopy = JSON.parse(JSON.stringify(board));
    boardCopy[action[0]][action[1]] = player(board);
    
    return boardCopy;
}

/**
 * Returns the winner of the game, if there is one.
 */
function winner(board) {
    // Check rows
    for (let row of board) {
        if (row[0] === row[1] && row[1] === row[2] && row[0] !== EMPTY) {
            return row[0];
        }
    }
    
    // Check columns
    for (let col = 0; col < board.length; col++) {
        if (board[0][col] === board[1][col] && 
            board[1][col] === board[2][col] && 
            board[0][col] !== EMPTY) {
            return board[0][col];
        }
    }
    
    // Check diagonals
    if (board[0][0] === board[1][1] && board[1][1] === board[2][2] && board[0][0] !== EMPTY) {
        return board[0][0];
    }
    
    if (board[0][2] === board[1][1] && board[1][1] === board[2][0] && board[0][2] !== EMPTY) {
        return board[0][2];
    }
    
    return null;
}

/**
 * Returns True if game is over, False otherwise.
 */
function terminal(board) {
    if (winner(board) !== null) {
        return true;
    }
    
    for (let row of board) {
        for (let cell of row) {
            if (cell === EMPTY) {
                return false;
            }
        }
    }
    
    return true;
}

/**
 * Returns 1 if X has won the game, -1 if O has won, 0 otherwise.
 */
function utility(board) {
    const winningPlayer = winner(board);
    
    if (winningPlayer === X) {
        return 1;
    } else if (winningPlayer === O) {
        return -1;
    } else {
        return 0;
    }
}

/**
 * Returns the minimum value of the board with alpha-beta pruning
 */
function minValue(board, alpha, beta) {
    if (terminal(board)) {
        return utility(board);
    }
    
    let v = Infinity;
    
    for (let action of actions(board)) {
        v = Math.min(v, maxValue(result(board, action), alpha, beta));
        if (v <= alpha) {
            return v;
        }
        beta = Math.min(beta, v);
    }
    
    return v;
}

/**
 * Returns the maximum value of the board with alpha-beta pruning
 */
function maxValue(board, alpha, beta) {
    if (terminal(board)) {
        return utility(board);
    }
    
    let v = -Infinity;
    
    for (let action of actions(board)) {
        v = Math.max(v, minValue(result(board, action), alpha, beta));
        if (v >= beta) {
            return v;
        }
        alpha = Math.max(alpha, v);
    }
    
    return v;
}

/**
 * Returns the optimal action for the current player on the board.
 */
function minimax(board) {
    if (terminal(board)) {
        return null;
    }
    
    let bestAction = null;
    
    // X is max player
    if (player(board) === X) {
        let value = -Infinity;
        let alpha = -Infinity;
        let beta = Infinity;
        
        for (let action of actions(board)) {
            const minResult = minValue(result(board, action), alpha, beta);
            if (minResult > value) {
                value = minResult;
                bestAction = action;
            }
            alpha = Math.max(alpha, value);
        }
    }
    // O is min player
    else if (player(board) === O) {
        let value = Infinity;
        let alpha = -Infinity;
        let beta = Infinity;
        
        for (let action of actions(board)) {
            const maxResult = maxValue(result(board, action), alpha, beta);
            if (maxResult < value) {
                value = maxResult;
                bestAction = action;
            }
            beta = Math.min(beta, value);
        }
    }
    
    return bestAction;
}

// Example usage
// const board = initialState();
// console.log("Initial board:", board);
// const optimalMove = minimax(board);
// console.log("Optimal first move:", optimalMove);

/**
 * Returns a random valid move from the available actions
 */
function getRandomMove(board) {
    const possibleMoves = actions(board);
    if (possibleMoves.length === 0) return null;
    return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
}

/**
 * Returns a "smart" move for the AI based on some simple rules
 * Not as good as minimax but better than random
 */
function getMediumDifficultyMove(board) {
    const currentPlayer = player(board);
    const opponent = currentPlayer === X ? O : X;
    
    // Check if AI can win in next move
    for (let action of actions(board)) {
        const testBoard = result(board, action);
        if (winner(testBoard) === currentPlayer) {
            return action;
        }
    }
    
    // Check if opponent can win in next move and block
    for (let action of actions(board)) {
        const boardCopy = JSON.parse(JSON.stringify(board));
        // Temporarily place opponent's move
        boardCopy[action[0]][action[1]] = opponent;
        if (winner(boardCopy) === opponent) {
            return action;
        }
    }
    
    // Try to take center
    if (board[1][1] === EMPTY) {
        return [1, 1];
    }
    
    // Try to take corners
    const corners = [[0,0], [0,2], [2,0], [2,2]];
    const availableCorners = corners.filter(([row, col]) => board[row][col] === EMPTY);
    if (availableCorners.length > 0) {
        return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }
    
    // Take any available edge
    return getRandomMove(board);
}

/**
 * Gets AI move based on difficulty level
 */
function getAIMove(board, difficulty) {
    switch(difficulty) {
        case 'easy':
            return getRandomMove(board);
        case 'medium':
            return getMediumDifficultyMove(board);
        case 'hard':
        default:
            return minimax(board);
    }
}