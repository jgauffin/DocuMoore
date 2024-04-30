import { readFileSync } from 'fs';
import { basename, dirname, join } from 'path';
import ts from 'typescript';
import { ModuleDoc, TypeDoc } from '../definitions';
import { parseClass } from './parsers/classes';
import { parseFunction } from './parsers/functions';
import { parseInterface } from './parsers/interfaces';
import { findChild } from './utils/nodes';

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
export function parseFile(fileOrFileName: FileToParse | string): ModuleDoc {
    return parseFileInner(fileOrFileName, []);
}

function parseFileInner(fileOrFileName: FileToParse | string, typesToExport: string[]): ModuleDoc {
    const file = typeof fileOrFileName === 'string' ? loadFile(fileOrFileName) : fileOrFileName;

    const sourceFile = ts.createSourceFile(`${file.dir}/${file.filename}`, file.contents, ts.ScriptTarget.ES5, true);
    const fileDocs = new ModuleDoc(file.dir, file.filename);
    const exports: Export[] = [];

    sourceFile.getChildren().forEach((child) => {
        child.getChildren().forEach((node) => {
            switch (node.kind) {
                case ts.SyntaxKind.ExportDeclaration:
                    {
                        const decl = <ts.ExportDeclaration>node;
                        const exp = parseExport(decl);
                        exports.push(exp);
                    }
                    break;

                case ts.SyntaxKind.FunctionDeclaration:
                    {
                        const func = parseFunction(<ts.FunctionDeclaration>node, true);
                        if (func) {
                            fileDocs.functions.push(func);
                        }
                    }

                    break;
                case ts.SyntaxKind.InterfaceDeclaration:
                    {
                        const intf = parseInterface(<ts.InterfaceDeclaration>node);
                        if (canExport(intf, typesToExport)) {
                            console.log('intf', intf);
                            fileDocs.interfaces.push(intf);
                        }
                    }
                    break;
                case ts.SyntaxKind.ClassDeclaration:
                    {
                        const cls = parseClass(<ts.ClassDeclaration>node);
                        if (canExport(cls, typesToExport)) {
                            console.log('cls', cls);
                            fileDocs.classes.push(cls);
                        }
                    }
                    break;
                default:
                    console.log('UNKNWON', ts.SyntaxKind[node.kind], node.pos, node.end);
                    break;
            }
        });
    });

    exports.forEach((item) => {
        if (item.moduleName[0] == '.') {
            const childFullPath = join(file.dir, item.moduleName);
            const importedFile = loadFile(childFullPath);
            const child = parseFileInner(importedFile, item.types);
            const matcher = function (name: string): boolean {
                if (item.types.length == 0) {
                    return true;
                }

                return item.types.findIndex((x) => x == name) >= 0;
            };

            const recipient = item.alias ? new ModuleDoc(dirname(childFullPath), item.alias) : fileDocs;

            recipient.callbacks.push(...child.callbacks.filter((x) => matcher(x.name)));

            recipient.properties.push(...child.properties.filter((x) => matcher(x.name)));

            recipient.functions.push(...child.functions.filter((x) => matcher(x.name)));

            recipient.classes.push(...child.classes.filter((x) => matcher(x.name)));

            recipient.interfaces.push(...child.interfaces.filter((x) => matcher(x.name)));
        }
    });

    return fileDocs;
}

function loadFile(fullPath: string): FileToParse {
    const src = readFileSync(fullPath, 'utf8');
    const filename = basename(fullPath);
    const dir = dirname(fullPath);
    return { dir, filename, contents: src };
}

function parseExport(exp: ts.ExportDeclaration): Export {
    /* we can have:
  export * from "someFile";
  export * as moduleName from "someFile";
  export {SomeType} from "someFile";
  */

    const moduleName = exp.moduleSpecifier.getText();
    let alias: string | null = null;
    const types: string[] = [];

    const namespaceExport = findChild<ts.NamespaceExport>(exp, ts.SyntaxKind.NamespaceExport);
    if (namespaceExport) {
        alias = namespaceExport.name.getText();
    }

    const namedExports = findChild<ts.NamedExports>(exp, ts.SyntaxKind.NamedExports);
    if (namedExports) {
        namedExports.elements.forEach((x) => types.push(x.name.getText()));
    }

    console.log('got', alias, moduleName, types);
    return {
        alias,
        moduleName,
        types
    };
}

export interface Export {
    moduleName: string;
    alias?: string;
    types: string[];
}
function canExport(type: TypeDoc, typesToExport: string[]): boolean {
    if (!type) {
        return false;
    }

    if (typesToExport.length == 0) {
        return true;
    }

    return typesToExport.includes(type.name);
}
