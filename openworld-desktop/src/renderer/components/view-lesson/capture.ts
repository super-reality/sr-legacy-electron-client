/* eslint-disable global-require */
import screenshot from "screenshot-desktop";

export default function capture() {
  return screenshot({ format: "png" })
    .then((img: any) => {
      const image = cv.imdecode(buffer);
      // img: Buffer filled with jpg goodness
      // ...
    })
    .catch(console.error);
}
