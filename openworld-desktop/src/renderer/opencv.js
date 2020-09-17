const { default: isElectron } = require("../utils/isElectron");

let opencv = {};
if (isElectron()) {
  // eslint-disable-next-line no-undef
  opencv = __non_webpack_require__("opencv4nodejs");
}

module.exports = opencv;
