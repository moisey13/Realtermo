import { mkdirSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

type CreateLeadInput = {
  comment: string | null;
  email: string | null;
  extraFields: Record<string, unknown>;
  name: string;
  pageUrl: string;
  phone: string;
};

export type LeadRecord = {
  comment: string | null;
  createdAt: string;
  email: string | null;
  extraFields: Record<string, unknown>;
  id: number;
  name: string;
  pageUrl: string;
  phone: string;
  status: "new" | "processed";
};

export type AdminAuditRecord = {
  action: string;
  actor: string;
  createdAt: string;
  details: Record<string, unknown>;
  id: number;
  ip: string | null;
  target: string | null;
};

let database: DatabaseSync | null = null;

function getDatabasePath() {
  return process.env.LEADS_DB_PATH?.trim() || path.join(process.cwd(), "storage", "realtermo_leads.sqlite");
}

function getDatabase() {
  if (database) {
    return database;
  }

  const databasePath = getDatabasePath();
  mkdirSync(path.dirname(databasePath), { recursive: true });

  const connection = new DatabaseSync(databasePath, {
    enableForeignKeyConstraints: true,
    timeout: 5_000,
  });

  connection.exec(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at TEXT NOT NULL,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT,
      comment TEXT,
      page_url TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'processed')),
      extra_fields_json TEXT NOT NULL DEFAULT '{}'
    ) STRICT;
    CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_leads_phone_created_at ON leads(phone, created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_leads_status_created_at ON leads(status, created_at DESC);
    CREATE TABLE IF NOT EXISTS admin_audit_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at TEXT NOT NULL,
      actor TEXT NOT NULL,
      action TEXT NOT NULL,
      target TEXT,
      ip TEXT,
      details_json TEXT NOT NULL DEFAULT '{}'
    ) STRICT;
    CREATE INDEX IF NOT EXISTS idx_admin_audit_created_at ON admin_audit_log(created_at DESC);
  `);

  database = connection;
  return connection;
}

function parseExtraFields(value: string) {
  try {
    const parsed = JSON.parse(value) as Record<string, unknown>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function getLeadsDatabasePath() {
  return getDatabasePath();
}

export function createLead(input: CreateLeadInput) {
  const db = getDatabase();
  const duplicateThreshold = new Date(Date.now() - 5 * 60 * 1000).toISOString();
  const duplicate = db
    .prepare(
      `SELECT id
       FROM leads
       WHERE phone = :phone AND created_at >= :duplicateThreshold
       ORDER BY created_at DESC
       LIMIT 1`,
    )
    .get({
      duplicateThreshold,
      phone: input.phone,
    }) as { id: number } | undefined;

  if (duplicate) {
    return {
      duplicate: true as const,
      id: duplicate.id,
    };
  }

  const createdAt = new Date().toISOString();
  const result = db
    .prepare(
      `INSERT INTO leads (
         created_at,
         name,
         phone,
         email,
         comment,
         page_url,
         status,
         extra_fields_json
       ) VALUES (
         :createdAt,
         :name,
         :phone,
         :email,
         :comment,
         :pageUrl,
         'new',
         :extraFieldsJson
       )`,
    )
    .run({
      comment: input.comment,
      createdAt,
      email: input.email,
      extraFieldsJson: JSON.stringify(input.extraFields),
      name: input.name,
      pageUrl: input.pageUrl,
      phone: input.phone,
    });

  return {
    duplicate: false as const,
    id: Number(result.lastInsertRowid),
  };
}

export function getAllLeads() {
  const db = getDatabase();
  const rows = db
    .prepare(
      `SELECT
         id,
         created_at,
         name,
         phone,
         email,
         comment,
         page_url,
         status,
         extra_fields_json
       FROM leads
       ORDER BY created_at DESC, id DESC`,
    )
    .all() as Array<{
      comment: string | null;
      created_at: string;
      email: string | null;
      extra_fields_json: string;
      id: number;
      name: string;
      page_url: string;
      phone: string;
      status: "new" | "processed";
    }>;

  return rows.map<LeadRecord>((row) => ({
    comment: row.comment,
    createdAt: row.created_at,
    email: row.email,
    extraFields: parseExtraFields(row.extra_fields_json),
    id: row.id,
    name: row.name,
    pageUrl: row.page_url,
    phone: row.phone,
    status: row.status,
  }));
}

export function updateLeadStatus(id: number, status: "new" | "processed") {
  const db = getDatabase();

  db.prepare("UPDATE leads SET status = :status WHERE id = :id").run({
    id,
    status,
  });
}

export function createAdminAuditLog(input: {
  action: string;
  actor: string;
  details?: Record<string, unknown>;
  ip?: string | null;
  target?: string | null;
}) {
  const db = getDatabase();

  db.prepare(
    `INSERT INTO admin_audit_log (
       created_at,
       actor,
       action,
       target,
       ip,
       details_json
     ) VALUES (
       :createdAt,
       :actor,
       :action,
       :target,
       :ip,
       :detailsJson
     )`,
  ).run({
    action: input.action,
    actor: input.actor,
    createdAt: new Date().toISOString(),
    detailsJson: JSON.stringify(input.details || {}),
    ip: input.ip || null,
    target: input.target || null,
  });
}

export function getRecentAdminAuditLogs(limit = 20) {
  const db = getDatabase();
  const rows = db
    .prepare(
      `SELECT
         id,
         created_at,
         actor,
         action,
         target,
         ip,
         details_json
       FROM admin_audit_log
       ORDER BY created_at DESC, id DESC
       LIMIT :limit`,
    )
    .all({ limit }) as Array<{
      action: string;
      actor: string;
      created_at: string;
      details_json: string;
      id: number;
      ip: string | null;
      target: string | null;
    }>;

  return rows.map<AdminAuditRecord>((row) => ({
    action: row.action,
    actor: row.actor,
    createdAt: row.created_at,
    details: parseExtraFields(row.details_json),
    id: row.id,
    ip: row.ip,
    target: row.target,
  }));
}
