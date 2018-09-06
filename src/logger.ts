// tslint:disable-next-line:import-name
import getLogger = require("loglevel-colored-level-prefix");

export function getLogLevel() {
  return process.env.LOG_LEVEL || "warn";
}

export const logger = getLogger({ prefix: "@linter/provider-prettier" });
