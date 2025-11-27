import React, { useState, useCallback } from 'react';
import './gomoku.scss';

const BOARD_SIZE = 15;
const EMPTY = null;
const BLACK = 'black';
const WHITE = 'white';

const Gomoku = () => {
  const [board, setBoard] = useState(() => 
    Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(EMPTY))
  );
  const [currentPlayer, setCurrentPlayer] = useState(BLACK);
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState([]);

  const checkWinner = useCallback((board, row, col, player) => {
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
              <span>当前玩家: </span>
              <span className={`player-stone ${currentPlayer}`}></span>
              <span className="player-name">{currentPlayer === BLACK ? '黑棋' : '白棋'}</span>
            </div>
          ) : (
            <div className="winner-info">
              <span>游戏结束! </span>
              <span className={`player-stone ${winner}`}></span>
              <span className="winner-name">{winner === BLACK ? '黑棋' : '白棋'}获胜!</span>
            </div>
          )}
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
                  className={`cell ${
                    cell !== EMPTY ? `occupied ${cell}` : ''
                  } ${isWinningCell(rowIndex, colIndex) ? 'winning' : ''}`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  data-position={`${rowIndex},${colIndex}`}
                >
                  {cell !== EMPTY && (
                    <div className={`stone ${cell}`}></div>
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