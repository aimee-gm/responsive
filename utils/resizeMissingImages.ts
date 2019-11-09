import jimp from "jimp";
import path from "path";

import { promiseMap } from "./promiseMap";
import { missingResizedImages } from "./missingResizedImages";

export async function resizeMissingImages(
  sourceDir: string,
  outputDir: string,
  filePath: string,
  sizes: number[]
): Promise<void> {
  const sourceFilePath = path.resolve(sourceDir, filePath);

  const toProcess = await missingResizedImages(outputDir, filePath, sizes);

  if (!toProcess.length) {
    console.log(`✅  Found all resized images for ${filePath}, skipping`);
    return;
  }

  const source = await jimp.read(sourceFilePath);

  await promiseMap(toProcess, async ({ size, target }) => {
    await source
      .resize(size, jimp.AUTO)
      .quality(75)
      .write(target);

    console.log(`⚙️  Resized ${filePath} to ${size}px`);
  });
}
