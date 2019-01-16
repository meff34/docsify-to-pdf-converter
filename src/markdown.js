const fs = require("fs");
const util = require("util");
const path = require("path");
const logger = require("./logger.js");

const [readdir, readFile, writeFile, mkdir] = [
  fs.readdir,
  fs.readFile,
  fs.writeFile,
  fs.mkdir,
].map(fn => util.promisify(fn));

const combineMarkdowns = ({
  pathToStatic,
  mainMdFilename,
  source,
}) => async () => {
  try {
    const filenames = await readdir(path.resolve(source));

    const files = await Promise.all(
      await filenames
        // .map(filename => {
        //   const a = filename;
        //
        //   return true;
        // })
        .map(async filename => ({
          content: await readFile(path.resolve(source, filename), {
            encoding: "utf8",
          }),
          name: filename,
        })),
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
