import "server-only";

import { createDecipheriv } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";

const MAGIC = Buffer.from("GLWR1");

export async function readDecryptedReport() {
  const encodedKey = process.env.REPORT_ENCRYPTION_KEY;
  if (!encodedKey) throw new Error("Report encryption is not configured.");

  const key = Buffer.from(encodedKey, "base64");
  if (key.length !== 32) throw new Error("Invalid report encryption key.");

  const filePath = path.join(
    process.cwd(),
    "private",
    "ghana-living-wage-report-2025.pdf.enc",
  );
  const encrypted = await readFile(filePath);

  if (!encrypted.subarray(0, MAGIC.length).equals(MAGIC)) {
    throw new Error("Invalid encrypted report file.");
  }

  const ivStart = MAGIC.length;
  const ivEnd = ivStart + 12;
  const tagEnd = ivEnd + 16;
  const iv = encrypted.subarray(ivStart, ivEnd);
  const tag = encrypted.subarray(ivEnd, tagEnd);
  const ciphertext = encrypted.subarray(tagEnd);

  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]);
}
