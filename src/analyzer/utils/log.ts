import ts from "typescript";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function printRecusivly(obj: any, path: any[] = [], depth: number = 0, wrap: boolean = false) {
    if (path.includes(obj)){
        console.log('recursicve');
        return;
    }
    path.push(obj);
  
    if (wrap && typeof obj === "object"){
      console.log('{'.padStart(depth*2+1, ' '));
      depth++;
    }
  
    for (const key in obj) {
      if (!Object.prototype.hasOwnProperty.call(obj, key)) continue; // skip this property
  
      const value = obj[key];
      if (value === undefined || value === null){
        continue;
      }
  
      log("".padStart(depth * 2, " ") + `${key}: `);
      if (Array.isArray(value)) {
        if (value.length == 0){
          console.log('[]');
        }
        else{
          console.log("[");
          for (let index = 0; index < value.length; index++) {
            const element = value[index];
            path.push(index);
            printRecusivly(element, path, depth + 1, true);
            path.pop();
          }
          console.log("]".padStart(depth * 2 + 1, " "));
          }
      } else if (typeof value === "object") {
        console.log("{");
        printRecusivly(value, path, depth + 1);
        console.log("}".padStart(depth * 2 + 1, " "));
      } else {
        console.log(value.toString());
      }
    }
  
    if (wrap && typeof obj === "object"){
      depth--;
      console.log('}'.padStart(depth*2+1, ' '));
    }
  
  
    path.pop();
  }

  export function printAllChildren(node: ts.Node, depth = 0) {
    console.log(new Array(depth+1).join('----'), ts.SyntaxKind[node.kind], node.pos, node.end);
    depth++;
    node.getChildren().forEach(c=> printAllChildren(c, depth));
}
  
  function log(msg: string) {
    process.stdout.write(msg);
  }