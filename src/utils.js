const fs = require("fs");
const util = require("util");
const path = require("path");
const rimraf = require("rimraf");
const yesno = require("yesno");
require("colors");

const logger = require("./logger.js");

const [mkdir, exists] = [fs.mkdir, fs.exists].map(fn => util.promisify(fn));

const safetyMkdir = async rawPath => {
  const resolvedPath = path.resolve(rawPath);

  const isExist = await exists(resolvedPath);

  if (!isExist) {
    return await mkdir(resolvedPath);
  }

  return Promise.resolve();
};

const removeArtifacts = paths =>
  Promise.all([
    paths.map(path => new Promise(resolve => rimraf(path, resolve))),
  ]);

const prepareEnv = ({ pathToStatic, pathToPublic }) => () => {
  const pathToStaticDir = path.resolve(pathToStatic);
  const pathToPublicDir = path.dirname(path.resolve(pathToPublic));

  return Promise.all([
    safetyMkdir(pathToStaticDir),
    safetyMkdir(pathToPublicDir),
  ]).catch(err => {
    logger.err("prepareEnv", err);
  });
};

const cleanUp = ({ pathToStatic, pathToPublic, removeTemp }) => async () => {
  const isExist = await exists(path.resolve(pathToStatic));

  if (!isExist) {
    return Promise.resolve();
  }

  const questionStatic = `Path "${path.resolve(
    pathToStatic,
  )}" reserved for statics is already exists.${
    removeTemp ? " It will be deleted." : ""
  } Continue evaluating? (y/n)`.yellow;

  const answer = await yesno.askAsync(questionStatic);

  if (answer) {
    return removeArtifacts([path.resolve(pathToPublic)]);
  } else {
    return Promise.reject("User stops evaluating");
  }
};

module.exports = config => ({
  removeArtifacts,
  prepareEnv: prepareEnv(config),
  cleanUp: cleanUp(config),
});
