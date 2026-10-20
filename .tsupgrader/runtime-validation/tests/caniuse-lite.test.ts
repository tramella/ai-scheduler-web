import { createRequire } from "node:module";
import { describe, expect, it } from "vitest";

const require = createRequire(import.meta.url);

describe("caniuse-lite installation", () => {
  it("loads the feature unpacker used by Browserslist", () => {
    const featureUnpackerPath = require.resolve("caniuse-lite/dist/unpacker/feature");

    expect(require(featureUnpackerPath)).toEqual(expect.any(Function));
  });

  it("loads Browserslist", () => {
    expect(require("browserslist")).toEqual(expect.any(Function));
  });
});
