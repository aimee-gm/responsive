import fs from "fs";
import { promisify } from "util";

const access = promisify(fs.access);

export async function canAccessFile(filePath: string) {
  try {
    await access(filePath);
    return true;
  } catch (err) {
    return false;
  }
}
