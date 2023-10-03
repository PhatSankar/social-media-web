import React, { memo, useContext } from "react";
import { IMessage } from "../../models/IMessage";
import { Avatar, Typography } from "antd";
import { IUser } from "../../models/IUser";
import { AuthContext } from "../../context/AuthContext";
import "./ChatTile.css";

type ChatTileProps = {
  chat: IMessage;
  profile: IUser;
  userId: string;
};

const { Text } = Typography;

function ChatTile(props: ChatTileProps) {
  const { chat, profile, userId } = props;
  return (
    <div
      style={{
        display: "flex",
        margin: "12px 0px",
        gap: "8px",
        flexDirection: userId === profile.id ? "row-reverse" : "row",
      }}
    >
      <Avatar
        size={"large"}
        src={
          profile?.avatar
            ? `http://${profile.avatar}${
                profile.updated_at ? `?cache=${profile.updated_at}` : ""
              }`
            : require("../../../public/images/default_ava.png")
        }
      />
      <div
        className="bubble_chat"
        style={{
          backgroundColor:
            userId === profile.id ? "rgb(30,144,255)" : "rgba(0, 0, 0, 0.1)",
        }}
      >
        <Text
          style={{
            fontSize: "17px",
            color: userId === profile.id ? "white" : "black",
          }}
        >
          {chat.message}
        </Text>
      </div>
    </div>
  );
}

export default memo(ChatTile);
