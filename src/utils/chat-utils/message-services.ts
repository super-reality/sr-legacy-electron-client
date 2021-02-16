import { messagesClient } from "./services";

export function getMessages(channelId: string) {
  console.log(channelId);
  return messagesClient.find({
    query: {
      $sort: { createdAt: -1 },
      channelId,
      $limit: 50,
    },
  });
}

export const sendMessage = (text: string, channelId: string) => {
  if (text !== "") {
    messagesClient.create({ channelId, text }).catch((err: any) => {
      console.log("create message error", err);
    });
  }
};
