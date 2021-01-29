import client from "../../renderer/feathers";
import { ChatUser } from "../../types/chat";

interface GroupSettings {
  collectiveName?: string;
  collectivePhoto?: string;
  ownerId?: string;
  users?: ChatUser[];
  category?: string[];
}

interface ChannelSettings {
  channelName?: string;
  channelPhoto?: string;
  users?: ChatUser[];
  categoryId?: string;
}

interface CategorySettings {
  categoryName?: string;
  categoryPhoto?: string;
  channels: string[];
}

export const messagesClient = client.service("messages");
export const usersClient = client.service("users");
export const groupClient = client.service("collectives");
export const categoryClient = client.service("categories");
export const channelsClient = client.service("channels");

export function updateGroup(id: string, groupSettings: GroupSettings) {
  groupClient.patch(id, groupSettings);
}

export function updateCategory(id: string, categorySettings: CategorySettings) {
  categoryClient.patch(id, categorySettings);
}

export function updateChannel(id: string, channelSettings: ChannelSettings) {
  channelsClient.patch(id, channelSettings);
}

export function updateUser(id: string, userSettings: ChannelSettings) {
  usersClient.patch(id, userSettings);
}

export const feathersClient = client;
