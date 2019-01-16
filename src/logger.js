require("colors");

class Logger {
  static success(text) {
    console.log(`SUCCESS: ${text}`.green);
  }
  static info(text) {
    console.log(`INFO: ${text}`.blue);
  }
  static warn(text) {
    console.warn(`WARNING: ${text}`.yellow);
  }
  static err(text) {
    console.error(`ERROR: ${text}`.red);
  }
}

module.exports = Logger;
