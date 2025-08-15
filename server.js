import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import auth_route from './routes/auth_route.js';
// import { rateLimiter } from "./middleware/ratelimiter.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import gossipRoute from './routes/gossips_route.js';
import http from "http";
import { Server } from "socket.io";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cookieParser());
app.use(cors({
  origin: "https://social-app-xi-beryl.vercel.app/",
  credentials: true,
}));

app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://social-app-xi-beryl.vercel.app/",
    methods: ["GET", "POST"],
  },
});


let onlineUsers = [];

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);


  socket.on("userOnline", (user) => {
    if (!onlineUsers.find(u => u._id === user._id)) {
      onlineUsers.push({ ...user, socketId: socket.id });
    }
    io.emit("onlineUsers", onlineUsers);
  });


  socket.on("newGossip", (data) => {
    console.log("New gossip received:", data);
    io.emit("gossipBroadcast", data);
  });

  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter(u => u.socketId !== socket.id);
    io.emit("onlineUsers", onlineUsers);
    console.log(`User disconnected: ${socket.id}`);
  });
});


// app.use(rateLimiter);
app.use("/api/users", auth_route);
app.use("/api/post", gossipRoute);

mongoose
  .connect(process.env.MONGO_URI, { dbName: "social" })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.get("/", (req, res) => {
  res.send("Hello from Express + MongoDB 🚀");
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


