require("colors");

class Logger {
  static success(text) {
    console.log(`\nSUCCESS: ${text}\n`.green);
  }
  static info(text) {
    console.log(`\nINFO: ${text}`.blue);
  }
  static warn(text) {
    console.warn(`\nWARNING: ${text}`.yellow);
  }
  static err(text, error) {
    console.error(`\nERROR: ${text}`.red);

    if (error) {
      console.error(error.toString().red);
    }
  }
}

module.exports = Logger;
