// This file contains type definitions for your Mzuzu Application data.
// Only the User type is needed for login and registration.

export type User = {
  id: string;
  name: string;
  email: string;
  password: string; // Note: In production, this should be hashed
};
