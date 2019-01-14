const path = require("path");

const config = {
  pathToStatic: "static",
  mainMdFilename: "main.md",
  sidebarContentFile: "docs/_sidebar.md",
  source: "docs",
  pathToPublic: "./public/readme.pdf"
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
    .then(() => removeArtifacts([path.resolve(pathToStatic)]));

module.exports = () =>
  run().catch(err => {
    console.error("run error", err);
    removeArtifacts([path.resolve(pathToStatic), path.resolve(pathToPublic)]);
  });
