// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html
const base = require("../../jest.config.js");

module.exports = {
  ...base,
  rootDir: "./build",
  name: "constants",
  displayName: "@cdc3/constants",
  collectCoverage: true,
  verbose: true,
};
