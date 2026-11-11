import { useEffect, useState } from 'react';
import { Button } from './components/ui/button';
import { Textarea } from './components/ui/textarea';
import { CopyButton } from './components/CopyButton';

type Request = (path: string, method?: string, body?: unknown) => Promise<Response>;
type Action = (run: () => Promise<void>) => Promise<void>;
type Revision = { version: number; message: string; author: string | null; createdAt: number };
type Snapshot = { version: number; files: { path: string; content: string }[] };
type Share = { id: string; version: number; expiresAt: number };

export function StudioCollaboration({ project, owner, canRestore, request, action, busy, restore }: {
  project: { id: string; version: number }; owner: boolean; canRestore: boolean; request: Request; action: Action; busy: boolean; restore: (version: number) => void;
}) {
  const [history, setHistory] = useState<Revision[]>([]);
  const [shares, setShares] = useState<Share[]>([]);
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [preview, setPreview] = useState('');
  const [shareUrl, setShareUrl] = useState('');
  const [present, setPresent] = useState<string[]>([]);
  const [presenceError, setPresenceError] = useState(false);
  const route = '/api/projects/' + project.id;
  useEffect(() => {
    let active = true, pending = false;
    const clientId = crypto.randomUUID();
    const refresh = async () => {
      if (pending) return;
      pending = true;
      try {
        const data = await (await request(route + '/presence', 'PUT', { clientId })).json();
        if (!Array.isArray(data.members) || !data.members.every((member: { displayName?: unknown }) => typeof member?.displayName === 'string')) throw new Error('Invalid presence');
        if (active) { setPresent([...new Set<string>(data.members.map((member: { displayName: string }) => member.displayName))]); setPresenceError(false); }
      } catch { if (active) setPresenceError(true); }
      finally { pending = false; }
    };
    void refresh(); const timer = window.setInterval(() => void refresh(), 15000);
    return () => { active = false; window.clearInterval(timer); };
  }, [request, route]);
  async function refresh(before?: number) {
    const [revisions, sharing] = await Promise.all([
      request(route + '/history' + (before === undefined ? '' : '?before=' + before)).then(r => r.json()),
      owner ? request(route + '/shares').then(r => r.json()) : Promise.resolve({ shares: [] }),
    ]);
    if (!Array.isArray(revisions.revisions) || !revisions.revisions.every((r: Revision) => r && Number.isSafeInteger(r.version) && typeof r.message === 'string' && typeof r.createdAt === 'number' && (r.author === null || typeof r.author === 'string')) || !Array.isArray(sharing.shares) || !sharing.shares.every((s: Share) => s && typeof s.id === 'string' && Number.isSafeInteger(s.version) && typeof s.expiresAt === 'number')) throw new Error('History could not be read. Refresh to try again.');
    setHistory(before === undefined ? revisions.revisions : previous => [...previous, ...revisions.revisions]); setShares(sharing.shares);
  }
  return <section className="studio-collaboration" aria-label="Project collaboration">
    <p className="studio-presence" role="status">{presenceError ? 'Presence unavailable. It will retry automatically.' : 'Active in the past minute: ' + (present.join(', ') || 'checking…')}</p>
    <details className="studio-handoff"><summary>Revision history</summary>
      <p>Current revision: {project.version}. Restoring keeps previous revisions.</p>
      <Button variant="outline" disabled={busy} onClick={() => void action(() => refresh())}>Refresh history</Button>
      <ul>{history.map(revision => <li key={revision.version}>
        <p>Revision {revision.version} · {revision.author || 'Imported project'} · {new Date(revision.createdAt).toLocaleString()}</p>
        <p>{revision.message}</p><Button variant="outline" disabled={busy} onClick={() => void action(async () => { const value = await (await request(route + '/snapshot?version=' + revision.version)).json(); if (!Number.isSafeInteger(value.version) || !Array.isArray(value.files) || !value.files.every((f: { path?: unknown; content?: unknown }) => f && typeof f.path === 'string' && typeof f.content === 'string')) throw new Error('Invalid revision.'); setSnapshot(value); setPreview(''); })}>Review revision {revision.version}</Button>
      </li>)}</ul>
      {history.length > 0 && history.length % 50 === 0 && <Button variant="outline" disabled={busy} onClick={() => void action(() => refresh(history.at(-1)!.version))}>Load older revisions</Button>}
      {snapshot && <div className="studio-revision"><h3>Revision {snapshot.version}</h3>
        {snapshot.files.length === 0 && <p>No files in this revision.</p>}
        {snapshot.files.map(file => <Button key={file.path} variant="outline" disabled={busy} onClick={() => {
          try { const bytes = Uint8Array.from(atob(file.content), c => c.charCodeAt(0)); setPreview(new TextDecoder('utf-8', { fatal: true }).decode(bytes).slice(0, 200000)); }
          catch { setPreview('Binary file. Use the snapshot download to inspect its original bytes.'); }
        }}>Read {file.path}</Button>)}
        {preview && <Textarea aria-label="Revision file preview" value={preview} readOnly rows={8} />}
        <p>The text preview shows up to 200,000 characters.</p>
        <Button variant="outline" onClick={() => downloadSnapshot(snapshot)}>Download revision</Button>
        {canRestore && <Button disabled={busy || snapshot.version === project.version} onClick={() => restore(snapshot.version)}>Restore revision {snapshot.version}</Button>}
      </div>}
    </details>
    {owner && <details className="studio-handoff"><summary>Share a revision</summary>
      <p>Anyone with the link can download its files and project details for 24 hours.</p>
      <Button disabled={busy} onClick={() => { if (window.confirm('Create a link that shares this revision’s files and metadata with anyone who has it?')) void action(async () => { const value = await (await request(route + '/shares', 'POST', { version: project.version, hours: 24 })).json(); setShareUrl(window.location.origin + '/studio#share=' + value.token); await refresh(); }); }}>Create share link</Button>
      {shareUrl && <><Textarea aria-label="Share link" value={shareUrl} readOnly rows={2} onFocus={e => e.target.select()} /><CopyButton value={shareUrl}>Copy share link</CopyButton></>}
      <ul>{shares.map(share => <li key={share.id}><p>Revision {share.version} · Expires {new Date(share.expiresAt).toLocaleString()}</p><Button variant="outline" disabled={busy} onClick={() => void action(async () => { await request(route + '/shares/' + share.id, 'DELETE'); setShareUrl(''); await refresh(); })}>Revoke share</Button></li>)}</ul>
    </details>}
  </section>;
}

