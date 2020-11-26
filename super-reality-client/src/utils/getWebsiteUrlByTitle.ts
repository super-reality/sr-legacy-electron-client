import globalData from "../renderer/globalData";
import { IpcMsgUrlByTitleResponse } from "../types/ipc";
import { makeIpcListenerOnce } from "./handleIpc";
import ipcSend from "./ipcSend";

export default function getWebsiteUrlByTitle(
  title: string
): Promise<IpcMsgUrlByTitleResponse["arg"]> {
  if (globalData.titleUrlDictionary[title]) {
    return new Promise((resolve) => {
      resolve({ title, url: globalData.titleUrlDictionary[title] });
    });
  }

  return new Promise((resolve) => {
    // If not in dictionary, try puppeteer
    const newChannel = `getUrlbyTitleResponse-${new Date().getTime()}`;
    console.log(`channel:${newChannel} title: ${title}`);
    ipcSend({
      method: "getUrlbyTitle",
      arg: { title, responseChannel: newChannel },
    });
    return makeIpcListenerOnce(newChannel).then((arg) => {
      console.log(newChannel, arg.title, arg.url);
      globalData.titleUrlDictionary[arg.title] = arg.url;
      return resolve(arg);
    });
  });
}
