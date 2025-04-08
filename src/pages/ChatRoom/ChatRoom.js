import React, { useEffect, useState } from "react";
import socket, { connectSocketWithToken } from "../../components/context/socket";
import "./ChatRoom.css";
import axios from "axios";
import { API_URL, ChatHistoryAPI } from "../../components/api/api";

const ChatRoom = ({ roomId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {

    const fetchHistory = async () => {
    
      const token = localStorage.getItem("token");
      console.log(token)
      try {
        await axios.get(`${ChatHistoryAPI}/${roomId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).then((res) => {
          console.log(res.data)
          const formatted = res.data.messages.map((msg) => ({
            ...msg,
            isSender: msg.senderId === JSON.parse(atob(token.split(".")[1])).id,
          }));
          setMessages(formatted);
        })
        
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };


    connectSocketWithToken();

    console.log(roomId)
    socket.emit("joinRoom", roomId);

    fetchHistory();

    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [roomId]);

  const handleSend = () => {
    if (input.trim()) {
      socket.emit("sendMessage", { roomId, message: input });
      setInput("");
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-card">
        <div className="chat-messages">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`chat-message ${
                msg.isSender ? "sender" : "receiver"
              }`}
            >
              <strong>{msg.senderName}:</strong> {msg.text}
            </div>
          ))}
        </div>
        <div className="chat-input">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
          />
          <button onClick={handleSend}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
