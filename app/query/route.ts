// This is a placeholder API route for the Mzuzu Application.
// You can expand it later for login/register functionality.

export async function GET() {
  return new Response(
    JSON.stringify({
      message: 'This API route is ready for login/register functionality.',
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}
