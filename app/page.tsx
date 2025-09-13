'use client';

import { useEffect, useState } from 'react';

export default function HomePage() {
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [useTurnstile, setUseTurnstile] = useState(false);
  const [tsToken, setTsToken] = useState<string | null>(null);

  // oppdag om Turnstile keys er satt (site key finnes i env build-time, men vi laster script runtime)
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '';

  useEffect(() => {
    if (siteKey) {
      setUseTurnstile(true);
      const s = document.createElement('script');
      s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      s.async = true;
      document.head.appendChild(s);
    }
  }, [siteKey]);

  useEffect(() => {
    if (useTurnstile && (window as any).turnstile && siteKey) {
      (window as any).turnstile.render('#cf-turnstile', {
        sitekey: siteKey,
        callback: (token: string) => setTsToken(token),
        'error-callback': () => setTsToken(null),
      });
    }
  }, [useTurnstile, siteKey]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const payload = {
      text: formData.get('text') as string,
      website: formData.get('website') as string | undefined,
      turnstileToken: tsToken
    };

    const res = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      window.location.href = '/success';
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data?.error || 'Noe gikk galt. Prøv igjen.');
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h1>Skriv og send inn</h1>
      <p className="muted">Teksten din lagres og er kun synlig for eieren av denne siden.</p>
      <form onSubmit={submit}>
        {/* Honeypot-felt (skjult for brukere) */}
        <div style={{ position: 'absolute', left: '-5000px' }} aria-hidden="true">
          <label>Website<input type="text" name="website" tabIndex={-1} autoComplete="off" /></label>
        </div>

        <div className="field">
          <label htmlFor="text">Tekst</label>
          <textarea id="text" name="text" placeholder="Skriv noe her..." required
            maxLength={10000} onChange={e => setText(e.target.value)} />
        </div>

        {useTurnstile && <div id="cf-turnstile" style={{ margin: '12px 0' }} />}

        <div className="row">
          <button type="submit" disabled={loading}>{loading ? 'Sender…' : 'Send inn'}</button>
        </div>
        {error && <p className="error">{error}</p>}
      </form>
      <p className="muted">Max 10 000 tegn. Misbruk logges og kan bli blokkert.</p>
    </div>
  );
}
