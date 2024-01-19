"use client";
import Square from "@components/Square";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { socket } from "@app/socket";

const TicTacOnline = () => {
  const router = useRouter();
  const renderFrom = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
  ];

  const [gameState, setGameState] = useState(renderFrom);
  const [currentPlayer, setCurrentPlayer] = useState("circle");
  const [finishedState, setFinishedState] = useState(false);
  const [finishedArrayState, setFinishedArrayState] = useState([]);
  const [playerName, setPlayerName] = useState("");
  const [opponentName, setOpponentName] = useState("");

  const [formState, setFormState] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const [turn, setTurn] = useState("");
  const [opponentActive, setOpponentActive] = useState(true);
  const [noOfPlayers, setNoOfPlayers] = useState(0);

  const handleCancel = (e) => {
    e.preventDefault();
    router.push("/");
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (playerName) {
      socket.connect();
      socket?.on("connect", () => {
        setFormState(false);
        console.log("connected");
        socket?.emit("request_to_play", { playerName: playerName });
        socket.on("opponentNotFound", () => {
          console.log("opponent not found");
          setOpponentName("");
        });
        socket.on("opponentFound", (data) => {
          console.log("opponent found");

          setCurrentPlayer(data.turn);
          setTurn(data.turn);
          if (data.turn == "cross") {
            setIsDisabled(true);
          }
          setOpponentName(data.opponentName);
        });
      });
    } else {
      alert("Enter your name");
    }
  };
  const handleChange = (e) => {
    setPlayerName(e.target.value);
  };

  useEffect(() => {
    console.log("hooooo");
    socket.connect();
    socket.emit("checkNoOfPlayers", "hloo");
    socket.on("no_of_players", (data) => {
      setNoOfPlayers(data);
      socket.disconnect();
    });
  }, []);

  if (formState) {
    return (
      <>
        <div>Online players: {noOfPlayers}</div>
        <form className="w-1/3 bg-white rounded-md">
          <h2>Enter your name</h2>
          <input
            type="text"
            name="name"
            className=" px-5 m-2 border-2 border-black rounded-md"
            onChange={handleChange}
            value={playerName}
          />
          <div className="flex gap-4">
            <button
              className="bg-green-500 text-white px-8 py-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring focus:border-green-300"
              onClick={handleSubmit}
            >
              Okay
            </button>
            <button
              className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring focus:border-red-300"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </>
    );
  }
  if (!opponentName) {
    return (
      <>
        <div>
          <h1 className="texxt-bold text-4xl">Waiting...</h1>
        </div>
      </>
    );
  }
  return (
    <>
      <div
        className={`font-semibold p-4 text-center text-5xl `}
      >{`${currentPlayer} turn`}</div>
      <div>{opponentActive ? "Opponent is online" : "Opponent is offline"}</div>
      <div className="gap-16 flex">
        <span
          className={`border-2 m-2 border-black px-4 ${
            !isDisabled ? "bg-yellow-400" : ""
          }
        `}
        >
          {playerName}
        </span>
        <span
          className={`border-2 m-2 border-black px-4 ${
            isDisabled ? "bg-yellow-400" : ""
          }
        `}
        >
          {opponentName}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-1 bg-black">
        {gameState.map((arr, index1) =>
          arr.map((num, index2) => {
            return (
              <Square
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
                socket={socket}
                isDisabled={isDisabled}
                setIsDisabled={setIsDisabled}
                setOpponentActive={setOpponentActive}
              />
            );
          })
        )}
      </div>
      {finishedState ? (
        <>
          <div className="font-bold rounded-md p-2 m-2 text-center text-5xl">
            {finishedState == "draw" ? (
              <p className="text-yellow-400">Match draw</p>
            ) : (
              <p className="text-green-500">
                {finishedState == turn ? playerName : opponentName} won the game
              </p>
            )}
          </div>
        </>
      ) : (
        ""
      )}
      {opponentName ? (
        <div className="font-bold rounded-md p-2 m-2 text-center text-5xl">
          you are playing against {opponentName}
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default TicTacOnline;
