import { useParams } from "react-router-dom";
import ChatRoom from "./ChatRoom";

const ChatRoomWrapper = () => {
  const { roomId } = useParams();
  return <ChatRoom roomId={roomId} />;
};

export default ChatRoomWrapper;
