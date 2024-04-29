import ts, { MethodSignature } from "typescript";
import { InterfaceDoc } from "../../definitions";
import { isExported } from "../../utils";
import { parseMethodSignature, parsePropertyDeclaration } from "../utils/members";
import { mergeDocs } from "../utils/docs";
import { findChild, findChildIndex } from "../utils/nodes";

export function parseInterface(interfaceNode: ts.InterfaceDeclaration): InterfaceDoc {
    if (!isExported(interfaceNode)) {
      return null;
    }
  
    var docs = findChild<ts.JSDoc>(interfaceNode, ts.SyntaxKind.JSDoc);
    var ifDoc = new InterfaceDoc(
      interfaceNode.name.getText(),
      mergeDocs(docs.comment)
    );
  
    var braceToken = findChildIndex(interfaceNode, ts.SyntaxKind.OpenBraceToken);
    var syntaxListNode = interfaceNode.getChildAt(braceToken + 1);
    syntaxListNode.getChildren().forEach((child) => {
      switch (child.kind) {
        case ts.SyntaxKind.MethodSignature:
          var method = <MethodSignature>child;
          var func = parseMethodSignature(method);
          ifDoc.functions.push(func);
          break;
        case ts.SyntaxKind.PropertyDeclaration:
          parsePropertyDeclaration(<ts.PropertyDeclaration>child, ifDoc);
          break;
      }
    });
  
    return ifDoc;
  }
  