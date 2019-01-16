const fs = require("fs");
const util = require("util");
const path = require("path");
const logger = require("./logger.js");

const [readFile, writeFile, exists] = [
  fs.readFile,
  fs.writeFile,
  fs.exists,
].map(fn => util.promisify(fn));

const isFileExcluded = (blackList, filePath) => {
  return blackList.map(item => path.resolve(item)).includes(filePath);
};

const combineMarkdowns = ({
  sidebarContent,
  pathToStatic,
  mainMdFilename,
  source,
  excluded,
}) => async links => {
  try {
    const filteredFilenames = links.filter(
      filename => !isFileExcluded(excluded, path.resolve(source, filename)),
    );

    const files = await Promise.all(
      await filteredFilenames.map(async filename => {
        const fileExist = await exists(path.resolve(source, filename));

        if (fileExist) {
          const content = await readFile(path.resolve(source, filename), {
            encoding: "utf8",
          });

          return {
            content,
            name: filename,
          };
        }

        throw new Error(
          `file ${filename} is not exist, but listed in ${sidebarContent}`,
        );
      }),
    );

    try {
      const content = files.map(({ content }) => content).join("\n\n");
      await writeFile(path.resolve(pathToStatic, mainMdFilename), content);
    } catch (e) {
      logger.err(e);
    }

    return path.resolve(pathToStatic, mainMdFilename);
  } catch (err) {
    console.error("combineMarkdowns", err);
    throw err;
  }
};

module.exports = config => ({
  combineMarkdowns: combineMarkdowns(config),
});
