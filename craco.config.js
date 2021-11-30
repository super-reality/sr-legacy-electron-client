const eslintConfig = require("./.eslintrc");

// https://www.npmjs.com/package/@craco/craco
module.exports = {
  webpack: {
    configure: {
      target: "electron-renderer",
      module: {
        rules: [
          {
            test: /\.node$/,
            use: "native-addon-loader",
          },
          {
            test: /\.tsx?$/,
            loader: "ts-loader",
            exclude: /node_modules/,
            options: {
              transpileOnly: true,
              configFile: "tsconfig.json",
            },
          },
        ],
      },
    },
  },
  jest: {
    configure: {
      preset: "jest-puppeteer",
    },
  },
  eslint: {
    configure: eslintConfig,
  },
};
