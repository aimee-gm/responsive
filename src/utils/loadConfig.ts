import { cosmiconfigSync } from "cosmiconfig";
import path from "path";

export type Extension = "jpg" | "jpeg" | "png";

export interface Config {
  srcDir: string;
  outDir: string;
  ext: Extension[];
  sizes: number[];
  assetPath: string;
  defaultSize: number;
  rewrite: { from: string; to: string };
}

export function loadConfig(): Config {
  const result = cosmiconfigSync("responsive").search(process.cwd());

  if (!result) {
    throw new Error("Cannot load responsive configuration file");
  }

  const root = path.dirname(result.filepath);

  const config = {
    outDir: "./",
    srcDir: "./",
    ext: ["jpg", "jpeg", "png"] as Extension[],
    sizes: [400, 800, 1600],
    srcRewrite: "./",
    ...result.config,
  };

  const defaultSize =
    config.defaultSize || config.sizes[config.sizes.length - 1];

  if (!config.sizes.includes(defaultSize)) {
    throw new Error(
      `The default size of "${defaultSize}" does not exist. Please choose one from: ${config.sizes.join(
        ", "
      )}`
    );
  }

  return {
    ...config,
    outDir: path.resolve(root, config.outDir),
    srcDir: path.resolve(root, config.srcDir),
    rewrite: {
      from: path.resolve("/", config.srcDir),
      to: path.resolve("/", config.srcRewrite || config.outDir),
    },
    defaultSize,
  };
}
