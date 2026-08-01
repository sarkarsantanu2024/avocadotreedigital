import pg from "pg";

const { Pool } = pg;
const hasNeonSettings =
  process.env.NEON_HOST &&
  process.env.NEON_DB &&
  process.env.NEON_USER &&
  process.env.NEON_PASSWORD;

const pool = new Pool(
  hasNeonSettings
    ? {
        host: process.env.NEON_HOST,
        port: Number(process.env.NEON_PORT || 5432),
        database: process.env.NEON_DB,
        user: process.env.NEON_USER,
        password: process.env.NEON_PASSWORD,
        ssl: { rejectUnauthorized: false },
      }
    : {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
      },
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const name = req.body?.name?.trim();
  const email = req.body?.email?.trim().toLowerCase();
  const company = req.body?.company?.trim();

  if (!name || !email || !company) {
    return res.status(400).json({ error: "Name, email and company are required." });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "A valid email is required." });
  }

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pricing_leads (
        id BIGSERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        company TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    const result = await pool.query(
      "INSERT INTO pricing_leads (name, email, company) VALUES ($1, $2, $3)",
      [name, email, company],
    );
    return res.status(201).json({ success: true, saved: result.rowCount === 1 });
  } catch (error) {
    console.error("Neon insert error:", error);
    return res.status(500).json({ error: "Unable to save lead" });
  }
}
