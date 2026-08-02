import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  max: 5,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 10000,
});

// Helper: run query and return rows
export async function query(sql: string, params?: any[]): Promise<any[]> {
  try {
    const result = await pool.query(sql, params);
    return result.rows;
  } catch (error: any) {
    console.error("Query error:", error.message);
    throw error;
  }
}

// Ensure ALL tables exist at startup
let tablesInitialized = false;

export async function ensureTables() {
  if (tablesInitialized) return;

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        image VARCHAR(500) DEFAULT NULL,
        role VARCHAR(20) DEFAULT 'user',
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        language VARCHAR(50) NOT NULL,
        code TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS run_history (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        project_name VARCHAR(255) NOT NULL,
        language VARCHAR(50) NOT NULL,
        code TEXT NOT NULL,
        output TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS shared_code (
        id SERIAL PRIMARY KEY,
        share_id VARCHAR(16) UNIQUE NOT NULL,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        project_name VARCHAR(255) NOT NULL,
        language VARCHAR(50) NOT NULL,
        code TEXT NOT NULL,
        views INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS previews (
        id SERIAL PRIMARY KEY,
        preview_id VARCHAR(16) UNIQUE NOT NULL,
        html_code TEXT NOT NULL,
        css_code TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS feedback (
        id SERIAL PRIMARY KEY,
        user_id INTEGER DEFAULT NULL REFERENCES users(id) ON DELETE SET NULL,
        name VARCHAR(255) DEFAULT NULL,
        email VARCHAR(255) DEFAULT NULL,
        rating INTEGER NOT NULL,
        comment TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS languages (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        slug VARCHAR(50) UNIQUE NOT NULL,
        extension VARCHAR(10) NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        compiler_cmd VARCHAR(255) DEFAULT NULL,
        run_cmd TEXT DEFAULT NULL,
        compile_cmd TEXT DEFAULT NULL,
        piston_lang VARCHAR(50) DEFAULT NULL,
        piston_version VARCHAR(20) DEFAULT NULL,
        stdin_support BOOLEAN DEFAULT FALSE,
        category VARCHAR(50) DEFAULT 'general',
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    // Insert default languages if table is empty
    const langCount = await query("SELECT COUNT(*) as c FROM languages");
    if (Number(langCount[0]?.c) === 0) {
      await pool.query(`
        INSERT INTO languages (name, slug, extension, compiler_cmd, run_cmd, compile_cmd, piston_lang, piston_version, stdin_support, category, sort_order) VALUES
        ('JavaScript', 'javascript', '.js', NULL, 'node {file}', NULL, 'javascript', '18.15.0', FALSE, 'web', 1),
        ('TypeScript', 'typescript', '.ts', 'npx tsx {file}', 'npx tsx {file}', NULL, 'typescript', '5.0.3', FALSE, 'web', 2),
        ('Python', 'python', '.py', 'python', 'python -u {file}', NULL, 'python', '3.10.0', TRUE, 'scripting', 3),
        ('C', 'c', '.c', 'gcc', NULL, 'gcc {file} -o {out} -lm', 'c', '10.2.0', FALSE, 'systems', 4),
        ('C++', 'cpp', '.cpp', 'g++', NULL, 'g++ {file} -o {out}', 'c++', '10.2.0', FALSE, 'systems', 5),
        ('Java', 'java', '.java', 'javac', 'java -cp {dir} Main', 'javac {file}', 'java', '15.0.2', FALSE, 'enterprise', 6),
        ('Go', 'go', '.go', 'go', 'go run {file}', NULL, 'go', '1.16.2', TRUE, 'systems', 7),
        ('Rust', 'rust', '.rs', 'rustc', NULL, 'rustc {file} -o {out}', 'rust', '1.68.2', FALSE, 'systems', 8),
        ('Ruby', 'ruby', '.rb', 'ruby', 'ruby {file}', NULL, 'ruby', '3.0.1', TRUE, 'scripting', 9),
        ('Haskell', 'haskell', '.hs', 'stack', 'stack exec runghc -- {file}', NULL, 'haskell', '9.4.1', FALSE, 'functional', 10)
      `);
    }

    tablesInitialized = true;
    console.log("Database tables ready");
  } catch (err: any) {
    console.error("Database init error:", err.message);
  }
}

// Auto-initialize on first import
ensureTables();

// Alias for backward compatibility
const tablesReady = ensureTables();

export { tablesReady };
export default pool;
