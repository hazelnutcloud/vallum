import ts from "typescript";
import { SolidityGenerator, createSolidityHandler } from ".";

export const classHandler = createSolidityHandler({
  syntaxKind: ts.SyntaxKind.ClassDeclaration,
  handler: (generator: SolidityGenerator, node: ts.ClassDeclaration) => {
    generator.code += `contract ${node.name?.text} {}\n`;
  },
});
