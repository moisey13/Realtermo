import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

import { cookies } from "next/headers";

import { verifyPasswordHash } from "@/lib/password";

const SESSION_COOKIE_NAME = "realtermo_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 14;

export function getAdminUsername() {
  return process.env.ADMIN_USERNAME?.trim() || "admin";
}

function getAdminPasswordHash() {
  return process.env.ADMIN_PASSWORD_HASH?.trim() || "";
}

function getSessionSecret() {
  return (process.env.ADMIN_SESSION_SECRET?.trim() || getAdminPasswordHash()).slice(0, 200);
}

function createSessionSignature(username: string, expiresAt: string, nonce: string) {
  return createHmac("sha256", getSessionSecret())
    .update([username, expiresAt, nonce].join(":"))
    .digest("base64url");
}

export function isAdminAuthConfigured() {
  return Boolean(getAdminPasswordHash() && getSessionSecret());
}

export function verifyAdminCredentials(username: string, password: string) {
  const storedHash = getAdminPasswordHash();

  if (!storedHash || username !== getAdminUsername()) {
    return false;
  }

  return verifyPasswordHash(password, storedHash);
}

export function createAdminSessionToken() {
  const username = getAdminUsername();
  const expiresAt = String(Date.now() + SESSION_TTL_SECONDS * 1000);
  const nonce = randomBytes(12).toString("base64url");
  const signature = createSessionSignature(username, expiresAt, nonce);

  return Buffer.from([username, expiresAt, nonce, signature].join(":"), "utf8").toString("base64url");
}

function parseSessionToken(token: string) {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const [username, expiresAt, nonce, signature] = decoded.split(":");

    if (!username || !expiresAt || !nonce || !signature) {
      return null;
    }

    return {
      expiresAt: Number(expiresAt),
      nonce,
      signature,
      username,
    };
  } catch {
    return null;
  }
}

export function verifyAdminSessionToken(token: string) {
  if (!token || !isAdminAuthConfigured()) {
    return false;
  }

  const parsed = parseSessionToken(token);

  if (!parsed || parsed.username !== getAdminUsername() || !Number.isFinite(parsed.expiresAt)) {
    return false;
  }

  if (parsed.expiresAt < Date.now()) {
    return false;
  }

  const expectedSignature = createSessionSignature(parsed.username, String(parsed.expiresAt), parsed.nonce);
  const actualSignature = Buffer.from(parsed.signature, "utf8");
  const expectedSignatureBuffer = Buffer.from(expectedSignature, "utf8");

  if (actualSignature.length !== expectedSignatureBuffer.length) {
    return false;
  }

  return timingSafeEqual(actualSignature, expectedSignatureBuffer);
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  return sessionToken ? verifyAdminSessionToken(sessionToken) : false;
}

export function getAdminSessionCookieName() {
  return SESSION_COOKIE_NAME;
}

export function getAdminSessionMaxAge() {
  return SESSION_TTL_SECONDS;
}
