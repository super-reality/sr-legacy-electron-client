import uploadFileToS3 from "./uploadFileToS3";

export default function uploadMany(
  files: string[]
): Promise<Record<string, string>> {
  const ret: Record<string, string> = {};
  return Promise.all(
    files.map((file) => {
      return new Promise((resolve, reject) => {
        uploadFileToS3(file)
          .then((f) => {
            ret[file] = f;
            resolve();
          })
          .catch((e) => {
            reject(e);
          });
      });
    })
  ).then(() => ret);
}
