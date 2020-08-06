const modules = require("./webpack.dev");
// Only export MAIN
module.exports = modules[0];
