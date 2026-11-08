import React from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/geist/400.css';
import '@fontsource/geist/500.css';
import '@fontsource/geist/600.css';
import './theme.css';
import './styles.css';
import { App } from './App';
import { applyTheme, readTheme } from './theme';

applyTheme(readTheme());
createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
