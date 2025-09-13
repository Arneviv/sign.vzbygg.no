import { listNotes } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const notes = await listNotes(500);
  return (
    <div>
      <h1>Admin — Innsendinger</h1>
      <p className="muted">{notes.length} rader</p>
      <div className="card">
        {notes.length === 0 && <p>Ingen innlegg ennå.</p>}
        {notes.map(n => (
          <div key={n.id} style={{ borderBottom: '1px solid #eee', padding: '10px 0' }}>
            <div style={{ display:'flex', justifyContent:'space-between', gap:8 }}>
              <strong>{new Date(n.created_at).toLocaleString('no-NO')}</strong>
              <span className="muted">{n.ip || '–'}</span>
            </div>
            <pre style={{ whiteSpace:'pre-wrap', wordBreak:'break-word', margin: '6px 0' }}>{n.text}</pre>
            <div className="muted">{n.user_agent || '–'}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
