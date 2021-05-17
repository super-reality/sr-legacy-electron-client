const ModuleReplacement = require("./module-resolver-file");

process.env.PORT = 3001;

// https://www.npmjs.com/package/@craco/craco
module.exports = {
  webpack: {
    configure: {
      target: "web",
    },
    plugins: [...ModuleReplacement({ webIndex: true, electronIndex: false })],
  },
  eslint: {
    configure: {
      rules: {
        "no-underscore-dangle": "off",
      },
    },
  },
};
