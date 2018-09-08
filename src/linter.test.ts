import fs from "jest-plugin-fs";
import { sep as separator } from "path";
import { linter, linterFactory } from "./linter";

jest.mock("fs", () => {
  const realFs = require.requireActual("fs");
  const mockFs = require("jest-plugin-fs/mock");
  const { ufs } = require("unionfs");
  ufs.use(realFs).use(mockFs);
  return ufs;
});

beforeAll(() => {
  fs.root = process.cwd();
});

afterEach(() => {
  fs.restore();
  jest.resetModules();
});

describe("Format", () => {
  test("with text and filePath", async () => {
    const linter = await linterFactory();

    expect(
      await linter.format({ filePath: "foo.js", text: "var bar = 'baz'" }),
    ).toMatchSnapshot();
  });

  test("with already formatted text", async () => {
    const linter = await linterFactory();

    expect(
      await linter.format({ filePath: "foo.js", text: 'var foo = "bar";' }),
    ).toMatchSnapshot();
  });

  test("with ignored file", async () => {
    fs.mock({
      ".prettierignore": "foo.js",
    });

    const linter = await linterFactory();

    expect(
      await linter.format({ filePath: "foo.js", text: "var bar = 'baz'" }),
    ).toMatchSnapshot();
  });
});

describe("Lint", () => {
  test("with text and filePath", async () => {
    const linter = await linterFactory();

    expect(
      await linter.lint({ filePath: "foo.js", text: "var bar = 'baz'" }),
    ).toMatchSnapshot();
  });

  test("with syntax error", async () => {
    const linter = await linterFactory();

    expect(
      await linter.lint({ filePath: "foo.js", text: "var foo ==== 'bar'" }),
    ).toMatchSnapshot();
  });
});
