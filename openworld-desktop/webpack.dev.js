process.env.NODE_ENV = "development";

const { merge } = require("webpack-merge");
const common = require("./webpack/webpack.common.js");
const post = require("./webpack/webpack.post.js");

console.log("MODE: development");

const merged = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
});

module.exports = post(merged);
