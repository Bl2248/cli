class GobangGame {
    constructor() {
        this.boardSize = 15;
        this.board = [];
        this.currentPlayer = 'black';
        this.gameOver = false;
        this.boardElement = document.getElementById('gobang-board');
        this.currentPlayerElement = document.getElementById('current-player');
        this.gameOverElement = document.getElementById('game-over');
        this.winnerTextElement = document.getElementById('winner-text');
        this.resetBtn = document.getElementById('reset-btn');
        this.newGameBtn = document.getElementById('new-game-btn');
        
        this.initGame();
        this.bindEvents();
    }
    
    initGame() {
        this.board = Array(this.boardSize).fill(null).map(() => Array(this.boardSize).fill(null));
        this.currentPlayer = 'black';
        this.gameOver = false;
        this.renderBoard();
        this.updateCurrentPlayerDisplay();
        this.hideGameOver();
    }
    
    renderBoard() {
        this.boardElement.innerHTML = '';
        
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
                
                this.boardElement.appendChild(cell);
            }
        }
    }
    
    bindEvents() {
        this.boardElement.addEventListener('click', (e) => {
            if (this.gameOver) return;
            
            const cell = e.target.closest('.cell');
            if (!cell) return;
            
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);
            
            this.makeMove(row, col);
        });
        
        this.resetBtn.addEventListener('click', () => {
            this.initGame();
        });
        
        this.newGameBtn.addEventListener('click', () => {
            this.initGame();
        });
    }
    
    makeMove(row, col) {
        if (this.board[row][col] !== null) {
            return;
        }
        
        this.board[row][col] = this.currentPlayer;
        this.renderBoard();
        
        if (this.checkWin(row, col)) {
            this.endGame(this.currentPlayer);
            return;
        }
        
        if (this.checkDraw()) {
            this.endGame('draw');
            return;
        }
        
        this.currentPlayer = this.currentPlayer === 'black' ? 'white' : 'black';
        this.updateCurrentPlayerDisplay();
    }
    
    checkWin(row, col) {
        const directions = [
            [[0, 1], [0, -1]],
            [[1, 0], [-1, 0]],
            [[1, 1], [-1, -1]],
            [[1, -1], [-1, 1]]
        ];
        
        for (const direction of directions) {
            let count = 1;
            
            for (const [dr, dc] of direction) {
                let r = row + dr;
                let c = col + dc;
                
                while (
                    r >= 0 && r < this.boardSize &&
                    c >= 0 && c < this.boardSize &&
                    this.board[r][c] === this.currentPlayer
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
    
    checkDraw() {
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                if (this.board[row][col] === null) {
                    return false;
                }
            }
        }
        return true;
    }
    
    endGame(winner) {
        this.gameOver = true;
        
        if (winner === 'draw') {
            this.winnerTextElement.textContent = '平局！';
        } else {
            const winnerText = winner === 'black' ? '黑棋' : '白棋';
            this.winnerTextElement.innerHTML = `${winnerText}获胜！`;
        }
        
        this.showGameOver();
    }
    
    updateCurrentPlayerDisplay() {
        const playerText = this.currentPlayer === 'black' ? '黑棋' : '白棋';
        const playerClass = this.currentPlayer === 'black' ? 'player-black' : 'player-white';
        this.currentPlayerElement.innerHTML = `当前玩家: <span class="${playerClass}">${playerText}</span>`;
    }
    
    showGameOver() {
        this.gameOverElement.classList.remove('hidden');
    }
    
    hideGameOver() {
        this.gameOverElement.classList.add('hidden');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new GobangGame();
});