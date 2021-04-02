import io from "socket.io-client";
import feathers from "@feathersjs/client";
import { xrApiServer, featherStoreKey } from "./xrengine-constants";

// const { publicRuntimeConfig } = getConfig();
// const apiServer =
//   process.env.NODE_ENV === "production"
//     ? publicRuntimeConfig.apiServer
//     : "https://dev.theoverlay.io/";

// const featherStoreKey: string = publicRuntimeConfig.featherStoreKey;

// Socket.io is exposed as the `io` global.
const socket = io(xrApiServer);

// @feathersjs/client is exposed as the `feathers` global.

// eslint-disable-next-line import/prefer-default-export
export const client = feathers();

client.configure(feathers.socketio(socket, { timeout: 10000 }));
client.configure(
  feathers.authentication({
    storageKey: featherStoreKey,
  })
);
