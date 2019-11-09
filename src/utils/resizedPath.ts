import path from "path";

interface Options {
  delimiter?: string;
}

export function resizedPath(
  filePath: string,
  size: number,
  opts: Options = {}
): string {
  const { delimiter } = {
    delimiter: "-",
    ...opts
  };

  const ext = path.extname(filePath);
  const filename = path.basename(filePath, ext);
  const dir = path.dirname(filePath);

  return path.join(dir, `${filename}${delimiter}${size}${ext}`);
}
