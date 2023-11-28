import ts from "typescript";
import { readFileSync } from "node:fs";
import path from "node:path";
import { createSolidityGenerator } from "./generator";

export interface AstVisitor<TGenerator extends CodeGenerator> {
  handlerMap: Partial<Record<ts.SyntaxKind, NodeHandler<TGenerator>>>;
  generator: TGenerator;
  extend: (
    handlers: Partial<Record<ts.SyntaxKind, NodeHandler<TGenerator>>>
  ) => AstVisitor<TGenerator>;
  visit: (node: ts.Node) => void;
}

export interface CodeGenerator {
  getDefaultHandlerMap():
    | Partial<Record<ts.SyntaxKind, NodeHandler<CodeGenerator>>>
    | undefined;
  print(): string;
}

export type NodeHandler<
  TGenerator extends CodeGenerator,
  TNode extends ts.Node = ts.Node
> = (generator: TGenerator, node: TNode) => void;

export function createAstVisitor<TGenerator extends CodeGenerator>(
  generator: TGenerator
): AstVisitor<TGenerator> {
  const handlerMap = generator.getDefaultHandlerMap() ?? {};

  const visitor: AstVisitor<TGenerator> = {
    handlerMap,
    generator,
    extend(handlers) {
      Object.assign(handlerMap, handlers);
      return visitor;
    },
    visit: (node) => {
      const handler = handlerMap[node.kind];
      if (handler) {
        handler(generator, node);
      }
      ts.forEachChild(node, visitor.visit);
    },
  };

  return visitor;
}

export function createSolidityVisitor() {
  return createAstVisitor(createSolidityGenerator());
}

export function compile(fileNames: string[]) {
  const generatedCode: string[] = [];
  for (const fileName of fileNames) {
    const sourceFile = ts.createSourceFile(
      fileName,
      readFileSync(path.join(process.cwd(), fileName)).toString(),
      ts.ScriptTarget.ESNext
    );

    const visitor = createSolidityVisitor();
    visitor.visit(sourceFile);
    const code = visitor.generator.print();
    generatedCode.push(code);
  }
  return generatedCode;
}
