import { randomBytes, scryptSync } from "node:crypto";

const password = process.argv[2];

if (!password) {
  console.error("Usage: npm run hash:admin-password -- \"your_password\"");
  process.exit(1);
}

const salt = randomBytes(16);
const key = scryptSync(password, salt, 64, {
  N: 16_384,
  p: 1,
  r: 8,
});

console.log(`scrypt$16384$8$1$${salt.toString("hex")}$${key.toString("hex")}`);
