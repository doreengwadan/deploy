import bcrypt from "bcrypt";
import postgres from "postgres";

// Connect using your Supabase Postgres URL
const connectionString =
  process.env.base_POSTGRES_URL ||
  process.env.base_POSTGRES_PRISMA_URL ||
  process.env.base_POSTGRES_URL_NON_POOLING;

if (!connectionString) {
  throw new Error("❌ Missing Supabase connection string in env vars");
}

// Reuse the same connection config
const sql = postgres(connectionString, {
  ssl: { rejectUnauthorized: false },
  idle_timeout: 30,
  connect_timeout: 30,
});

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check if email already exists
    const existing = await sql`SELECT * FROM users WHERE email = ${email}`;
    if (existing.length > 0) {
      return new Response(
        JSON.stringify({ error: "Email already registered" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Hash password and insert user
    const hashed = await bcrypt.hash(password, 10);
    await sql`
      INSERT INTO users (name, email, password)
      VALUES (${name}, ${email}, ${hashed});
    `;

    return new Response(
      JSON.stringify({ message: "✅ Registration successful" }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("❌ Registration error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : String(error),
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  } finally {
    await sql.end({ timeout: 5 });
  }
}
