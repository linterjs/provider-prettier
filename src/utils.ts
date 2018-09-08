import {
  FormatOutput,
  LintMessage,
  LintOutput,
  LintSeverity,
} from "@linter/core";
import {
  LintMessage as PrettyLintMessage,
  LintResult,
  // XXX: Use number until we can find a way to import const enum when
  // using single file typescript compilation that ts-jest are using.
  // LintSeverity as PrettyLintSeverity,
} from "prettylint";
import { logger } from "./logger";

function prettylintResultToLintOutput(result: LintResult): LintOutput {
  const { errorCount, filePath, messages, warningCount } = result;

  logger.debug("Prettylint result:", JSON.stringify(result, null, 2));

  const lintOutput = {
    errorCount,
    ...(filePath && { filePath }),
    warningCount,
    messages: messages.map<LintMessage>(
      ({ column, line, message, ruleId, severity }: PrettyLintMessage) => ({
        column,
        line,
        message,
        ruleId,
        severity: severity === 2 ? LintSeverity.ERROR : LintSeverity.WARNING,
      }),
    ),
  };

  logger.debug("Mapping Prettylint result to LintOutput");

  return lintOutput;
}

function prettylintResultToFormatOutput(result: LintResult): FormatOutput {
  const { output } = result;

  const formatOutput = {
    ...prettylintResultToLintOutput(result),
    ...(output && { output }),
  };

  logger.debug("Mapping Prettylint result and LintOutput to FormatOutput");

  return formatOutput;
}

export { prettylintResultToFormatOutput, prettylintResultToLintOutput };
