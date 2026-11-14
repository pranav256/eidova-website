import { useEffect, useRef, useState } from 'react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Textarea } from './components/ui/textarea';
import { CopyButton } from './components/CopyButton';
import library from './resource-catalog.json';

type ResourceEntry = typeof library.entries[number];
type ResourceFile = {path:string;bytes:number;binary:boolean;mimeType?:string};
const kindLabels:Record<string,string> = {'design-systems':'Design system','design-templates':'Design template',plugins:'Plugin design',templates:'Template framework',catalogs:'Source notes',skills:'Skill'};
const safePath = (value:unknown):value is string => typeof value==='string' && value.length>0 && value.length<=1000 && !/[\\\x00-\x1f]/.test(value) && !value.split('/').some(part=>!part||part==='.'||part==='..');

function ResourcePreview({url,type,name,onClose}:{url:string;type:string;name:string;onClose:()=>void}) {
  const iframe=useRef<HTMLIFrameElement>(null);
  const [state,setState]=useState<'loading'|'ready'|'error'>('loading');
  const [retry,setRetry]=useState(0);
  useEffect(()=>{
    const escape=(event:MessageEvent)=>{if(event.source===iframe.current?.contentWindow&&event.data?.type==='eidova-preview-escape')onClose();};
    window.addEventListener('message',escape);
    return ()=>window.removeEventListener('message',escape);
  },[onClose]);
  useEffect(()=>{
    const controller=new AbortController();let disposed=false;
    const timer=window.setTimeout(()=>controller.abort(),15000);
    setState('loading');
    if(type!=='html'){setState('ready');window.clearTimeout(timer);return ()=>controller.abort();}
    fetch(url,{method:'HEAD',signal:controller.signal}).then(response=>{
      const policy=response.headers.get('content-security-policy')||'';
      if(!response.ok||!response.headers.get('content-type')?.startsWith('text/html')||!policy.includes('sandbox allow-scripts')||policy.includes('allow-same-origin'))throw new Error();
      if(!disposed)setState('ready');
    }).catch(()=>{if(!disposed)setState('error');}).finally(()=>window.clearTimeout(timer));
    return ()=>{disposed=true;controller.abort();window.clearTimeout(timer);};
  },[url,type,retry]);
  if(state==='loading')return <p role="status">Loading preview…</p>;
  if(state==='error')return <div role="alert"><p>This preview could not load. You can still read or download the original files.</p><Button variant="outline" onClick={()=>setRetry(value=>value+1)}>Retry preview</Button></div>;
  if(type==='html')return <iframe ref={iframe} key={retry} className="resource-file-preview" title={name+' preview'} src={url} sandbox="allow-scripts" referrerPolicy="no-referrer" onError={()=>setState('error')} />;
  if(type==='video')return <video key={retry} className="resource-file-media" aria-label={name+' preview'} src={url} controls playsInline preload="metadata" onError={()=>setState('error')} />;
  return <img key={retry} className="resource-file-image" src={url} alt={name+' preview'} referrerPolicy="no-referrer" onError={()=>setState('error')} />;
}

