import ts from 'typescript';
import { FunctionDocs, ArgumentDocs } from '../../definitions';
import { findChildIndex, findChildRecursive, getTypeNameFromNode } from '../utils/nodes';
import { getDocNode } from '../utils/docs';

export function parseFunction(func: ts.FunctionLikeDeclaration, isGlobalFunction: boolean): FunctionDocs {
    if (isGlobalFunction) {
        const pub = findChildRecursive(func, ts.SyntaxKind.ExportKeyword);
        if (!pub) {
            console.log('not public', func.name.getText());
            return;
        }
    }

    const name = func.name.getText();
    const f = new FunctionDocs(name, name);

    const index = findChildIndex(func, ts.SyntaxKind.ColonToken);
    if (index >= 0) {
        // return value is not the colon, but the statement after ;)
        const returnType = func.getChildAt(index + 1);
        f.returnType = returnType.getText();
    }

    //printAllChildren(func);

    for (let index = 0; index < func.parameters.length; index++) {
        const element = func.parameters[index];
        const type = element.getChildAt(2);
        const typeName = getTypeNameFromNode(type);

        const p = new ArgumentDocs(element.name.getText(), typeName, '');
        f.arguments.push(p);
    }

    const docs = getDocNode(func);
    parseFunctionDocs(f, docs);

    // let context :ts.TransformationContext={

    // }
    // ts.visitEachChild(func, child => {
    //     console.log(child.kind);
    //     return child;
    // }, context);

    return f;
}

export function parseMethod(func: ts.MethodDeclaration, isGlobalFunction: boolean): FunctionDocs {
    if (isGlobalFunction) {
        const pub = findChildRecursive(func, ts.SyntaxKind.ExportKeyword);
        if (!pub) {
            console.log('not public', func.name.getText());
            return;
        }
    }

    const name = func.name.getFullText();
    const f = new FunctionDocs(name, name);

    const index = findChildIndex(func, ts.SyntaxKind.ColonToken);
    if (index >= 0) {
        // return value is not the colon, but the statement after ;)
        const returnType = func.getChildAt(index + 1);
        f.returnType = returnType.getText();
    }

    //printAllChildren(func);

    for (let index = 0; index < func.parameters.length; index++) {
        const element = func.parameters[index];
        const type = element.getChildAt(2);
        const typeName = getTypeNameFromNode(type);

        const p = new ArgumentDocs(element.name.getText(), typeName, '');
        f.arguments.push(p);
    }

    const docs = getDocNode(func);
    parseFunctionDocs(f, docs);

    // let context :ts.TransformationContext={

    // }
    // ts.visitEachChild(func, child => {
    //     console.log(child.kind);
    //     return child;
    // }, context);

    return f;
}


export function parseFunctionDocs(f: FunctionDocs, docs: ts.JSDoc) {
    if (!docs) {
        throw new Error('Docs was not specified for ' + f.name);
    }

    f.summary = docs.comment.toString();

    const pDocs = new Map<string, string>();
    for (let index = 0; index < docs.getChildren().length; index++) {
        const element = docs.getChildren()[index];
        switch (element.kind) {
            case ts.SyntaxKind.JSDocParameterTag:
                {
                    const tag = <ts.JSDocParameterTag>element;
                    pDocs.set((<ts.Identifier>tag.getChildAt(1)).text, tag.comment?.toString() ?? '');
                }
                break;
            case ts.SyntaxKind.JSDocTag:
                {
                    const cmd = <ts.JSDocTag>element;
                    f.tags.set(cmd.getChildAt(0).getFullText(), cmd.comment?.toString() ?? '');
                }
                break;
            case ts.SyntaxKind.JSDocReturnTag:
                f.returnSummary = (<ts.JSDocReturnTag>element).comment?.toString() ?? '';
                break;
        }
    }

    f.arguments.forEach((arg) => {
        const sum = pDocs.get(arg.name);
        if (sum) {
            arg.summary = sum;
        }
    });
}
