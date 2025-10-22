import bcrypt from "bcrypt";
import postgres from "postgres";
import { users } from "../lib/placeholder-data";

// Use the pooled Supabase Postgres connection string
const connectionString =
  process.env.base_POSTGRES_URL ||
  process.env.base_POSTGRES_PRISMA_URL ||
  process.env.base_POSTGRES_URL_NON_POOLING;

if (!connectionString) {
  throw new Error("❌ Missing base_POSTGRES_URL in environment variables");
}

// Connect to Supabase Postgres
const sql = postgres(connectionString, {
  ssl: { rejectUnauthorized: false },
  idle_timeout: 30,
  connect_timeout: 30,
});

async function seedUsers() {
  try {
    console.log("🔄 Connecting to Supabase Postgres...");
    await sql`SELECT 1;`;
    console.log("✅ Connected successfully!");

    // Create the users table if not exists
    await sql`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      );
    `;

    // Insert sample users
    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await sql`
        INSERT INTO users (name, email, password)
        VALUES (${user.name}, ${user.email}, ${hashedPassword})
        ON CONFLICT (email) DO NOTHING;
      `;
    }

    console.log("✅ Users table seeded successfully!");
    return { message: "Users table seeded successfully" };
  } catch (error) {
    console.error("❌ Error seeding users:", error);
    throw error;
  } finally {
    await sql.end({ timeout: 5 });
  }
}

export async function GET() {
  try {
    const result = await seedUsers();
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : String(error),
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
