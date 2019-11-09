import { expect } from "chai";

import { resizedPath } from "../utils/resizedPath";

describe("resizedPath()", () => {
  it("should return the path to the resized file", () => {
    expect(resizedPath("./my/path/to/file.jpg", 400)).to.equal(
      "my/path/to/file-400.jpg"
    );
  });

  it("should respect a custom delimiter", () => {
    expect(
      resizedPath("./my/path/to/file.jpg", 400, {
        delimiter: "."
      })
    ).to.equal("my/path/to/file.400.jpg");
  });
});
