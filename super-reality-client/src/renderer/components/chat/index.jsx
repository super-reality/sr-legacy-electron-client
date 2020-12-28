import React, { useEffect, useState } from "react";
import Login from "./login";
import Chat from "./chat";
import client from "./feathers";

export default function ChatApplication() {
  const [chatState, setChatState] = useState({});

  useEffect(() => {
    const messagesClient = client.service("messages");
    const usersClient = client.service("users");

    // Try to authenticate with the JWT stored in localStorage
    client.authenticate().catch(() => setChatState({ login: null }));

    // On successfull login
    client.on("authenticated", (login) => {
      // Get all users and messages
      Promise.all([
        messagesClient.find({
          query: {
            $sort: { createdAt: -1 },
            $limit: 25,
          },
        }),
        usersClient.find(),
      ]).then(([messagePage, userPage]) => {
        // We want the latest messages but in the reversed order
        const messages = messagePage.data.reverse();
        const users = userPage.data;

        // Once both return, update the state
        setChatState({ login, ...messages, ...users });
      });
    });

    // On logout reset all all local state (which will then show the login screen)
    client.on("logout", () => {
      setChatState({
        login: null,
        messages: null,
        users: null,
      });
    });

    // Add new messages to the message list
    messagesClient.on("created", (message) => {
      const { messages } = chatState;
      setChatState({
        messages: messages.concat(message),
      });
    });

    // Add new users to the user list
    usersClient.on("created", (user) => {
      const { users } = chatState;
      setChatState({
        users: users.concat(user),
      });
    });
  }, []);

  const { login, messages, users } = chatState;
  return (
    <div>
      {login == undefined ? (
        <main className="container text-center">
          <h1>Loading...</h1>
        </main>
      ) : (
        <Chat messages={messages} users={users} />
      )}
      <Login />;
    </div>
  );
}
