import { useEffect, useRef, useState } from 'react';

// A simple type-to-search dropdown for a list of string options.
export default function SearchSelect({
  options = [],
  value,
  onChange,
  placeholder = 'Type to search…',
  disabled = false,
  emptyText = 'No matches.',
}) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const filtered = query
    ? options.filter((o) => o.toLowerCase().includes(query.toLowerCase()))
    : options;
  const display = open ? query : value || '';

  return (
    <div className="relative" ref={ref}>
      <input
        className="field-input pr-9"
        placeholder={placeholder}
        value={display}
        disabled={disabled}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          if (value) onChange('');
        }}
        onFocus={() => {
          if (!disabled) {
            setOpen(true);
            setQuery('');
          }
        }}
      />
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted">▾</span>
      {open && !disabled && (
        <div className="thin-scroll absolute z-40 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-white/10 bg-ink-2 shadow-card">
          {filtered.length === 0 && <p className="px-4 py-3 text-sm text-muted">{emptyText}</p>}
          {filtered.map((o) => (
            <button
              type="button"
              key={o}
              className="block w-full px-3 py-2 text-left text-sm text-white transition hover:bg-white/10"
              onClick={() => {
                onChange(o);
                setQuery('');
                setOpen(false);
              }}
            >
              {o}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
