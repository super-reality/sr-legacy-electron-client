import io from "socket.io-client";
import feathers from "@feathersjs/client";

// Socket.io is exposed as the `io` global.
const socket = io("http://3.101.51.61:3040/", {
  transports: ["websocket"],
});

// @feathersjs/client is exposed as the `feathers` global.
const client = feathers<any>();

client.configure(feathers.socketio(socket, { timeout: 10000 }));
client.configure(
  feathers.authentication({
    storageKey: "chat-token",
    storage: localStorage,
  })
);

export const logoutChat = async () => {
  await (client as any).logout();
};
export default client;