function ResourceReader({entry,onClose,initialPreview=false}:{entry:ResourceEntry;onClose:()=>void;initialPreview?:boolean}) {
  const dialog=useRef<HTMLDialogElement>(null);
  const [manifest,setManifest]=useState<{state:'loading'|'error'}|{state:'ready';files:ResourceFile[]}>({state:'loading'});
  const [filePath,setFilePath]=useState(initialPreview&&entry.preview?.type==='html'?entry.preview.path||entry.entrypoint:entry.entrypoint);
  const [content,setContent]=useState<{path:string;state:'loading'|'error'|'ready';text?:string;asset?:string;mimeType?:string}>({path:filePath,state:'loading'});
  const [preview,setPreview]=useState(initialPreview);
  const [retry,setRetry]=useState(0);
  const resourceUri=`design://open-design/${entry.kind}/${entry.id}`;
  const endpoint=`/api/resources/${entry.kind}/${entry.id}`;
  const file=manifest.state==='ready'?manifest.files.find(file=>file.path===filePath):undefined;
  const previewPath=file?.mimeType==='text/html'?file.path:entry.preview?.type==='html'?entry.preview.path:undefined;
  const previewUrl=previewPath?endpoint+'/preview?path='+encodeURIComponent(previewPath):entry.preview&&'url' in entry.preview?entry.preview.url:undefined;
  const prompt=`Use Eidova's read-resource tool with uri "${resourceUri}" to inspect this ${(kindLabels[entry.kind]||'resource').toLowerCase()}. Read its entrypoint, original components, assets and needed companion files, following nextOffset until each file is complete. Use the included build instructions. Preserve the supplied licenses and attribution, and merge guidance with existing project rules. Inspect scripts before running them and respect the user's permissions. Review the resulting UI with Eidova's source, copy and rendered-spacing tools.`;
  useEffect(()=>{dialog.current?.showModal();dialog.current?.querySelector<HTMLElement>('h2')?.focus();},[]);
  useEffect(()=>{
    const controller=new AbortController();let disposed=false;
    const timer=window.setTimeout(()=>controller.abort(),15000);
    setManifest({state:'loading'});
    fetch(endpoint,{signal:controller.signal}).then(response=>{if(!response.ok)throw new Error();return response.json();}).then(value=>{
      if(value.kind!==entry.kind||value.id!==entry.id||!Array.isArray(value.files)||!value.files.length||value.files.length>500||!value.files.every((file:ResourceFile)=>safePath(file?.path)&&Number.isSafeInteger(file.bytes)&&file.bytes>=0&&file.bytes<=16*1024*1024&&typeof file.binary==='boolean'&&(file.mimeType===undefined||typeof file.mimeType==='string'&&file.mimeType.length<=100))||!value.files.some((file:ResourceFile)=>file.path===entry.entrypoint))throw new Error();
      if(!disposed)setManifest({state:'ready',files:value.files});
    }).catch(()=>{if(!disposed)setManifest({state:'error'});}).finally(()=>window.clearTimeout(timer));
    return ()=>{disposed=true;controller.abort();window.clearTimeout(timer);};
  },[endpoint,entry.kind,entry.id,entry.entrypoint,retry]);
  useEffect(()=>{
    if(!file||preview)return;
    const controller=new AbortController();let disposed=false;let imageUrl:string|undefined;
    const timer=window.setTimeout(()=>controller.abort(),15000);
    setContent({path:file.path,state:'loading'});
    fetch(endpoint+'/file?path='+encodeURIComponent(file.path),{signal:controller.signal}).then(async response=>{
      if(!response.ok||!response.headers.get('content-type')?.startsWith('application/octet-stream'))throw new Error();
      const bytes=await response.arrayBuffer();if(bytes.byteLength!==file.bytes)throw new Error();
      if(disposed)return;
      if(file.binary){const mimeType=file.mimeType||'image/png';imageUrl=URL.createObjectURL(new Blob([bytes],{type:mimeType}));setContent({path:file.path,state:'ready',asset:imageUrl,mimeType});}
      else setContent({path:file.path,state:'ready',text:new TextDecoder().decode(bytes)});
    }).catch(()=>{if(!disposed)setContent({path:file.path,state:'error'});}).finally(()=>window.clearTimeout(timer));
    return ()=>{disposed=true;controller.abort();window.clearTimeout(timer);if(imageUrl)URL.revokeObjectURL(imageUrl);};
  },[endpoint,file,retry,preview]);
  const displayed=content.path===filePath?content:{state:'loading'};
  return <dialog ref={dialog} className="resource-reader" aria-labelledby="resource-reader-title" onCancel={event=>{event.preventDefault();onClose();}}>
    <div className="resource-reader-heading"><div><h2 id="resource-reader-title" tabIndex={-1}>{entry.name} files</h2><p>{kindLabels[entry.kind]} · {entry.license}</p></div><Button variant="outline" onClick={onClose}>Close reader</Button></div>
    <div className="resource-reader-actions"><CopyButton value={prompt}>Copy agent prompt</CopyButton><details><summary>Agent instructions</summary><Textarea aria-label="Resource agent prompt" value={prompt} rows={5} readOnly onFocus={event=>event.target.select()} /></details></div>
    {manifest.state==='loading'&&<p role="status">Loading resource files…</p>}
    {manifest.state==='error'&&<div role="alert"><p>Resource files could not load.</p><Button variant="outline" onClick={()=>setRetry(value=>value+1)}>Retry loading files</Button></div>}
    {manifest.state==='ready'&&<>
      <div className="resource-file-picker"><div className="resource-file-field"><label htmlFor="resource-file">File</label><select id="resource-file" value={filePath} onChange={event=>{setFilePath(event.target.value);setPreview(false);}}>{manifest.files.map(file=><option key={file.path} value={file.path}>{file.path}</option>)}</select></div><a className="text-link" href={endpoint+'/file?path='+encodeURIComponent(filePath)} download={filePath.split('/').at(-1)}>Download file</a></div>
      {previewUrl&&<div className="resource-preview-controls"><Button variant="outline" aria-pressed={preview} onClick={()=>{if(!preview&&previewPath)setFilePath(previewPath);setPreview(value=>!value);}}>{preview?'Read source':'Preview design'}</Button></div>}
      {preview&&previewUrl?<ResourcePreview url={previewUrl} type={previewPath?'html':entry.preview?.type||'image'} name={entry.name} onClose={onClose} />:<>
        {displayed.state==='loading'&&<p role="status">Loading file…</p>}
        {displayed.state==='error'&&<div role="alert"><p>This file could not load. Your selection is kept.</p><Button variant="outline" onClick={()=>setRetry(value=>value+1)}>Retry loading file</Button></div>}
        {displayed.state==='ready'&&('asset' in displayed&&displayed.asset?
          displayed.mimeType?.startsWith('image/')?<img className="resource-file-image" src={displayed.asset} alt={filePath} />:
          displayed.mimeType?.startsWith('video/')?<video className="resource-file-media" src={displayed.asset} aria-label={filePath} controls playsInline preload="metadata" />:
          displayed.mimeType?.startsWith('audio/')?<audio src={displayed.asset} aria-label={filePath} controls preload="metadata" />:
          <p>Download this file to use it in your project.</p>:
          <pre className="resource-file-content" tabIndex={0} aria-label={'Contents of '+filePath}>{'text' in displayed?displayed.text:''}</pre>)}
      </>}
    </>}
    <div className="resource-reader-links"><a href={manifest.state==='ready'&&manifest.files.some(file=>file.path==='LICENSE')?endpoint+'/file?path=LICENSE':'/api/resources/license'} download="LICENSE">License</a></div>
  </dialog>;
}

