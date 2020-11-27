/* eslint-env jest */

function getPrimaryDisplayMock() {
  return { bounds: { width: 1920, height: 1080, x: 0, y: 0 } };
}

function getAllDisplaysMock() {
  return [
    {
      bounds: { width: 1920, height: 1080, x: -1920, y: 0 },
      size: { width: 1920, height: 1080 },
    },
    {
      bounds: { width: 1920, height: 1080, x: 0, y: 0 },
      size: { width: 1920, height: 1080 },
    },
  ];
}

module.exports = {
  require: jest.fn(),
  match: jest.fn(),
  app: {
    version: "1.0.0",
    name: "super-reality-client",
    getPath: () => "src\\assets",
  },
  remote: {
    app: {
      getVersion: () => "1.0.0",
      getPath: () => "src\\assets",
    },
    screen: {
      getPrimaryDisplay: getPrimaryDisplayMock,
      getAllDisplays: getAllDisplaysMock,
    },
  },
  screen: {
    getPrimaryDisplay: getPrimaryDisplayMock,
    getAllDisplays: getAllDisplaysMock,
  },
  ipcRenderer: {
    on: jest.fn(),
    send: jest.fn(),
  },
  dialog: jest.fn(),
};
