require("colors");

class Logger {
  static success(text) {
    console.log(`\nSUCCESS:\n${text}\n`.green);
  }
  static info(text) {
    console.log(`\nINFO:\n${text}\n`.blue);
  }
  static warn(text) {
    console.warn(`\nWARNING:\n${text}\n`.yellow);
  }
  static err(text, error) {
    console.error(`\nERROR:\n${text}\n`.red);

    if (error) {
      console.error(error.toString().red);
      console.error("\n");
    }
  }
}

module.exports = Logger;
