import { Pool } from "pg";

let pool: Pool | null = null;

function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 5,
      idleTimeoutMillis: 10000,
      connectionTimeoutMillis: 15000,
    });
  }
  return pool;
}

// Helper: run query and return rows
export async function query(sql: string, params?: any[]): Promise<any[]> {
  try {
    const result = await getPool().query(sql, params);
    return result.rows;
  } catch (error: any) {
    console.error("Query error:", error.message);
    throw error;
  }
}

// Ensure tables exist — lazy, only runs on first actual DB call
let tablesInitialized = false;

export async function ensureTables() {
  if (tablesInitialized) return;
  if (!process.env.DATABASE_URL) return;

  try {
    const p = getPool();
    await p.query(`CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY, name VARCHAR(255) NOT NULL, email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL, image VARCHAR(500) DEFAULT NULL,
      role VARCHAR(20) DEFAULT 'user', created_at TIMESTAMPTZ DEFAULT NOW()
    )`);
    await p.query(`CREATE TABLE IF NOT EXISTS projects (
      id SERIAL PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL, language VARCHAR(50) NOT NULL, code TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
    )`);
    await p.query(`CREATE TABLE IF NOT EXISTS run_history (
      id SERIAL PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      project_name VARCHAR(255) NOT NULL, language VARCHAR(50) NOT NULL,
      code TEXT NOT NULL, output TEXT, created_at TIMESTAMPTZ DEFAULT NOW()
    )`);
    await p.query(`CREATE TABLE IF NOT EXISTS shared_code (
      id SERIAL PRIMARY KEY, share_id VARCHAR(16) UNIQUE NOT NULL,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      project_name VARCHAR(255) NOT NULL, language VARCHAR(50) NOT NULL,
      code TEXT NOT NULL, views INTEGER DEFAULT 0, created_at TIMESTAMPTZ DEFAULT NOW()
    )`);
    await p.query(`CREATE TABLE IF NOT EXISTS previews (
      id SERIAL PRIMARY KEY, preview_id VARCHAR(16) UNIQUE NOT NULL,
      html_code TEXT NOT NULL, css_code TEXT NOT NULL, created_at TIMESTAMPTZ DEFAULT NOW()
    )`);
    await p.query(`CREATE TABLE IF NOT EXISTS feedback (
      id SERIAL PRIMARY KEY, user_id INTEGER DEFAULT NULL REFERENCES users(id) ON DELETE SET NULL,
      name VARCHAR(255) DEFAULT NULL, email VARCHAR(255) DEFAULT NULL,
      rating INTEGER NOT NULL, comment TEXT NOT NULL, created_at TIMESTAMPTZ DEFAULT NOW()
    )`);
    await p.query(`CREATE TABLE IF NOT EXISTS languages (
      id SERIAL PRIMARY KEY, name VARCHAR(50) NOT NULL, slug VARCHAR(50) UNIQUE NOT NULL,
      extension VARCHAR(10) NOT NULL, is_active BOOLEAN DEFAULT TRUE,
      compiler_cmd VARCHAR(255) DEFAULT NULL, run_cmd TEXT DEFAULT NULL,
      compile_cmd TEXT DEFAULT NULL, piston_lang VARCHAR(50) DEFAULT NULL,
      piston_version VARCHAR(20) DEFAULT NULL, stdin_support BOOLEAN DEFAULT FALSE,
      category VARCHAR(50) DEFAULT 'general', sort_order INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`);
    tablesInitialized = true;
    console.log("Database tables ready");
  } catch (err: any) {
    console.error("Database init error:", err.message);
  }
}

// Don't auto-call ensureTables — let API routes call it explicitly
const tablesReady = Promise.resolve();
export { tablesReady };
export default pool;
