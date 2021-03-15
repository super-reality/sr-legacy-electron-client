import client from "../../renderer/feathers";
import { ChannelSettings } from "../../types/chat";

export const usersClient = client.service("users");
export const groupClient = client.service("groups");
export const categoryClient = client.service("category");
export const channelsClient = client.service("channels");
export const messagesClient = client.service("messages");

export function updateUser(id: string, userSettings: ChannelSettings) {
  usersClient.patch(id, userSettings);
}
export const feathersClient = client;
