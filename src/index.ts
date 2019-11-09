import { loadConfig } from "./utils/loadConfig";
import { resizedPath } from "./utils/resizedPath";

const config = loadConfig();

export function responsiveImages(filepath: string) {
  const rewrittenPath = filepath.replace(
    config.rewrite.from,
    config.rewrite.to
  );

  const resized = config.sizes.map(size => [
    resizedPath(rewrittenPath, size),
    size
  ]);

  const [[src]] = resized;

  const srcset = resized.map(([src, size]) => `${src} ${size}w`).join(", ");

  return { src, srcset };
}
