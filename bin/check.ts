#!/usr/bin/env node

import { loadConfig } from "../utils/loadConfig";
import { findImages } from "../utils/findImages";
import { missingResizedImages } from "../utils/missingResizedImages";

export async function check(): Promise<number> {
  const config = await loadConfig();

  const sourceFiles = await findImages(config.srcDir, config.ext);
  console.log(`Found ${sourceFiles.length} source images`);

  let exitCode = 0;

  for (const file of sourceFiles) {
    const missing = await missingResizedImages(
      config.outDir,
      file,
      config.sizes
    );

    if (missing.length) {
      exitCode++;
      console.log(`❌  Missing ${missing.length} resized images for ${file}`);
    }
  }

  return exitCode;
}

/* istanbul ignore if */
if (require.main === module) {
  check().then(process.exit);
}
