const path = require("path");
const markdownLinkExtractor = require("markdown-link-extractor");
const unified = require("unified");
const parser = require("remark-parse");

module.exports = ({ content, name }, _, arr) => {
  let newContent = content;
  const b = markdownLinkExtractor(content)
    .filter(link => path.parse(link).ext === ".md")
    .map(link => ({ file: arr.find(({ name }) => name.includes(link)), link }))
    .filter(({ file }) => file)
    .map(({ file: { content }, link }) => ({
      ast: unified()
        .use(parser)
        .parse(content),
      link,
    }))
    .map(({ ast, link }) => {
      const [a] = ast.children.filter(({ type }) => type === "heading");
      const { value } = a.children.find(obj => obj.type === "text");

      return { link, unsafeTag: value };
    })
    .map(({ unsafeTag, link }) => ({
      link,
      tagWord: unsafeTag.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, "").replace(/\s/g, "-"),
    }))
    .map(({ link, tagWord }) => ({
      link,
      tag: `#${tagWord}`,
    }));

  b.forEach(({ tag, link }) => (newContent = newContent.replace(link, tag)));

  return { content: newContent, name };
};
