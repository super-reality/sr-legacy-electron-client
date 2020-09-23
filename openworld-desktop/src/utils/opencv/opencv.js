const { default: isElectron } = require("../isElectron");

let opencv = {};
if (isElectron()) {
  // eslint-disable-next-line no-undef
  opencv = __non_webpack_require__("opencv4nodejs-prebuilt");
}
if (typeof jest !== "undefined") {
  // eslint-disable-next-line global-require
  opencv = require("opencv4nodejs-prebuilt");
}

module.exports = opencv;
