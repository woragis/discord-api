const moment = require("moment");

const logger = async (req, res, next) => {
  reset = "\x1b[0m";
  bright = "\x1b[1m";
  fgMagenta = "\x1b[35m";
  fgCyan = "\x1b[36m";
  fgYellow = "\x1b[33m";
  let now = moment().format("HH:mm:ss - DD/MM/YYYY");
  console.log(
    `${fgYellow}${req.method}${reset} ${bright}${fgCyan}${req.url}${reset} ${fgMagenta}${now}${reset}`
  );
  next();
};
module.exports = logger;
