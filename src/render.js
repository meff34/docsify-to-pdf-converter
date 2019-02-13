const fs = require("fs");
const util = require("util");
const path = require("path");
const markdownStyles = require("markdown-styles");
const puppeteer = require("puppeteer");
const logger = require("./logger.js");

const [rename] = [fs.rename].map(fn => util.promisify(fn));

const markdownToHtml = ({ pathToStatic, markdownStylesLayout }) => pathToFile =>
  new Promise(resolve => {
    markdownStyles.render(
      markdownStyles.resolveArgs({
        input: path.resolve(pathToFile),
        output: pathToStatic,
        layout: markdownStylesLayout,
      }),
      resolve,
    );
  });

const renderPdf = async ({ pathToStatic, pathToPublic, pdfOptions }) => {
  const browser = await puppeteer.launch();
  try {
    const page = await browser.newPage();
    await page.goto(`file:${path.resolve(pathToStatic, "index.html")}`);

    await page.pdf({
      ...pdfOptions,
      path: path.resolve(pathToPublic),
    });

    return await browser.close();
  } catch (e) {
    await browser.close();
    throw e;
  }
};

const htmlToPdf = ({
  mainMdFilename,
  pathToStatic,
  pathToPublic,
  renderSettings,
}) => async () => {
  const oldHtmlFile = path.resolve(
    pathToStatic,
    `${path.basename(mainMdFilename, "md")}html`,
  );
  try {
    const newHtmlFile = path.resolve(pathToStatic, "index.html");

    await rename(oldHtmlFile, newHtmlFile);

    return renderPdf({ pathToStatic, pathToPublic, renderSettings });
  } catch (err) {
    logger.err("afterRender", err);
    throw err;
  }
};

module.exports = config => ({
  markdownToHtml: markdownToHtml(config),
  htmlToPdf: htmlToPdf(config),
});
