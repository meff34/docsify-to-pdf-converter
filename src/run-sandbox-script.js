module.exports = async (page, { mainMdFilenameWithoutExt, pathToStatic }) => {
  await page.addScriptTag({
    url: "https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.11/lodash.min.js",
  });

  return page.evaluate(
    ({ mainMdFilenameWithoutExt, pathToStatic }) => {
      const makeDocsifyPrettyPrintable = () => {
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
      };

      const isSafeTag = tag => tag === window.decodeURIComponent(tag);

      function randomString(length) {
        let text = "";
        const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

        for (var i = 0; i < length; i++)
          text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
      }

      const setSafeTagToHref = (anchorNodes, unsafeTag) => {
        const safeId = randomString(10);

        anchorNodes.forEach(node => {
          node.href = `#${safeId}`;
        });

        const anchorTarget = document.querySelector(`#${decodeURIComponent(unsafeTag)}`);
        if (anchorTarget) anchorTarget.id = safeId;
      };

      const processSafeInternalLinks = links => {
        links.forEach(({ node, id }) => (node.href = `#${id}`));
      };

      const processUnSafeInternalLinks = unsafeInternalLinks => {
        _.chain(unsafeInternalLinks)
          .groupBy("id")
          .transform((result, value, key) => {
            result[key] = value.map(({ node }) => node);
          }, {})
          .forOwn(setSafeTagToHref)
          .value();
      };

      const extractInternalLinks = () => {
        const allInternalLinks = [
          ...document.querySelectorAll(
            `[href*="#/${pathToStatic}/${mainMdFilenameWithoutExt}?id="]`,
          ),
        ].map(node => {
          const [, id] = node.href.split("id=");
          return { node, id };
        });

        const [safeInternalLinks, unsafeInternalLinks] = allInternalLinks.reduce(
          ([safe, unsafe], elem) =>
            isSafeTag(elem.id) ? [[...safe, elem], unsafe] : [safe, [...unsafe, elem]],
          [[], []],
        );

        return [safeInternalLinks, unsafeInternalLinks];
      };

      const processAnchors = () => {
        const [safeInternalLinks, unsafeInternalLinks] = extractInternalLinks();

        processSafeInternalLinks(safeInternalLinks);
        processUnSafeInternalLinks(unsafeInternalLinks);
      };

      const main = () => {
        makeDocsifyPrettyPrintable();
        processAnchors();
      };

      main();
    },
    { mainMdFilenameWithoutExt, pathToStatic },
  );
};
