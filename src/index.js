const path = require("path");
const { merge } = require("lodash");
const logger = require("./logger");

const defaultConfig = {
  pathToStatic: "static",
  mainMdFilename: "main.md",
  markdownStylesLayout: "jasonm23-swiss",
  removeTemp: true,
  contents: "docs/_sidebar.md",
  pathToPublic: "./pdf/readme.pdf",
  pdfOptions: { format: "A4" },
  emulateMedia: "print",
};

const run = async incomingConfig => {
  const config = merge(defaultConfig, incomingConfig);

  logger.info("Build with settings:");
  console.log(JSON.stringify(config, null, 2));
  console.log("\n");

  const { markdownToHtml, htmlToPdf } = require("./render.js")(config);
  const { combineMarkdowns } = require("./markdown-combine.js")(config);
  const { closeProcess, prepareEnv, cleanUp } = require("./utils.js")(config);
  const { createRoadMap } = require("./contents-builder.js")(config);

  try {
    await cleanUp();
    await prepareEnv();
    const roadMap = await createRoadMap();
    const markdownBundlePath = await combineMarkdowns(roadMap);
    await markdownToHtml(markdownBundlePath);
    await htmlToPdf();

    logger.success(path.resolve(config.pathToPublic));
  } catch (error) {
    logger.err("run error", error);
  } finally {
    closeProcess(0);
  }
};

module.exports = run;
