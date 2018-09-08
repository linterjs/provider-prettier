// tslint:disable-next-line:import-name
import getLogger = require("loglevel-colored-level-prefix");

function getLogLevel() {
  return process.env.LOG_LEVEL || "warn";
}

const logger = getLogger({ prefix: "@linter/provider-prettier" });

export { getLogLevel, logger };
