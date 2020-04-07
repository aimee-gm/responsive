import { expect } from "chai";
import { responsiveImages, shortcode } from "..";

describe("index/responsiveImages()", () => {
  it("should return src and srcset", () => {
    expect(responsiveImages("/src/test/photos/folder1/image1.jpg")).to.eql({
      src: "/assets/images/folder1/image1-1280.jpg",
      srcset:
        "/assets/images/folder1/image1-320.jpg 320w, /assets/images/folder1/image1-640.jpg 640w, /assets/images/folder1/image1-1280.jpg 1280w",
    });
  });
});

describe("index/shortcode()", () => {
  it("should return a html string", () => {
    expect(
      shortcode([
        "(min-width: 1025px) 864px",
        "(min-width: 768px) 736px",
        "(min-width: 645px) 608px",
        "100vw",
      ])("/src/test/photos/folder1/image1.jpg", "An alt to the image")
    ).to.equal(
      `<img src="/assets/images/folder1/image1-1280.jpg" srcset="/assets/images/folder1/image1-320.jpg 320w, /assets/images/folder1/image1-640.jpg 640w, /assets/images/folder1/image1-1280.jpg 1280w" sizes="(min-width: 1025px) 864px, (min-width: 768px) 736px, (min-width: 645px) 608px, 100vw" alt="An alt to the image" class="">`
    );
  });
});
