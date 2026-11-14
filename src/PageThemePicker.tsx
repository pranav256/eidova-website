import { useLayoutEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { catalogThemes, type ThemeMode } from './theme';
import families from './design-families.json';
import './page-theme-picker.css';

const groups = [...families].sort((a, b) => Number(b.id === 'neutral') - Number(a.id === 'neutral')).map(family => ({
  ...family,
  themes: [family.representative, ...family.variants].filter(id => Object.hasOwn(catalogThemes, id)),
}));
const themeIds: (string | null)[] = [null, ...groups.flatMap(group => group.themes)];

function Swatches({ id, mode }: { id: string | null; mode: ThemeMode }) {
  const tokens = id ? catalogThemes[id].modes[mode].tokens : null;
  return <span className="theme-swatches" aria-hidden="true">{['--background', '--primary', '--foreground'].map(token => <i key={token} style={{ background: tokens?.[token] ?? `var(${token})` }} />)}</span>;
}

export function PageThemePicker({ mode, value, onChange }: { mode: ThemeMode; value: string | null; onChange: (id: string | null) => void }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const container = useRef<HTMLElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const title = value ? catalogThemes[value].title : 'Eidova default';
  const visible = groups.map(group => ({ ...group, themes: group.themes.filter(id => `${catalogThemes[id].title} ${group.title}`.toLowerCase().includes(query.trim().toLowerCase())) })).filter(group => group.themes.length);

  useLayoutEffect(() => {
    if (!open) return;
    search.current?.focus({ preventScroll: true });
    const panel = container.current?.querySelector<HTMLElement>('.page-theme-menu');
    const fit = () => {
      if (panel) panel.style.maxHeight = Math.max(0, innerHeight - panel.getBoundingClientRect().top - parseFloat(getComputedStyle(panel).paddingBottom)) + 'px';
    };
    fit();
    const resize = new ResizeObserver(fit);
    if (container.current) resize.observe(container.current);
    window.addEventListener('resize', fit);
    window.addEventListener('scroll', fit, { passive: true });
    const dismiss = (event: PointerEvent) => {
      if (!container.current?.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener('pointerdown', dismiss);
    return () => {
      window.removeEventListener('pointerdown', dismiss);
      window.removeEventListener('resize', fit);
      window.removeEventListener('scroll', fit);
      resize.disconnect();
    };
  }, [open]);

  function close() {
    setOpen(false);
    trigger.current?.focus({ preventScroll: true });
  }
  function choose(id: string | null) { onChange(id); close(); }
  function step(direction: number) {
    const index = themeIds.indexOf(value);
    onChange(themeIds[(index + direction + themeIds.length) % themeIds.length]);
  }

  return <aside ref={container} className="page-theme-picker" data-mode={mode} aria-label="Live page theme preview" onBlur={event => { if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget as Node)) setOpen(false); }} onKeyDown={event => { if (event.key === 'Escape' && open) { event.preventDefault(); close(); } }}>
    <div className="page-theme-picker-inner">
      <p className="theme-preview-label">Try it on this page</p>
      <div className="theme-picker-controls">
        <Button ref={trigger} variant="outline" className="theme-picker-trigger" aria-label={'Choose page theme: ' + title} aria-haspopup="dialog" aria-expanded={open} aria-controls="page-theme-menu" onClick={() => { setQuery(''); setOpen(current => !current); }}>
          <Swatches id={value} mode={mode} /><span>{title}</span><ChevronDown aria-hidden="true" />
        </Button>
        <div className="theme-step-controls" role="group" aria-label="Compare page themes">
          <Button variant="ghost" aria-label="Previous page theme" onClick={() => step(-1)}><ChevronLeft aria-hidden="true" /></Button>
          <Button variant="ghost" aria-label="Next page theme" onClick={() => step(1)}><ChevronRight aria-hidden="true" /></Button>
        </div>
        <p className="sr-only" role="status">Page theme: {title}</p>
        {open && <div className="page-theme-menu" id="page-theme-menu" role="dialog" aria-modal="false" aria-labelledby="page-theme-menu-title">
          <div className="theme-menu-heading"><h2 id="page-theme-menu-title">Choose a page theme</h2><Button variant="ghost" onClick={close}>Close</Button></div>
          <Input ref={search} type="search" aria-label="Search page themes" placeholder="Search themes or families…" value={query} onChange={event => setQuery(event.target.value)} onKeyDown={event => { if (event.key === 'ArrowDown') { event.preventDefault(); container.current?.querySelector<HTMLButtonElement>('.theme-choice:not(.theme-default-choice)')?.focus(); } }} />
          <div className="theme-menu-options" onKeyDown={event => {
            if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
            const options = [...event.currentTarget.querySelectorAll<HTMLButtonElement>('.theme-choice')];
            const index = options.indexOf(event.target as HTMLButtonElement);
            if (index < 0) return;
            event.preventDefault();
            const next = event.key === 'Home' ? 0 : event.key === 'End' ? options.length - 1 : (index + (event.key === 'ArrowDown' ? 1 : options.length - 1)) % options.length;
            options[next].focus();
          }}>
            <Button variant="ghost" className="theme-choice theme-default-choice" aria-pressed={!value} onClick={() => choose(null)}><Swatches id={null} mode={mode} /><span>Eidova default</span>{!value && <span className="theme-current">Current</span>}</Button>
            {visible.map(group => <section key={group.id} aria-labelledby={'theme-group-' + group.id}><h3 id={'theme-group-' + group.id}>{group.title}</h3>{group.themes.map(id => <Button key={id} variant="ghost" className="theme-choice" aria-label={'Apply page theme: ' + catalogThemes[id].title} aria-pressed={value === id} onClick={() => choose(id)}><Swatches id={id} mode={mode} /><span>{catalogThemes[id].title}</span>{value === id && <span className="theme-current">Current</span>}</Button>)}</section>)}
            {!visible.length && <p className="theme-picker-empty" role="status">No matching themes. Try another name.</p>}
          </div>
        </div>}
      </div>
    </div>
  </aside>;
}
