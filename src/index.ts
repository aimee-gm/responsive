import { loadConfig } from "./utils/loadConfig";
import { resizedPath } from "./utils/resizedPath";

const config = loadConfig();

export function responsiveImages(filepath: string) {
  const rewrittenPath = filepath.replace(
    config.rewrite.from,
    config.rewrite.to
  );

  const resized = config.sizes.map((size) => [
    resizedPath(rewrittenPath, size),
    size,
  ]);

  const [[src]] = resized;

  const srcset = resized.map(([src, size]) => `${src} ${size}w`).join(", ");

  return { src, srcset };
}

interface ShortcodeOptions {
  class?: string;
}

export function shortcode(sizes: string[]) {
  const sizesString = sizes.join(", ");
  return (filepath: string, alt: string, options: ShortcodeOptions = {}) => {
    const { src, srcset } = responsiveImages(filepath);
    return `<img src="${src}" srcset="${srcset}" sizes="${sizesString}" alt="${alt}" class="${
      options.class || ""
    }">`;
  };
}
