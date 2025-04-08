import { io } from "socket.io-client";
import { API_URL } from "../api/api";


const socket = io(API_URL, {
  autoConnect: false, // Important: don’t connect right away
  transports: ["websocket"], // Optional but recommended for stability
});

// Function to manually attach token and connect
export const connectSocketWithToken = () => {
  const token = localStorage.getItem("token");
  if (token) {
    socket.auth = { token };
    socket.connect();
  }
};

export default socket;
