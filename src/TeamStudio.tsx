import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Textarea } from './components/ui/textarea';
import { CopyButton } from './components/CopyButton';
import { useAppearance } from './theme';
import { SiteHeader, SiteFooter } from './App';
import { StudioCollaboration, StudioKeyControls } from './StudioCollaboration';

const api = (import.meta.env.VITE_STUDIO_API_URL || '/api/studio').replace(/\/$/, '');
const configured = Boolean(import.meta.env.VITE_STUDIO_API_URL) || import.meta.env.DEV;
const setupDocs = (import.meta.env.VITE_MCP_REPOSITORY_URL || 'https://github.com/pranav256/eidova-mcp') + '/blob/main/docs/STUDIO.md';
const nativeStudioUrl = (() => {
  try {
    const url = new URL(import.meta.env.VITE_NATIVE_STUDIO_URL || 'http://127.0.0.1:7457');
    return !url.username && !url.password && !url.search && !url.hash && (url.protocol === 'https:' || url.protocol === 'http:' && ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)) ? url.href : null;
  } catch { /* Invalid configuration is shown beside the setup guide. */ return null; }
})();
type Project = { id: string; name: string; version: number; updatedAt: number; canEdit?: 0 | 1; nativeProjectId?: string | null; nativePolicyVersion?: number | null; visibility?: 'private' | 'team' | null; ownerMemberId?: string | null };
type Workspace = { id: string; name: string; memberId: string; role: string; members: { id: string; displayName: string; role: string }[]; projects: Project[] };
type FileEntry = { path: string; bytes: number; version: number };
type Comment = { id: string; body: string; author: string; memberId: string; resolved: number; filePath: string | null };
type Editor = { path: string; text: string; version: number; dirty: boolean };
const isRecord = (value: unknown): value is Record<string, unknown> => value !== null && typeof value === 'object';
const isProject = (value: unknown): value is Project => isRecord(value) && typeof value.id === 'string' && typeof value.name === 'string' && Number.isSafeInteger(value.version) && Number(value.version) >= 0
  && (value.canEdit === undefined || value.canEdit === 0 || value.canEdit === 1)
  && (value.nativeProjectId == null || typeof value.nativeProjectId === 'string' && (value.canEdit === 0 || value.canEdit === 1) && Number.isSafeInteger(value.nativePolicyVersion) && (value.visibility === 'private' || value.visibility === 'team'));
function readComments(value: unknown): Comment[] {
  if (!Array.isArray(value) || !value.every(item => isRecord(item) && ['id', 'body', 'author', 'memberId'].every(field => typeof item[field] === 'string') && (item.resolved === 0 || item.resolved === 1) && (item.filePath === null || typeof item.filePath === 'string'))) throw new Error('The backend returned invalid feedback. Refresh the project to try again.');
  return value as Comment[];
}

