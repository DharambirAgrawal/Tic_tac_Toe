import { io } from "socket.io-client";

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NEXT_PUBLIC_SERVER;

// export const socket = io(URL);

export const socket = io(URL, {
  autoConnect: false,
});

// In that case, you will need to call socket.connect()
// to make the Socket.IO client connect. This can be useful for
//  example when the user must provide some kind of credentials before connecting.
// process.env.NODE_ENV === "production" ? process.env.SERVER : "http://localhost:8080";
