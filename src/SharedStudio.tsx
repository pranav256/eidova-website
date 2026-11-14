import { useEffect, useState } from 'react';
import { Button } from './components/ui/button';
import { Textarea } from './components/ui/textarea';
import { downloadSnapshot } from './StudioCollaboration';
import { useAppearance } from './theme';
import { SiteHeader, SiteFooter } from './App';

const api = (import.meta.env.VITE_STUDIO_API_URL || '/api/studio').replace(/\/$/, '');
type Snapshot = { version: number; metadata: Record<string, unknown>; files: { path: string; content: string }[] };

export function SharedStudio() {
  const { theme, toggleTheme } = useAppearance();
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null), [error, setError] = useState(''), [preview, setPreview] = useState('');
  async function load() {
    setError(''); setSnapshot(null); setPreview('');
    try {
      const key = new URLSearchParams(window.location.hash.slice(1)).get('share');
      if (!key || !/^[A-Za-z0-9_-]{43}$/.test(key)) throw new Error('This share link is invalid. Ask its owner for a new link.');
      const response = await fetch(api + '/api/share', { headers: { Authorization: 'Share ' + key }, signal: AbortSignal.timeout(15000) });
      if (!response.ok) throw new Error('This share is expired or unavailable. Ask its owner for a new link.');
      const data = await response.json();
      if (!Number.isSafeInteger(data.version) || !Array.isArray(data.files) || !data.files.every((file: { path?: unknown; content?: unknown }) => typeof file?.path === 'string' && typeof file?.content === 'string')) throw new Error('The shared revision could not be read.');
      setSnapshot(data);
    } catch (error) { setError(error instanceof Error ? error.message : 'The share could not be loaded. Retry to check its availability.'); }
  }
  useEffect(() => { document.title = 'Shared revision · Eidova'; void load(); }, []);
  return <><a className="skip-link" href="#shared-main">Skip to shared files</a><SiteHeader theme={theme} onToggleTheme={toggleTheme} />
    <main id="shared-main" className="team-studio"><h1>Shared revision{snapshot ? ' ' + snapshot.version : ''}</h1><p>A fixed copy shared by its owner. Files are displayed as text.</p>
      {error ? <><p className="studio-notice" role="alert">{error}</p><Button onClick={() => void load()}>Retry share</Button></> : !snapshot ? <p role="status">Loading shared files…</p> : <>
        <div className="studio-share-files">{snapshot.files.map(file => <Button variant="outline" key={file.path} onClick={() => { try { setPreview(new TextDecoder('utf-8', { fatal: true }).decode(Uint8Array.from(atob(file.content), c => c.charCodeAt(0))).slice(0, 200000)); } catch { setPreview('Binary file. Download the revision to inspect its original bytes.'); } }}>Read {file.path}</Button>)}</div>
        {preview && <><Textarea aria-label="Shared file preview" value={preview} readOnly rows={16} /><p>Preview limited to 200,000 characters.</p></>}
        <Button onClick={() => downloadSnapshot(snapshot)}>Download revision</Button>
      </>}
    </main><SiteFooter /></>;
}
