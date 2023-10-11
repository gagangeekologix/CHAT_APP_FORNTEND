const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");
const app = express();
const socket = require("socket.io");
require("dotenv").config();
app.use(cors());
app.use(express.json());
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connetion Successfull");
  })
  .catch((err) => {
    console.log(err.message);
  });
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
const server = app.listen(process.env.PORT, () =>
  console.log(`Server started on ${process.env.PORT}`)
);
app.post('/api/send-message-to-all', (req, res) => {
  const message = req.body.message;

  // Broadcast the message to all connected clients
  io.emit('broadcast-message', message);

  res.status(200).json({ message: 'Message sent to all users' });
});
const io = socket(server, {
  cors: {
    origin: [
      "https://chat-app-frontend-d748.onrender.com",
      "https://chat-app-38ede.web.app",
      "http://localhost:3000",
      "http://192.168.1.67:3000"
    ],
    credentials: true,
  },
});
global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });
  socket.on("send-msg", (data) => {
    console.log(data)
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      console.log(sendUserSocket)
      socket.to(sendUserSocket).emit("msg-recieve", data);
    }
  });
});