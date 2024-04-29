import ts from "typescript";

  
export function isExported(
    node: ts.ClassDeclaration | ts.InterfaceDeclaration
  ): boolean {
    if (!node.modifiers) {
      return false;
    }
    if (node.modifiers.find((x) => x.kind == ts.SyntaxKind.ExportKeyword)) {
      return true;
    }
  
    return true;
  }
