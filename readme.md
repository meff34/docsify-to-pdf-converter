# docsify-pdf-converter

## Install

```sh
npm install --save-dev docsify-pdf-converter
```

## Usage as CLI:

Create:

* config file `.docsifytopdfrc.<js|json|yaml>`
* or `"docsifytopdf"` field in `package.json` (like [rcfile][rcfile] can receive) with this setup object:

Example `.docsifytopdfrc.js` content:

```js
module.exports = {
  contents: [ "docs/_sidebar.md" ], // array of "table of contents" files path
  pathToPublic: "pdf/readme.pdf", // path where pdf will stored
  pdfOptions: "<options for puppeteer.pdf()>", // reference: https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagepdfoptions
  removeTemp: true, // remove generated .md and .html or not
  emulateMedia: "screen", // mediaType, emulating by puppeteer for rendering pdf, 'print' by default (reference: https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pageemulatemediamediatype)
}
```

Add script into `package.json`:

```json
{
  "scripts": {
    "convert": "node_modules/.bin/docsify-pdf-converter"
  }
}
```

Run converter:

```sh
npm run convert
```

## Usage as npm-package:
🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧
This part of module is not safe for work - it will stop process after generation pdf. Use it for your own risk.
You can just import and use main function like this:

```js
const converter = require('docsify-pdf-converter');
const config = require('./.docsifytopdfrc.js');

converter(config) // right after resolve or reject inner promise your process will be terminated :C
```
🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧

## Contributing

- Fork it!
- Create your feature branch: `git checkout -b my-new-feature`
- Commit your changes: `git commit -am 'Add some feature'`
- Push to the branch: `git push origin my-new-feature`
- Submit a pull request

Your pull requests and issues are welcome!

[rcfile]: https://www.npmjs.com/package/rcfile
