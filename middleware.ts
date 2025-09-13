import { NextRequest, NextResponse } from 'next/server';

const BASIC_REALM = 'Restricted';

function unauthorized() {
  return new NextResponse('Authentication required', {
    status: 401,
    headers: { 'WWW-Authenticate': `Basic realm="${BASIC_REALM}"` },
  });
}

export function middleware(req: NextRequest) {
  const url = new URL(req.url);

  if (url.pathname.startsWith('/admin')) {
    const header = req.headers.get('authorization');
    if (!header?.startsWith('Basic ')) return unauthorized();

    const base64 = header.split(' ')[1] || '';
    // Edge-runtime har ikke Node's Buffer; bruk atob (web API)
    let decoded = '';
    try {
      decoded = atob(base64);
    } catch {
      return unauthorized();
    }

    const sepIdx = decoded.indexOf(':');
    const user = sepIdx >= 0 ? decoded.slice(0, sepIdx) : '';
    const pass = sepIdx >= 0 ? decoded.slice(sepIdx + 1) : '';

    const expectedUser = process.env.ADMIN_USER;
    const expectedPass = process.env.ADMIN_PASS;
    if (!expectedUser || !expectedPass) return unauthorized();
    if (user !== expectedUser || pass !== expectedPass) return unauthorized();

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
