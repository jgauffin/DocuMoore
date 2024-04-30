import ts from "typescript";

export function findChildRecursive(
    node: ts.Node,
    nodeType: ts.SyntaxKind
  ): ts.Node | null {
    let nodeToReturn: ts.Node | null = null;
    node.getChildren().forEach((child) => {
      if (child.kind == nodeType) {
        nodeToReturn = child;
        return;
      }
    });
  
    node.getChildren().forEach((child) => {
      const result = findChildRecursive(child, nodeType);
      if (result) {
        nodeToReturn = result;
      }
    });
  
    return nodeToReturn;
  }
  
  export function findChildIndex(parent: ts.Node, kind: ts.SyntaxKind): number {
    const index = parent.getChildren().findIndex((x) => x.kind == kind);
    return index == -1 ? null : index;
  }
  
  export function findChild<T extends ts.Node>(parent: ts.Node, kind: ts.SyntaxKind): T  | null {
    const index = parent.getChildren().findIndex((x) => x.kind == kind);
    return index == -1 ? null : <T>parent.getChildAt(index);
  }
  
  export function printAllChildren(node: ts.Node, depth = 0) {
    if (node.kind == ts.SyntaxKind.FunctionDeclaration) {
      const fun = <ts.FunctionDeclaration>node;
      console.log('## func not used,', fun);
    }
  
    console.log(
      new Array(depth + 1).join("----"),
      ts.SyntaxKind[node.kind],
      node.kind,
      node.pos,
      node.end
    );
    depth++;
    node.getChildren().forEach((c) => printAllChildren(c, depth));
  }
  
  export function getTypeNameFromNode(type: ts.Node) {
    let typeName = "";
    switch (type.kind) {
      case ts.SyntaxKind.StringKeyword:
        typeName = "string";
        break;
      case ts.SyntaxKind.NumberKeyword:
        typeName = "number";
        break;
      case ts.SyntaxKind.TypeReference:
        typeName = (<ts.TypeReferenceNode>type).typeName.getText();
        break;
      default:
        console.log("UNKNOWN TYPE NAME", ts.SyntaxKind[type.kind]);
        break;
    }
    return typeName;
  }
  