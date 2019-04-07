const path = require("path");
const puppeteer = require("puppeteer");
const logger = require("./logger.js");

const preparePageToPrint = page => {
  return page.evaluate(() => {
    const nav = document.querySelector("nav");
    if (nav) nav.remove();

    const aside = document.querySelector("aside.sidebar");
    if (aside) aside.remove();

    const button = document.querySelector("button.sidebar-toggle");
    if (button) button.remove();


    document.querySelector("section.content").style = `
      position: static;
      padding-top: 0;
    `;
  });
};

const renderPdf = async ({
  mainMdFilename,
  pathToStatic,
  pathToPublic,
  pdfOptions,
  docsifyRendererPort,
  emulateMedia,
}) => {
  const browser = await puppeteer.launch({
    defaultViewport: {
      width: 1200,
      height: 1000,
    },
  });
  try {
    const mainMdFilenameWithoutExt = path.parse(mainMdFilename).name;
    const docsifyUrl = `http://localhost:${docsifyRendererPort}/#/${pathToStatic}/${mainMdFilenameWithoutExt}`;

    const page = await browser.newPage();
    await page.goto(docsifyUrl, { waitUntil: "networkidle0" });
    await preparePageToPrint(page);

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
  docsifyRendererPort,
  emulateMedia,
}) => async () => {
  const { closeProcess } = require("./utils.js")({ pathToStatic, removeTemp });
  try {
    return await renderPdf({
      mainMdFilename,
      pathToStatic,
      pathToPublic,
      pdfOptions,
      docsifyRendererPort,
      emulateMedia,
    });
  } catch (err) {
    logger.err("puppeteer renderer error:", err);
    await closeProcess(1);
  }
};

module.exports = config => ({
  htmlToPdf: htmlToPdf(config),
});
