import escape from "escape-string-regexp";

import { loadConfig } from "./utils/loadConfig";
import { resizedPath } from "./utils/resizedPath";

type Replacer = (
  resizedImages: {
    filePath: string;
    size: number;
  }[]
) => {
  src: string;
  srcset: string[];
  sizes: string[];
};

export async function replaceImgSrc(html: string, replacer?: Replacer) {
  const config = await loadConfig();

  const exts = config.ext.map(escape);
  const extsRegExp = `(${exts.join("|")})`;

  const regex = new RegExp(
    `src="${escape(config.rewrite.from)}([A-Za-z0-9-_./%]+\.${extsRegExp})"`,
    "g"
  );

  return html.replace(regex, m => {
    const path = m
      .replace(/^src="/, "")
      .replace(/"$/, "")
      .replace(/^\/+/, "/")
      .replace(config.rewrite.from, config.rewrite.to);

    const fileSizes = config.sizes.map(size => {
      const filePath = resizedPath(path, size);

      return { size, filePath };
    });

    const defaults = {
      src: fileSizes[0].filePath,
      srcset: fileSizes.map(({ filePath, size }) => `${filePath} ${size}w`),
      sizes: ["100vw"]
    };

    const result = { ...defaults, ...(replacer ? replacer(fileSizes) : {}) };

    const { src, srcset, sizes } = result;

    return `src="${src}" srcset="${srcset.join(", ")}" sizes="${sizes.join(
      ", "
    )}"`;
  });
}
