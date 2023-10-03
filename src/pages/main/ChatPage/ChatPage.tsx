import { useContext, useEffect, useState } from "react";
import { IMessage } from "../../../models/IMessage";
import { useLocation, useParams } from "react-router-dom";
import { socket } from "../../../utils/Socket";
import { Avatar, Input, Typography } from "antd";
import { IUser } from "../../../models/IUser";
import { useQuery } from "react-query";
import { AuthContext } from "../../../context/AuthContext";
import UserService from "../../../api/UserService";
import.meta.env;
import "./ChatPage.css";
import ChatTile from "../../../components/ChatTile/ChatTile";
import { SendOutlined } from "@ant-design/icons";
import AlwaysScrollToBottom from "../../../utils/AlwaysScrollToBottom";

const { Text } = Typography;

function ChatPage() {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const { roomId } = useParams();
  const [chat, setChat] = useState("");

  const { state } = useLocation();
  const { currentProfile }: { currentProfile: IUser } = state;
  const { user } = useContext(AuthContext);
  const fetchUserQuery = useQuery({
    queryKey: ["user", user?.id],
    queryFn: () => UserService.fetchUserProfile({ userId: user?.id! }),
    onSuccess: (data) => {},
  });

  useEffect(() => {
    socket.on("connect", () => {
      socket.emit(
        "hello",
        {
          roomId: roomId,
          socketId: socket.id,
        },
        (val: IMessage[]) => {
          setMessages(val);
        }
      );
    });

    socket.on("chat", (e) => {
      setMessages((prev) => [...prev, e]);
      setChat("");
    });

    socket.connect();

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("chat");
      socket.off("hello");

      socket.disconnect();
    };
  }, []);

  return (
    <div className="chat_container">
      <div className="header_chat">
        <Avatar
          size={"large"}
          src={
            currentProfile?.avatar
              ? `http://${currentProfile.avatar}${
                  currentProfile.updated_at
                    ? `?cache=${currentProfile.updated_at}`
                    : ""
                }`
              : require("../../../../public/images/default_ava.png")
          }
        />
        <Text strong style={{ fontSize: "24px" }}>
          {currentProfile.name}
        </Text>
      </div>
      <div style={{ flex: 1, overflow: "scroll" }}>
        {fetchUserQuery.isLoading ? (
          <></>
        ) : (
          <>
            {messages.map((item) => (
              <ChatTile
                chat={item}
                key={item._id}
                profile={
                  item.userId === currentProfile.id
                    ? currentProfile
                    : fetchUserQuery.data?.at(0)!
                }
                userId={fetchUserQuery.data?.at(0)?.id!}
              />
            ))}
            <AlwaysScrollToBottom messages={messages} />
          </>
        )}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "8px",
        }}
      >
        <Input
          placeholder="Enter your message"
          value={chat}
          style={{
            fontSize: "17px",
            borderRadius: "15px",
          }}
          onChange={(e) => setChat(e.target.value)}
        />
        <SendOutlined
          style={{
            fontSize: "20px",
            color: chat.length !== 0 ? "blue" : "gray",
          }}
          onClick={
            chat.length !== 0
              ? () => {
                  socket.emit("chat", {
                    message: chat,
                    userId: user?.id,
                    roomId: roomId,
                  });
                }
              : undefined
          }
        />
      </div>
    </div>
  );
}

export default ChatPage;
