const fs = require("fs");
const util = require("util");
const path = require("path");
const markdownStyles = require("markdown-styles");
const puppeteer = require("puppeteer");
const logger = require("./logger.js");

const [rename] = [fs.rename].map(fn => util.promisify(fn));

const markdownToHtml = ({ pathToStatic, markdownStylesLayout, removeTemp }) => async pathToFile => {
  const { closeProcess } = require("./utils.js")({ pathToStatic, removeTemp });

  try {
    await new Promise(resolve => {
      markdownStyles.render(
        markdownStyles.resolveArgs({
          input: path.resolve(pathToFile),
          output: pathToStatic,
          layout: markdownStylesLayout,
        }),
        resolve,
      );
    });
  } catch (err) {
    logger.err("markdown-styles renderer error:", err);
    await closeProcess(1);
  }
};

const renderPdf = async ({ pathToStatic, pathToPublic, pdfOptions, emulateMedia }) => {
  const browser = await puppeteer.launch();
  try {
    const page = await browser.newPage();
    await page.goto(`file:${path.resolve(pathToStatic, "index.html")}`);

    await page.emulateMedia(emulateMedia);
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
  pdfOptions,
  removeTemp,
  emulateMedia,
}) => async () => {
  const oldHtmlFile = path.resolve(pathToStatic, `${path.basename(mainMdFilename, "md")}html`);
  const { closeProcess } = require("./utils.js")({ pathToStatic, removeTemp });
  try {
    const newHtmlFile = path.resolve(pathToStatic, "index.html");

    await rename(oldHtmlFile, newHtmlFile);

    return await renderPdf({ pathToStatic, pathToPublic, pdfOptions, emulateMedia });
  } catch (err) {
    logger.err("puppeteer renderer error:", err);
    await closeProcess(1);
  }
};

module.exports = config => ({
  markdownToHtml: markdownToHtml(config),
  htmlToPdf: htmlToPdf(config),
});
