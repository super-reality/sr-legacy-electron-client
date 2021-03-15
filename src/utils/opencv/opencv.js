const { default: isElectron } = require("../electron/isElectron");

let opencv = {};
if (isElectron()) {
  // eslint-disable-next-line no-undef
  opencv = __non_webpack_require__("opencv4nodejs-prebuilt");
}

module.exports = opencv;
