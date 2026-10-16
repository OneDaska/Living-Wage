import "server-only";

import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";

type DownloadTokenPayload = {
  email: string;
  exp: number;
  jti: string;
};

const encode = (value: string) => Buffer.from(value).toString("base64url");

const secret = () => {
  const value = process.env.DOWNLOAD_TOKEN_SECRET;
  if (!value || value.length < 32) {
    throw new Error("Download token signing is not configured.");
  }
  return value;
};

const signature = (payload: string) =>
  createHmac("sha256", secret()).update(payload).digest("base64url");

export function createDownloadToken(email: string) {
  const payload: DownloadTokenPayload = {
    email,
    exp: Math.floor(Date.now() / 1000) + 5 * 60,
    jti: randomUUID(),
  };
  const encoded = encode(JSON.stringify(payload));
  return `${encoded}.${signature(encoded)}`;
}

export function verifyDownloadToken(token: string) {
  const [encoded, providedSignature] = token.split(".");
  if (!encoded || !providedSignature) return null;

  const expectedSignature = signature(encoded);
  const provided = Buffer.from(providedSignature);
  const expected = Buffer.from(expectedSignature);

  if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf8"),
    ) as DownloadTokenPayload;

    if (
      !payload.email ||
      !payload.jti ||
      !Number.isInteger(payload.exp) ||
      payload.exp < Math.floor(Date.now() / 1000)
    ) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
