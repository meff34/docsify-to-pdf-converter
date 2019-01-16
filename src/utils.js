const fs = require("fs");
const util = require("util");
const path = require("path");
const rimraf = require("rimraf");
require("colors");

const logger = require("./logger.js");

const [mkdir, exists] = [fs.mkdir, fs.exists].map(fn => util.promisify(fn));

const safetyMkdir = async (rawPath, removeTemp) => {
  const resolvedPath = path.resolve(rawPath);

  const isExist = await exists(resolvedPath);

  if (!isExist) {
    return await mkdir(resolvedPath);
  }

  logger.warn(`Path ${resolvedPath} is already exists, will use it..`);

  if (removeTemp) {
    logger.warn("It will be deleted\n");
  }

  return Promise.resolve();
};

const removeArtifacts = paths =>
  Promise.all([
    paths.map(path => new Promise(resolve => rimraf(path, resolve))),
  ]);

const prepareEnv = ({ pathToStatic, removeTemp }) => () =>
  Promise.all([safetyMkdir(path.resolve(pathToStatic), removeTemp)]).catch(
    err => {
      console.error("prepareEnv", err);
    },
  );

module.exports = config => ({
  removeArtifacts,
  prepareEnv: prepareEnv(config),
});
