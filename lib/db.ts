import { sql } from '@vercel/postgres';
import { v4 as uuidv4 } from 'uuid';

export type Note = {
  id: string;
  text: string;
  created_at: string;
  ip: string | null;
  user_agent: string | null;
};

export async function insertNote(text: string, ip?: string | null, userAgent?: string | null) {
  const id = uuidv4();
  await sql`INSERT INTO notes (id, text, ip, user_agent) VALUES (${id}, ${text}, ${ip || null}, ${userAgent || null})`;
  return id;
}

export async function listNotes(limit = 200) {
  const { rows } = await sql<Note>`SELECT id, text, created_at, ip, user_agent FROM notes ORDER BY created_at DESC LIMIT ${limit}`;
  return rows;
}
