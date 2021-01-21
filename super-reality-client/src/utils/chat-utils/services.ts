import client from "../../renderer/feathers";
import { ChatUser } from "../../types/chat";

export const messagesClient = client.service("messages");
export const usersClient = client.service("users");
export const groupClient = client.service("collectives");

interface GroupSettings {
  collectiveName?: string;
  collectivePhoto?: string;
  ownerId?: string;
  users?: ChatUser[];
  channels?: [];
}

export function updateGroup(id: string, groupSettings: GroupSettings) {
  groupClient.patch(id, groupSettings);
}
