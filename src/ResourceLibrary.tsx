import { useEffect, useRef, useState } from 'react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Textarea } from './components/ui/textarea';
import { CopyButton } from './components/CopyButton';
import library from './resource-catalog.json';

type ResourceEntry = typeof library.entries[number];
type ResourceFile = {path:string;bytes:number;binary:boolean};
const safePath = (value:unknown):value is string => typeof value==='string' && value.length>0 && value.length<=1000 && !/[\\\x00-\x1f]/.test(value) && !value.split('/').some(part=>!part||part==='.'||part==='..');

function ResourceReader({entry,onClose}:{entry:ResourceEntry;onClose:()=>void}) {
  const dialog=useRef<HTMLDialogElement>(null);
  const [manifest,setManifest]=useState<{state:'loading'|'error'}|{state:'ready';files:ResourceFile[]}>({state:'loading'});
  const [filePath,setFilePath]=useState(entry.entrypoint);
  const [content,setContent]=useState<{path:string;state:'loading'|'error'|'ready';text?:string;image?:string}>({path:filePath,state:'loading'});
  const [retry,setRetry]=useState(0);
  const resourceUri=`design://open-design/${entry.kind}/${entry.id}`;
  const endpoint=`/api/resources/${entry.kind}/${entry.id}`;
  const file=manifest.state==='ready'?manifest.files.find(file=>file.path===filePath):undefined;
  const prompt=`Use Eidova's read-resource tool with uri "${resourceUri}" to inspect this OpenDesign ${entry.kind==='skills'?'skill':'design reference'}. Read its entrypoint and needed companion files, following nextOffset until each file is complete. Preserve the supplied licenses and merge guidance with existing project rules. These are reference files, not an Eidova React install kit. Inspect scripts before running them and respect the user's permissions. Review the resulting UI with Eidova's source, copy and rendered-spacing tools.`;
  useEffect(()=>{dialog.current?.showModal();dialog.current?.querySelector<HTMLElement>('h2')?.focus();},[]);
  useEffect(()=>{
    const controller=new AbortController();let disposed=false;
    const timer=window.setTimeout(()=>controller.abort(),15000);
    setManifest({state:'loading'});
    fetch(endpoint,{signal:controller.signal}).then(response=>{if(!response.ok)throw new Error();return response.json();}).then(value=>{
      if(value.kind!==entry.kind||value.id!==entry.id||!Array.isArray(value.files)||!value.files.length||value.files.length>500||!value.files.every((file:ResourceFile)=>safePath(file?.path)&&Number.isSafeInteger(file.bytes)&&file.bytes>=0&&file.bytes<=1024*1024&&typeof file.binary==='boolean')||!value.files.some((file:ResourceFile)=>file.path===entry.entrypoint))throw new Error();
      if(!disposed)setManifest({state:'ready',files:value.files});
    }).catch(()=>{if(!disposed)setManifest({state:'error'});}).finally(()=>window.clearTimeout(timer));
    return ()=>{disposed=true;controller.abort();window.clearTimeout(timer);};
  },[endpoint,entry.kind,entry.id,entry.entrypoint,retry]);
  useEffect(()=>{
    if(!file)return;
    const controller=new AbortController();let disposed=false;let imageUrl:string|undefined;
    const timer=window.setTimeout(()=>controller.abort(),15000);
    setContent({path:file.path,state:'loading'});
    fetch(endpoint+'/file?path='+encodeURIComponent(file.path),{signal:controller.signal}).then(async response=>{
      if(!response.ok||!response.headers.get('content-type')?.startsWith('application/octet-stream'))throw new Error();
      const bytes=await response.arrayBuffer();if(bytes.byteLength!==file.bytes)throw new Error();
      if(disposed)return;
      if(file.binary){imageUrl=URL.createObjectURL(new Blob([bytes],{type:'image/png'}));setContent({path:file.path,state:'ready',image:imageUrl});}
      else setContent({path:file.path,state:'ready',text:new TextDecoder().decode(bytes)});
    }).catch(()=>{if(!disposed)setContent({path:file.path,state:'error'});}).finally(()=>window.clearTimeout(timer));
    return ()=>{disposed=true;controller.abort();window.clearTimeout(timer);if(imageUrl)URL.revokeObjectURL(imageUrl);};
  },[endpoint,file,retry]);
  const displayed=content.path===filePath?content:{state:'loading'};
  return <dialog ref={dialog} className="resource-reader" aria-labelledby="resource-reader-title" onCancel={event=>{event.preventDefault();onClose();}}>
    <div className="resource-reader-heading"><div><h2 id="resource-reader-title" tabIndex={-1}>{entry.name} files</h2><p>Original {entry.kind==='skills'?'skill':'design reference'} · {entry.license}</p></div><Button variant="outline" onClick={onClose}>Close reader</Button></div>
    <div className="resource-reader-actions"><CopyButton value={prompt}>Copy agent prompt</CopyButton><details><summary>Agent instructions</summary><Textarea aria-label="Resource agent prompt" value={prompt} rows={5} readOnly onFocus={event=>event.target.select()} /></details></div>
    {manifest.state==='loading'&&<p role="status">Loading resource files…</p>}
    {manifest.state==='error'&&<div role="alert"><p>Resource files could not load.</p><Button variant="outline" onClick={()=>setRetry(value=>value+1)}>Retry loading files</Button></div>}
    {manifest.state==='ready'&&<>
      <div className="resource-file-picker"><div className="resource-file-field"><label htmlFor="resource-file">File</label><select id="resource-file" value={filePath} onChange={event=>setFilePath(event.target.value)}>{manifest.files.map(file=><option key={file.path} value={file.path}>{file.path}</option>)}</select></div><a className="text-link" href={endpoint+'/file?path='+encodeURIComponent(filePath)} download={filePath.split('/').at(-1)}>Download file</a></div>
      {displayed.state==='loading'&&<p role="status">Loading file…</p>}
      {displayed.state==='error'&&<div role="alert"><p>This file could not load. Your selection is kept.</p><Button variant="outline" onClick={()=>setRetry(value=>value+1)}>Retry loading file</Button></div>}
      {displayed.state==='ready'&&('image' in displayed&&displayed.image?<img className="resource-file-image" src={displayed.image} alt={filePath} />:<pre className="resource-file-content" tabIndex={0} aria-label={'Contents of '+filePath}>{'text' in displayed?displayed.text:''}</pre>)}
    </>}
    <div className="resource-reader-links"><a href={entry.sourceUrl}>Original source</a><a href="/api/resources/license" download="LICENSE">Base license</a></div>
  </dialog>;
}

