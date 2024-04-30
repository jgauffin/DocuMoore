import ts, { MethodSignature } from 'typescript';
import { InterfaceDoc } from '../../definitions';
import { isExported } from '../../utils';
import { parseMethodSignature, parsePropertyDeclaration } from '../utils/members';
import { mergeDocs } from '../utils/docs';
import { findChild, findChildIndex } from '../utils/nodes';

export function parseInterface(interfaceNode: ts.InterfaceDeclaration): InterfaceDoc {
    if (!isExported(interfaceNode)) {
        return null;
    }

    const docs = findChild<ts.JSDoc>(interfaceNode, ts.SyntaxKind.JSDoc);
    const ifDoc = new InterfaceDoc(interfaceNode.name.getText(), mergeDocs(docs.comment));

    const braceToken = findChildIndex(interfaceNode, ts.SyntaxKind.OpenBraceToken);
    const syntaxListNode = interfaceNode.getChildAt(braceToken + 1);
    syntaxListNode.getChildren().forEach((child) => {
        switch (child.kind) {
            case ts.SyntaxKind.MethodSignature:
                {
                    const method = <MethodSignature>child;
                    const func = parseMethodSignature(method);
                    ifDoc.functions.push(func);
                }
                break;
            case ts.SyntaxKind.PropertyDeclaration:
                parsePropertyDeclaration(<ts.PropertyDeclaration>child, ifDoc);
                break;
        }
    });

    return ifDoc;
}
