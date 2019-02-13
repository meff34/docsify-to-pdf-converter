const fs = require("fs");
const util = require("util");
const path = require("path");
const markdownLinkExtractor = require("markdown-link-extractor");
const isUrl = require("is-url");
const { flatten } = require("lodash");

const [readFile] = [fs.readFile].map(fn => util.promisify(fn));

const createRoadMap = ({ contents }) => async () => {
  let contentsPaths = Array.isArray(contents) ? contents : [contents];

  const sidebarFilePaths = contentsPaths.map(sidebarFileName => {
    const a = path.dirname(path.resolve(sidebarFileName));
    const b = path.resolve(sidebarFileName);
    return { dir: a, filePath: b };
  });

  const sidebarFileContents = await Promise.all(
    sidebarFilePaths.map(async ({ dir, filePath }) => ({
      dir,
      file: await readFile(filePath, { encoding: "utf8" }),
    })),
  );

  const contentsArray = sidebarFileContents.map(({ file, dir }) =>
    markdownLinkExtractor(file)
      .filter(link => !isUrl(link))
      .map(link => path.resolve(dir, link)),
  );

  return await flatten(contentsArray);
};

module.exports = config => ({
  createRoadMap: createRoadMap(config),
});
