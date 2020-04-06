import { expect } from "chai";
import mockFs from "mock-fs";

import { missingResizedImages } from "../utils/missingResizedImages";

describe("utils/missingResizedImages()", () => {
  afterEach(() => {
    mockFs.restore();
  });

  it("returns a list of missing image sizes with target path", async () => {
    mockFs({
      "/my/built/images/dir/pic-200.jpg": "",
      "/my/built/images/dir/pic-400.jpg": "",
      "/my/built/images/dir/pic-800.jpg": ""
    });

    expect(
      await missingResizedImages("/my/built/images", "dir/pic.jpg", [
        200,
        400,
        800,
        1600
      ])
    ).to.deep.equal([
      {
        exists: false,
        size: 1600,
        target: "/my/built/images/dir/pic-1600.jpg"
      }
    ]);
  });
});
