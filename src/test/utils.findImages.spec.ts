import { expect } from "chai";
import mockFs from "mock-fs";

import { findImages } from "../utils/findImages";

describe("utils/findImages()", () => {
  afterEach(() => {
    mockFs.restore();
  });

  it("returns a list of all the matching image files", async () => {
    mockFs({
      "/my/image/dir/pic1.jpg": "",
      "/my/image/dir/pic2.jpeg": "",
      "/my/image/dir/pic3.png": "",
      "/my/image/dir/not-a-pic.txt": ""
    });

    expect(
      await findImages("/my/image", ["jpg", "jpeg", "png"])
    ).to.deep.equal(["dir/pic1.jpg", "dir/pic2.jpeg", "dir/pic3.png"]);
  });

  it("returns matching images with only one extension configured", async () => {
    mockFs({
      "/my/image/dir/pic1.jpg": "",
      "/my/image/dir/pic2.jpeg": "",
      "/my/image/dir/pic3.png": "",
      "/my/image/dir/not-a-pic.txt": ""
    });

    expect(await findImages("/my/image", ["jpg"])).to.deep.equal([
      "dir/pic1.jpg"
    ]);
  });
});
