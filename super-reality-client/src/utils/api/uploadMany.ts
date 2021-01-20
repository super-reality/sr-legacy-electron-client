import uploadFileToIPFS from "./uploadFileToIPFS";

export default function uploadMany(
  files: string[]
): Promise<Record<string, string>> {
  const ret: Record<string, string> = {};
  return Promise.all(
    files.map((file) => {
      return new Promise((resolve, reject) => {
        if (file.startsWith("http")) {
          ret[file] = file;
          resolve();
        } else {
          uploadFileToIPFS(file)
            .then((f) => {
              ret[file] = f;
              resolve();
            })
            .catch((e) => {
              reject(e);
            });
        }
      });
    })
  ).then(() => ret);
}
