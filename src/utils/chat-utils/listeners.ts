import { remote } from "electron";
import os from "os";
import path from "path";
import client from "../../renderer/feathers";
import reduxAction from "../../renderer/redux/reduxAction";
import store from "../../renderer/redux/stores/renderer";

import { Group, Message, ChatUser, Channel, Category } from "../../types/chat";
import getPublicPath from "../electron/getPublicPath";
import {
  categoryClient,
  channelsClient,
  groupClient,
  messagesClient,
  usersClient,
} from "./services";

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
const onMessageCreateListener = (newMessage: Message) => {
  console.log("message created", newMessage);

  reduxAction(store.dispatch, { type: "ADD_MESSAGE", arg: newMessage });
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

// group listeners functions
export const onGroupCreatedListener = (newGroup: Group) => {
  reduxAction(store.dispatch, {
    type: "ADD_GROUP",
    arg: newGroup,
  });
};

export const onGroupUpdatedListener = (updatedGroup: Group) => {
  reduxAction(store.dispatch, {
    type: "UPDATE_GROUP",
    arg: updatedGroup,
  });
};

export const onDeleteGroupListener = (deletedGroup: Group) => {
  reduxAction(store.dispatch, {
    type: "DELETE_GROUP",
    arg: deletedGroup,
  });
};

// categories listeners
export const onCategoryCreatedListener = (newCategory: Category) => {
  console.log(newCategory);
  reduxAction(store.dispatch, {
    type: "ADD_CATEGORY",
    arg: newCategory,
  });
};

export const onCategoryUpdatedListener = (updatedCategory: Category) => {
  reduxAction(store.dispatch, {
    type: "UPDATE_CATEGORY",
    arg: updatedCategory,
  });
};

export const onDeleteCategoryListener = (deletedCategory: Category) => {
  reduxAction(store.dispatch, {
    type: "DELETE_CATEGORY",
    arg: deletedCategory._id,
  });
};
// channels listeners
const onChannelCreatedListener = (newChannel: Channel) => {
  reduxAction(store.dispatch, {
    type: "ADD_CHANNEL",
    arg: newChannel,
  });
};

const onChannelUpdateListener = (updatetedChannel: Channel) => {
  reduxAction(store.dispatch, {
    type: "UPDATE_CHANNEL",
    arg: updatetedChannel,
  });
};

const onChannelDeleteListener = (deletedChannel: Channel) => {
  reduxAction(store.dispatch, {
    type: "DELETE_CHANNEL",
    arg: deletedChannel,
  });
};
// chat realtime listeners
// on loguot listener
export const onLogout = () => {
  client.on("logout", () => {
    console.log("logout");
    logoutListener();
  });
};

export const onAuthenticated = () => {
  // On successfull login
  console.log("authenticated listener");
  client.on("authenticated", (login: any) => {
    // Get all users and messages
    console.log("authenticated listener start. login:", login);
    Promise.all([
      usersClient.find(),
      groupClient.find(),
      categoryClient.find(),
      channelsClient.find(),
    ])
      .then(([usersResult, groupsResult, categoryResult, channelsResult]) => {
        const uploadedUsers = usersResult.data;
        const uploadedGroups = groupsResult.data;
        const uploadedCategories = categoryResult.data;
        console.log(
          "login",
          login,
          "users",
          uploadedUsers,
          "groups",
          uploadedGroups,
          "categories",
          categoryResult,
          "channels",
          channelsResult
        );
        // Once both return, update the state
        reduxAction(store.dispatch, {
          type: "SET_CHAT_LOGIN_DATA",
          arg: login,
        });

        reduxAction(store.dispatch, {
          type: "SET_USERS",
          arg: uploadedUsers,
        });
        reduxAction(store.dispatch, {
          type: "SET_GROUPS",
          arg: uploadedGroups,
        });
        reduxAction(store.dispatch, {
          type: "SET_ACTIVE_GROUP",
          arg: uploadedGroups[0]._id,
        });
        reduxAction(store.dispatch, {
          type: "SET_CATEGORIES",
          arg: uploadedCategories,
        });
        reduxAction(store.dispatch, {
          type: "SET_CHANNELS",
          arg: channelsResult,
        });
        reduxAction(store.dispatch, {
          type: "SET_ACTIVE_CHANNEL",
          arg: channelsResult.data[9]._id,
        });
        // chat listeners

        // messages created listener clean up
        messagesClient.off("created", onMessageCreateListener);
        // add new message to the redux state
        messagesClient.on("created", (message: any) => {
          onMessageCreateListener(message);
          showChatNotification(message);
        });
        // edit message listener
        messagesClient.off("patched", onMessageUpdate);
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

          reduxAction(store.dispatch, {
            type: "SET_MESSAGES",
            arg: updatedMessages,
          });
        });
        console.log("listeners test");
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

        // groups listeners
        // groups created listeners
        groupClient.off("created", onGroupCreatedListener);
        groupClient.on("created", (group: Group) => {
          console.log("group created", group);

          onGroupCreatedListener(group);
        });
        // groups updated listener
        groupClient.off("patched", onGroupUpdatedListener);
        groupClient.on("patched", (group: Group) => {
          console.log("patched", group);
          onGroupUpdatedListener(group);
        });
        // groups delete listener
        groupClient.off("removed", onDeleteGroupListener);
        groupClient.on("removed", (group: Group) => {
          console.log("deleted", group);
          onDeleteGroupListener(group);
        });

        // categories listeners
        // categories created listener
        categoryClient.off("created", onCategoryCreatedListener);
        categoryClient.on("created", onCategoryCreatedListener);

        // categories updated listener
        categoryClient.off("patched", onCategoryUpdatedListener);
        categoryClient.on("patched", onCategoryUpdatedListener);

        // categories deleted listener
        categoryClient.off("removed", onDeleteCategoryListener);
        categoryClient.on("removed", onDeleteCategoryListener);

        // channels listeners
        // channels created listeners
        channelsClient.off("created", onChannelCreatedListener);
        channelsClient.on("created", (channel: Channel) => {
          onChannelCreatedListener(channel);
        });
        // channels updated listener
        channelsClient.off("patched", onChannelUpdateListener);
        channelsClient.on("patched", (channel: Channel) => {
          console.log(channel);
          onChannelUpdateListener(channel);
        });
        // channels delete listener
        channelsClient.off("removed", onChannelDeleteListener);
        channelsClient.on("removed", (channel: Channel) => {
          onChannelDeleteListener(channel);
        });
      })
      .catch((err) => {
        console.log("on authenticated", err);
      });
  });
};
