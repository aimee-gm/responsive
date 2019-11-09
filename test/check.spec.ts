import mockFs from "mock-fs";
import { expect } from "chai";
import path from "path";
import * as cosmiconfig from "cosmiconfig";
import sinon from "sinon";

import { check } from "../bin/check";

describe("bin/check()", () => {
  beforeEach(() => {
    sinon.stub(cosmiconfig, "cosmiconfig").returns({
      async search() {
        return {
          filepath: path.resolve(process.cwd(), "./responsiverc.json"),
          config: { srcDir: "./source", outDir: "./output" }
        };
      }
    } as any);
  });

  afterEach(() => {
    sinon.restore();
    mockFs.restore();
  });

  context("no resized images exist", () => {
    beforeEach(() => {
      mockFs({
        "./source/dir/pic1.jpg": "",
        "./source/dir/pic2.jpg": ""
      });
    });

    it("should return an exit code of 2", async () => {
      sinon.stub(console, "log");
      const exitCode = await check();
      expect(exitCode).to.equal(2);
    });

    it("should log the source images with missing resizes", async () => {
      const consoleStub = sinon.stub(console, "log");

      await check();

      expect(consoleStub.args).to.deep.equal([
        ["Found 2 source images"],
        ["❌  Missing 3 resized images for dir/pic1.jpg"],
        ["❌  Missing 3 resized images for dir/pic2.jpg"]
      ]);
    });
  });

  context("some images have been completely resized", () => {
    beforeEach(() => {
      mockFs({
        "./source/dir/pic1.jpg": "",
        "./source/dir/pic2.jpg": "",
        "./output/dir/pic1-400.jpg": "",
        "./output/dir/pic1-800.jpg": "",
        "./output/dir/pic1-1600.jpg": ""
      });
    });

    it("should return an exit code of 1", async () => {
      sinon.stub(console, "log");
      const exitCode = await check();
      expect(exitCode).to.equal(1);
    });

    it("should log the source images with missing resizes", async () => {
      const consoleStub = sinon.stub(console, "log");
      await check();
      expect(consoleStub.args).to.deep.equal([
        ["Found 2 source images"],
        ["❌  Missing 3 resized images for dir/pic2.jpg"]
      ]);
    });
  });

  context("some partial resized images exist", () => {
    beforeEach(() => {
      mockFs({
        "./source/dir/pic1.jpg": "",
        "./source/dir/pic2.jpg": "",
        "./output/dir/pic1-400.jpg": "",
        "./output/dir/pic1-800.jpg": "",
        "./output/dir/pic1-1600.jpg": "",
        "./output/dir/pic2-400.jpg": ""
      });
    });

    it("should return an exit code of 1", async () => {
      sinon.stub(console, "log");
      const exitCode = await check();
      expect(exitCode).to.equal(1);
    });

    it("should log the source images with missing resizes", async () => {
      const consoleStub = sinon.stub(console, "log");
      await check();
      expect(consoleStub.args).to.deep.equal([
        ["Found 2 source images"],
        ["❌  Missing 2 resized images for dir/pic2.jpg"]
      ]);
    });
  });

  context("all resized images exist", () => {
    beforeEach(() => {
      mockFs({
        "./source/dir/pic1.jpg": "",
        "./output/dir/pic1-400.jpg": "",
        "./output/dir/pic1-800.jpg": "",
        "./output/dir/pic1-1600.jpg": "",
        "./output/dir/pic2-400.jpg": ""
      });
    });

    it("should return an exit code of 0", async () => {
      sinon.stub(console, "log");
      const exitCode = await check();
      expect(exitCode).to.equal(0);
    });

    it("should log the number of source images", async () => {
      const consoleStub = sinon.stub(console, "log");
      await check();
      expect(consoleStub.args).to.deep.equal([["Found 1 source images"]]);
    });
  });
});
