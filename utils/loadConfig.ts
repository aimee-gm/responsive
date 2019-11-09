import { cosmiconfig } from "cosmiconfig";
import path from "path";

export type Extension = "jpg" | "jpeg" | "png";

export interface Config {
  srcDir: string;
  outDir: string;
  ext: Extension[];
  sizes: number[];
  assetPath: string;
  rewrite: { from: string; to: string };
}

export async function loadConfig(): Promise<Config> {
  const result = await cosmiconfig("responsive").search(process.cwd());

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
    ...result.config
  };

  return {
    ...config,
    outDir: path.resolve(root, config.outDir),
    srcDir: path.resolve(root, config.srcDir),
    rewrite: {
      from: path.resolve("/", config.srcDir),
      to: path.resolve("/", config.srcRewrite)
    }
  };
}