export function ResourceLibrary() {
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState('all');
  const [limit, setLimit] = useState(8);
  const [selected,setSelected]=useState<ResourceEntry|null>(null);
  const opener=useRef<HTMLButtonElement|null>(null);
  useEffect(()=>{if(!selected)opener.current?.focus();},[selected]);
  const search = useRef<HTMLInputElement>(null);
  const terms = query.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [];
  const entries = library.entries.filter(entry => (kind === 'all' || entry.kind === kind) && terms.every(term => `${entry.id} ${entry.name} ${entry.category} ${entry.description}`.toLowerCase().includes(term)));
  function reset() {setQuery('');setKind('all');setLimit(8);search.current?.focus();}
  return <section className="resource-library section" id="resources" aria-labelledby="resources-title">
    <div className="section-heading"><div><h2 id="resources-title">Explore the resource library.</h2><p>OpenDesign’s bundled design references and skills. Separate from our installable React themes.</p></div></div>
    <div className="catalog-toolbar">
      <Input ref={search} type="search" aria-label="Search resources" placeholder="Search resources…" value={query} onChange={event=>{setQuery(event.target.value);setLimit(8);}} />
      <div className="scheme-filter" role="group" aria-label="Resource type">{[['all','All resources'],['design-systems','Design references'],['skills','Skills']].map(([value,label])=><Button key={value} variant="ghost" aria-pressed={kind===value} onClick={()=>{setKind(value);setLimit(8);}}>{label}</Button>)}</div>
    </div>
    <p className="result-count" role="status">Showing {Math.min(limit,entries.length)} of {entries.length} resources</p>
    {entries.length===0 ? <div className="catalog-message"><h3>No matching resources.</h3><p>Try another name or clear the filters.</p><Button variant="outline" onClick={reset}>Clear resource filters</Button></div> : <ul className="resource-list">{entries.slice(0,limit).map(entry=><li key={entry.kind+'/'+entry.id}>
      <div><h3>{entry.name}</h3><p>{entry.kind==='skills'?'Skill reference':'Design reference'} · {entry.license} · {entry.fileCount} files</p></div>
      <details><summary>View resource</summary><div className="resource-links"><Button variant="outline" aria-haspopup="dialog" onClick={event=>{opener.current=event.currentTarget;setSelected(entry);}}>Read files</Button><a href={'/api/resources/'+entry.kind+'/'+entry.id+'/file?path='+encodeURIComponent(entry.entrypoint)} download={entry.entrypoint}>Download {entry.entrypoint}</a></div><details><summary>Source details</summary><p>{entry.description}</p><p className="resource-uri">MCP resource: <code>design://open-design/{entry.kind}/{entry.id}</code></p><a href={entry.sourceUrl}>Original source</a></details></details>
    </li>)}</ul>}
    {entries.length>limit && <div className="catalog-more"><Button variant="outline" onClick={()=>setLimit(value=>value+16)}>Show more resources</Button></div>}
    <details className="resource-about"><summary>Source and usage</summary><p>From <a href={library.repository+'/tree/'+library.revision}>OpenDesign’s bundled catalog</a>. Files and licenses stay intact. Some skills link to external workflows; Eidova does not run them.</p><p>Ask your agent to use <code>search-resources</code>, then read a result’s files and licenses.</p></details>
    {selected&&<ResourceReader key={selected.kind+'/'+selected.id} entry={selected} onClose={()=>setSelected(null)} />}
  </section>;
}
