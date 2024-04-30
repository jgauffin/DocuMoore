import ts from 'typescript';
import { findChildRecursive } from '../analyzer/utils/nodes';

export function sourceToNode(source: string, fileName?: string): ts.SourceFile {
    const sourceFile = ts.createSourceFile(
        fileName ?? 'file.ts',
        source,
        ts.ScriptTarget.Latest,
        true // setParentNodes -- sets the `parent` property
    );

    return sourceFile;
}

export function sourceToClass(source: string): ts.ClassDeclaration {
    const file = sourceToNode(source);
    const node = findChildRecursive(file, ts.SyntaxKind.ClassDeclaration);
    if (!node) {
        throw new Error('Faoled to find a class.');
    }
    return <ts.ClassDeclaration>node;
}

export function sourceToFunction(source: string): ts.FunctionDeclaration {
    const file = sourceToNode(source);
    const node = findChildRecursive(file, ts.SyntaxKind.FunctionDeclaration);
    if (!node) {
        throw new Error('Fauled to find a function.');
    }
    return <ts.FunctionDeclaration>node;
}
