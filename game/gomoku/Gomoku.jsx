import React, { useState } from 'react';
import './Gomoku.scss';

const BOARD_SIZE = 15;
const EMPTY = 0;
const BLACK = 1;
const WHITE = 2;

const Gomoku = () => {
  const [board, setBoard] = useState(() => 
    Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(EMPTY))
  );
  const [currentPlayer, setCurrentPlayer] = useState(BLACK);
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState([]);

  const checkWinner = (board, row, col, player) => {
    const directions = [
      [[0, 1], [0, -1]],
      [[1, 0], [-1, 0]],
      [[1, 1], [-1, -1]],
      [[1, -1], [-1, 1]]
    ];

    for (const direction of directions) {
      const line = [[row, col]];
      
      for (const [dr, dc] of direction) {
        let r = row + dr;
        let c = col + dc;
        
        while (
          r >= 0 && r < BOARD_SIZE && 
          c >= 0 && c < BOARD_SIZE && 
          board[r][c] === player
        ) {
          line.push([r, c]);
          r += dr;
          c += dc;
        }
      }
      
      if (line.length >= 5) {
        return line;
      }
    }
    
    return null;
  };

  const handleCellClick = (row, col) => {
    if (winner || board[row][col] !== EMPTY) return;

    const newBoard = board.map(r => [...r]);
    newBoard[row][col] = currentPlayer;
    setBoard(newBoard);

    const winLine = checkWinner(newBoard, row, col, currentPlayer);
    if (winLine) {
      setWinner(currentPlayer);
      setWinningLine(winLine);
    } else {
      setCurrentPlayer(currentPlayer === BLACK ? WHITE : BLACK);
    }
  };

  const resetGame = () => {
    setBoard(Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(EMPTY)));
    setCurrentPlayer(BLACK);
    setWinner(null);
    setWinningLine([]);
  };

  const isWinningCell = (row, col) => {
    return winningLine.some(([r, c]) => r === row && c === col);
  };

  return (
    <div className="gomoku-container">
      <div className="game-header">
        <h1>五子棋</h1>
        <div className="game-info">
          {!winner ? (
            <div className="current-player">
              当前玩家: <span className={`player-stone ${currentPlayer === BLACK ? 'black' : 'white'}`}></span>
            </div>
          ) : (
            <div className="winner">
              获胜者: <span className={`player-stone ${winner === BLACK ? 'black' : 'white'}`}></span>
            </div>
          )}
        </div>
        <button className="reset-btn" onClick={resetGame}>重新开始</button>
      </div>
      
      <div className="board">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="board-row">
            {row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`cell ${
                  cell === BLACK ? 'black' : 
                  cell === WHITE ? 'white' : ''
                } ${isWinningCell(rowIndex, colIndex) ? 'winning' : ''}`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gomoku;