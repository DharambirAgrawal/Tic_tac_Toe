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
  socket,
  isDisabled,
  setIsDisabled,
  setOpponentActive,
}) => {
  const [value, setValue] = useState(null);
  const [state, setState] = useState(false);
  const [match, setMatch] = useState([]);

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
    if (state || finishedState || isDisabled) {
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
      socket.emit("gameState", {
        gameState: newState,
        pos: num,
        player: currentPlayer,
      });
      return [...prev];
    });
    setIsDisabled(true);
    setCurrentPlayer(currentPlayer === "circle" ? "cross" : "circle");
    setState(true);
    // console.log(isDisabled);
  };

  useEffect(() => {
    let winner = checkWinner(gameState);
    const containsArray = finishedArrayState.some(
      (subArray) =>
        subArray.length === num.length &&
        subArray.every((value, index) => value === num[index])
    );
    setMatch(containsArray);

    if (winner === "circle" || winner === "cross" || winner === "draw") {
      setFinishedState(winner);
    }
  }, [gameState, setFinishedState, setGameState]);

  useEffect(() => {
    socket.on("sendingStateFromServer", (data) => {
      let newState = gameState;
      setGameState((prev) => {
        newState = data.gameState;
        return [...prev];
      });

      if (data.player === "circle") {
        if (num[0] == data.pos[0] && num[1] == data.pos[1]) {
          setIsDisabled(false);
          setCurrentPlayer("cross");
          setGameState(data.gameState);
          setState(true);
          setValue(<Circle />);
        }
      } else {
        if (num[0] == data.pos[0] && num[1] == data.pos[1]) {
          setIsDisabled(false);
          setState(true);

          setCurrentPlayer("circle");
          setGameState(data.gameState);

          setValue(<Cross />);
        }
      }
    });
    socket.on("gameLeft", (data) => {
      setIsDisabled(data);
      console.log("hlooo");
      setOpponentActive(false);
    });
  }, [socket]);

  return (
    <div className="bg-white">
      <div
        className={`w-28 h-28 flex items-center justify-center ${
          finishedState || isDisabled ? "cursor-not-allowed" : "cursor-pointer"
        } ${match ? "bg-red-400" : ""}`}
        onClick={handleClick}
      >
        {value}
      </div>
    </div>
  );
};

export default Square;
