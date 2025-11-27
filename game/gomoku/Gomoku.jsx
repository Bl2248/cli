import React, { useState, useCallback } from 'react';
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

  const checkWinner = useCallback((newBoard, row, col, player) => {
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
          newBoard[r][c] === player
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
  }, []);

  const handleCellClick = useCallback((row, col) => {
    if (board[row][col] !== EMPTY || winner) {
      return;
    }

    const newBoard = board.map(r => [...r]);
    newBoard[row][col] = currentPlayer;
    
    const winLine = checkWinner(newBoard, row, col, currentPlayer);
    
    if (winLine) {
      setWinner(currentPlayer);
      setWinningLine(winLine);
    }
    
    setBoard(newBoard);
    setCurrentPlayer(currentPlayer === BLACK ? WHITE : BLACK);
  }, [board, currentPlayer, winner, checkWinner]);

  const resetGame = useCallback(() => {
    setBoard(Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(EMPTY)));
    setCurrentPlayer(BLACK);
    setWinner(null);
    setWinningLine([]);
  }, []);

  const isWinningCell = useCallback((row, col) => {
    return winningLine.some(([r, c]) => r === row && c === col);
  }, [winningLine]);

  return (
    <div className="gomoku-container">
      <div className="game-header">
        <h1>五子棋</h1>
        <div className="game-info">
          {!winner ? (
            <div className="current-player">
              当前玩家: <span className={`player-${currentPlayer === BLACK ? 'black' : 'white'}`}>
                {currentPlayer === BLACK ? '黑棋' : '白棋'}
              </span>
            </div>
          ) : (
            <div className="winner">
              <span className={`player-${winner === BLACK ? 'black' : 'white'}`}>
                {winner === BLACK ? '黑棋' : '白棋'}
              </span> 获胜！
            </div>
          )}
        </div>
        <button className="reset-button" onClick={resetGame}>
          重新开始
        </button>
      </div>
      
      <div className="board-container">
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
                  data-position={`${rowIndex}-${colIndex}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gomoku;