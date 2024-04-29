import ts from "typescript";
import { ClassDoc, ArgumentDocs, FunctionDocs } from "../../definitions";
import { isExported } from "../../utils";
import { getDocNode, mergeDocs } from "../utils/docs";
import { findChildRecursive, findChildIndex } from "../utils/nodes";
import { parseMethodSignature, parsePropertyDeclaration } from "../utils/members";
import { parseFunctionDocs } from "./functions";


export function parseClass(classNode: ts.ClassDeclaration): ClassDoc {
    if (!isExported(classNode)) {
      return null;
    }
  
    var docNode = getDocNode(classNode);
    var classDoc = new ClassDoc(
      classNode.name.getText(),
      docNode ? mergeDocs(docNode.comment) : null
    );
  
    var constructor = findChildRecursive(classNode, ts.SyntaxKind.Constructor);
    if (constructor) {
      classDoc.constr = parseConstructor(<ts.ConstructorDeclaration>constructor);
    }
  
    var braceToken = findChildIndex(classNode, ts.SyntaxKind.OpenBraceToken);
    var syntaxListNode = classNode.getChildAt(braceToken + 1);
    syntaxListNode.getChildren().forEach((child) => {
      switch (child.kind) {
        case ts.SyntaxKind.MethodSignature:
          var method = <ts.MethodSignature>child;
          var func = parseMethodSignature(method);
          classDoc.functions.push(func);
          break;
        case ts.SyntaxKind.PropertyDeclaration:
          parsePropertyDeclaration(<ts.PropertyDeclaration>child, classDoc);
          break;
      }
    });
  
    return classDoc;
  }
  
function parseConstructor(method: ts.ConstructorDeclaration): FunctionDocs {
    var f = new FunctionDocs("constructor", "constructor");
    f.summary;
    method.parameters.forEach((p) => {
      f.arguments.push(
        new ArgumentDocs(p.name.getText(), p.type.getText(), "")
      );
    });
    var docs = getDocNode(method);
    if (docs) {
      parseFunctionDocs(f, docs);
    }
  
    return f;
  }
  
