import globalData from "../renderer/globalData";
import { IpcMsgUrlByTitleResponse } from "../types/ipc";
import { makeIpcListenerOnce } from "./handleIpc";
import ipcSend from "./ipcSend";

export default function getWebsiteUrlByTitle(title: string) {
  if (globalData.titleUrlDictionary[title]) {
    return new Promise((resolve) =>
      resolve({ title, url: globalData.titleUrlDictionary[title] })
    );
  }
  // If not in dictionary, try puppeteer
  ipcSend({
    method: "getUrlbyTitle",
    arg: title,
  });
  return makeIpcListenerOnce<IpcMsgUrlByTitleResponse>(
    "getUrlbyTitleResponse"
  ).then((arg) => {
    globalData.titleUrlDictionary[arg.title] = arg.url;
    return arg;
  });
}
