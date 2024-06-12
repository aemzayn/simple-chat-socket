import { Server } from "socket.io";
import type { Server as HttpServer } from "http";

export default function initSocketServer(server: HttpServer) {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("New connection", socket.id);

    socket.on("join", (room: string) => {
      console.log(`User ${socket.id} joined room ${room}`);
      socket.join(room);
    });

    socket.on("disconnect", () => {
      console.log("User leaved", socket.id);
    });

    socket.on("message", (room, message) => {
      console.log("Message received", message);
      io.to(room).emit("message", message);
    });
  });
}
