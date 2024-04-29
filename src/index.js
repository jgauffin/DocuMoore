"use strict";
exports.__esModule = true;
var fs = require("fs");
var typescript_1 = require("typescript");
// function printAllChildren(node, depth = 0) {
//     console.log(new Array(depth + 1).join('----'), ts.formatSyntaxKind(node.kind), node.pos, node.end);
//     depth++;
//     node.getChildren().forEach(c=> printAllChildren(c, depth));
// }
var src = fs.readFileSync("../example/index.ts", "utf8");
var sourceFile = typescript_1["default"].createSourceFile("foo.ts", src, typescript_1["default"].ScriptTarget.ES5, true);
//printAllChildren(sourceFile);
/*

 SourceFile 0 135
---- SyntaxList 0 135
-------- FunctionDeclaration 0 135
------------ JSDocComment 2 79
---------------- JSDocParameterTag 35 77
-------------------- Identifier 36 41
-------------------- Identifier 42 46
------------ SyntaxList 0 87
---------------- ExportKeyword 0 87
------------ FunctionKeyword 87 96
------------ Identifier 96 107
------------ OpenParenToken 107 108
------------ SyntaxList 108 120
---------------- Parameter 108 120
-------------------- Identifier 108 112
-------------------- ColonToken 112 113
-------------------- StringKeyword 113 120
------------ CloseParenToken 120 121
------------ ColonToken 121 122
------------ VoidKeyword 122 127
------------ Block 127 135
---------------- FirstPunctuation 127 128
---------------- SyntaxList 128 128
---------------- CloseBraceToken 128 135
---- EndOfFileToken 135 135
*/
var DocParameter = /** @class */ (function () {
    function DocParameter() {
    }
    return DocParameter;
}());
var Function = /** @class */ (function () {
    function Function(name, docuId) {
        this.name = name;
        this.docuId = docuId;
        this.arguments = [];
        this.tags = new Map();
    }
    return Function;
}());
var SeeAlso = /** @class */ (function () {
    function SeeAlso(name) {
        this.name = name;
    }
    return SeeAlso;
}());
var FunctionParameter = /** @class */ (function () {
    function FunctionParameter(name, typeName, summary) {
        this.name = name;
        this.typeName = typeName;
        this.summary = summary;
    }
    return FunctionParameter;
}());
sourceFile
    .getChildren()[0]
    .getChildren()
    .forEach(function (node) {
    switch (node.kind) {
        case typescript_1["default"].SyntaxKind.FunctionDeclaration:
            parseFunction(node);
            break;
        default:
            console.log(typescript_1["default"].SyntaxKind[node.kind], node.pos, node.end);
            break;
    }
});
function parseFunction(func) {
    var pub = findChildRecursive(func, typescript_1["default"].SyntaxKind.ExportKeyword);
    if (!pub) {
        console.log("not public");
        return;
    }
    var name = func.name.getFullText();
    var f = new Function(name, name);
    printAllChildren(func);
    for (var index = 0; index < func.parameters.length; index++) {
        var element = func.parameters[index];
        var type = element.getChildAt(2);
        var typeName = "any";
        console.log(type.kind);
        switch (type.kind) {
            case typescript_1["default"].SyntaxKind.StringKeyword:
                typeName = "string";
                break;
            case typescript_1["default"].SyntaxKind.NumberKeyword:
                typeName = "number";
                break;
            case typescript_1["default"].SyntaxKind.TypeReference:
                typeName = type.typeName.getText();
                break;
            default:
                console.log("IIIIPS", type.kind);
                break;
        }
        var p = new FunctionParameter(element.name.getText(), typeName, '');
        console.log('parameters', p);
        f.arguments.push(p);
    }
    var docs = findChildRecursive(func, typescript_1["default"].SyntaxKind.JSDoc);
    f.summary = docs.comment.toString();
    var pDocs = new Map();
    for (var index = 0; index < docs.getChildren().length; index++) {
        var element = docs.getChildren()[index];
        switch (element.kind) {
            case typescript_1["default"].SyntaxKind.JSDocParameterTag:
                var tag = element;
                console.log('tag', tag);
                pDocs.set(tag.getChildAt(1).text, tag.comment.toString());
                break;
            case typescript_1["default"].SyntaxKind.JSDocTag:
                var cmd = element;
                f.tags.set(cmd.getChildAt(0).getFullText(), cmd.comment.toString());
                break;
        }
    }
    f.arguments.forEach(function (arg) {
        var sum = pDocs.get(arg.name);
        if (!sum) {
            console.log('mssig docs', arg.name);
        }
        else {
            arg.summary = sum;
        }
    });
    console.log('generated func', f);
    // let context :ts.TransformationContext={
    // }
    // ts.visitEachChild(func, child => {
    //     console.log(child.kind);
    //     return child;
    // }, context);
    var parameters = [];
    typescript_1["default"].visitNode(docs, function (node) {
        console.log(node);
        return node;
    });
}
function findChildRecursive(node, nodeType) {
    var nodeToReturn = null;
    node.getChildren().forEach(function (child) {
        console.log('comparing', child.kind, nodeType);
        if (child.kind == nodeType) {
            nodeToReturn = child;
            return;
        }
    });
    console.log('recursive');
    node.getChildren().forEach(function (child) {
        var result = findChildRecursive(child, nodeType);
        console.log();
        if (result) {
            nodeToReturn = result;
        }
    });
    return nodeToReturn;
}
function printAllChildren(node, depth) {
    if (depth === void 0) { depth = 0; }
    if (node.kind == typescript_1["default"].SyntaxKind.FunctionDeclaration) {
        var fun = node;
    }
    console.log(new Array(depth + 1).join('----'), typescript_1["default"].SyntaxKind[node.kind], node.kind, node.pos, node.end);
    depth++;
    node.getChildren().forEach(function (c) { return printAllChildren(c, depth); });
}
