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

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildLeadEmailHtml({ name, email, company, createdAt }) {
  const rows = [
    ["Name", name],
    ["Email", email],
    ["Company", company],
    ["Submitted", createdAt],
  ]
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:12px 16px;border-bottom:1px solid #e7e5e0;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:600;color:#6b7280;white-space:nowrap;">${escapeHtml(label)}</td>
          <td style="padding:12px 16px;border-bottom:1px solid #e7e5e0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#111827;">${escapeHtml(value)}</td>
        </tr>`,
    )
    .join("");

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>New Lead</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f4f3f0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f3f0;padding:24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background-color:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e7e5e0;">
            <tr>
              <td style="background-color:#111827;padding:24px 32px;">
                <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#a3e635;">Avocado Tree Digital</p>
                <h1 style="margin:8px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:20px;color:#ffffff;">New pricing lead submitted</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px 8px;">
                <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#374151;">A visitor just submitted the pricing form on the website. Details below:</p>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 24px 24px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e7e5e0;border-radius:8px;overflow:hidden;">
                  ${rows}
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 32px;">
                <a href="mailto:${escapeHtml(email)}" style="display:inline-block;background-color:#111827;color:#ffffff;text-decoration:none;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:600;padding:12px 24px;border-radius:6px;">Reply to ${escapeHtml(name)}</a>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 32px;background-color:#f9fafb;border-top:1px solid #e7e5e0;">
                <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#9ca3af;">This is an automated notification from the Avocado Tree Digital website lead form.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

async function sendLeadNotification(lead) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFICATION_EMAIL;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !to || !from) {
    console.warn("Resend not configured; skipping lead notification email.");
    return;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      reply_to: lead.email,
      subject: `New pricing lead: ${lead.name} (${lead.company})`,
      html: buildLeadEmailHtml(lead),
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Resend API error ${response.status}: ${body}`);
  }
}

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
      "INSERT INTO pricing_leads (name, email, company) VALUES ($1, $2, $3) RETURNING created_at",
      [name, email, company],
    );

    try {
      await sendLeadNotification({
        name,
        email,
        company,
        createdAt: result.rows[0].created_at.toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" }),
      });
    } catch (emailError) {
      console.error("Lead notification email failed:", emailError);
    }

    return res.status(201).json({ success: true, saved: result.rowCount === 1 });
  } catch (error) {
    console.error("Neon insert error:", error);
    return res.status(500).json({ error: "Unable to save lead" });
  }
}