export function downloadSnapshot(snapshot: Snapshot) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' }));
  const link = document.createElement('a'); link.href = url; link.download = 'revision-' + snapshot.version + '.json'; link.click(); window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function StudioKeyControls({ request, action, busy, remember }: { request: Request; action: Action; busy: boolean; remember: (key: string) => void }) {
  const [recovery, setRecovery] = useState('');
  return <details className="studio-handoff"><summary>Recovery and key rotation</summary>
    <p>Save a recovery key privately before replacing your workspace key.</p>
    <Button variant="outline" disabled={busy} onClick={() => void action(async () => { setRecovery((await (await request('/api/key/recovery', 'POST', {})).json()).recoveryKey); })}>Create recovery key</Button>
    {recovery && <><p>This key works once. Creating another invalidates it.</p><Textarea aria-label="Recovery key" value={recovery} readOnly rows={2} onFocus={e => e.target.select()} /><CopyButton value={recovery}>Copy recovery key</CopyButton>
      <Button variant="outline" disabled={busy} onClick={() => { if (window.confirm('Replace your workspace key? Other devices using it will be disconnected. Keep your recovery key.')) void action(async () => { const value = await (await request('/api/key/rotate', 'POST', {})).json(); remember(value.token); }); }}>Replace workspace key</Button></>}
  </details>;
}
