const fp = require("find-free-port");

const getFreePort = () => {
  return fp(3000, 3100, "127.0.0.1", 2).catch(err => {
    console.error(err);
  });
};

module.exports = getFreePort;
