const fs = require("fs");
const util = require("util");
const path = require("path");
const rimraf = require("rimraf");

const [mkdir] = [fs.mkdir].map(fn => util.promisify(fn));

const removeArtifacts = paths =>
  Promise.all([
    paths.map(path => new Promise(resolve => rimraf(path, resolve)))
  ]);

const prepareEnv = pathToStatic => () =>
  Promise.all([mkdir(path.resolve(pathToStatic))]).catch(err => {
    console.error("prepareEnv", err);
  });

module.exports = ({ pathToStatic }) => ({
  removeArtifacts,
  prepareEnv: prepareEnv(pathToStatic)
});
