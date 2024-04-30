import ts from 'typescript';

/**
 * Checks if the export keyword is specified as a modifier.
 * @param node Node to check
 * @returns true if the node is exported.
 */
export function isExported(node: ts.ClassDeclaration | ts.InterfaceDeclaration): boolean {
    if (!node.modifiers) {
        return false;
    }
    if (node.modifiers.find((x) => x.kind == ts.SyntaxKind.ExportKeyword)) {
        return true;
    }

    return true;
}
