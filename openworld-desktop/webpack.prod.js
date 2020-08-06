process.env.NODE_ENV = "production";

const merge = require("webpack-merge");
const common = require("./webpack/webpack.common.js");
const post = require("./webpack/webpack.post.js");

console.log("MODE: production");

const merged = merge(common, {
  mode: "production",
  devtool: "source-map",
});

module.exports = post(merged);
