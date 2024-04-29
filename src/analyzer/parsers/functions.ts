import ts from "typescript";
import { FunctionDocs, ArgumentDocs } from "../../definitions";
import { findChildIndex, findChildRecursive, getTypeNameFromNode, printAllChildren } from "../utils/nodes";
import { getDocNode } from "../utils/docs";

export function parseFunction(
    func: ts.FunctionDeclaration,
    isGlobalFunction: boolean
  ): FunctionDocs {
    if (isGlobalFunction) {
      const pub = findChildRecursive(func, ts.SyntaxKind.ExportKeyword);
      if (!pub) {
        console.log("not public", func.name.getText());
        return;
      }
    }
  
    var name = func.name.getFullText();
    var f = new FunctionDocs(name, name);
  
    var index = findChildIndex(func, ts.SyntaxKind.ColonToken);
    if (index >= 0) {
      // return value is not the colon, but the statement after ;)
      var returnType = func.getChildAt(index + 1);
      f.returnType = returnType.getText();
    }
  
    printAllChildren(func);
  
    for (let index = 0; index < func.parameters.length; index++) {
      const element = func.parameters[index];
      var type = element.getChildAt(2);
      var typeName = getTypeNameFromNode(type);
  
      var p = new ArgumentDocs(element.name.getText(), typeName, "");
      f.arguments.push(p);
    }
  
    var docs = getDocNode(func);
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
    if (!docs){
        throw new Error("Docs was not specified for " + f.name);
    }
  
    f.summary = docs.comment.toString();
  
    var pDocs = new Map<string, string>();
    for (let index = 0; index < docs.getChildren().length; index++) {
      const element = docs.getChildren()[index];
      switch (element.kind) {
        case ts.SyntaxKind.JSDocParameterTag:
          const tag = <ts.JSDocParameterTag>element;
          pDocs.set((<ts.Identifier>tag.getChildAt(1)).text, tag.comment?.toString() ?? '');
          break;
        case ts.SyntaxKind.JSDocTag:
          let cmd = <ts.JSDocTag>element;
          f.tags.set(cmd.getChildAt(0).getFullText(), cmd.comment?.toString() ?? '');
          break;
        case ts.SyntaxKind.JSDocReturnTag:
          f.returnSummary = (<ts.JSDocReturnTag>element).comment?.toString() ?? '';
          break;
      }
    }
  
    f.arguments.forEach((arg) => {
      var sum = pDocs.get(arg.name);
      if (sum) {
        arg.summary = sum;
      }
    });
  }
  