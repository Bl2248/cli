class TicTacToe {
    constructor() {
        this.currentPlayer = 'X';
        this.gameBoard = ['', '', '', '', '', '', '', '', ''];
        this.gameActive = true;
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
    }
    
    initializeElements() {
        this.cells = document.querySelectorAll('.cell');
        this.currentPlayerDisplay = document.getElementById('current-player');
        this.winnerDisplay = document.getElementById('winner');
        this.resetButton = document.getElementById('reset-button');
    }
    
    attachEventListeners() {
        this.cells.forEach((cell, index) => {
            cell.addEventListener('click', () => this.handleCellClick(index));
        });
        
        this.resetButton.addEventListener('click', () => this.resetGame());
    }
    
    handleCellClick(index) {
        if (this.gameBoard[index] !== '' || !this.gameActive) {
            return;
        }
        
        this.updateCell(index);
        this.checkResult();
    }
    
    updateCell(index) {
        this.gameBoard[index] = this.currentPlayer;
        const cell = this.cells[index];
        cell.textContent = this.currentPlayer;
        cell.classList.add(this.currentPlayer.toLowerCase(), 'taken');
    }
    
    checkResult() {
        let roundWon = false;
        
        for (let i = 0; i < this.winningConditions.length; i++) {
            const [a, b, c] = this.winningConditions[i];
            
            if (this.gameBoard[a] && 
                this.gameBoard[a] === this.gameBoard[b] && 
                this.gameBoard[a] === this.gameBoard[c]) {
                roundWon = true;
                break;
            }
        }
        
        if (roundWon) {
            this.endGame(false);
            return;
        }
        
        if (!this.gameBoard.includes('')) {
            this.endGame(true);
            return;
        }
        
        this.changePlayer();
    }
    
    changePlayer() {
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        this.currentPlayerDisplay.textContent = `当前玩家: ${this.currentPlayer}`;
    }
    
    endGame(draw) {
        this.gameActive = false;
        
        if (draw) {
            this.winnerDisplay.textContent = '平局！';
            this.winnerDisplay.style.color = '#FF9800';
        } else {
            this.winnerDisplay.textContent = `玩家 ${this.currentPlayer} 获胜！`;
            this.winnerDisplay.style.color = '#4CAF50';
        }
        
        this.currentPlayerDisplay.style.display = 'none';
    }
    
    resetGame() {
        this.currentPlayer = 'X';
        this.gameBoard = ['', '', '', '', '', '', '', '', ''];
        this.gameActive = true;
        
        this.cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o', 'taken');
        });
        
        this.currentPlayerDisplay.textContent = `当前玩家: ${this.currentPlayer}`;
        this.currentPlayerDisplay.style.display = 'block';
        this.winnerDisplay.textContent = '';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TicTacToe();
});