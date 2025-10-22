import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// -------------------------
// User Authentication
// -------------------------

/**
 * Registers a new user.
 * @param name User's full name
 * @param email User's email
 * @param password User's password (should hash in production)
 * @returns Newly created user ID
 */
export async function registerUser(name: string, email: string, password: string) {
  try {
    // Check if user already exists
    const existing = await sql<{ count: string }[]>`
      SELECT COUNT(*) FROM users WHERE email = ${email}
    `;
    if (Number(existing[0].count) > 0) {
      throw new Error('User with this email already exists');
    }

    // Insert new user (password should be hashed in production)
    const result = await sql<{ id: string }[]>`
      INSERT INTO users (name, email, password)
      VALUES (${name}, ${email}, ${password})
      RETURNING id
    `;
    return result[0].id;
  } catch (error) {
    console.error('Database Error (registerUser):', error);
    throw new Error('Failed to register user');
  }
}

/**
 * Logs in a user by email and password.
 * @param email User's email
 * @param password User's password
 * @returns User info if successful
 */
export async function loginUser(email: string, password: string) {
  try {
    const user = await sql<{ id: string; name: string; email: string }[]>`
      SELECT id, name, email
      FROM users
      WHERE email = ${email} AND password = ${password}
    `;

    if (user.length === 0) {
      throw new Error('Invalid email or password');
    }

    return user[0];
  } catch (error) {
    console.error('Database Error (loginUser):', error);
    throw new Error('Failed to login user');
  }
}
