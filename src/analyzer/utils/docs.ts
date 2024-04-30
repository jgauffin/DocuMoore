import ts from "typescript";
import { findChildIndex } from "./nodes";

export function getDocNode(node: ts.Node): ts.JSDoc | null {
    const index = findChildIndex(node, ts.SyntaxKind.JSDoc);
    if (index === null) {
        node.getChildren().forEach(x=>console.log(x.kind == ts.SyntaxKind.JSDoc));
        console.log('##no docs');
        //printAllChildren(node);
      return null;
    }
  
    return <ts.JSDoc>node.getChildAt(index);
  }
  
  export function mergeDocs(
    comment: string | ts.NodeArray<ts.JSDocComment>
  ): string | null {
    if (!comment) {
      return null;
    }
    if (typeof comment === "string") {
      return comment;
    }
  
    return "nodeRrray";
  }
  