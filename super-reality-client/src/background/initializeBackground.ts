import setupIpc from "./setupIpc";

export default function initializeBackground() {
  console.log("Background process init");

  setupIpc();
}
