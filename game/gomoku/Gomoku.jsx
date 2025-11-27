import React, { useState, useCallback } from 'react';
import './Gomoku.scss';

const BOARD_SIZE = 15;
const EMPTY = null;
const BLACK = 'black';
const WHITE = 'white';

const Gomoku = () => {
  const [board, setBoard] = useState(() => 
    Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(EMPTY))
  );
  const [currentPlayer, setCurrentPlayer] = useState(BLACK);
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState([]);

  const checkWinner = useCallback((board, row, col, player) => {
    const directions = [
      [[0, 1], [0, -1]],  // 横向
      [[1, 0], [-1, 0]],  // 纵向
      [[1, 1], [-1, -1]], // 主对角线
      [[1, -1], [-1, 1]]  // 副对角线
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
        return { winner: player, line };
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
    setBoard(newBoard);

    const result = checkWinner(newBoard, row, col, currentPlayer);
    if (result) {
      setWinner(result.winner);
      setWinningLine(result.line);
    } else {
      setCurrentPlayer(currentPlayer === BLACK ? WHITE : BLACK);
    }
  }, [board, currentPlayer, winner, checkWinner]);

  const resetGame = useCallback(() => {
    setBoard(Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(EMPTY)));
    setCurrentPlayer(BLACK);
    setWinner(null);
    setWinningLine([]);
  }, []);

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
              当前玩家: 
              <span className={`player-indicator ${currentPlayer}`}>
                {currentPlayer === BLACK ? '黑棋' : '白棋'}
              </span>
            </div>
          ) : (
            <div className="winner">
              <span className={`player-indicator ${winner}`}>
                {winner === BLACK ? '黑棋' : '白棋'}
              </span>
              获胜！
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
                    cell ? `occupied ${cell}` : ''
                  } ${isWinningCell(rowIndex, colIndex) ? 'winning' : ''}`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  data-row={rowIndex}
                  data-col={colIndex}
                >
                  {cell && (
                    <div className={`stone ${cell}`}>
                      {isWinningCell(rowIndex, colIndex) && (
                        <div className="winning-mark"></div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gomoku;