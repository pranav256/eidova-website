import { useEffect, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Button } from './ui/button';

export function CopyButton({ value, children, variant = 'default' }: { value: string; children: string; variant?: 'default' | 'outline' }) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'error'>('idle');
  useEffect(() => {
    setStatus('idle');
  }, [value]);
  useEffect(() => {
    if (status === 'idle') return;
    const timer = window.setTimeout(() => setStatus('idle'), 3500);
    return () => window.clearTimeout(timer);
  }, [status]);
  async function copy() {
    try { await navigator.clipboard.writeText(value); setStatus('copied'); }
    catch { setStatus('error'); }
  }
  return <div className="copy-action">
    <Button type="button" variant={variant} onClick={copy}>{status === 'copied' ? 'Copied' : children}{status === 'copied' ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}</Button>
    <span role="status" className="copy-feedback">{status === 'error' ? 'Select the text and copy it manually.' : status === 'copied' ? 'Copied to clipboard.' : ''}</span>
  </div>;
}
