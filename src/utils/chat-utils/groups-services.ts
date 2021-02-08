import { Group } from "../../types/chat";
import { createCategory } from "./categories-services";
import { groupClient } from "./services";

interface GroupSettings {
  groupName?: string;
  groupPhoto?: string;
  ownerId?: string;
  users?: string[];
  category?: string[];
}
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
  groupClient
    .create(groupProps)
    .then((group: Group) => {
      createCategory(group._id);
    })
    .catch((err: any) => {
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
