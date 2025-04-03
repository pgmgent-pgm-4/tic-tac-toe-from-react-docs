import { useState } from "react";

function Square({ value, isWinningSquare, onSquareClick }) {
  return (
    <button 
      className={isWinningSquare ? "green square" : "square"}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares, i);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner.winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  const boardRows = [];
  for (let i = 0; i < 3; i++) {
    const row = [];
    for (let j = 0; j < 3; j++) {
      const indexOfSquare = j + (i * 3)
      row.push(
        <Square 
          value={squares[indexOfSquare]}
          key={indexOfSquare}
          isWinningSquare={
            winner?.winningSquares 
              ? (winner.winningSquares.includes(indexOfSquare) ? true : false)
              : false
          }
          onSquareClick={() => handleClick(indexOfSquare)}
        ></Square>
      );
    }
    boardRows.push((
      <div className="board-row" key={i}>
        {row}
      </div>
    ));
  };

  return (
    <>
      <div className="status">{status}</div>
      {boardRows}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([{ squares: Array(9).fill(null), moveAsArray: null }]);
  const [currentMove, setCurrentMove] = useState(0);
  const [sortOrder, setSortOrder] = useState("ascending");
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove].squares;

  function handlePlay(nextSquares, index) {
    const nextHistory = [
      ...history.slice(0, currentMove + 1),
      { squares: nextSquares, moveAsArray: mapSquareIndexToRowAndColumn.get(index) }
    ];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function changeSortOrder() {
    setSortOrder(sortOrder === "ascending" ? "descending" : "ascending");
  }  

  const moves = history.map((historyData, move) => {  
    const isAtLastMove = history.squares?.length === (move + 1);
    let description;
    if (isAtLastMove) {
      description = `You are at move #${move} (${historyData.moveAsArray[0]}, ${historyData.moveAsArray[1]})`;
    } else if (move > 0) {
      description = `Go to move #${move} (${historyData.moveAsArray[0]}, ${historyData.moveAsArray[1]})`;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        { isAtLastMove ? (
            <p>{description}</p>
          ) : (
            <button onClick={() => jumpTo(move)}>{description}</button>
          )
        }
      </li>
    );
  });
  const sortedMoves = (sortOrder === "descending") ? moves.reverse() : moves;

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button onClick={() => changeSortOrder()}>Sort {sortOrder === "ascending" ? "descending" : "ascending"}</button>
        <ol>{sortedMoves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        winningSquares: lines[i]
      }
    }
  }
  return null;
}

const mapSquareIndexToRowAndColumn = new Map([
  [0, [1, 1]],
  [1, [1, 2]],
  [2, [1, 3]],
  [3, [2, 1]],
  [4, [2, 2]],
  [5, [2, 3]],
  [6, [3, 1]],
  [7, [3, 2]],
  [8, [3, 3]],
]);
