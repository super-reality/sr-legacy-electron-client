import io from "socket.io-client";
import feathers from "@feathersjs/client";

const socket = io("http://3.101.51.61:3040/",
{
  transports: ['websocket'],
});
const client = feathers();

client.configure(feathers.socketio(socket));
client.configure(
  feathers.authentication({
    storageKey: "chat-token",
    storage: localStorage,
  })
);

export const logoutChat = async () => {
  await client.logout();
};
export default client;
