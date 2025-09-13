# sign.vzbygg.no — MVP (Next.js + Vercel Postgres)

En enkel, sikker MVP hvor hvem som helst kan skrive tekst og sende inn. Du får en privat /admin-side
(beskyttet med Basic Auth) som viser innsendte bidrag.

## Stack
- Next.js 14 (App Router, TypeScript)
- @vercel/postgres (Postgres i Vercel)
- Zod (validering)
- (Valgfritt) Cloudflare Turnstile (anti-bot)

## Rask start
1. **Klon repo** og installer pakker:
   ```bash
   pnpm install # eller npm/yarn
   ```

2. **Lag database-tabell** i Vercel Postgres (eller Postgres du allerede har):
   - Kjør SQL i `schema.sql` i din database.

3. **Miljøvariabler** — lag en `.env.local` basert på `.env.example`:
   - `POSTGRES_URL` fra Vercel Postgres (eller din Postgres-URI).
   - Sett `ADMIN_USER` og `ADMIN_PASS` for å låse /admin.
   - (Valgfritt) Sett `TURNSTILE_SECRET_KEY` og `NEXT_PUBLIC_TURNSTILE_SITE_KEY` hvis du bruker Turnstile.

4. **Kjør lokalt**:
   ```bash
   pnpm dev
   ```

5. **Deploy** til Vercel:
   - Opprett nytt prosjekt i Vercel, pek mot repo.
   - Sett env-variabler i Vercel dashboard.
   - Pek DNS for `sign.vzbygg.no` til Vercel (CNAME).
   - Sett `sign.vzbygg.no` som Production Domain i Vercel.

## Ruter
- `/` — offentlig tekstskjema (med honeypot + (valgfritt) Turnstile).
- `/success` — kvittering etter innsending.
- `/admin` — liste over innsendte tekster (Basic Auth).

## Sikkerhet/Personvern (kort)
- IP og user-agent logges for misbrukshåndtering (se `app/api/submit/route.ts`).
- Skjema valideres med Zod (max 10k tegn).
- Honeypot-felt + (valgfritt) Turnstile for anti-bot.
- /admin er bak Basic Auth i `middleware.ts`.
- Legg til personvernerklæring/ToS på sikt.

Lykke til!
