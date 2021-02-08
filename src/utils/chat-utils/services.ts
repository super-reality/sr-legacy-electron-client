import client from "../../renderer/feathers";
import { ChannelSettings } from "../../types/chat";

interface GroupSettings {
  groupName?: string;
  groupPhoto?: string;
  ownerId?: string;
  users?: string[];
  category?: string[];
}

export const usersClient = client.service("users");
export const groupClient = client.service("groups");
export const categoryClient = client.service("category");
export const channelsClient = client.service("channels");
export const messagesClient = client.service("messages");

export const createGroup = (gName: string, gPhoto?: string) => {
  let groupProps;
  if (gPhoto) {
    groupProps = {
      groupName: gName,
      groupPhoto: gPhoto,
    };
  } else {
    groupProps = {
      groupName: gName,
    };
  }
  console.log("groupProps", groupProps);
  groupClient.create(groupProps).catch((err: any) => {
    console.log(err);
  });
};

export function updateGroup(id: string, groupSettings: GroupSettings) {
  groupClient.patch(id, groupSettings);
}

export type UpdateGroupType = typeof updateGroup;

export const deleteGroup = (groupId: string) => {
  groupClient.remove(groupId);
};

export function updateUser(id: string, userSettings: ChannelSettings) {
  usersClient.patch(id, userSettings);
}

export const feathersClient = client;
