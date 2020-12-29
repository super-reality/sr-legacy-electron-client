import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Login from "./login-chat";
import Chat from "./chat";
import client from "./feathers";
import reduxAction from "../../redux/reduxAction";
import { AppState } from "../../redux/stores/renderer";

export default function ChatApplication() {
  const { isChatAuth, messages, users } = useSelector(
    (state: AppState) => state.chat
  );
  const dispatch = useDispatch();

  const logoutListener = () => {
    console.log("logout");
    reduxAction(dispatch, { type: "LOGIN_CHAT_ERROR", arg: null });
    reduxAction(dispatch, { type: "SET_MESSAGES", arg: [] });
    reduxAction(dispatch, { type: "SET_USERS", arg: [] });
  };
  useEffect(() => {
    const messagesClient = client.service("messages");
    const usersClient = client.service("users");

    // Try to authenticate with the JWT stored in localStorage
    // client.authenticate().catch((err) => {
    //   const token = localStorage.getItem("token");
    //   console.log("token", token, "err authent", err);

    //   setChatState({ login: null });
    // });

    // On logout reset all all local state (which will then show the login screen)
    client.on("logout", () => {
      console.log("logout");
      logoutListener();
    });

    // Add new messages to the message list
    messagesClient.on("created", async (message: any) => {
      console.log("message created", message);
      const newMessages = messages.concat(message);
      reduxAction(dispatch, { type: "SET_MESSAGES", arg: newMessages });
    });

    // Add new users to the user list
    usersClient.on("created", (user: any) => {
      const updatedUsers = users.concat(user);
      reduxAction(dispatch, { type: "SET_USERS", arg: updatedUsers });
    });
  }, []);

  return (
    <div>
      {!isChatAuth ? (
        <main className="container text-center">
          <Login />
        </main>
      ) : (
        <Chat messages={messages} users={users} />
      )}
    </div>
  );
}
