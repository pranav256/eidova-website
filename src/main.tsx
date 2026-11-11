import React from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/geist/400.css';
import '@fontsource/geist/500.css';
import '@fontsource/geist/600.css';
import { App } from './App';
import { applyTheme, readTheme } from './theme';
import { SpecimenPage } from './previews/Specimen';
import { TeamStudio } from './TeamStudio';
import { SharedStudio } from './SharedStudio';

const params=new URLSearchParams(window.location.search);
const specimen=params.get('specimen');
if(specimen)document.documentElement.dataset.specimen=specimen;
else applyTheme(readTheme());
const ready=specimen?Promise.resolve():Promise.all([import('./theme.css'),import('./styles.css')]);
ready.then(()=>{
  if(!specimen)applyTheme(readTheme());
  createRoot(document.getElementById('root')!).render(<React.StrictMode>{specimen?<SpecimenPage id={specimen} compact={params.get('example')==='details'} />:window.location.pathname.replace(/\/$/,'')==='/studio'?(window.location.hash.startsWith('#share=')?<SharedStudio />:<TeamStudio />):<App />}</React.StrictMode>);
});
