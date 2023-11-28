import { describe, expect, it, beforeEach } from "bun:test";
import { compile } from "../src";
import { readFileSync } from "node:fs";

describe("Vallum specification contract", () => {
  let generatedCodes: string[];

  beforeEach(() => {
    generatedCodes = compile(["tests/contract/Spec.ts"]);
  });

  it("should compile", () => {
    expect(generatedCodes).toBeDefined();
    expect(generatedCodes.length).toBe(1);
  });

  it("should generate the expected solidity specification contracts", () => {
    const expectedCode = readFileSync("tests/contract/Spec.sol").toString();
    expect(generatedCodes[0]).toBe(expectedCode);
  });
});
