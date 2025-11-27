class Gomoku {
    constructor() {
        this.boardSize = 15;
        this.board = [];
        this.currentPlayer = 'black';
        this.gameOver = false;
        this.gameBoard = document.getElementById('gameBoard');
        this.currentPlayerDisplay = document.getElementById('currentPlayer');
        this.gameResult = document.getElementById('gameResult');
        this.resetBtn = document.getElementById('resetBtn');
        
        this.initBoard();
        this.renderBoard();
        this.bindEvents();
    }
    
    initBoard() {
        this.board = Array(this.boardSize).fill(null).map(() => Array(this.boardSize).fill(null));
        this.currentPlayer = 'black';
        this.gameOver = false;
        this.gameResult.textContent = '';
        this.updateCurrentPlayerDisplay();
    }
    
    renderBoard() {
        this.gameBoard.innerHTML = '';
        const boardElement = document.createElement('div');
        boardElement.className = 'board';
        
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                
                if (this.board[row][col]) {
                    const piece = document.createElement('div');
                    piece.className = `piece ${this.board[row][col]}`;
                    cell.appendChild(piece);
                }
                
                boardElement.appendChild(cell);
            }
        }
        
        this.gameBoard.appendChild(boardElement);
    }
    
    bindEvents() {
        this.gameBoard.addEventListener('click', (e) => {
            if (this.gameOver) return;
            
            const cell = e.target.closest('.cell');
            if (!cell) return;
            
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);
            
            this.makeMove(row, col);
        });
        
        this.resetBtn.addEventListener('click', () => {
            this.resetGame();
        });
    }
    
    makeMove(row, col) {
        if (this.board[row][col] !== null) {
            return;
        }
        
        this.board[row][col] = this.currentPlayer;
        this.renderBoard();
        
        if (this.checkWin(row, col)) {
            this.gameOver = true;
            const winner = this.currentPlayer === 'black' ? '黑棋' : '白棋';
            this.gameResult.textContent = `${winner}获胜！`;
            return;
        }
        
        this.currentPlayer = this.currentPlayer === 'black' ? 'white' : 'black';
        this.updateCurrentPlayerDisplay();
    }
    
    updateCurrentPlayerDisplay() {
        const playerText = this.currentPlayer === 'black' ? '黑棋' : '白棋';
        this.currentPlayerDisplay.textContent = playerText;
        this.currentPlayerDisplay.style.color = this.currentPlayer === 'black' ? '#000' : '#f44336';
    }
    
    checkWin(row, col) {
        const directions = [
            [[0, 1], [0, -1]],
            [[1, 0], [-1, 0]],
            [[1, 1], [-1, -1]],
            [[1, -1], [-1, 1]]
        ];
        
        const player = this.board[row][col];
        
        for (const direction of directions) {
            let count = 1;
            
            for (const [dr, dc] of direction) {
                let r = row + dr;
                let c = col + dc;
                
                while (
                    r >= 0 && r < this.boardSize &&
                    c >= 0 && c < this.boardSize &&
                    this.board[r][c] === player
                ) {
                    count++;
                    r += dr;
                    c += dc;
                }
            }
            
            if (count >= 5) {
                return true;
            }
        }
        
        return false;
    }
    
    resetGame() {
        this.initBoard();
        this.renderBoard();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Gomoku();
});