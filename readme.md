# docsify-pdf-converter

## Install

```sh
npm install --save docsify-pdf-converter
```

## Usage

create config `.docsifytopdf.<js|json|yaml>` of `"docsifytopdf"` field in `package.json` (like [rcfile](https://www.npmjs.com/package/rcfile) can receive) with this setup object:

`.docsifytopdfrc.js`
```js
module.exports = {
  contents: [ "docs/_sidebar.md" ], // array of "table of contents" files path 
  pathToPublic: "pdf/readme.pdf", // path where pdf will stored
  pdfOptions: "<options for puppeteer.pdf()>", // reference: https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagepdfoptions
  markdownStylesLayout: "<layout for markdown-styles>", // reference: https://github.com/mixu/markdown-styles#screenshots-of-the-layouts
  removeTemp: true, // remove generated .md and .html or not
}
``` 

add script into `package.json`:

```json
{
  "scripts": {
    "convert": "node_modules/.bin/converter"
  }
}
```

run converter!

```
$ npm run convert
```
