import { NextRequest, NextResponse } from 'next/server';
import { insertNote } from '@/lib/db';
import { submissionSchema } from '@/lib/validate';
import { getClientIp } from '@/lib/utils';

async function verifyTurnstile(token: string | null, ip: string | null) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // Turnstile ikke aktivert
  if (!token) return false;
  const form = new URLSearchParams();
  form.append('secret', secret);
  form.append('response', token);
  if (ip) form.append('remoteip', ip);
  const resp = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: form
  });
  const data = await resp.json().catch(() => null);
  return !!data?.success;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parse = submissionSchema.safeParse({ text: body?.text, website: body?.website });
    if (!parse.success) {
      const msg = parse.error.issues[0]?.message || 'Ugyldig data';
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    // Honeypot
    if (body?.website) {
      return NextResponse.json({ error: 'Blokkert' }, { status: 400 });
    }

    const xff = req.headers.get('x-forwarded-for');
    const ip = getClientIp(xff, null);
    const ua = req.headers.get('user-agent') || null;

    const ok = await verifyTurnstile(body?.turnstileToken || null, ip);
    if (!ok) {
      return NextResponse.json({ error: 'Turnstile verifisering feilet' }, { status: 400 });
    }

    await insertNote(parse.data.text, ip, ua);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Serverfeil' }, { status: 500 });
  }
}
