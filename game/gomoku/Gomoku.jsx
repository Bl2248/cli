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
        return { hasWon: true, winningLine: line };
      }
    }
    
    return { hasWon: false, winningLine: [] };
  }, []);

  const handleCellClick = useCallback((row, col) => {
    if (board[row][col] !== EMPTY || winner) {
      return;
    }

    const newBoard = board.map(row => [...row]);
    newBoard[row][col] = currentPlayer;
    
    const { hasWon, winningLine } = checkWinner(newBoard, row, col, currentPlayer);
    
    if (hasWon) {
      setWinner(currentPlayer);
      setWinningLine(winningLine);
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

  const getCellClassName = (row, col) => {
    const baseClass = 'cell';
    const playerClass = board[row][col] === BLACK ? 'black' : 
                       board[row][col] === WHITE ? 'white' : '';
    const isWinningCell = winningLine.some(([r, c]) => r === row && c === col);
    const winningClass = isWinningCell ? 'winning' : '';
    
    return [baseClass, playerClass, winningClass].filter(Boolean).join(' ');
  };

  const getPlayerDisplay = () => {
    if (winner) {
      return winner === BLACK ? '黑棋获胜！' : '白棋获胜！';
    }
    return currentPlayer === BLACK ? '黑棋回合' : '白棋回合';
  };

  return (
    <div className="gomoku-container">
      <div className="game-header">
        <h1>五子棋</h1>
        <div className="game-info">
          <div className={`player-display ${winner ? 'winner' : ''}`}>
            {getPlayerDisplay()}
          </div>
          <button className="reset-button" onClick={resetGame}>
            重新开始
          </button>
        </div>
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
                  data-row={rowIndex}
                  data-col={colIndex}
                />
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