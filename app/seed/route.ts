import bcrypt from 'bcrypt';
import postgres from 'postgres';
import { users } from '../lib/placeholder-data';

// Configure connection with SSL and timeout for Neon
const sql = postgres(process.env.POSTGRES_URL!, {
  ssl: 'require',
  connect_timeout: 100, // seconds
  max_lifetime: 60, // optional: keep connections alive
  idle_timeout: 30,  // optional
});

async function seedUsers() {
  try {
    // Ensure UUID extension exists
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Create users table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
    `;

    // Insert placeholder users with hashed passwords
    const insertedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return sql`
          INSERT INTO users (id, name, email, password)
          VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
          ON CONFLICT (id) DO NOTHING;
        `;
      })
    );

    return insertedUsers;
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

// API route to seed users
export async function GET() {
  try {
    await seedUsers();
    return new Response(
      JSON.stringify({ message: 'Users table seeded successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : error }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
