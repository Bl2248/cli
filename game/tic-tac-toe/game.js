class TicTacToe {
    constructor() {
        this.board = Array(9).fill(null);
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.winningCells = [];
        
        this.cells = document.querySelectorAll('.cell');
        this.statusDisplay = document.getElementById('status');
        this.restartButton = document.getElementById('restart');
        
        this.winningConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];
        
        this.initializeGame();
    }
    
    initializeGame() {
        this.cells.forEach(cell => {
            cell.addEventListener('click', (e) => this.handleCellClick(e));
        });
        
        this.restartButton.addEventListener('click', () => this.restartGame());
        
        this.updateStatus();
    }
    
    handleCellClick(event) {
        const cell = event.target;
        const index = parseInt(cell.getAttribute('data-index'));
        
        if (this.board[index] !== null || !this.gameActive) {
            return;
        }
        
        this.makeMove(index, cell);
    }
    
    makeMove(index, cell) {
        this.board[index] = this.currentPlayer;
        
        cell.textContent = this.currentPlayer;
        cell.classList.add(this.currentPlayer.toLowerCase());
        
        if (this.checkWinner()) {
            this.handleWin();
        } else if (this.checkDraw()) {
            this.handleDraw();
        } else {
            this.switchPlayer();
            this.updateStatus();
        }
    }
    
    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
    }
    
    checkWinner() {
        for (let condition of this.winningConditions) {
            const [a, b, c] = condition;
            
            if (this.board[a] && 
                this.board[a] === this.board[b] && 
                this.board[a] === this.board[c]) {
                this.winningCells = condition;
                return true;
            }
        }
        return false;
    }
    
    checkDraw() {
        return this.board.every(cell => cell !== null);
    }
    
    handleWin() {
        this.gameActive = false;
        this.highlightWinningCells();
        this.statusDisplay.textContent = `玩家 ${this.currentPlayer} 获胜！`;
        this.statusDisplay.style.background = '#4CAF50';
        this.statusDisplay.style.color = 'white';
    }
    
    handleDraw() {
        this.gameActive = false;
        this.statusDisplay.textContent = '平局！';
        this.statusDisplay.style.background = '#FF9800';
        this.statusDisplay.style.color = 'white';
    }
    
    highlightWinningCells() {
        this.winningCells.forEach(index => {
            this.cells[index].classList.add('winner');
        });
    }
    
    updateStatus() {
        if (this.gameActive) {
            this.statusDisplay.textContent = `玩家 ${this.currentPlayer} 的回合`;
            this.statusDisplay.style.background = '#f0f0f0';
            this.statusDisplay.style.color = '#333';
        }
    }
    
    restartGame() {
        this.board = Array(9).fill(null);
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.winningCells = [];
        
        this.cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o', 'winner');
        });
        
        this.updateStatus();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TicTacToe();
});