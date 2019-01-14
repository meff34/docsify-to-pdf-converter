const fs = require("fs");
const util = require("util");
const pdf = require("html-pdf");
const mds = require("markdown-styles");
const path = require("path");

const [readdir, readFile, rename] = [fs.readdir, fs.readFile, fs.rename].map(
  fn => util.promisify(fn),
);

const render = pathToStatic => pathToFile =>
  new Promise(resolve => {
    mds.render(
      mds.resolveArgs({
        input: path.resolve(pathToFile),
        // input: '### aaa',
        output: pathToStatic,
        layout: "markedapp-byword",
      }),
      resolve,
    );
  });

const filterNonCss = fileName => {
  const splitted = fileName.split(".");
  return splitted[splitted.length - 1] === "css";
};

const createPdf = (html, pathToPublic) =>
  new Promise((resolve, reject) => {
    pdf
      .create(html, { format: "A4" })
      .toFile(pathToPublic, function(err, res) {
        if (err) reject(err);
        resolve(res);
      });
  });

const extractStyles = pathToStatic => async dirName => {
  try {
    const dirs = await readdir(dirName);
    return await Promise.all(
      dirs
        .filter(filterNonCss)
        .map(
          async dir =>
            await readFile(path.resolve(pathToStatic, `assets/${dir}`), {
              encoding: "utf8",
            }),
        )
        .join("\n"),
    );
  } catch (err) {
    console.error("extractStyles", err);
    throw err;
  }
};

const afterRender = (pathToStatic, filename, pathToPublic) => async () => {
  try {
    const oldHtmlFile = path.resolve(
      pathToStatic,
      `${path.basename(filename, "md")}html`,
    );
    const newHtmlFile = path.resolve(pathToStatic, "index.html");

    await rename(oldHtmlFile, newHtmlFile);

    const css = await extractStyles(pathToStatic)(
      path.resolve(pathToStatic, "assets"),
    );
    const html = await readFile(path.resolve(pathToStatic, "index.html"), {
      encoding: "utf8",
    });

    const htmlWithStyles = html.replace(
      "</head>",
      `<style>${css}</style></head>`,
    );

    return await createPdf(htmlWithStyles, pathToPublic);
  } catch (err) {
    console.error("afterRender", err);
    throw err;
  }
};

module.exports = ({ pathToStatic, mainMdFilename, pathToPublic }) => ({
  render: render(pathToStatic),
  afterRender: afterRender(pathToStatic, mainMdFilename, pathToPublic),
});
