import { promise as glob } from "glob-promise";
import path from "path";

export async function findImages(
  srcDir: string,
  ext: string[]
): Promise<string[]> {
  const extPattern = ext.length === 1 ? ext : `{${ext.join(",")}}`;
  const pattern = path.join(`${srcDir}`, "**", `*.${extPattern}`);
  const files = await glob(pattern);
  return files.map((filePath) => path.relative(srcDir, filePath));
}
