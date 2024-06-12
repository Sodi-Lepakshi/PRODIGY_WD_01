let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let mode = 'ai'; // Default mode is playing against AI
const statusDisplay = document.getElementById('game-status');

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function handleResultValidation() {
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        let a = board[winCondition[0]];
        let b = board[winCondition[1]];
        let c = board[winCondition[2]];
        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            drawWinningLine(winCondition);
            break;
        }
    }

    if (roundWon) {
        statusDisplay.innerHTML = `Player ${currentPlayer} has won!`;
        gameActive = false;
        return;
    }

    let roundDraw = !board.includes('');
    if (roundDraw) {
        statusDisplay.innerHTML = 'Game ended in a draw!';
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusDisplay.innerHTML = `Player ${currentPlayer}'s turn`;

    if (gameActive && mode === 'ai' && currentPlayer === 'O') {
        makeAIMove();
    }
}

function handleCellPlayed(clickedCellIndex) {
    board[clickedCellIndex] = currentPlayer;
    document.getElementById(`cell-${clickedCellIndex}`).innerHTML = currentPlayer;
    document.getElementById(`cell-${clickedCellIndex}`).classList.add(currentPlayer);
}

function handleCellClick(clickedCellIndex) {
    if (board[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    handleCellPlayed(clickedCellIndex);
    handleResultValidation();

    if (mode === 'online') {
        // Implement online play logic here, like sending the move to the server
        // For now, we'll just log it
        console.log(`Move sent to server: Player ${currentPlayer} to cell ${clickedCellIndex}`);
    }
}

function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'X';
    statusDisplay.innerHTML = `Player ${currentPlayer}'s turn`;
    document.querySelectorAll('.cell').forEach(cell => {
        cell.innerHTML = '';
        cell.classList.remove('X', 'O');
    });
    document.querySelectorAll('.line').forEach(line => line.remove());
}

function setMode(newMode) {
    mode = newMode;
    resetGame();
    if (mode === 'online') {
        alert('Online mode selected. Implement server communication here.');
    }
}

function makeMove(index) {
    handleCellClick(index);
}

function makeAIMove() {
    let emptyCells = board.map((cell, index) => cell === '' ? index : null).filter(val => val !== null);
    let randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    setTimeout(() => handleCellClick(randomIndex), 500);
}

function drawWinningLine(winCondition) {
    const line = document.createElement('div');
    line.classList.add('line');

    const gameBoard = document.getElementById('game-board');
    const cellSize = 100;
    const offset = 10;
    const centerAdjust = cellSize / 2;

    const [a, b, c] = winCondition;
    const cells = [a, b, c].map(index => document.getElementById(`cell-${index}`));
    const [startCell, , endCell] = cells;

    const startCellRect = startCell.getBoundingClientRect();
    const endCellRect = endCell.getBoundingClientRect();

    let left, top, width, height, transform;

    if (a % 3 === b % 3) {
        // Vertical line
        left = startCellRect.left + centerAdjust - gameBoard.getBoundingClientRect().left - offset / 2;
        top = startCellRect.top - gameBoard.getBoundingClientRect().top;
        height = endCellRect.bottom - startCellRect.top;
        width = offset;
        transform = '';
    } else if (Math.floor(a / 3) === Math.floor(b / 3)) {
        // Horizontal line
        top = startCellRect.top + centerAdjust - gameBoard.getBoundingClientRect().top - offset / 2;
        left = startCellRect.left - gameBoard.getBoundingClientRect().left;
        width = endCellRect.right - startCellRect.left;
        height = offset;
        transform = '';
    } else if (a === 0 && c === 8 || a === 2 && c === 6) {
        // Diagonal line
        width = Math.sqrt(Math.pow(endCellRect.right - startCellRect.left, 2) + Math.pow(endCellRect.bottom - startCellRect.top, 2));
        height = offset;
        left = startCellRect.left - gameBoard.getBoundingClientRect().left;
        top = startCellRect.top - gameBoard.getBoundingClientRect().top;
        transform = `rotate(${a === 0 ? 45 : -45}deg)`;
    }

    line.style.left = `${left}px`;
    line.style.top = `${top}px`;
    line.style.width = `${width}px`;
    line.style.height = `${height}px`;
    line.style.transform = transform;

    gameBoard.appendChild(line);
}

document.querySelectorAll('.cell').forEach(cell => {
    cell.addEventListener('click', () => {
        handleCellClick(parseInt(cell.id.split('-')[1]));
    });
});
