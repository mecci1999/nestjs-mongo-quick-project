import { Request } from "express";
import * as fs from "fs";

export function saveFile(path: string, buffer: Buffer): Promise<boolean> {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, buffer, (error) => {
      if (error) {
        reject(error);
      }

      resolve(!error);
    });
  });
}
