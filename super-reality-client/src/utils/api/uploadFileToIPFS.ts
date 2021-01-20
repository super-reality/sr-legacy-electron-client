import fs from "fs";
import { saveResourceIPFS } from "../ipfs"
import uploadFileToS3 from './uploadFileToS3'

export default function uploadFileToIPFS(
  localFileName: string,
  type = "lesson"
): Promise<string> {
  console.log("ipfs:", localFileName);
  return new Promise((resolve, reject) => {
    try {
      const fileContent = fs.readFileSync(localFileName);
      saveResourceIPFS(Uint8Array.from(fileContent)).then(cid => {
        if(cid) { // successful
          resolve(cid)
        } else { // fall back
          uploadFileToS3(localFileName, type).then(resolve)
        }
      })
    } catch (e) {
      reject(e);
    }
  });
}
