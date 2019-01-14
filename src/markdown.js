const fs = require("fs");
const util = require("util");
const path = require("path");

const [readdir, readFile, writeFile, mkdir] = [
  fs.readdir,
  fs.readFile,
  fs.writeFile,
  fs.mkdir,
].map(fn => util.promisify(fn));

const combineMarkdowns = (
  pathToStatic,
  mainMdFilename,
  dirName,
) => async () => {
  try {
    const filenames = await readdir(path.resolve(dirName));

    const files = await Promise.all(
      await filenames.map(async filename => ({
        content: await readFile(path.resolve(dirName, filename), {
          encoding: "utf8",
        }),
        name: filename,
      })),
    );

    await writeFile(
      path.resolve(pathToStatic, mainMdFilename),
      files.map(({ content }) => content).join("\n\n"),
    );

    return path.resolve(pathToStatic, mainMdFilename);
  } catch (err) {
    console.error("combineMarkdowns", err);
    throw err;
  }
};

module.exports = ({ pathToStatic, mainMdFilename, source }) => ({
  combineMarkdowns: combineMarkdowns(pathToStatic, mainMdFilename, source),
});
