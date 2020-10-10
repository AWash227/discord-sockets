import React, { useEffect, useState, useCallback } from "react";
import socketIoClient from "socket.io-client";
import "./App.css";
const ENDPOINT = "http://192.168.1.80:5000";
const io = socketIoClient(ENDPOINT);
const menu = [{ name: "Scout's Honor" }, { name: "Programmer's Hangout" }];

function App() {
  const [name, setName] = useState("Andrew");
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [nameInput, setNameInput] = useState(name);

  useEffect(() => {
    io.on("chat messages", (myMessages) => {
      setMessages(myMessages);
      console.log(myMessages);
    });
    return () => {
      io.off("chat messages");
    };
  }, []);

  useEffect(() => {
    io.on("chat message", ({ id, name, message }) => {
      setMessages([...messages, { id, name, message }]);
      console.log({ id, name, message });
    });
    return () => {
      io.off("chat message");
    };
  }, [messages]);

  const handleMessageSubmit = (e) => {
    e.preventDefault();
    io.emit("chat message", { name, message: messageInput });
    setMessageInput("");
  };

  const handleNameSubmit = (e) => {
    e.preventDefault();
    io.emit("chat message", {
      name,
      message: `${name} has changed their name to ${nameInput}`,
    });
    setName(nameInput);
  };

  return (
    <div className="App">
      <div className="sidebar">
        <nav>
          <ul className="server-container">
            {menu.map((item) => (
              <li className="server">
                {item.name
                  .split(" ")
                  .map((word) => word[0])
                  .join("")}
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <main className="main">
        <form id="name-input" onSubmit={handleNameSubmit}>
          <input
            placeholder="Name"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
          />
          <button>Change Name</button>
        </form>
        <div className="message-container">
          <ul>
            {messages.map((message) => (
              <li className="message" key={message.id}>
                <div className="message-header">{message.name}</div>
                <div className="message-content">{message.message}</div>
              </li>
            ))}
          </ul>
        </div>
        <form id="message-input" onSubmit={handleMessageSubmit}>
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
          />
        </form>
      </main>
    </div>
  );
}

export default App;
