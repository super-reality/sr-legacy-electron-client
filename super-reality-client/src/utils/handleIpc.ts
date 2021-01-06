import pythonExecute from "../background/pythonExecute";
import client from "../renderer/feathers";
import reduxAction from "../renderer/redux/reduxAction";
import store from "../renderer/redux/stores/renderer";
import {
  IpcMsg,
  ipcMsgCv,
  ipcMsgCvResult,
  IpcMsgPythocExec,
  IpcMsgPythocResponse,
} from "../types/ipc";
import createBackgroundProcess from "./createBackgroundProcess";

import getWindowId from "./electron/getWindowId";
import setFocusable from "./electron/setFocusable";
// import setFocusable from "./electron/setFocusable";
import setMaximize from "./electron/setMaximize";
import setResizable from "./electron/setResizable";
import setTopMost from "./electron/setTopMost";

interface DetachLesson {
  type: "LESSON_VIEW";
  arg: any;
}

interface CreateLesson {
  type: "LESSON_CREATE";
  arg: any;
}

interface DetachSniping {
  type: "SNIPING_TOOL";
  arg: string;
}

export type DetachArg = DetachLesson | DetachSniping | CreateLesson;

/**
 * Utility function to create an ipc listener, removing previous listeners on the same channel, type aware.
 * @param channel IPC channel to listen.
 * @param fn function to execute.
 */
function makeIpcListener<T extends IpcMsg>(
  channel: T["method"],
  fn: (e: Electron.IpcRendererEvent, arg: T["arg"]) => void
): void {
  // eslint-disable-next-line global-require
  const { ipcRenderer } = require("electron");
  ipcRenderer.removeAllListeners(channel);
  ipcRenderer.on(channel, fn);
}

/**
 * Utility function to create an ipc listener for once.
 * @param channel IPC channel to listen.
 * @param fn function to execute.
 */
export function makeIpcListenerOnce<T extends IpcMsg>(
  channel: T["method"] | string
): Promise<T["arg"]> {
  return new Promise((resolve) => {
    // eslint-disable-next-line global-require
    const { ipcRenderer } = require("electron");
    ipcRenderer.once(channel, (e: Electron.IpcRendererEvent, arg: T["arg"]) => {
      resolve(arg);
    });
  });
}

