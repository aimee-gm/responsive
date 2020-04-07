import { expect } from "chai";
import sinon from "sinon";
import * as cosmiconfig from "cosmiconfig";
import path from "path";
import { loadConfig } from "../utils/loadConfig";

function configStub(config: {} | null = null) {
  sinon
    .stub(cosmiconfig, "cosmiconfigSync")
    .withArgs("responsive")
    .returns({
      search: sinon.stub().withArgs(process.cwd()).returns(config),
    } as any);
}

describe("utils/loadConfig()", () => {
  afterEach(() => {
    sinon.restore();
  });

  it("rejects when it cannot find a config file", async () => {
    configStub();
    expect(() => loadConfig()).to.throw(
      "Cannot load responsive configuration file"
    );
  });

  it("resolves the default config with an empty file", () => {
    configStub({
      filepath: path.resolve(process.cwd(), ".responsiverc"),
      config: {},
    });

    const config = loadConfig();

    expect(config).to.deep.include({
      ext: ["jpg", "jpeg", "png"],
      outDir: process.cwd(),
      srcDir: process.cwd(),
      sizes: [400, 800, 1600],
      rewrite: { from: "/", to: "/" },
      defaultSize: 1600,
    });
  });

  it("resolves the correct configuration when found", () => {
    configStub({
      filepath: path.resolve(process.cwd(), ".responsiverc"),
      config: {
        ext: ["gif"],
        outDir: "./output",
        srcDir: "./source",
        sizes: [20, 30, 40],
        srcRewrite: "./rewrite",
        defaultSize: 30,
      },
    });

    const config = loadConfig();

    expect(config).to.deep.include({
      ext: ["gif"],
      outDir: path.resolve(process.cwd(), "./output"),
      srcDir: path.resolve(process.cwd(), "./source"),
      sizes: [20, 30, 40],
      rewrite: { from: "/source", to: "/rewrite" },
      defaultSize: 30,
    });
  });

  it("should throw an error when the default size does not exist", async () => {
    configStub({
      filepath: path.resolve(process.cwd(), ".responsiverc"),
      config: {
        ext: ["gif"],
        outDir: "./output",
        srcDir: "./source",
        sizes: [20, 30, 40],
        srcRewrite: "./rewrite",
        defaultSize: 35,
      },
    });

    expect(() => loadConfig()).to.throw(
      'The default size of "35" does not exist. Please choose one from: 20, 30, 40'
    );
  });
});
