import ts, { JSDocReturnTag } from "typescript";
import {
  TypeDoc,
  ArgumentDocs,
  FunctionDocs,
  PropertyDocs,
} from "../../definitions";
import { getDocNode, mergeDocs } from "./docs";
import { findChildIndex, getTypeNameFromNode, findChild } from "./nodes";
import { parseFunctionDocs } from "../parsers/functions";

export function parsePropertyDeclaration(
  propDecl: ts.PropertyDeclaration,
  parent: TypeDoc
) {
  const propDocs = getDocNode(propDecl);

  if (propDecl.type.kind == ts.SyntaxKind.FunctionType) {
    const funcType = <ts.FunctionTypeNode>propDecl.type;
    const callBack = new FunctionDocs(propDecl.name.getText(), "");
    funcType.parameters.forEach((p) => {
      callBack.arguments.push(
        new ArgumentDocs(p.name.getText(), p.type.getText(), "")
      );
    });

    const arrowIndex = findChildIndex(
      funcType,
      ts.SyntaxKind.EqualsGreaterThanToken
    );
    if (arrowIndex >= 0) {
      const keyword = funcType.getChildAt(arrowIndex + 1);
      callBack.returnType = getTypeNameFromNode(keyword);

      const returnDoc = findChild<JSDocReturnTag>(
        propDocs,
        ts.SyntaxKind.JSDocReturnTag
      );
      if (returnDoc) {
        callBack.returnSummary = mergeDocs(returnDoc.comment);
      }
    }

    if (propDocs) {
      parseFunctionDocs(callBack, propDocs);
    }

    parent.callbacks.push(callBack);
  } else {
    const propDoc = new PropertyDocs(
      propDecl.name.getText(),
      getTypeNameFromNode(propDecl.type),
      mergeDocs(propDocs.comment)
    );
    parent.properties.push(propDoc);
  }
}

export function parseMethodSignature(method: ts.MethodSignature): FunctionDocs {
  const f = new FunctionDocs(method.name.getText(), method.name.getText());
  f.summary;
  method.parameters.forEach((p) => {
    f.arguments.push(
      new ArgumentDocs(p.name.getText(), p.type.getText(), "")
    );
  });
  return f;
}
