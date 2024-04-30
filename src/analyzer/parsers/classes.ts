import ts from 'typescript';
import { ClassDoc, ArgumentDocs, FunctionDocs } from '../../definitions';
import { isExported } from '../../utils';
import { getDocNode, mergeDocs } from '../utils/docs';
import { findChildRecursive, findChildIndex } from '../utils/nodes';
import { parseMethodSignature, parsePropertyDeclaration } from '../utils/members';
import { parseFunction, parseFunctionDocs } from './functions';

export function parseClass(classNode: ts.ClassDeclaration): ClassDoc {
    if (!isExported(classNode)) {
        return null;
    }

    const docNode = getDocNode(classNode);
    const classDoc = new ClassDoc(classNode.name.getText(), docNode ? mergeDocs(docNode.comment) : null);

    const constructor = findChildRecursive(classNode, ts.SyntaxKind.Constructor);
    if (constructor) {
        classDoc.constr = parseConstructor(<ts.ConstructorDeclaration>constructor);
    }

    const braceToken = findChildIndex(classNode, ts.SyntaxKind.OpenBraceToken);
    const syntaxListNode = classNode.getChildAt(braceToken + 1);
    syntaxListNode.getChildren().forEach((child) => {
        switch (child.kind) {
            case ts.SyntaxKind.FunctionDeclaration:
            case ts.SyntaxKind.MethodDeclaration: {
                const funcDecl = <ts.FunctionDeclaration>child;
                const func = parseFunction(funcDecl, false);
                classDoc.functions.push(func);
                break;
            }

            case ts.SyntaxKind.MethodSignature: {
                const method = <ts.MethodSignature>child;
                const func = parseMethodSignature(method);
                classDoc.functions.push(func);
                break;
            }
            case ts.SyntaxKind.PropertyDeclaration:
                parsePropertyDeclaration(<ts.PropertyDeclaration>child, classDoc);
                break;
        }
    });

    return classDoc;
}

function parseConstructor(method: ts.ConstructorDeclaration): FunctionDocs {
    const f = new FunctionDocs('constructor', 'constructor');
    f.summary;
    method.parameters.forEach((p) => {
        f.arguments.push(new ArgumentDocs(p.name.getText(), p.type.getText(), ''));
    });
    const docs = getDocNode(method);
    if (docs) {
        parseFunctionDocs(f, docs);
    }

    return f;
}
