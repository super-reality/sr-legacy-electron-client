// https://www.npmjs.com/package/@craco/craco
module.exports = {
  webpack: {
    configure: {
      target: "electron-renderer",
    },
  },
  jest: {
    configure: {
      preset: "jest-puppeteer",
    },
  },
  eslint: {
    configure: {
      rules: {
        "no-underscore-dangle": "off",
      },
    },
  },
};
