const modules = require("./webpack.dev");
// Only export RENDERER
module.exports = modules[1];
