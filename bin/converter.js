const rcfile = require("rcfile");

const config = rcfile("docsifyconverter");

require("../src/index.js")(config);
