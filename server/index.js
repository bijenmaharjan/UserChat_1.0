const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const app = express();
const server = http.createServer(app);
const port = 3000;

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World");
});

io.on("connection", (socket) => {
  console.log("user connected", socket.id);

  socket.on("disconnect", () => {
    console.log("user disconnect", socket.id);
  });

  socket.on("message", ({ room, message }) => {
    io.to(room).emit("receiver-message", message);
    console.log(room, message);
    // socket.emit("welcome", "welcome to the server");
    // socket.broadcast.emit("welcome", `${socket.id} joined the server`);
  });

  socket.on("join-room", (room) => {
    socket.join(room);
    console.log(room);
  });
});

server.listen(port, (err) => {
  console.log(`Server is connected at port:${port}` || err);
});
