import fs from "node:fs";
import path from "node:path";

const dbPath = process.env.LEADS_DB_PATH?.trim() || path.join(process.cwd(), "storage", "realtermo_leads.sqlite");
const backupDir = path.join(path.dirname(dbPath), "backups");

if (!fs.existsSync(dbPath)) {
  console.error(`Database not found: ${dbPath}`);
  process.exit(1);
}

fs.mkdirSync(backupDir, { recursive: true });

const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const backupPath = path.join(backupDir, `realtermo_leads-${timestamp}.sqlite`);

fs.copyFileSync(dbPath, backupPath);

console.log(`Backup created: ${backupPath}`);
