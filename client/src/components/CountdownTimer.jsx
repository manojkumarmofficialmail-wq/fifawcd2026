import { useEffect, useState } from 'react';

function diff(target) {
  const ms = Math.max(0, new Date(target).getTime() - Date.now());
  const d = Math.floor(ms / 86400000);
  const h = Math.floor((ms % 86400000) / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return { ms, d, h, m, s };
}

function Cell({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <div className="min-w-[52px] rounded-xl border border-white/10 bg-ink/70 px-2 py-2 text-center">
        <span className="stat-num text-2xl text-white sm:text-3xl">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="mt-1 text-[10px] uppercase tracking-widest text-muted">{label}</span>
    </div>
  );
}

// Counts down to `target`. Calls onExpire once when it hits zero.
export default function CountdownTimer({ target, onExpire }) {
  const [t, setT] = useState(() => (target ? diff(target) : null));

  useEffect(() => {
    if (!target) return;
    setT(diff(target));
    const id = setInterval(() => {
      const next = diff(target);
      setT(next);
      if (next.ms === 0) {
        clearInterval(id);
        onExpire && onExpire();
      }
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  if (!target || !t) return null;

  return (
    <div className="flex items-end gap-2 sm:gap-3" role="timer" aria-live="polite">
      <Cell value={t.d} label="Days" />
      <span className="stat-num pb-5 text-2xl text-gold">:</span>
      <Cell value={t.h} label="Hrs" />
      <span className="stat-num pb-5 text-2xl text-gold">:</span>
      <Cell value={t.m} label="Min" />
      <span className="stat-num pb-5 text-2xl text-gold">:</span>
      <Cell value={t.s} label="Sec" />
    </div>
  );
}
