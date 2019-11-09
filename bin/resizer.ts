#!/usr/bin/env node

import { loadConfig } from "../utils/loadConfig";
import { resizeMissingImages } from "../utils/resizeMissingImages";
import { findImages } from "../utils/findImages";

export async function resizer() {
  const config = await loadConfig();
  const sourceFiles = await findImages(config.srcDir, config.ext);

  for (const file of sourceFiles) {
    await resizeMissingImages(config.srcDir, config.outDir, file, config.sizes);
  }
}

/* istanbul ignore if */
if (require.main === module) {
  resizer();
}
