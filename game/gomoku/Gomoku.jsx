import React, { useState, useEffect } from 'react';
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
      [[0, 1], [0, -1]],  // 水平
      [[1, 0], [-1, 0]],  // 垂直
      [[1, 1], [-1, -1]], // 对角线
      [[1, -1], [-1, 1]]  // 反对角线
    ];

    for (const direction of directions) {
      const line = [[row, col]];
      let count = 1;

      for (const [dr, dc] of direction) {
        let r = row + dr;
        let c = col + dc;
        
        while (
          r >= 0 && r < BOARD_SIZE && 
          c >= 0 && c < BOARD_SIZE && 
          board[r][c] === player
        ) {
          line.push([r, c]);
          count++;
          r += dr;
          c += dc;
        }
      }

      if (count >= 5) {
        return { winner: player, line };
      }
    }

    return { winner: null, line: [] };
  };

  const handleCellClick = (row, col) => {
    if (board[row][col] !== EMPTY || winner) {
      return;
    }

    const newBoard = board.map(r => [...r]);
    newBoard[row][col] = currentPlayer;
    setBoard(newBoard);

    const { winner: gameWinner, line } = checkWinner(newBoard, row, col, currentPlayer);
    
    if (gameWinner) {
      setWinner(gameWinner);
      setWinningLine(line);
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
    <div className="gomoku-game">
      <div className="game-header">
        <h1>五子棋</h1>
        <div className="game-info">
          {!winner ? (
            <div className="current-player">
              当前玩家: 
              <span className={`player-stone ${currentPlayer === BLACK ? 'black' : 'white'}`} />
              <span className="player-name">{currentPlayer === BLACK ? '黑棋' : '白棋'}</span>
            </div>
          ) : (
            <div className="winner-info">
              <span className="winner-text">
                {winner === BLACK ? '黑棋' : '白棋'}获胜！
              </span>
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
                  className={`board-cell ${
                    cell === BLACK ? 'black' : cell === WHITE ? 'white' : ''
                  } ${isWinningCell(rowIndex, colIndex) ? 'winning' : ''}`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                >
                  {cell !== EMPTY && (
                    <div className={`stone ${cell === BLACK ? 'black' : 'white'}`} />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="game-rules">
        <h3>游戏规则</h3>
        <ul>
          <li>黑棋先行，双方轮流在棋盘上落子</li>
          <li>先将五颗棋子连成一线（横、竖、斜均可）的一方获胜</li>
          <li>点击"重新开始"可以开始新游戏</li>
        </ul>
      </div>
    </div>
  );
};

export default Gomoku;