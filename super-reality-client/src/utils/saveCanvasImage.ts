import fs from "fs";

export default function saveCanvasImage(fileName: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const canvas = document.getElementById("preview-video-canvas") as
      | HTMLCanvasElement
      | undefined;
    if (canvas) {
      const url = canvas.toDataURL("image/jpg", 0.8);

      // remove Base64 stuff from the Image
      const base64Data = url.replace(/^data:image\/png;base64,/, "");
      fs.writeFile(fileName, base64Data, "base64", (err: any) => {
        if (err) reject(err);
        else {
          resolve();
        }
      });
    } else {
      reject();
    }
  });
}
