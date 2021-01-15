import { remote } from "electron";
import path from "path";
import client from "../../renderer/feathers";
import reduxAction from "../../renderer/redux/reduxAction";
import store from "../../renderer/redux/stores/renderer";

import { Group, Message, ChatUser } from "../../types/chat";
import getPublicPath from "../electron/getPublicPath";
// import NotificationLogo from "../../assets/images/sidebar-logo.png";

// eslint-disable-next-line
const os = require("os");
const { Notification, app } = remote;
const showChatNotification = (message: Message) => {
  if (os.platform() === "win32") {
    app.setAppUserModelId("Super Reality");
  }
  const notification = {
    title: "Super Reality Message",
    subtitle: message.user.username,
    body: `User: ${message.user.username} 
    ${message.text}`,
    icon: path.join(getPublicPath(), "/icons/logo-os-notification.png"),
  };
  new Notification(notification).show();
};
// chat listeners
// message listeners
// message created listener
const onMessageCreateteListener = (
  newMessage: Message,
  stateMessages: Message[]
) => {
  console.log("message created", newMessage, "messages", stateMessages);
  const newMessages = [...stateMessages, newMessage];

  reduxAction(store.dispatch, { type: "SET_MESSAGES", arg: newMessages });
};
// message updated listener
const onMessageUpdate = (updatedMessage: Message) => {
  reduxAction(store.dispatch, {
    type: "UPDATE_MESSAGE",
    arg: updatedMessage,
  });
};

// user listeners
export const onUserCreatedListener = (
  newUser: ChatUser,
  stateUsers: ChatUser[]
) => {
  const updatedUsers = stateUsers.concat(newUser);
  reduxAction(store.dispatch, {
    type: "SET_USERS",
    arg: updatedUsers,
  });
};
// one of the users in chat updated
const onUpdatedChatUser = (updatedUser: ChatUser) => {
  reduxAction(store.dispatch, {
    type: "UPDATE_CHAT_USERS",
    arg: updatedUser,
  });
};
export const logoutListener = () => {
  console.log("logout");
  reduxAction(store.dispatch, { type: "LOGIN_CHAT_ERROR", arg: null });
  reduxAction(store.dispatch, { type: "SET_MESSAGES", arg: [] });
  reduxAction(store.dispatch, { type: "SET_USERS", arg: [] });
};

// collectives listeners functions
export const onGroupCreatedListener = (newCollective: Group) => {
  reduxAction(store.dispatch, {
    type: "ADD_GROUP",
    arg: newCollective,
  });
};

export const onGroupUpdatedListener = (updatedCollective: Group) => {
  reduxAction(store.dispatch, {
    type: "UPDATE_GROUP",
    arg: updatedCollective,
  });
};

export const onDeleteGroupListener = (deletedCollective: Group) => {
  reduxAction(store.dispatch, {
    type: "DELETE_GROUP",
    arg: deletedCollective,
  });
};

const messagesClient = client.service("messages");
const usersClient = client.service("users");
const groupClient = client.service("collectives");

export const onLogout = () => {
  client.on("logout", () => {
    console.log("logout");
    logoutListener();
  });
};

// chat realtime listeners
export const onAuthenticated = () => {
  // On successfull login
  console.log("authenticated listener");
  client.on("authenticated", (login) => {
    // Get all users and messages
    console.log("authenticated listener start. login:", login);
    Promise.all([
      messagesClient.find({
        query: {
          $sort: { createdAt: -1 },
          $limit: 25,
        },
      }),
      usersClient.find(),
      groupClient.find(),
    ])
      .then(([messagesResult, usersResult, groupsResult]) => {
        // We want the latest messages but in the reversed order
        const uploadedMessages = messagesResult.data.reverse();
        const uploadedUsers = usersResult.data;
        const uploadedGroups = groupsResult.data;
        console.log(
          "login",
          login,
          "messages",
          uploadedMessages,
          "users",
          uploadedUsers,
          "groups",
          uploadedGroups
        );
        // Once both return, update the state
        reduxAction(store.dispatch, {
          type: "SET_CHAT_LOGIN_DATA",
          arg: login,
        });
        reduxAction(store.dispatch, {
          type: "SET_MESSAGES",
          arg: uploadedMessages,
        });
        reduxAction(store.dispatch, {
          type: "SET_USERS",
          arg: uploadedUsers,
        });
        reduxAction(store.dispatch, {
          type: "SET_GROUPS",
          arg: uploadedGroups,
        });
        // chat listeners

        // messages created listener clean up
        messagesClient.off("created", onMessageCreateteListener);
        // add new message to the redux state
        messagesClient.on("created", (message: any) => {
          const { chat } = store.getState();
          onMessageCreateteListener(message, chat.messages);
          showChatNotification(message);
        });
        // edit message listener
        messagesClient.on("patched", (params: any) => {
          console.log("MESSAGE PATCHED EVENT", params);
          onMessageUpdate(params);
        });

        // messages removed listener clean up
        // messagesClient.off("removed", onMessagesUpdateListener);
        messagesClient.on("removed", (message: any) => {
          const { chat } = store.getState();
          console.log("removed", message);
          const updatedMessages = chat.messages.filter(
            ({ _id }) => _id != message._id
          );
          console.log("remove message state", updatedMessages);
          reduxAction(store.dispatch, {
            type: "SET_MESSAGES",
            arg: updatedMessages,
          });
        });

        // users listener clean up
        usersClient.off("created", onUserCreatedListener);
        // Add new users to the user list
        usersClient.on("created", (user: ChatUser) => {
          const { chat } = store.getState();
          onUserCreatedListener(user, chat.users);
        });

        usersClient.off("patched", onUpdatedChatUser);
        usersClient.on("patched", (user: ChatUser) => {
          onUpdatedChatUser(user);
        });

        // collectives listeners
        // collectives listeners clean up
        groupClient.off("created", onGroupCreatedListener);
        groupClient.on("created", (group: Group) => {
          console.log(group);

          onGroupCreatedListener(group);
        });
        // collective updated listener
        groupClient.off("patched", onGroupUpdatedListener);
        groupClient.on("patched", (group: Group) => {
          console.log("patched", group);
          onGroupUpdatedListener(group);
        });
        // collective delete listener
        groupClient.off("removed", onDeleteGroupListener);
        groupClient.on("removed", (group: Group) => {
          console.log("patched", group);
          onDeleteGroupListener(group);
        });
      })
      .catch((err) => {
        console.log("on authenticated", err);
      });
  });
};
