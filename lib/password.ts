import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const KEY_LENGTH = 64;
const SCRYPT_COST = 16_384;
const SCRYPT_BLOCK_SIZE = 8;
const SCRYPT_PARALLELIZATION = 1;

function toHex(buffer: Uint8Array) {
  return Buffer.from(buffer).toString("hex");
}

export function createPasswordHash(password: string) {
  const salt = randomBytes(16);
  const derivedKey = scryptSync(password, salt, KEY_LENGTH, {
    N: SCRYPT_COST,
    r: SCRYPT_BLOCK_SIZE,
    p: SCRYPT_PARALLELIZATION,
  });

  return [
    "scrypt",
    String(SCRYPT_COST),
    String(SCRYPT_BLOCK_SIZE),
    String(SCRYPT_PARALLELIZATION),
    toHex(salt),
    toHex(derivedKey),
  ].join("$");
}

export function verifyPasswordHash(password: string, storedHash: string) {
  const [algorithm, cost, blockSize, parallelization, saltHex, keyHex] = storedHash.split("$");

  if (
    algorithm !== "scrypt" ||
    !cost ||
    !blockSize ||
    !parallelization ||
    !saltHex ||
    !keyHex
  ) {
    return false;
  }

  const salt = Buffer.from(saltHex, "hex");
  const expectedKey = Buffer.from(keyHex, "hex");
  const derivedKey = scryptSync(password, salt, expectedKey.length, {
    N: Number(cost),
    r: Number(blockSize),
    p: Number(parallelization),
  });

  if (derivedKey.length !== expectedKey.length) {
    return false;
  }

  return timingSafeEqual(derivedKey, expectedKey);
}
