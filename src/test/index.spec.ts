import { expect } from "chai";
import { responsiveImages, shortcode } from "..";

describe("index/responsiveImages()", () => {
  it("should return src and srcset", () => {
    expect(responsiveImages("/src/test/photos/folder1/image1.jpg")).to.eql({
      src: "/assets/images/folder1/image1-32.jpg",
      srcset:
        "/assets/images/folder1/image1-32.jpg 32w, /assets/images/folder1/image1-64.jpg 64w, /assets/images/folder1/image1-128.jpg 128w"
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
        "100vw"
      ])("/src/test/photos/folder1/image1.jpg", "An alt to the image")
    ).to.equal(
      `<img src="/assets/images/folder1/image1-32.jpg" srcset="/assets/images/folder1/image1-32.jpg 32w, /assets/images/folder1/image1-64.jpg 64w, /assets/images/folder1/image1-128.jpg 128w" sizes="(min-width: 1025px) 864px, (min-width: 768px) 736px, (min-width: 645px) 608px, 100vw" alt="An alt to the image" class="">`
    );
  });
});
