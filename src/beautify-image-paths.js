const path = require("path");
const markdownLinkExtractor = require("markdown-link-extractor");
const isUrl = require("is-url");

module.exports = (content, filePath) => {
  let markdown = content;
  const dir = path.dirname(filePath);

  markdownLinkExtractor(content)
    .filter(link => !isUrl(link))
    .map(link => ({ origin: link, processed: path.resolve(dir, link) }))
    .map(({ origin, processed }) => ({
      origin,
      processed: path.relative(process.cwd(), processed),
    }))
    .forEach(({ origin, processed }) => {
      markdown = markdown.replace(origin, processed);
    });

  return markdown;
};
