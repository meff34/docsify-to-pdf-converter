const path = require("path");
const puppeteer = require("puppeteer");
const logger = require("./logger.js");

const prepareDocToPrint = async page => {
  return await page.evaluate(() => {
    document.querySelector('.sidebar-toggle').click();
  })
};

const renderPdf = async ({ pathToStatic, pathToPublic, pdfOptions, emulateMedia }) => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: {
      width: 1200,
      height: 1000,
    }
  });
  try {
    const page = await browser.newPage();
    // await page.goto(`file:${path.resolve(pathToStatic, "index.html")}`);
    await page.goto(`http://localhost:3000/#/static/main`);

    await prepareDocToPrint(page);

    await page.emulateMedia('screen');
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
  const { closeProcess } = require("./utils.js")({ pathToStatic, removeTemp });
  try {
    return await renderPdf({ pathToStatic, pathToPublic, pdfOptions, emulateMedia });
  } catch (err) {
    logger.err("puppeteer renderer error:", err);
    await closeProcess(1);
  }
};

module.exports = config => ({
  htmlToPdf: htmlToPdf(config),
});
