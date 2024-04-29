import { readFileSync } from "fs";
import { basename, dirname, join } from "path";
import ts from "typescript";
import { ModuleDoc } from "../definitions";
import { parseClass } from "./parsers/classes";
import { parseFunction } from "./parsers/functions";
import { parseInterface } from "./parsers/interfaces";
import { findChild } from "./utils/nodes";

export interface FileToParse {
  dir: string;
  filename: string;
  contents: string;
}

/**
 * Parse a typescript file to generate documentation meta.
 * 
 * Will also process all export directives to recursivly document everything exported (within the project).
 *
 * @param file Either a filename or file information.
 * @returns Generated documentation.
 */
export function parseFile(
  fileOrFileName: FileToParse | string
): ModuleDoc {
  return parseFileInner(fileOrFileName, []);
}

 function parseFileInner(
    fileOrFileName: FileToParse | string,
    typesToExport: string[]
  ): ModuleDoc {
  
  console.log('parsing ', fileOrFileName);
  let file =
    typeof fileOrFileName === "string"
      ? loadFile(fileOrFileName)
      : fileOrFileName;

  var sourceFile = ts.createSourceFile(
    `${file.dir}/${file.filename}`,
    file.contents,
    ts.ScriptTarget.ES5,
    true
  );
  var fileDocs = new ModuleDoc(file.dir, file.filename);
  const exports: Export[] = [];

  sourceFile.getChildren().forEach((child) => {
    child.getChildren().forEach((node) => {
      switch (node.kind) {
        case ts.SyntaxKind.ExportDeclaration:
          var decl = <ts.ExportDeclaration>node;
          var exp = parseExport(decl, fileDocs);
          exports.push(exp);
          break;

        case ts.SyntaxKind.FunctionDeclaration:
          var func = parseFunction(<ts.FunctionDeclaration>node, true);
          if (func) {
            fileDocs.functions.push(func);
          }

          break;
        case ts.SyntaxKind.InterfaceDeclaration:
          var intf = parseInterface(<ts.InterfaceDeclaration>node);
          if (intf) {
            console.log("intf", intf);
            fileDocs.interfaces.push(intf);
          }

          break;
        case ts.SyntaxKind.ClassDeclaration:
          var cls = parseClass(<ts.ClassDeclaration>node);
          if (cls) {
            console.log("cls", cls);
            fileDocs.classes.push(cls);
          }

        default:
          console.log("UNKNWON", ts.SyntaxKind[node.kind], node.pos, node.end);
          break;
      }
    });
  });

  exports.forEach((item) => {
    if (item.moduleName[0] == ".") {
      const childFullPath = join(file.dir, item.moduleName);
      const importedFile = loadFile(childFullPath);
      var child = parseFileInner(importedFile, item.types);
      var matcher = function (name: string): boolean {
        if (item.types.length == 0) {
          return true;
        }

        return item.types.findIndex((x) => x == name) >= 0;
      };

      const recipient = item.alias
        ? new ModuleDoc(dirname(childFullPath), item.alias)
        : fileDocs;

      recipient.callbacks.push(
        ...child.callbacks.filter((x) => matcher(x.name))
      );
      
      recipient.properties.push(
        ...child.properties.filter((x) => matcher(x.name))
      );
      
      recipient.functions.push(
      ...child.functions.filter((x) => matcher(x.name))
      );
      
      recipient.classes.push(...child.classes.filter((x) => matcher(x.name)));
      
      recipient.interfaces.push(
        ...child.interfaces.filter((x) => matcher(x.name))
      );
    }
  });

  return fileDocs;
}

function loadFile(fullPath: string): FileToParse {
  const src = readFileSync(fullPath, "utf8");
  var filename = basename(fullPath);
  var dir = dirname(fullPath);
  return { dir, filename, contents: src };
}

function parseExport(exp: ts.ExportDeclaration, docs: ModuleDoc): Export {
  /* we can have:
  export * from "someFile";
  export * as moduleName from "someFile";
  export {SomeType} from "someFile";
  */

  var moduleName = exp.moduleSpecifier.getText();
  var alias: string | null = null;
  var types: string[] = [];

  var namespaceExport = findChild<ts.NamespaceExport>(
    exp,
    ts.SyntaxKind.NamespaceExport
  );
  if (namespaceExport) {
    alias = namespaceExport.name.getText();
  }

  var namedExports = findChild<ts.NamedExports>(
    exp,
    ts.SyntaxKind.NamedExports
  );
  if (namedExports) {
    namedExports.elements.forEach((x) => types.push(x.name.getText()));
  }

  console.log('got', alias, moduleName, types);
  return {
    alias,
    moduleName,
    types,
  };
}

export interface Export {
  moduleName: string;
  alias?: string;
  types: string[];
}
