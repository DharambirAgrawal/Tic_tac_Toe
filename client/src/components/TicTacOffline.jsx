"use client";
import SquareOffline from "@components/SquareOffline";
import { useState } from "react";
const TicTacOffline = () => {
  const renderFrom = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
  ];

  const [gameState, setGameState] = useState(renderFrom);
  const [currentPlayer, setCurrentPlayer] = useState("circle");
  const [finishedState, setFinishedState] = useState(false);
  const [finishedArrayState, setFinishedArrayState] = useState([]);

  return (
    <>
      <div className="font-semibold p-4 text-center text-5xl ">{`${currentPlayer} turn`}</div>
      <div className="grid grid-cols-3 gap-1 bg-black  ">
        {gameState.map((arr, index1) =>
          arr.map((num, index2) => {
            return (
              <SquareOffline
                id={num}
                key={`${index1}-${index2}`}
                num={[index1, index2]}
                currentPlayer={currentPlayer}
                setCurrentPlayer={setCurrentPlayer}
                gameState={gameState}
                setGameState={setGameState}
                finishedState={finishedState}
                setFinishedState={setFinishedState}
                setFinishedArrayState={setFinishedArrayState}
                finishedArrayState={finishedArrayState}
              />
            );
          })
        )}
      </div>
      {finishedState ? (
        <>
          <div className="font-bold rounded-md p-2 m-2 text-center text-5xl ">
            {finishedState == "draw" ? (
              <p className="text-yellow-400">Match draw</p>
            ) : (
              <p className="text-green-500">{finishedState} won the game</p>
            )}
          </div>
        </>
      ) : (
        ""
      )}
    </>
  );
};

export default TicTacOffline;
