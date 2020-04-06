import path from "path";

import { canAccessFile } from "./canAccessFile";
import { resizedPath } from "./resizedPath";
import { promiseMap } from "./promiseMap";

interface AnalysedImage {
  size: number;
  target: string;
  exists: boolean;
}

export async function missingResizedImages(
  outputDir: string,
  filePath: string,
  sizes: number[]
): Promise<AnalysedImage[]> {
  const files = await promiseMap(sizes, async (size) => {
    const target = path.resolve(outputDir, resizedPath(filePath, size));
    const exists = await canAccessFile(target);

    return { target, size, exists };
  });

  return files.filter(({ exists }) => exists === false);
}
