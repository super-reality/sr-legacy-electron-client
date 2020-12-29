import io from "socket.io-client";
import feathers from "@feathersjs/client";

const socket = io("http://3.101.51.61:3040/");
const client = feathers();

client.configure(feathers.socketio(socket));
client.configure(feathers.authentication());

export const logout = async () => {
  await client.logout();
};
export default client;
