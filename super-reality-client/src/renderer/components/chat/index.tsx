import React from "react";
import { useSelector } from "react-redux";
import Login from "./login-chat";
import Chat from "./chat";
import { AppState } from "../../redux/stores/renderer";

export default function ChatApplication() {
  const { isChatAuth, messages, users } = useSelector(
    (state: AppState) => state.chat
  );
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   const messagesClient = client.service("messages");
  //   const usersClient = client.service("users");

  //   // Try to authenticate with the JWT stored in localStorage
  //   // client.authenticate().catch((err) => {
  //   //   const token = localStorage.getItem("token");
  //   //   console.log("token", token, "err authent", err);

  //   //   setChatState({ login: null });
  //   // });

  //   // On logout reset all all local state (which will then show the login screen)
  // }, []);

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
