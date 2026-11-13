import React from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-500.css';
import '@fontsource/inter/latin-600.css';
import { App } from './App';
import { applyTheme, readTheme } from './theme';
import { SpecimenPage } from './previews/Specimen';
import { TeamStudio } from './TeamStudio';
import { SharedStudio } from './SharedStudio';

const params=new URLSearchParams(window.location.search);
const specimen=params.get('specimen');
const showcase=window.location.pathname.replace(/\/$/,'')==='/showcase';
if(specimen)document.documentElement.dataset.specimen=specimen;
else applyTheme(readTheme());
const ready=specimen?Promise.resolve():Promise.all([import('./theme.css'),import('./styles.css')]).then(()=>import('./clean.css'));
ready.then(()=>{
  if(!specimen)applyTheme(readTheme());
  if(showcase&&!specimen){import('./Showcase').then(({Showcase})=>createRoot(document.getElementById('root')!).render(<React.StrictMode><Showcase /></React.StrictMode>));return;}
  createRoot(document.getElementById('root')!).render(<React.StrictMode>{specimen?<SpecimenPage id={specimen} compact={params.get('example')==='details'} />:window.location.pathname.replace(/\/$/,'')==='/studio'?(window.location.hash.startsWith('#share=')?<SharedStudio />:<TeamStudio />):<App />}</React.StrictMode>);
});
