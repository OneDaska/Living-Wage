import { createCipheriv } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const [inputPath, outputPath] = process.argv.slice(2);
const encodedKey = process.env.REPORT_ENCRYPTION_KEY;

if (!inputPath || !outputPath || !encodedKey) {
  throw new Error(
    "Usage: REPORT_ENCRYPTION_KEY=<base64-key> node scripts/encrypt-report.mjs <input> <output>",
  );
}

const key = Buffer.from(encodedKey, "base64");
if (key.length !== 32) throw new Error("REPORT_ENCRYPTION_KEY must decode to 32 bytes.");

const source = await readFile(inputPath);
const iv = crypto.getRandomValues(new Uint8Array(12));
const cipher = createCipheriv("aes-256-gcm", key, iv);
const ciphertext = Buffer.concat([cipher.update(source), cipher.final()]);
const tag = cipher.getAuthTag();
const output = Buffer.concat([Buffer.from("GLWR1"), Buffer.from(iv), tag, ciphertext]);

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, output);
