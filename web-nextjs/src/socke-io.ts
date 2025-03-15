import { io } from "socket.io-client";

// Parei em 23:38

export const socket = io("http://localhost:3000", {
  autoConnect: false,
});
