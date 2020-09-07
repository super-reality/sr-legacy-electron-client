const Promise = require("pinkie-promise");
const fs = require("fs");

function unlinkP(path) {
  return new Promise((resolve, reject) => {
    fs.unlink(path, (err) => {
      if (err) {
        return reject(err);
      }
      return resolve();
    });
  });
}

function readFileP(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, img) => {
      if (err) {
        return reject(err);
      }
      return resolve(img);
    });
  });
}

function readAndUnlinkP(path) {
  return new Promise((resolve, reject) => {
    readFileP(path)
      .then((img) => {
        unlinkP(path)
          .then(() => resolve(img))
          .catch(reject);
      })
      .catch(reject);
  });
}

function defaultAll(snapshot) {
  return new Promise((resolve, reject) => {
    snapshot
      .listDisplays()
      .then((displays) => {
        const snapsP = displays.map(({ id }) => snapshot({ screen: id }));
        Promise.all(snapsP).then(resolve).catch(reject);
      })
      .catch(reject);
  });
}

module.exports = {
  unlinkP,
  readFileP,
  readAndUnlinkP,
  defaultAll,
};