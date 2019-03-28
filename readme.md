# docsify-pdf-converter

## Install

```sh
npm install --save-dev docsify-pdf-converter
```

## Usage

Create:

* config file `.docsifytopdfrc.<js|json|yaml>`
* or `"docsifytopdf"` field in `package.json` (like [rcfile][rcfile] can receive) with this setup object:

Example `.docsifytopdfrc.js` content:

```js
module.exports = {
  contents: [ "docs/_sidebar.md" ], // array of "table of contents" files path
  pathToPublic: "pdf/readme.pdf", // path where pdf will stored
  pdfOptions: "<options for puppeteer.pdf()>", // reference: https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagepdfoptions
  markdownStylesLayout: "<layout for markdown-styles>", // reference: https://github.com/mixu/markdown-styles#screenshots-of-the-layouts
  removeTemp: true, // remove generated .md and .html or not
  emulateMedia: "screen", // mediaType, emulating by puppeteer for rendering pdf, 'print' by default (reference: https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pageemulatemediamediatype)
}
```

Add script into `package.json`:

```json
{
  "scripts": {
    "convert": "node_modules/.bin/converter"
  }
}
```

Run converter:

```sh
npm run convert
```

[rcfile]: https://www.npmjs.com/package/rcfile
