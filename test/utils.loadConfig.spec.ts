import { expect } from "chai";
import sinon from "sinon";
import * as cosmiconfig from "cosmiconfig";
import path from "path";
import { loadConfig } from "../utils/loadConfig";

function configStub(config: {} | null = null) {
  sinon
    .stub(cosmiconfig, "cosmiconfig")
    .withArgs("responsive")
    .returns({
      search: sinon
        .stub()
        .withArgs(process.cwd())
        .resolves(config)
    } as any);
}

describe("loadConfig()", () => {
  afterEach(() => {
    sinon.restore();
  });

  it("rejects when it cannot find a config file", async () => {
    configStub();
    await expect(loadConfig()).to.be.rejectedWith(
      "Cannot load responsive configuration file"
    );
  });

  it("resolves the default config with an empty file", async () => {
    configStub({
      filepath: path.resolve(process.cwd(), ".responsiverc"),
      config: {}
    });

    const config = await loadConfig();

    expect(config).to.deep.include({
      ext: ["jpg", "jpeg", "png"],
      outDir: process.cwd(),
      srcDir: process.cwd(),
      sizes: [400, 800, 1600],
      rewrite: { from: "/", to: "/" }
    });
  });

  it("resolves the correct configuration when found", async () => {
    configStub({
      filepath: path.resolve(process.cwd(), ".responsiverc"),
      config: {
        ext: ["gif"],
        outDir: "./output",
        srcDir: "./source",
        sizes: [20, 30, 40],
        srcRewrite: "./rewrite"
      }
    });

    const config = await loadConfig();

    expect(config).to.deep.include({
      ext: ["gif"],
      outDir: path.resolve(process.cwd(), "./output"),
      srcDir: path.resolve(process.cwd(), "./source"),
      sizes: [20, 30, 40],
      rewrite: { from: "/source", to: "/rewrite" }
    });
  });
});
