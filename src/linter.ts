import { LinterAdapter, LinterFactory, LinterProvider } from "@linter/core";
import { getSupportInfo } from "prettier";
import { lint } from "prettylint";
import { logger, getLogLevel } from "./logger";
import {
  prettylintResultToFormatOutput,
  prettylintResultToLintOutput,
} from "./utils";

const logLevel = getLogLevel();
logger.debug(`Setting log level to "${logLevel}"`);
logger.setLevel(logLevel);

const linter: LinterAdapter = {
  async format({ filePath, text }) {
    logger.debug("Running format");
    logger.debug(`filePath: ${filePath}`);
    logger.debug(`text: ${text}`);

    logger.debug("Running prettylint");
    const result = await lint(filePath, text);
    const formatOutput = prettylintResultToFormatOutput(result);
    logger.debug("Format done");
    return formatOutput;
  },

  async lint({ filePath, text }) {
    logger.debug("Running lint");
    logger.debug(`filePath: ${filePath}`);
    logger.debug(`text: ${text}`);

    logger.debug("Running prettylint");
    const result = await lint(filePath, text);
    const lintOutput = prettylintResultToLintOutput(result);
    logger.debug("Lint done");
    return lintOutput;
  },
};

const linterFactory: LinterFactory = () => linter;

const linterProvider: LinterProvider = {
  factory: linterFactory,
  name: "prettier",
  supportedExtensions: getSupportInfo().languages.reduce(
    (accumulator, { extensions }) => accumulator.concat(extensions),
    [] as string[],
  ),
};

export { linter, linterFactory, linterProvider };
