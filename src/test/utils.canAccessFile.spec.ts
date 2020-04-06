import { expect } from "chai";
import mockFs from "mock-fs";

import { canAccessFile } from "../utils/canAccessFile";

describe("utils/canAccessFile()", () => {
  afterEach(() => {
    mockFs.restore();
  });

  it("returns true if it can access the file", async () => {
    mockFs({
      "/test/file": "some contents",
    });

    expect(await canAccessFile("/test/file")).to.equal(true);
  });

  it("returns false if it cannot access the file", async () => {
    mockFs({
      "/test/tricked": "i have a different name",
    });

    expect(await canAccessFile("/test/file")).to.equal(false);
  });
});
