class Gomoku {
    constructor() {
        this.boardSize = 15;
        this.board = [];
        this.currentPlayer = 'black';
        this.gameOver = false;
        this.boardElement = document.getElementById('board');
        this.currentPlayerElement = document.getElementById('currentPlayer');
        this.gameOverElement = document.getElementById('gameOver');
        this.winnerTextElement = document.getElementById('winnerText');
        this.restartBtn = document.getElementById('restartBtn');
        this.newGameBtn = document.getElementById('newGameBtn');
        
        this.initBoard();
        this.bindEvents();
    }
    
    initBoard() {
        this.board = Array(this.boardSize).fill(null).map(() => Array(this.boardSize).fill(null));
        this.renderBoard();
    }
    
    renderBoard() {
        this.boardElement.innerHTML = '';
        
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                
                if (this.board[row][col] === 'black') {
                    cell.classList.add('black');
                } else if (this.board[row][col] === 'white') {
                    cell.classList.add('white');
                }
                
                this.boardElement.appendChild(cell);
            }
        }
    }
    
    bindEvents() {
        this.boardElement.addEventListener('click', (e) => {
            if (e.target.classList.contains('cell') && !this.gameOver) {
                const row = parseInt(e.target.dataset.row);
                const col = parseInt(e.target.dataset.col);
                this.makeMove(row, col);
            }
        });
        
        this.restartBtn.addEventListener('click', () => {
            this.resetGame();
        });
        
        this.newGameBtn.addEventListener('click', () => {
            this.resetGame();
            this.gameOverElement.style.display = 'none';
        });
    }
    
    makeMove(row, col) {
        if (this.board[row][col] !== null) {
            return;
        }
        
        this.board[row][col] = this.currentPlayer;
        this.renderBoard();
        
        if (this.checkWin(row, col)) {
            this.endGame();
        } else {
            this.switchPlayer();
        }
    }
    
    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'black' ? 'white' : 'black';
        this.updateCurrentPlayerDisplay();
    }
    
    updateCurrentPlayerDisplay() {
        const playerName = this.currentPlayer === 'black' ? '黑棋' : '白棋';
        this.currentPlayerElement.textContent = playerName;
        this.currentPlayerElement.style.color = this.currentPlayer === 'black' ? '#000' : '#666';
    }
    
    checkWin(row, col) {
        return (
            this.checkDirection(row, col, 1, 0) ||  // 横向
            this.checkDirection(row, col, 0, 1) ||  // 纵向
            this.checkDirection(row, col, 1, 1) ||  // 对角线（\）
            this.checkDirection(row, col, 1, -1)    // 对角线（/）
        );
    }
    
    checkDirection(row, col, deltaRow, deltaCol) {
        const player = this.board[row][col];
        let count = 1;
        
        // 检查正方向
        for (let i = 1; i < 5; i++) {
            const newRow = row + deltaRow * i;
            const newCol = col + deltaCol * i;
            
            if (this.isValidPosition(newRow, newCol) && this.board[newRow][newCol] === player) {
                count++;
            } else {
                break;
            }
        }
        
        // 检查反方向
        for (let i = 1; i < 5; i++) {
            const newRow = row - deltaRow * i;
            const newCol = col - deltaCol * i;
            
            if (this.isValidPosition(newRow, newCol) && this.board[newRow][newCol] === player) {
                count++;
            } else {
                break;
            }
        }
        
        return count >= 5;
    }
    
    isValidPosition(row, col) {
        return row >= 0 && row < this.boardSize && col >= 0 && col < this.boardSize;
    }
    
    endGame() {
        this.gameOver = true;
        const winnerName = this.currentPlayer === 'black' ? '黑棋' : '白棋';
        this.winnerTextElement.textContent = `${winnerName}获胜！`;
        this.gameOverElement.style.display = 'flex';
    }
    
    resetGame() {
        this.currentPlayer = 'black';
        this.gameOver = false;
        this.updateCurrentPlayerDisplay();
        this.initBoard();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Gomoku();
});