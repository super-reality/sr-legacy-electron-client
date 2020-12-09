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
    configure: {
      rules: {
        allowEmptyCatch: 0,
        "no-cond-assign": 0,
        "no-console": "off",
        "no-redeclare": "warn",
        "no-duplicate-imports": "warn",
        "no-undef": "error",
        "no-global-assign": "warn",
        "no-empty": "warn",
        "no-underscore-dangle": "off",
        "object-shorthand": 0,
        complexity: ["warn", 40],
        "max-statements": ["warn", 100],
        "react/jsx-filename-extension": [
          1,
          {
            extensions: [".jsx", ".tsx"],
          },
        ],
        "react/require-default-props": [
          1,
          {
            ignoreFunctionalComponents: true,
          },
        ],
        eqeqeq: "off",
        "jsx-a11y/label-has-associated-control": "off",
        "jsx-a11y/no-noninteractive-element-interactions": "off",
        "import/extensions": [
          "error",
          "ignorePackages",
          {
            js: "never",
            jsx: "never",
            ts: "never",
            tsx: "never",
          },
        ],
        "prettier/prettier": [
          "warn",
          {
            endOfLine: "auto",
          },
        ],
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": [
          "error",
          { varsIgnorePattern: "^_", argsIgnorePattern: "^_" },
        ],
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/no-var-requires": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/camelcase": "off",
        "@typescript-eslint/ban-ts-comment": "off",
        "@typescript-eslint/ban-ts-ignore": "off",
        "@typescript-eslint/interface-name-prefix": "off",
        "react-hooks/rules-of-hooks": "error",
      },
    },
  },
};