export default function handleIpc(): void {
  console.log("Initialize IPC handlers");
  // eslint-disable-next-line global-require
  const { ipcRenderer } = require("electron");

  // Remove the listeners before initializing to avoid HMR creating duplicate listeners
  ipcRenderer.removeAllListeners("rendererInit");
  ipcRenderer.on("rendererInit", () => {
    console.log("Register on IPC as: renderer");
    ipcRenderer.send("ipc_register", "renderer", getWindowId());
    createBackgroundProcess();
  });

  // message created listener
  const onMessageCreatedListener = (newMessage: any, stateMessages: any[]) => {
    console.log("message created", newMessage, "messages", stateMessages);
    const newMessages = [...stateMessages, newMessage];
    reduxAction(store.dispatch, { type: "SET_MESSAGES", arg: newMessages });
  };
  const logoutListener = () => {
    console.log("logout");
    reduxAction(store.dispatch, { type: "LOGIN_CHAT_ERROR", arg: null });
    reduxAction(store.dispatch, { type: "SET_MESSAGES", arg: [] });
    reduxAction(store.dispatch, { type: "SET_USERS", arg: [] });
  };
  ipcRenderer.removeAllListeners("rendererReady");
  ipcRenderer.on("rendererReady", () => {
    setFocusable(true);
    setTopMost(false);
    setMaximize(true);
    setResizable(false);
    reduxAction(store.dispatch, { type: "SET_READY", arg: true });
    // chat first requests and listeners
    // (client as any)
    //   .authenticate()
    //   .then((res: any) => {
    //     console.log("whohooo chat reAuth login", res);
    //     // reduxAction(dispatch, { type: "LOGIN_CHAT_SUCCES", arg: null });
    //   })
    //   .catch((err: any) => {
    //     console.log("chat jwt login error", err);
    //     (client as any).logout();
    //     // reduxAction(dispatch, { type: "LOGIN_CHAT_ERROR", arg: null });
    //   });
    // client
    //   .service("messages")
    //   .find()
    //   .then((res: any) => {
    //     console.log("test get messages res:", res);
    //   })
    //   .catch((err: any) => {
    //     console.log("test get messages err:", err);
    //   });
    const messagesClient = client.service("messages");
    const usersClient = client.service("users");
    // Promise.all([
    //   messagesClient.find({
    //     query: {
    //       $sort: { createdAt: -1 },
    //       $limit: 25,
    //     },
    //   }),
    //   usersClient.find(),
    // ])
    //   .then(([messagePage, userPage]) => {
    //     // We want the latest messages but in the reversed order
    //     const uploadedMessages = messagePage.data.reverse();
    //     const uploadedUsers = userPage.data;
    //     console.log(
    //       "first time",
    //       "messages",
    //       uploadedMessages,
    //       "users",
    //       uploadedUsers
    //     );
    //     // Once both return, update the state
    //     // reduxAction(dispatch, { type: "SET_CHAT_LOGIN_DATA", arg: login });
    //     reduxAction(store.dispatch, {
    //       type: "SET_MESSAGES",
    //       arg: [...uploadedMessages],
    //     });
    //     reduxAction(store.dispatch, { type: "SET_USERS", arg: [...uploadedUsers] });
    //     // Add new messages to the message list

    //     client.service("messages").on("created", (message: any) => {
    //       onMessageCreatedListener(message, messages);
    //     });
    //   })
    //   .catch((err) => {
    //     console.log("on authenticated", err);
    //   });

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
      ])
        .then(([messagePage, userPage]) => {
          // We want the latest messages but in the reversed order
          const uploadedMessages = messagePage.data.reverse();
          const uploadedUsers = userPage.data;
          console.log(
            "login",
            login,
            "messages",
            uploadedMessages,
            "users",
            uploadedUsers
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
          // chat listeners
          const { chat } = store.getState();
          // messages
          messagesClient.on("created", (message: any) => {
            onMessageCreatedListener(message, chat.messages);
          });
          // Add new users to the user list
          usersClient.on("created", (user: any) => {
            const updatedUsers = chat.users.concat(user);
            reduxAction(store.dispatch, {
              type: "SET_USERS",
              arg: updatedUsers,
            });
          });
        })
        .catch((err) => {
          console.log("on authenticated", err);
        });
    });

    //

    // client.service("messages").on("created", (message: any) => {
    //   console.log("message created", message, "messages", messages);
    //   const newMessages = [...messages, message];
    //   reduxAction(dispatch, { type: "SET_MESSAGES", arg: newMessages });
    // });

    client.on("logout", () => {
      console.log("logout");
      logoutListener();
    });
  });

  ipcRenderer.removeAllListeners("detached");
  ipcRenderer.on("detached", (e: any, arg: DetachArg) => {
    console.log(`Register on IPC as: ${arg.type}`);
    ipcRenderer.send("ipc_register", arg.type, getWindowId());
    reduxAction(store.dispatch, { type: "SET_DETACHED", arg });
  });

  ipcRenderer.removeAllListeners("background");
  ipcRenderer.on("background", (e: any, arg: boolean) => {
    console.log("Register on IPC as background");
    ipcRenderer.send("ipc_register", "background", getWindowId());
    reduxAction(store.dispatch, { type: "SET_BACKGROUND", arg });
  });

  ipcRenderer.removeAllListeners("token");
  ipcRenderer.on("token", (e: any, arg: string) => {
    reduxAction(store.dispatch, { type: "AUTH_TOKEN", arg });
  });

  makeIpcListener<IpcMsgPythocExec>("pythonExec", (e, arg) => {
    console.log("pythonExec", arg);
    pythonExecute(arg);
  });

  makeIpcListener<IpcMsgPythocResponse>("pythonResponse", (e, arg) => {
    console.log("pythonResponse", arg);
  });

  makeIpcListener<ipcMsgCv>("cv", (e, arg) => {
    reduxAction(store.dispatch, {
      type: "SET_BACK",
      arg: { cvTemplates: arg.cvTemplates, cvTo: arg.cvTo },
    });
    reduxAction(store.dispatch, { type: "SET_CV_SETTINGS", arg });
  });

  ipcRenderer.removeAllListeners("cvResult");
  makeIpcListener<ipcMsgCvResult>("cvResult", (e, arg) => {
    console.log("cv pos", { x: arg.x, y: arg.y });
    reduxAction(store.dispatch, { type: "SET_CV_RESULT", arg });
  });
}
