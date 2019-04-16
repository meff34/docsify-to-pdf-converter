const path = require("path");
const markdownLinkExtractor = require("markdown-link-extractor");
const isUrl = require("is-url");

const isImg = filePath => {
  const extName = path.parse(filePath).ext;

  return extName === ".jpg" || extName === ".png" || extName === ".gif";
};

module.exports = ({ pathToStatic }) => ({ content, name }) => {
  let markdown = content;
  const dir = path.dirname(name);
  const dirWithStatic = path.resolve(process.cwd(), pathToStatic);

  markdownLinkExtractor(content)
    .filter(link => !isUrl(link))
    .filter(isImg)
    .map(link => ({ origin: link, processed: path.resolve(dir, link) }))
    .map(({ origin, processed }) => ({
      origin,
      processed: path.relative(dirWithStatic, processed),
    }))
    .forEach(({ origin, processed }) => {
      markdown = markdown.replace(origin, processed);
    });

  return markdown;
};
