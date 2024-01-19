import express from "express";
import http from "http"; // Import the http module
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
// Load environment variables from .env file
const app = express();
const server = http.createServer(app); // Create an http server using the express app
dotenv.config();

const corsOptions = {
  origin: process.env.CLIENT, // Replace with your allowed origin
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // Allow sending cookies across domains
  optionsSuccessStatus: 204, // Respond with a 204 status for preflight requests
};

// Enable CORS for socket.io with specific options
app.use(cors(corsOptions));

const io = new Server(server, {
  headers: {
    "user-agent": "Mozilla",
  },
  cors: process.env.CLIENT,
}); // Pass the http server to socket.io

const allUsers = {};

io.on("connection", (socket) => {
  console.log("user connected " + socket.id);
  allUsers[socket.id] = {
    socket: socket,
    online: true,
    playing: false,
  };

  socket.on("checkNoOfPlayers", () => {
    // console.log(Object.keys(allUsers).length);
    let NoOfPlayers = Object.keys(allUsers).length;
    socket.emit("no_of_players", NoOfPlayers);
  });
  // Listen for 'request_to_play' on the specific socket
  socket.on("request_to_play", (data) => {
    let opponentPlayer;
    const currentUser = allUsers[socket.id];
    currentUser.playerName = data.playerName;

    for (const key in allUsers) {
      const user = allUsers[key];
      if (user.online && !user.playing && socket.id !== key) {
        opponentPlayer = user;

        break;
      }
    }

    if (opponentPlayer) {
      console.log("opponent found");
      allUsers[currentUser.socket.id].playing = true;
      allUsers[opponentPlayer.socket.id].playing = true;
      allUsers[currentUser.socket.id].opponentId = opponentPlayer.socket.id;
      allUsers[opponentPlayer.socket.id].opponentId = currentUser.socket.id;

      currentUser.socket.emit("opponentFound", {
        turn: "circle",
        opponentName: opponentPlayer.playerName,
      });
      opponentPlayer.socket.emit("opponentFound", {
        turn: "cross",
        opponentName: currentUser.playerName,
      });
      currentUser.socket.on("gameState", (data) => {
        opponentPlayer.socket.emit("sendingStateFromServer", data);
      });

      opponentPlayer.socket.on("gameState", (data) => {
        currentUser.socket.emit("sendingStateFromServer", data);
      });
    } else {
      currentUser.socket.emit("opponentNotFound");
      console.log("opponent not found");
    }
  });

  // Listen for 'disconnect' on the specific socket
  socket.on("disconnect", () => {
    console.log("user disconnected ");
    const currentUser = allUsers[socket.id];

    const id = currentUser.socket.id;
    currentUser.online = false;

    if (allUsers[id].opponentId) {
      let opponent = allUsers[allUsers[id].opponentId];
      //here i gave the opponent empty string so when first left and second is going to left the sever doesnt crashes as it will have opponent id but opponent left the games
      opponent.opponentId = "";
      opponent.socket.emit("gameLeft", true);
    }
    delete allUsers[id];
  });
});

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log(`SERVER IS RUNNING ON PORT ${PORT}`);
});
