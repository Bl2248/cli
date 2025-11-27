class TicTacToe {
    constructor() {
        this.board = ['', '', '', '', '', '', '', '', ''];
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.score = {
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
        
        this.statusDisplay = document.getElementById('status');
        this.restartButton = document.getElementById('restartBtn');
        this.cells = document.querySelectorAll('.cell');
        this.scoreXDisplay = document.getElementById('scoreX');
        this.scoreODisplay = document.getElementById('scoreO');
        this.scoreDrawDisplay = document.getElementById('scoreDraw');
        
        this.init();
    }
    
    init() {
        this.cells.forEach(cell => {
            cell.addEventListener('click', (e) => this.handleCellClick(e));
        });
        
        this.restartButton.addEventListener('click', () => this.restartGame());
        
        this.updateScoreDisplay();
    }
    
    handleCellClick(event) {
        const clickedCell = event.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));
        
        if (this.board[clickedCellIndex] !== '' || !this.gameActive) {
            return;
        }
        
        this.handleCellPlayed(clickedCell, clickedCellIndex);
        this.handleResultValidation();
    }
    
    handleCellPlayed(clickedCell, clickedCellIndex) {
        this.board[clickedCellIndex] = this.currentPlayer;
        clickedCell.textContent = this.currentPlayer;
        clickedCell.classList.add('taken', this.currentPlayer.toLowerCase());
    }
    
    handleResultValidation() {
        let roundWon = false;
        let winningCells = [];
        
        for (let i = 0; i < this.winningConditions.length; i++) {
            const winCondition = this.winningConditions[i];
            const a = this.board[winCondition[0]];
            const b = this.board[winCondition[1]];
            const c = this.board[winCondition[2]];
            
            if (a === '' || b === '' || c === '') {
                continue;
            }
            
            if (a === b && b === c) {
                roundWon = true;
                winningCells = winCondition;
                break;
            }
        }
        
        if (roundWon) {
            this.handleWin(winningCells);
            return;
        }
        
        const roundDraw = !this.board.includes('');
        if (roundDraw) {
            this.handleDraw();
            return;
        }
        
        this.handlePlayerChange();
    }
    
    handleWin(winningCells) {
        this.gameActive = false;
        this.statusDisplay.textContent = `玩家 ${this.currentPlayer} 获胜！`;
        this.statusDisplay.style.color = '#48bb78';
        
        winningCells.forEach(index => {
            this.cells[index].classList.add('winner');
        });
        
        this.score[this.currentPlayer]++;
        this.updateScoreDisplay();
    }
    
    handleDraw() {
        this.gameActive = false;
        this.statusDisplay.textContent = '平局！';
        this.statusDisplay.style.color = '#ed8936';
        
        this.score.draw++;
        this.updateScoreDisplay();
    }
    
    handlePlayerChange() {
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        this.statusDisplay.textContent = `玩家 ${this.currentPlayer} 的回合`;
        this.statusDisplay.style.color = '#667eea';
    }
    
    restartGame() {
        this.gameActive = true;
        this.currentPlayer = 'X';
        this.board = ['', '', '', '', '', '', '', '', ''];
        this.statusDisplay.textContent = '玩家 X 的回合';
        this.statusDisplay.style.color = '#667eea';
        
        this.cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('taken', 'x', 'o', 'winner');
        });
    }
    
    updateScoreDisplay() {
        this.scoreXDisplay.textContent = this.score.X;
        this.scoreODisplay.textContent = this.score.O;
        this.scoreDrawDisplay.textContent = this.score.draw;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TicTacToe();
});