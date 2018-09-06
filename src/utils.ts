import {
  FormatOutput,
  LintMessage,
  LintOutput,
  LintSeverity,
} from "@linter/core";
import {
  LintMessage as PrettyLintMessage,
  LintResult,
  LintSeverity as PrettyLintSeverity,
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
        ruleId: ruleId ? ruleId : "parser",
        severity:
          severity === PrettyLintSeverity.Error
            ? LintSeverity.ERROR
            : LintSeverity.WARNING,
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
