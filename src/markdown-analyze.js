const fs = require("fs");
const util = require("util");
const path = require("path");
const markdownLinkExtractor = require("markdown-link-extractor");

const [readFile] = [fs.readFile].map(fn => util.promisify(fn));

const read = ({ sidebarContent }) => async () => {
  const filePath = path.resolve(sidebarContent);
  const file = await readFile(filePath, { encoding: "utf8" });

  const links = markdownLinkExtractor(file).filter(link => {
    return !(link.includes("http://") || link.includes("https://"));
  });

  return Promise.resolve(links);
};

module.exports = config => ({
  read: read(config),
});
