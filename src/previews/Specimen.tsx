import { Fragment, useEffect, useState, type FormEvent } from 'react';
import families from '../design-families.json';
import { catalogThemes } from '../theme';
import './specimen.css';

type Kit = typeof import('./kits/minimal-light');
const loaders=import.meta.glob<Kit>('./kits/*/index.ts');

export function SpecimenPage({ id, compact=false }: { id:string; compact?:boolean }) {
  const [kit,setKit]=useState<Kit>();
  const [failed,setFailed]=useState(false);
  const [name,setName]=useState('Acme Studio');
  const [saved,setSaved]=useState(false);
  const [invite,setInvite]=useState(false);
  const [email,setEmail]=useState('');
  const [members,setMembers]=useState([{name:'Alex Morgan',role:'Owner'},{name:'Sam Chen',role:'Editor'}]);
  const family=families.find(item=>item.representative===id);
  useEffect(()=>{let disposed=false;const load=loaders[`./kits/${id}/index.ts`];if(!load){setFailed(true);return;}const mode=catalogThemes[id].scheme;document.documentElement.dataset.theme=mode;document.documentElement.classList.toggle('dark',mode==='dark');load().then(value=>{if(!disposed)setKit(value);}).catch(()=>{if(!disposed)setFailed(true);});return()=>{disposed=true;};},[id]);
  if(failed||!family) return <main className="specimen-error"><h1>Preview unavailable</h1><p>Return to the catalog and choose another family.</p><a href="/">Open theme catalog</a></main>;
  if(!kit) return <p className="specimen-error" role="status">Loading component preview…</p>;
  const {Button,Input,Card,CardHeader,CardTitle,CardDescription,CardContent,CardFooter,Dialog,DialogTrigger,DialogContent,DialogHeader,DialogTitle,DialogDescription,Table,TableHeader,TableBody,TableRow,TableHead,TableCell,Sidebar,SidebarHeader,SidebarContent,SidebarGroup,SidebarItem,SidebarFooter}=kit;
  const Provider=kit.SidebarProvider??Fragment;
  function save(event:FormEvent) {event.preventDefault();setSaved(true);}
  function addMember(event:FormEvent) {event.preventDefault();setMembers(current=>[...current,{name:email,role:'Editor'}]);setEmail('');setInvite(false);}
  const details=<Card id="workspace-details"><form onSubmit={save}>
    <CardHeader><CardTitle>Workspace details</CardTitle><CardDescription>Your team sees this name.</CardDescription></CardHeader>
    <CardContent><label htmlFor="workspace-name" className="specimen-label">Workspace name</label><Input id="workspace-name" required pattern=".*\S.*" maxLength={80} value={name} onChange={event=>{setName(event.target.value);setSaved(false);}} /></CardContent>
    <CardFooter className="specimen-actions"><Button type="submit">Save changes</Button><span role="status">{saved?'Saved in this sample.':''}</span></CardFooter>
  </form></Card>;
  return <Provider>
    <style>{kit.css}</style>
    {compact?<main className="specimen-demo"><h1 style={{fontFamily:kit.headingFont}}>Workspace settings</h1><p>Acme Studio · Sample workspace</p>{details}</main>:<div className="specimen-page">
      <header className="specimen-meta"><a href="/" target="_top">Theme catalog</a><span>{family.title} · {catalogThemes[id].title} · Sample workspace</span></header>
      <div className="specimen-shell">
        <Sidebar className="specimen-nav" aria-label="Sample workspace navigation">
          <SidebarHeader>Acme Studio</SidebarHeader>
          <SidebarContent><SidebarGroup><SidebarItem {...(kit.sidebarUsesLabel?{label:'Workspace'}:{})} active aria-current="page" onClick={()=>document.getElementById('workspace-details')?.scrollIntoView()}>Workspace</SidebarItem><SidebarItem {...(kit.sidebarUsesLabel?{label:'Members'}:{})} onClick={()=>document.getElementById('workspace-members')?.scrollIntoView()}>Members</SidebarItem></SidebarGroup></SidebarContent>
          <SidebarFooter>Personal workspace</SidebarFooter>
        </Sidebar>
        <main className="specimen-content">
          <h1 style={{fontFamily:kit.headingFont}}>Workspace settings</h1>
          <p className="specimen-intro">Manage your workspace name and members.</p>
          {details}
          <Card id="workspace-members"><CardHeader><CardTitle>Workspace members</CardTitle><CardDescription>People who can access this sample workspace.</CardDescription></CardHeader>
            <CardContent><Table><TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Role</TableHead></TableRow></TableHeader><TableBody>{members.map(member=><TableRow key={member.name}><TableCell>{member.name}</TableCell><TableCell>{member.role}</TableCell></TableRow>)}</TableBody></Table></CardContent>
            <CardFooter><Dialog open={invite} onOpenChange={setInvite}><DialogTrigger asChild><Button variant="outline">Invite a member</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>Invite a member</DialogTitle><DialogDescription>Add a member to this sample. No email is sent.</DialogDescription></DialogHeader><form onSubmit={addMember} className="specimen-invite"><label htmlFor="invite-email">Email address</label><Input id="invite-email" type="email" required maxLength={254} value={email} onChange={event=>setEmail(event.target.value)} /><Button type="submit">Add sample member</Button></form></DialogContent></Dialog></CardFooter>
          </Card>
        </main>
      </div>
    </div>}
  </Provider>;
}
