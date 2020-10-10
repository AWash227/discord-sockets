const app = require("express")();
const cors = require("cors");
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const { v4: uuidv4 } = require("node-uuid");

app.use(cors());

app.get("/", (req, res) => {
  return res.sendFile(__dirname + "/index.html");
});

let messages = [];

const homeroom = io.of("/homeroom");

io.on("connection", (socket) => {
  console.log("A user has connected");
  socket.emit("chat messages", messages);
  socket.on("disconnect", () => {
    console.log("A user has disconnected");
  });
  socket.on("chat message", ({ name, message }) => {
    const id = uuidv4();
    console.log({ id, name, message });
    messages.push({ id, name, message });
    io.emit("chat message", { id, name, message });
  });
  socket.on("change name", ({ oldName, newName }) => {
    io.emit("change name", { oldName, newName });
  });
});

http.listen(5000, () => console.log("App is listening on port 3000"));