export function TeamStudio() {
  const { theme, toggleTheme } = useAppearance();
  const [key, setKey] = useState(() => { try { return sessionStorage.getItem('eidova-studio-key:' + api) || ''; } catch { /* Storage can be disabled; a key can still be entered manually. */ return ''; } });
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [editor, setEditor] = useState<Editor | null>(null);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const [invite, setInvite] = useState('');
  const [connection, setConnection] = useState<'connect' | 'create' | 'join'>('connect');
  const [displayName, setDisplayName] = useState('');
  const [workspaceName, setWorkspaceName] = useState('');
  const [access, setAccess] = useState('');
  const [registrationKey, setRegistrationKey] = useState('');
  const [recoveryAccess, setRecoveryAccess] = useState('');
  const [projectName, setProjectName] = useState('');
  const [fileName, setFileName] = useState('');
  const [comment, setComment] = useState('');
  const running = useRef(false);
  const request = useCallback(async (path: string, method = 'GET', body?: unknown, credential = key) => {
    if (!configured) throw new Error('Workspace connection is not set up on this site yet. Open the setup guide to connect your backend.');
    const response = await fetch(api + path, { method, signal: AbortSignal.timeout(15000), headers: { ...(credential ? { Authorization: 'Bearer ' + credential } : {}), ...(body === undefined ? {} : { 'Content-Type': 'application/json' }) }, body: body === undefined ? undefined : JSON.stringify(body) });
    if (!response.ok) { const data = await response.json().catch(() => ({})); throw new Error(data.error || 'The workspace could not be reached. Try again.'); }
    return response;
  }, [key]);
  async function loadWorkspace(credential = key) {
    const value = await (await request('/api/workspace', 'GET', undefined, credential)).json();
    if (!isRecord(value) || typeof value.name !== 'string' || typeof value.memberId !== 'string' || !['owner', 'member'].includes(String(value.role)) || !Array.isArray(value.projects) || !value.projects.every(isProject) || !Array.isArray(value.members) || !value.members.every(member => isRecord(member) && typeof member.id === 'string' && typeof member.displayName === 'string' && ['owner', 'member'].includes(String(member.role)))) throw new Error('The backend returned an invalid workspace. Reconnect to try again.');
    setWorkspace(value as Workspace);
  }
  async function action(run: () => Promise<void>) {
    if (running.current) return;
    running.current = true;
    setBusy(true); setError(''); setStatus('');
    try { await run(); } catch (error) { setError(error instanceof TypeError || (error instanceof DOMException && error.name === 'TimeoutError') ? 'The backend did not confirm the operation. Your edits are still here. Reconnect or refresh to check whether it completed before retrying.' : error instanceof Error ? error.message : 'The operation failed. Try again.'); }
    finally { running.current = false; setBusy(false); }
  }
  function remember(credential: string) {
    if (credential !== '' && !/^[A-Za-z0-9_-]{43}$/.test(credential)) throw new Error('The server returned an invalid workspace key. Use your recovery key to reconnect.');
    setKey(credential);
    try { if (credential) sessionStorage.setItem('eidova-studio-key:' + api, credential); else sessionStorage.removeItem('eidova-studio-key:' + api); } catch { /* A session can continue without browser storage. */ }
  }
  useEffect(() => { document.title = 'Team workspace · Eidova'; if (key && configured) void action(() => loadWorkspace(key)); }, []);
  async function connect() {
    let credential = access.trim();
    if (connection !== 'connect') {
      const response = await request(connection === 'create' ? '/api/workspaces' : '/api/join', 'POST', connection === 'create' ? { name: workspaceName, displayName, ...(registrationKey ? { registrationKey } : {}) } : { invite: credential, displayName }, '');
      const created = await response.json(); credential = created.token;
      if (/^[A-Za-z0-9_-]{43}$/.test(credential)) remember(credential);
    }
    if (!/^[A-Za-z0-9_-]{43}$/.test(credential)) throw new Error('Use the complete workspace key or invitation.');
    await loadWorkspace(credential); remember(credential); setAccess('');
  }
  function canLeaveEditor() { return !editor?.dirty || window.confirm('Discard your unsaved file edits?'); }
  async function selectProject(value: Project, discardApproved = false) {
    if (!discardApproved && !canLeaveEditor()) return;
    const [fileData, commentData] = await Promise.all([request('/api/projects/' + value.id + '/files').then(r => r.json()), request('/api/projects/' + value.id + '/comments').then(r => r.json())]);
    if (!isProject(fileData.project) || !Array.isArray(fileData.files) || !fileData.files.every((file: unknown) => isRecord(file) && typeof file.path === 'string' && Number.isSafeInteger(file.bytes) && Number(file.bytes) >= 0 && Number.isSafeInteger(file.version))) throw new Error('The project returned an invalid response. Refresh it to try again.');
    const feedback = readComments(commentData.comments);
    setProject(fileData.project); setFiles(fileData.files); setComments(feedback); setEditor(null);
  }
  async function openFile(file: FileEntry) {
    if (!project || !canLeaveEditor()) return;
    if (!/\.(?:md|txt|html?|css|js|jsx|ts|tsx|json|yaml|yml|svg|xml|py|sh)$/i.test(file.path)) throw new Error('Download this binary file to view it locally.');
    const bytes = await (await request('/api/projects/' + project.id + '/file?path=' + encodeURIComponent(file.path))).arrayBuffer();
    let text: string;
    try { text = new TextDecoder('utf-8', { fatal: true }).decode(bytes); }
    catch { throw new Error('This file is not UTF-8 text. Download it to edit locally.'); }
    setEditor({ path: file.path, text, version: project.version, dirty: false });
  }
  async function downloadFile(file: FileEntry) {
    const blob = await (await request('/api/projects/' + project!.id + '/file?path=' + encodeURIComponent(file.path))).blob();
    const url = URL.createObjectURL(blob), link = document.createElement('a'); link.href = url; link.download = file.path.split('/').at(-1)!; link.click(); window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  async function saveFile() {
    if (!project || !editor || project.canEdit === 0) return;
    const saved = await (await request('/api/projects/' + project.id + '/file', 'PUT', { path: editor.path, content: editor.text, expectedVersion: editor.version })).json();
    if (!isRecord(saved) || saved.path !== editor.path || !Number.isSafeInteger(saved.version) || !Number.isSafeInteger(saved.bytes)) throw new Error('The save returned an invalid response. Copy your edits, then reload to check whether they were saved.');
    const file = saved as FileEntry;
    setEditor({ ...editor, version: file.version, dirty: false }); setProject({ ...project, version: file.version });
    setFiles(previous => [...previous.filter(entry => entry.path !== file.path), file].sort((a, b) => a.path.localeCompare(b.path))); setStatus('File saved.'); await loadWorkspace();
  }
  useEffect(() => {
    if (!editor?.dirty) return;
    const prevent = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ''; };
    window.addEventListener('beforeunload', prevent); return () => window.removeEventListener('beforeunload', prevent);
  }, [editor?.dirty]);
  return <>
    <a className="skip-link" href="#studio-main">Skip to workspace</a>
    <SiteHeader theme={theme} onToggleTheme={toggleTheme} />
    <main id="studio-main" className="team-studio">
      <div className="studio-title">
        <div>
          <h1>{workspace?.name || 'Team workspace'}</h1>
          <p>Share files and feedback with your team.</p>
        </div>{workspace && <Button variant="outline" disabled={busy} onClick={() => { if (canLeaveEditor()) { remember(''); setWorkspace(null); setProject(null); setEditor(null); setInvite(''); } }}>Disconnect</Button>}</div>
      {!configured && <p className="studio-notice">Workspace connection is not set up on this site yet. <a className="text-link" href={setupDocs}>Open setup guide</a>
      </p>}
      <details className="studio-handoff"><summary>Design Studio</summary><p>Start Studio on your computer, then open its design editor to create projects using your own model keys.</p>{nativeStudioUrl ? <a className="text-link" href={nativeStudioUrl} target="_blank" rel="noopener noreferrer">Open design Studio</a> : <p>The Studio address is invalid. Use the setup guide to configure it.</p>} <a className="text-link" href={setupDocs}>Studio setup guide</a></details>
      {error && <p className="studio-notice" role="alert">{error}</p>}<p className="studio-status" role="status">{busy ? 'Working…' : status}</p>
      {!workspace ? <section className="studio-connect" aria-labelledby="studio-connect-title">
        <h2 id="studio-connect-title">{connection === 'create' ? 'Create a workspace' : connection === 'join' ? 'Join a workspace' : 'Connect your workspace'}</h2>
        <div className="scheme-filter" role="group" aria-label="Connection method">{(['connect', 'create', 'join'] as const).filter(mode => mode !== connection).map(mode => <Button key={mode} variant="ghost" disabled={busy} onClick={() => { setConnection(mode); setError(''); }}>{mode === 'connect' ? 'Workspace key' : mode === 'create' ? 'Create workspace' : 'Join workspace'}</Button>)}</div>
        <form onSubmit={event => { event.preventDefault(); void action(connect); }}>
          {connection === 'create' && <label>Workspace name<Input disabled={busy || !configured} value={workspaceName} onChange={e => setWorkspaceName(e.target.value)} required maxLength={120} />
          </label>}
          {connection === 'create' && <label>Server registration key (if required)<Input type="password" autoComplete="off" disabled={busy || !configured} value={registrationKey} onChange={e => setRegistrationKey(e.target.value)} maxLength={256} /></label>}
          {connection !== 'connect' && <label>Your name<Input disabled={busy || !configured} value={displayName} onChange={e => setDisplayName(e.target.value)} required maxLength={120} autoComplete="name" />
          </label>}
          {connection !== 'create' && <label>{connection === 'connect' ? 'Workspace key' : 'Invitation'}<Input disabled={busy || !configured} type="password" autoComplete="off" value={access} onChange={e => setAccess(e.target.value)} required />
          </label>}
          <Button type="submit" disabled={busy || !configured}>{connection === 'create' ? 'Create workspace' : connection === 'join' ? 'Join workspace' : 'Connect'}</Button>
        </form>
        <p>Access stays in this tab. Keep your key to reconnect.</p>
        <details className="studio-handoff">
          <summary>Backend setup</summary>
          <a className="text-link" href={setupDocs}>Set up your team backend</a>
        </details><details className="studio-handoff"><summary>Recover workspace access</summary><p>A saved recovery key replaces your lost workspace key.</p><form onSubmit={event => { event.preventDefault(); void action(async () => { const value = await (await request('/api/recover', 'POST', { recoveryKey: recoveryAccess.trim() }, '')).json(); remember(value.token); await loadWorkspace(value.token); setRecoveryAccess(''); }); }}><label>Saved recovery key<Input type="password" autoComplete="off" required disabled={busy || !configured} value={recoveryAccess} onChange={event => setRecoveryAccess(event.target.value)} /></label><Button type="submit" disabled={busy || !configured}>Recover access</Button></form></details>{key && <details className="studio-handoff">
          <summary>Recover saved workspace key</summary>
          <p>Keep this key private. It grants your workspace access.</p>
          <Textarea aria-label="Saved workspace key" value={key} readOnly rows={2} onFocus={e => e.target.select()} />
          <CopyButton value={key}>Copy workspace key</CopyButton>
        </details>}</section> : <>
        <div className="studio-workspace">
          <section className="studio-projects" aria-labelledby="studio-projects-title">
            <h2 id="studio-projects-title">Projects</h2>
            <form onSubmit={event => { event.preventDefault(); void action(async () => { const created = await (await request('/api/projects', 'POST', { name: projectName })).json(); setProjectName(''); await loadWorkspace(); await selectProject(created); }); }}>
              <label>Project name<Input disabled={busy || !configured} value={projectName} onChange={e => setProjectName(e.target.value)} required maxLength={120} />
              </label>
              <Button type="submit" disabled={busy || !configured}>Create project</Button>
            </form>
            <nav aria-label="Projects">{workspace.projects.map(item => <Button key={item.id} variant="ghost" aria-pressed={project?.id === item.id} disabled={busy} onClick={() => void action(() => selectProject(item))}>{item.name}</Button>)}</nav>{workspace.projects.length === 0 && <p>No projects yet. Create one to share files.</p>}<Button variant="outline" disabled={busy} onClick={() => void action(() => loadWorkspace())}>Refresh projects</Button>
          </section>
          <section className="studio-editor" aria-labelledby="studio-project-title">
            <h2 id="studio-project-title">{project?.name || 'Choose a project'}</h2>{project ? <>
              {project.nativeProjectId && <p className="studio-notice">{project.canEdit === 0 ? 'Read-only native project. You can review files and leave feedback.' : project.visibility === 'team' ? 'Your native project is shared with this workspace.' : 'Your native project is private.'}</p>}
              <div className="studio-file-list" aria-label="Project files">{files.map(file => <div key={file.path}>
                <Button variant="ghost" aria-pressed={editor?.path === file.path} disabled={busy} onClick={() => void action(() => openFile(file))}>{file.path}</Button>
                <Button variant="outline" disabled={busy} aria-label={'Download ' + file.path} onClick={() => void action(() => downloadFile(file))}>Download</Button>
              </div>)}</div>
              {project.canEdit !== 0 && <form className="studio-new-file" onSubmit={event => { event.preventDefault(); if (!canLeaveEditor()) return; if (files.some(file => file.path === fileName)) { setError('That file exists. Open it from the list.'); return; } setEditor({ path: fileName, text: '', version: project.version, dirty: true }); setFileName(''); }}>
                <label>New file path<Input disabled={busy || !configured} value={fileName} onChange={e => setFileName(e.target.value)} placeholder="index.html" required maxLength={1000} />
                </label>
                <Button variant="outline" type="submit" disabled={busy}>New file</Button>
              </form>}
              {editor && <form onSubmit={event => { event.preventDefault(); void action(saveFile); }}>
                <label>{editor.path}<Textarea aria-label="File contents" className="studio-code" readOnly={busy || project.canEdit === 0} value={editor.text} onChange={e => setEditor({ ...editor, text: e.target.value, dirty: true })} rows={16} spellCheck={false} />
                </label>
                <div className="studio-file-actions">
                  {project.canEdit !== 0 && <Button type="submit" disabled={busy || !editor.dirty}>Save file</Button>}
                  <Button type="button" variant="outline" disabled={busy} onClick={() => void action(() => selectProject(project))}>Reload project</Button>
                  <CopyButton variant="outline" value={editor.text}>Copy file contents</CopyButton>
                  <span>{project.canEdit === 0 ? 'Read only' : editor.dirty ? 'Unsaved edits' : 'Saved'}</span>
                </div>
              </form>}
              <details className="studio-handoff">
                <summary>Use with a coding agent</summary>
                <p>Keep this key private. It grants your workspace access.</p>
                <CopyButton value={key}>Copy workspace key</CopyButton>
                <Textarea aria-label="Workspace key for manual copy" value={key} readOnly rows={2} onFocus={e => e.target.select()} />
                <p>Project ID: <code>{project.id}</code>
                </p>
                <a className="text-link" href={setupDocs}>Connect your coding agent</a>
              </details>
            </> : <p>Select or create a project to read and edit its files.</p>}</section>
          {project && <section className="studio-comments" aria-labelledby="studio-comments-title">
            <h2 id="studio-comments-title">Feedback</h2>
            <form onSubmit={event => { event.preventDefault(); void action(async () => { await request('/api/projects/' + project.id + '/comments', 'POST', { body: comment, filePath: editor?.dirty ? null : editor?.path ?? null }); setComment(''); setComments(readComments((await (await request('/api/projects/' + project.id + '/comments')).json()).comments)); }); }}>
              <label>Comment<Textarea disabled={busy} value={comment} onChange={e => setComment(e.target.value)} required maxLength={10000} rows={3} />
              </label>
              <Button type="submit" disabled={busy || !configured}>Add comment</Button>
            </form>
            <ul>{comments.map(item => <li key={item.id}>
              <strong>{item.author}</strong>
              <p>{item.body}</p>{item.filePath && <p>{item.filePath}</p>}{item.resolved ? <span>Resolved</span> : (item.memberId === workspace.memberId || (project.nativeProjectId ? project.ownerMemberId === workspace.memberId : workspace.role === 'owner')) && <Button variant="outline" disabled={busy} onClick={() => void action(async () => { await request('/api/projects/' + project.id + '/comments/' + item.id, 'PATCH', { resolved: true }); setComments(previous => previous.map(value => value.id === item.id ? { ...value, resolved: 1 } : value)); })}>Resolve comment</Button>}</li>)}</ul>
          </section>}
        </div>
        {project?.nativeProjectId && project.canEdit === 1 && <section className="studio-handoff" aria-label="Native project visibility"><h2>Team visibility</h2><p>{project.visibility === 'team' ? 'Workspace members can read this project and leave feedback.' : 'Only you can access this project.'} Moving it to private revokes existing revision links.</p><Button variant="outline" disabled={busy || project.version === 0} onClick={() => {
          if (!canLeaveEditor() || !window.confirm(project.visibility === 'team' ? 'Make this project private and revoke its share links?' : 'Share this project with your workspace?')) return;
          void action(async () => { await request('/api/native/projects/' + encodeURIComponent(project.nativeProjectId!) + '/visibility', 'PUT', { visibility: project.visibility === 'team' ? 'private' : 'team', expectedPolicyVersion: project.nativePolicyVersion }); await selectProject(project, true); await loadWorkspace(); setStatus('Project visibility updated.'); });
        }}>{project.visibility === 'team' ? 'Make private' : 'Share with workspace'}</Button>{project.version === 0 && <p>Publish content in native Studio before sharing.</p>}</section>}
        {project && <StudioCollaboration key={project.id} project={project} canRestore={project.canEdit !== 0} owner={project.nativeProjectId ? project.canEdit === 1 : workspace.role === 'owner'} request={request} action={action} busy={busy} restore={version => {
          if (project.canEdit === 0) return;
          if (!canLeaveEditor() || !window.confirm('Restore revision ' + version + '? The current revision will remain in history.')) return;
          void action(async () => { await request('/api/projects/' + project.id + '/restore', 'POST', { version, expectedVersion: project.version }); await selectProject(project, true); await loadWorkspace(); setStatus('Revision restored.'); });
        }} />}
        <details className="studio-access">
          <summary>Workspace access</summary>
          <ul>{workspace.members.map(member => <li key={member.id}>
            <span>{member.displayName} · {member.role}</span>{workspace.role === 'owner' && member.id !== workspace.memberId && <Button variant="outline" disabled={busy} onClick={() => { if (window.confirm('Remove ' + member.displayName + ' from this workspace?')) void action(async () => { await request('/api/members/' + member.id, 'DELETE'); await loadWorkspace(); }); }}>Remove member</Button>}</li>)}</ul>{workspace.role === 'owner' && <Button variant="outline" disabled={busy} onClick={() => void action(async () => { setInvite((await (await request('/api/invites', 'POST', {})).json()).invite); })}>Create invitation</Button>}{invite && <div>
              <p>This invitation works once and expires in 24 hours.</p>
              <Textarea aria-label="Invitation" value={invite} readOnly rows={2} onFocus={e => e.target.select()} />
              <CopyButton value={invite}>Copy invitation</CopyButton>
            </div>}<StudioKeyControls request={request} action={action} busy={busy} remember={remember} /></details>
      </>}
    </main>
    <SiteFooter />
  </>;
}
