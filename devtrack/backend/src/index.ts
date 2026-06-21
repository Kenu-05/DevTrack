import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";

import authRoutes from "./routes/auth";
import taskRoutes from "./routes/tasks";

dotenv.config();

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: { origin: process.env.CLIENT_URL || "*" },
});

app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

// Socket.io connection handling — clients join a "project:<id>" room
// to receive live task updates for that project.
io.on("connection", (socket) => {
  socket.on("project:join", (projectId: string) => {
    socket.join(`project:${projectId}`);
  });

  socket.on("disconnect", () => {
    // cleanup happens automatically when socket disconnects
  });
});

// Make io accessible from route handlers if needed:
// app.set("io", io);

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`DevTrack API running on port ${PORT}`);
});

export { app, io };
