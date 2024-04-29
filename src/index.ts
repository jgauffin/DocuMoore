import * as fs from "fs";
import { parseFile } from "./analyzer";
import { parseArgs } from "node:util";
import { ParseArgsConfig } from "util";
import { generateOutput } from "./templates";
import { HtmlGenerator } from "./templates/Html";

var root = process.cwd();
if (root.endsWith("src") || root.endsWith("out")) {
  var pos = root.indexOf("/");
  root = root.substring(0, pos - 1);
}

var file = root + "/example/index.ts";
generate({
  entryPoints: file,
  outDir: root + "/out/docs",
});

//var result = parseFile(file);
//var json = JSON.stringify(result);
//fs.writeFileSync(root + "/out/docs.json", json);

const args = ["-f", "--bar", "b"];
var config: ParseArgsConfig = {
  args,
  options: {
    foo: {
      type: "boolean",
      short: "f",
    },
    bar: {
      type: "string",
    },
  },
};

const { values, positionals } = parseArgs(config);

/**
 * Used when there are multiple entrypoints and they should generate different sets of documentation.
 */
export interface EntryPoint {
  /**
   * Documentation title.
   */
  title: string;

  /**
   * Directory and filename of the typescript file to use as entry point.
   */
  path: string;

  /**
   * Used to overide the default outDir (defined in @see Options).
   */
  outDir?: string;
}

/**
 * Options for the documentation generation.
 */
export interface Options {
  /**
   * Relative paths to all entry points.
   *
   */
  entryPoints: string | string[] | EntryPoint[];

  /**
   * Will merge all entry points into a single documentation.
   *
   * Will generate one set of documentation per entry point if not specifed.
   */
  mergeEntryPoints?: boolean;

  /**
   * Relative directory to where documentation should be stored.
   */
  outDir: string;
}

/**
 * Generate documentation based on code
 * @param options
 */
export function generate(options: Options) {
  if (typeof options.entryPoints === "string") {
    var docs = parseFile(options.entryPoints);
    generateOutput(
      {
        docs,
        outDir: options.outDir,
        title: "Documoore",
      },
      docs
    );
  } else if (Array.isArray(options.entryPoints)) {
    options.entryPoints.forEach((entryPoint) => {
      if (typeof entryPoint === "string") {
      }
    });
  }
}
