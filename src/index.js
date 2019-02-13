const path = require("path");
const { merge } = require("lodash");
require("colors");

const logger = require("./logger.js");

const defaultConfig = {
  pathToStatic: "static",
  mainMdFilename: "main.md",

  markdownStylesLayout: "jasonm23-swiss",
  removeTemp: true,
  contents: "docs/_sidebar.md",
  pathToPublic: "./pdf/readme.pdf",
  pdfOptions: { format: "A4" },
};

const run = incomingConfig => {
  const config = merge(defaultConfig, incomingConfig);
  const { pathToStatic } = config;

  const { markdownToHtml, htmlToPdf } = require("./render.js")(config);
  const { combineMarkdowns } = require("./markdown-combine.js")(config);
  const { removeArtifacts, prepareEnv, cleanUp } = require("./utils.js")(
    config,
  );
  const { createRoadMap } = require("./contents-builder.js")(config);

  return cleanUp()
    .then(prepareEnv)
    .then(createRoadMap)
    .then(combineMarkdowns)
    .then(markdownToHtml)
    .then(htmlToPdf)
    .then(() => logger.success(path.resolve(config.pathToPublic)))
    .then(() => {
      if (config.removeTemp) {
        removeArtifacts([path.resolve(pathToStatic)]);
      }
    })
    .catch(err => {
      logger.err("run error", err);

      if (config.removeTemp) {
        removeArtifacts([path.resolve(pathToStatic)]);
      }
    });
};

module.exports = run;
