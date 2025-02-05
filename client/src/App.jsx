import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Container from "@mui/material/Container";
import {
  Button,
  TextField,
  Typography,
  Box,
  Paper,
  Stack,
} from "@mui/material";

const App = () => {
  const [messages, setMessages] = useState([]); // Stores received messages
  const [inputMessage, setInputMessage] = useState(""); // Stores user input message
  const [socket, setSocket] = useState(null);
  const [socketId, setSocketId] = useState("");
  const [room, setRoom] = useState("");
  const [roomName, setRoomName] = useState("");

  useEffect(() => {
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected:", newSocket.id);
      setSocketId(newSocket.id);
    });

    newSocket.on("receiver-message", (payload) => {
      setMessages((prevMessages) => [...prevMessages, payload]); // Store messages properly
    });

    return () => {
      newSocket.disconnect();
      console.log("Socket disconnected");
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (socket && inputMessage.trim() !== "") {
      socket.emit("message", { room, message: inputMessage }); // Send only inputMessage
      setInputMessage(""); // Clear input field after sending
    }
  };

  const joinhandleSubmit = (e) => {
    e.preventDefault();
    if (socket) {
      socket.emit("join-room", roomName);
      console.log(`Joined room: ${roomName}`);
      setRoomName("");
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, mt: 5, textAlign: "center" }}>
        <Typography variant="h4" component="div" gutterBottom>
          Welcome to ChatApp
        </Typography>

        <Typography variant="h6" component="div" gutterBottom>
          {`ID: ${socketId}`}
        </Typography>

        {/* Join Room Input and Button in a Single Line */}
        <form onSubmit={joinhandleSubmit}>
          <h1>Join Room</h1>
          <Box display="flex" alignItems="center" gap={1}>
            <TextField
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              label="Room Name"
              variant="outlined"
              fullWidth
            />
            <Button type="submit" variant="contained" color="primary">
              Join
            </Button>
          </Box>
        </form>

        {/* Message Input and Send Button */}
        <form onSubmit={handleSubmit}>
          <Box display="flex" flexDirection="column" gap={2} mt={2}>
            <TextField
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              label="Room"
              variant="outlined"
              fullWidth
            />

            <TextField
              value={inputMessage} // Use inputMessage instead of messages array
              onChange={(e) => setInputMessage(e.target.value)}
              label="Enter message"
              variant="outlined"
              fullWidth
            />

            <Button type="submit" variant="contained" color="primary">
              Send
            </Button>
          </Box>
        </form>

        {/* Display Messages */}
        <Stack>
          {messages.map((msg, index) => (
            <Typography key={index} variant="h6" component="div" gutterBottom>
              {msg}
            </Typography>
          ))}
        </Stack>
      </Paper>
    </Container>
  );
};

export default App;
