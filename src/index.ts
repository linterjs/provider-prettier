import {
  registerLinter,
  LinterAdapter,
  LinterFactory,
  LintOutput
} from "@linter/core";
import { getSupportInfo } from "prettier";
import { lint } from "prettylint";
import { extname } from "path";
import "tslib";

const supportsFilePath = filePath =>
  getSupportInfo().languages.find(
    language => language.extensions.indexOf(extname(filePath)) > -1
  );

const eslintToLinter = (eslintResult) => eslintResult;

const adapter: LinterAdapter = {
  async format({ filePath, text }) {
    if (!supportsFilePath(filePath)) {
      return;
    }
    const result = await lint(filePath, text);
    return eslintToLinter(result);
  },
  async lint({ filePath, text }) {
    if (!supportsFilePath(filePath)) {
      return;
    }
    const result = await lint(filePath, text);
    return result.output || text;
  }
};

const linterFactory: LinterFactory = () => adapter;

try {
  registerLinter("prettier", linterFactory);
} catch (error) {
  console.error(error);
}
