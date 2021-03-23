import io from "socket.io-client";
// import getConfig from 'next/config';

import feathers from "@feathersjs/client";

import * as publicRuntimeConfig from "../../../xrconstants";

const apiServer = publicRuntimeConfig.xrApiServer;

const { featherStoreKey } = publicRuntimeConfig;

// Socket.io is exposed as the `io` global.
const socket = io(apiServer);

// @feathersjs/client is exposed as the `feathers` global.
const xrEngineClient = feathers();

xrEngineClient.configure(feathers.socketio(socket, { timeout: 10000 }));
xrEngineClient.configure(
  feathers.authentication({
    storageKey: featherStoreKey,
  })
);
export default xrEngineClient;
