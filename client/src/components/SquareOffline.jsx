"use client";
import { useState, useEffect } from "react";

import Circle from "./Circle";
import Cross from "./Cross";

const Square = ({
  id,
  num,
  currentPlayer,
  setCurrentPlayer,
  gameState,
  setGameState,
  finishedState,
  setFinishedState,
  setFinishedArrayState,
  finishedArrayState,
}) => {
  const [value, setValue] = useState(null);
  const [state, setState] = useState(false);

  function checkWinner(board) {
    // Check rows and columns
    for (let i = 0; i < 3; i++) {
      if (board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
        setFinishedArrayState([
          [i, 0],
          [i, 1],
          [i, 2],
        ]);
        return board[i][i]; // Return the winning player ('X' or 'O')
      }
      if (board[0][i] === board[1][i] && board[1][i] === board[2][i]) {
        setFinishedArrayState([
          [0, i],
          [1, i],
          [2, i],
        ]);
        return board[i][i];
      }
    }

    // Check diagonals
    if (board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
      setFinishedArrayState([
        [0, 0],
        [1, 1],
        [2, 2],
      ]);
      return board[1][1];
    }
    if (board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
      setFinishedArrayState([
        [0, 2],
        [1, 1],
        [2, 0],
      ]);
      return board[1][1];
    }
    const isDrawMatch = gameState.flat().every((e) => {
      if (e === "circle" || e === "cross") return "draw";
    });
    if (isDrawMatch) return "draw";
    // No winner yet
    return null;
  }

  const handleClick = () => {
    if (state || finishedState) {
      return;
    }
    if (currentPlayer === "circle") {
      setValue(<Circle />);
    } else {
      setValue(<Cross />);
    }

    let newState = gameState;
    setGameState((prev) => {
      newState[num[0]][num[1]] = currentPlayer;

      return [...prev];
    });

    setCurrentPlayer(currentPlayer === "circle" ? "cross" : "circle");
    setState(true);
    // console.log(isDisabled);
  };

  useEffect(() => {
    let winner = checkWinner(gameState);

    if (winner === "circle" || winner === "cross" || winner === "draw") {
      setFinishedState(winner);
    }
  }, [gameState, setFinishedState, setGameState]);
  const containsArray = finishedArrayState.some(
    (subArray) =>
      subArray.length === num.length &&
      subArray.every((value, index) => value === num[index])
  );
  return (
    <div className="bg-white">
      <div
        className={`w-28 h-28 flex items-center justify-center ${
          finishedState ? "cursor-not-allowed" : "cursor-pointer"
        } ${containsArray ? "bg-red-400" : ""}`}
        onClick={handleClick}
      >
        {value}
      </div>
    </div>
  );
};

export default Square;
