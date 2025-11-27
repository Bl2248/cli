import React, { useState, useEffect } from 'react';
import './Gomoku.scss';

const BOARD_SIZE = 15;
const EMPTY = null;
const BLACK = 'black';
const WHITE = 'white';

const Gomoku = () => {
  const [board, setBoard] = useState(Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(EMPTY)));
  const [currentPlayer, setCurrentPlayer] = useState(BLACK);
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState([]);

  const checkWinner = (board, row, col, player) => {
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
        return line;
      }
    }
    
    return null;
  };

  const handleCellClick = (row, col) => {
    if (board[row][col] !== EMPTY || winner) {
      return;
    }

    const newBoard = board.map((r, rowIndex) =>
      r.map((cell, colIndex) => {
        if (rowIndex === row && colIndex === col) {
          return currentPlayer;
        }
        return cell;
      })
    );

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

  const getCellClassName = (row, col) => {
    const cellValue = board[row][col];
    const isWinningCell = winningLine.some(([r, c]) => r === row && c === col);
    
    let className = 'cell';
    if (cellValue) {
      className += ` ${cellValue}`;
      if (isWinningCell) {
        className += ' winning';
      }
    }
    
    return className;
  };

  return (
    <div className="gomoku-game">
      <div className="game-header">
        <h1>五子棋</h1>
        <div className="game-info">
          {!winner ? (
            <div className="current-player">
              当前玩家: <span className={`player-indicator ${currentPlayer}`}></span>
              {currentPlayer === BLACK ? '黑棋' : '白棋'}
            </div>
          ) : (
            <div className="winner">
              <span className={`player-indicator ${winner}`}></span>
              {winner === BLACK ? '黑棋' : '白棋'} 获胜！
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
                  className={getCellClassName(rowIndex, colIndex)}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                >
                  {cell && <div className="piece"></div>}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      
      <div className="game-rules">
        <h3>游戏规则</h3>
        <ul>
          <li>黑棋先行，双方轮流落子</li>
          <li>先在横、竖、斜方向连成五子者获胜</li>
          <li>点击棋盘空白处落子</li>
        </ul>
      </div>
    </div>
  );
};

export default Gomoku;