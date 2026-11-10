import React from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/geist/400.css';
import '@fontsource/geist/500.css';
import '@fontsource/geist/600.css';
import { App } from './App';
import { applyTheme, readTheme } from './theme';
import { SpecimenPage } from './previews/Specimen';

const params=new URLSearchParams(window.location.search);
const specimen=params.get('specimen');
if(specimen)document.documentElement.dataset.specimen=specimen;
const ready=specimen?Promise.resolve():Promise.all([import('./theme.css'),import('./styles.css')]);
ready.then(()=>{
  if(!specimen)applyTheme(readTheme());
  createRoot(document.getElementById('root')!).render(<React.StrictMode>{specimen?<SpecimenPage id={specimen} compact={params.get('example')==='details'} />:<App />}</React.StrictMode>);
});
