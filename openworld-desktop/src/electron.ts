import Electron from "electron";

const electron = window.require("electron") as typeof Electron;

export default electron;

/*
https://github.com/electron/electron/issues/6451#issuecomment-332384546

import electron from "./electron";
const { remote } = electron;
remote.app.getVersion()

*/
