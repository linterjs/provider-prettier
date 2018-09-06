import { LinterAdapter, LinterFactory, LinterProvider } from "@linter/core";
import { getSupportInfo } from "prettier";
import { lint } from "prettylint";
import {
  prettylintResultToFormatOutput,
  prettylintResultToLintOutput,
} from "./utils";

const linter: LinterAdapter = {
  async format({ filePath, text }) {
    const result = await lint(filePath, text);
    return prettylintResultToFormatOutput(result);
  },

  async lint({ filePath, text }) {
    const result = await lint(filePath, text);
    return prettylintResultToLintOutput(result);
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
