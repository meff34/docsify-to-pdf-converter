const path = require("path");
require("colors");

const logger = require("./logger.js");

const config = {
  pathToStatic: "static",
  mainMdFilename: "main.md",
  sidebarContentFile: "docs/_sidebar.md",
  source: "docs",
  pathToPublic: "./public/readme.pdf",
  removeTemp: true,
};

const { pathToStatic, mainMdFilename, pathToPublic } = config;

const { render, afterRender } = require("./statics.js")(config);
const { combineMarkdowns } = require("./markdown.js")(config);
const { removeArtifacts, prepareEnv } = require("./utils.js")(config);

const run = () =>
  removeArtifacts([path.resolve(pathToStatic), path.resolve(pathToPublic)])
    .then(prepareEnv)
    .then(combineMarkdowns)
    .then(pathToFile => render(pathToFile))
    .then(() => afterRender(mainMdFilename))
    .then(() => logger.success(config.pathToPublic))
    .then(
      () => config.removeTemp && removeArtifacts([path.resolve(pathToStatic)]),
    );

module.exports = () =>
  run().catch(err => {
    logger.err("run error", err);
    removeArtifacts([path.resolve(pathToStatic), path.resolve(pathToPublic)]);
  });