export function ResourceLibrary() {
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState('all');
  const [limit, setLimit] = useState(16);
  const [selected,setSelected]=useState<ResourceEntry|null>(null);
  const [openPreview,setOpenPreview]=useState(false);
  const opener=useRef<HTMLButtonElement|null>(null);
  useEffect(()=>{if(!selected)opener.current?.focus();},[selected]);
  const search = useRef<HTMLInputElement>(null);
  const terms = query.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [];
  const entries = library.entries.filter(entry => (kind === 'all' || (kind==='templates'?['design-templates','templates'].includes(entry.kind):entry.kind===kind)) && terms.every(term => `${entry.id} ${entry.name} ${entry.category} ${entry.description}`.toLowerCase().includes(term)));
  function open(entry:ResourceEntry,button:HTMLButtonElement,preview=false) {opener.current=button;setOpenPreview(preview);setSelected(entry);}
  function reset() {setQuery('');setKind('all');setLimit(16);search.current?.focus();}
  return <section className="resource-library section" id="resources" aria-labelledby="resources-title">
    <div className="section-heading"><div><h2 id="resources-title">Explore the Eidova library.</h2><p>Find a design, preview it, and use its files.</p></div></div>
    <div className="catalog-toolbar">
      <Input ref={search} type="search" aria-label="Search resources" placeholder="Search resources…" value={query} onChange={event=>{setQuery(event.target.value);setLimit(16);}} />
      <div className="resource-file-field"><label htmlFor="resource-type">Resource type</label><select id="resource-type" value={kind} onChange={event=>{setKind(event.target.value);setLimit(16);}}>{[['all','All resources'],['design-systems','Design systems'],['templates','Templates'],['plugins','Plugin designs'],['skills','Skills'],['catalogs','Catalog notes']].map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></div>
    </div>
    <p className="result-count" role="status">Showing {Math.min(limit,entries.length)} of {entries.length} resources</p>
    {entries.length===0 ? <div className="catalog-message"><h3>No matching resources.</h3><p>Try another name or clear the filters.</p><Button variant="outline" onClick={reset}>Clear resource filters</Button></div> : <ul className="resource-list">{entries.slice(0,limit).map(entry=><li key={entry.kind+'/'+entry.id}>
      <div><h3>{entry.name}</h3><p>{kindLabels[entry.kind]} · {entry.license} · {entry.fileCount} files</p><details><summary>Details</summary><p>Start with <code>{entry.entrypoint}</code></p><p className="resource-uri">MCP resource: <code>design://open-design/{entry.kind}/{entry.id}</code></p><a href={'/api/resources/'+entry.kind+'/'+entry.id+'/file?path='+encodeURIComponent(entry.entrypoint)} download={entry.entrypoint}>Download {entry.entrypoint}</a></details></div>
      <div className="resource-links">{entry.preview&&<Button variant="secondary" aria-haspopup="dialog" onClick={event=>open(entry,event.currentTarget,true)}>Preview design</Button>}<Button variant="outline" aria-haspopup="dialog" onClick={event=>open(entry,event.currentTarget)}>Read files</Button></div>
    </li>)}</ul>}
    {entries.length>limit && <div className="catalog-more"><Button variant="outline" onClick={()=>setLimit(value=>value+16)}>Show more resources</Button><Button variant="ghost" onClick={()=>setLimit(entries.length)}>Show all resources</Button></div>}
    <details className="resource-about"><summary>Use with your agent</summary><p>Use <code>search-resources</code> to find a design, then <code>read-resource</code> to load its files. Each reader includes an agent prompt and downloads. Keep the included licenses with your project.</p></details>
    {selected&&<ResourceReader key={selected.kind+'/'+selected.id} entry={selected} initialPreview={openPreview} onClose={()=>setSelected(null)} />}
  </section>;
}
