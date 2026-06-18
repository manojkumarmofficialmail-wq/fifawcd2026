import { useEffect, useRef, useState } from 'react';
import Flag from './Flag.jsx';
import { metaFor } from '../teamMeta.js';

// Type-to-filter team picker. Shows real flags, hides eliminated teams,
// closes on outside click / Escape.
export default function TeamSelect({ teams, value, onChange }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onDocClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const active = teams.filter((t) => !t.is_eliminated);
  const filtered = query
    ? active.filter((t) => t.name.toLowerCase().includes(query.toLowerCase()))
    : active;

  const display = open ? query : value || '';

  return (
    <div className="relative" ref={ref}>
      <div className="relative">
        {!open && value && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
            <Flag code={metaFor(value).code} size="1rem" />
          </span>
        )}
        <input
          className={`field-input ${!open && value ? 'pl-10' : ''}`}
          placeholder="Type to search teams…"
          value={display}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            if (value) onChange('');
          }}
          onFocus={() => {
            setOpen(true);
            setQuery('');
          }}
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted">▾</span>
      </div>

      {open && (
        <div className="thin-scroll absolute z-40 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-white/10 bg-ink-2 shadow-card">
          {filtered.length === 0 && (
            <p className="px-4 py-3 text-sm text-muted">No teams found.</p>
          )}
          {filtered.map((t) => (
            <button
              type="button"
              key={t.id}
              className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-white transition hover:bg-white/10"
              onClick={() => {
                onChange(t.name);
                setQuery('');
                setOpen(false);
              }}
            >
              <Flag code={metaFor(t.name).code} size="1rem" />
              <span>{t.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
