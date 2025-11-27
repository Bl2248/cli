class TicTacToe {
    constructor() {
        this.currentPlayer = 'X';
        this.gameBoard = Array(9).fill('');
        this.gameActive = true;
        this.scores = {
            X: 0,
            O: 0,
            draw: 0
        };
        
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
        
        this.initializeElements();
        this.attachEventListeners();
        this.updateDisplay();
    }
    
    initializeElements() {
        this.cells = document.querySelectorAll('.cell');
        this.statusDisplay = document.getElementById('status');
        this.restartBtn = document.getElementById('restartBtn');
        this.scoreXDisplay = document.getElementById('scoreX');
        this.scoreODisplay = document.getElementById('scoreO');
        this.scoreDrawDisplay = document.getElementById('scoreDraw');
    }
    
    attachEventListeners() {
        this.cells.forEach(cell => {
            cell.addEventListener('click', (e) => this.handleCellClick(e));
        });
        
        this.restartBtn.addEventListener('click', () => this.restartGame());
    }
    
    handleCellClick(e) {
        const cell = e.target;
        const index = parseInt(cell.getAttribute('data-index'));
        
        if (this.gameBoard[index] !== '' || !this.gameActive) {
            return;
        }
        
        this.makeMove(cell, index);
    }
    
    makeMove(cell, index) {
        this.gameBoard[index] = this.currentPlayer;
        cell.textContent = this.currentPlayer;
        cell.classList.add('taken');
        
        if (this.checkWinner()) {
            this.handleGameEnd(false);
        } else if (this.checkDraw()) {
            this.handleGameEnd(true);
        } else {
            this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
            this.updateStatus();
        }
    }
    
    checkWinner() {
        for (let condition of this.winningConditions) {
            const [a, b, c] = condition;
            if (
                this.gameBoard[a] &&
                this.gameBoard[a] === this.gameBoard[b] &&
                this.gameBoard[a] === this.gameBoard[c]
            ) {
                this.highlightWinningCells(condition);
                return true;
            }
        }
        return false;
    }
    
    highlightWinningCells(condition) {
        condition.forEach(index => {
            this.cells[index].classList.add('winner');
        });
    }
    
    checkDraw() {
        return this.gameBoard.every(cell => cell !== '');
    }
    
    handleGameEnd(isDraw) {
        this.gameActive = false;
        
        if (isDraw) {
            this.scores.draw++;
            this.statusDisplay.textContent = '游戏平局！';
            this.statusDisplay.style.color = '#ff9800';
        } else {
            this.scores[this.currentPlayer]++;
            this.statusDisplay.textContent = `玩家 ${this.currentPlayer} 获胜！`;
            this.statusDisplay.style.color = '#4CAF50';
        }
        
        this.updateScoreDisplay();
    }
    
    updateStatus() {
        this.statusDisplay.textContent = `玩家 ${this.currentPlayer} 的回合`;
        this.statusDisplay.style.color = '#667eea';
    }
    
    updateScoreDisplay() {
        this.scoreXDisplay.textContent = this.scores.X;
        this.scoreODisplay.textContent = this.scores.O;
        this.scoreDrawDisplay.textContent = this.scores.draw;
    }
    
    restartGame() {
        this.currentPlayer = 'X';
        this.gameBoard = Array(9).fill('');
        this.gameActive = true;
        
        this.cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('taken', 'winner');
        });
        
        this.updateStatus();
    }
    
    updateDisplay() {
        this.updateStatus();
        this.updateScoreDisplay();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TicTacToe();
});