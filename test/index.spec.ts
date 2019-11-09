import { expect } from "chai";
import path from "path";
import * as cosmiconfig from "cosmiconfig";
import sinon from "sinon";
import { replaceImgSrc } from "../index";

describe("index", () => {
  beforeEach(() => {
    sinon.stub(cosmiconfig, "cosmiconfig").returns({
      async search() {
        return {
          filepath: path.resolve(process.cwd(), "./responsiverc.json"),
          config: {
            srcDir: "./source",
            outDir: "./output",
            srcRewrite: "/assets/images"
          }
        };
      }
    } as any);
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should replace image URLs with defaults if there is no replacer", async () => {
    const output = await replaceImgSrc(`<img src="/source/image.jpg">`);

    expect(output).to.equal(
      `<img src="/assets/images/image-400.jpg" srcset="/assets/images/image-400.jpg 400w, /assets/images/image-800.jpg 800w, /assets/images/image-1600.jpg 1600w" sizes="100vw">`
    );
  });

  it("should replace image URLs", async () => {
    const replacer = sinon.stub().returns({
      src: "/assets/images/image-400.jpg",
      srcset: [
        "/assets/images/image-400.jpg 400w",
        "/assets/images/image-800.jpg 400w"
      ],
      sizes: ["(max-width: 320px) 280px", "(max-width: 480px) 440px", "800px"]
    });
    const output = await replaceImgSrc(
      `<img src="/source/image.jpg">`,
      replacer
    );

    expect(replacer.firstCall.args).to.deep.equal([
      [
        {
          filePath: "/assets/images/image-400.jpg",
          size: 400
        },
        {
          filePath: "/assets/images/image-800.jpg",
          size: 800
        },
        {
          filePath: "/assets/images/image-1600.jpg",
          size: 1600
        }
      ]
    ]);

    expect(output).to.equal(
      `<img src="/assets/images/image-400.jpg" srcset="/assets/images/image-400.jpg 400w, /assets/images/image-800.jpg 400w" sizes="(max-width: 320px) 280px, (max-width: 480px) 440px, 800px">`
    );
  });
});
