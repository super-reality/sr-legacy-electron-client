process.env.NODE_ENV = "development";

const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const post = require("./webpack.post.js");

console.log("MODE: development");

const merged = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
});

module.exports = post(merged);
