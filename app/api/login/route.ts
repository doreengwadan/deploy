import bcrypt from "bcrypt";
import postgres from "postgres";

// Supabase Postgres connection
const connectionString =
  process.env.base_POSTGRES_URL ||
  process.env.base_POSTGRES_PRISMA_URL ||
  process.env.base_POSTGRES_URL_NON_POOLING;

if (!connectionString) {
  throw new Error("❌ Missing Supabase connection string in env vars");
}

const sql = postgres(connectionString, {
  ssl: { rejectUnauthorized: false },
  idle_timeout: 30,
  connect_timeout: 30,
});

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: "Email and password are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Fetch user by email
    const users = await sql`SELECT * FROM users WHERE email = ${email}`;
    if (users.length === 0) {
      return new Response(
        JSON.stringify({ error: "Invalid email or password" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const user = users[0];

    // Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return new Response(
        JSON.stringify({ error: "Invalid email or password" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Optional: return user info or a JWT
    return new Response(
      JSON.stringify({ message: "✅ Login successful", user: { id: user.id, name: user.name, email: user.email } }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("❌ Login error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : String(error) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  } finally {
    //await sql.end({ timeout: 5 });
  }
}
