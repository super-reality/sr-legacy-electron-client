import { ChannelSettings } from "../../types/chat";
import { channelsClient } from "./services";

// channnels srevices
export const getChannel = (id: string) => {
  channelsClient
    .find({
      query: {
        _id: id,
      },
    })
    .then((res: any) => {
      console.log("get channels", res);
    });
};

export const createChannel = (
  categoryId: string,
  channelName: string,
  channelPhoto?: string
) => {
  let createProps;
  if (channelPhoto) {
    createProps = {
      channelName,
      channelPhoto,
    };
    console.log("channelProps", createProps);
  } else {
    createProps = {
      channelName,
    };
  }

  channelsClient.create({ ...createProps, categoryId }).catch((err: any) => {
    console.log(err);
  });
};
export function updateChannel(id: string, channelSettings: ChannelSettings) {
  channelsClient.patch(id, channelSettings);
}
