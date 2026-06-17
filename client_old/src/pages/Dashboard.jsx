import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getDashboard, pdfUrl } from '../api';
import StatTile from '../components/StatTile.jsx';
import TeamRow from '../components/TeamRow.jsx';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);
  const [updatedAt, setUpdatedAt] = useState(null);

  async function load() {
    try {
      const d = await getDashboard();
      setData(d);
      setUpdatedAt(new Date());
      setErr(null);
    } catch (e) {
      setErr('Could not reach the live feed.');
    }
  }

  useEffect(() => {
    load();
    const id = setInterval(load, 15000); // live refresh
    return () => clearInterval(id);
  }, []);

  if (!data) {
    return (
      <div className="panel mt-8 p-10 text-center text-muted">
        {err || 'Loading the live tracker…'}
      </div>
    );
  }

  const { stats, teamBreakdown, teamsOut, eliminatedToday, champion } = data;
  const maxActive = Math.max(1, ...teamBreakdown.map((t) => t.active_count));

  return (
    <div className="space-y-6">
      {/* Hero band */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-ink-2 via-ink to-ink-2 p-6 sm:p-8">
        <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
          <div className="absolute inset-y-0 left-1/2 w-px bg-white" />
          <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white" />
        </div>
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow text-grass">Live tracker</p>
            <h1 className="mt-1 font-display text-3xl text-white sm:text-5xl">CONTEST STANDINGS</h1>
            <p className="mt-1 text-sm text-muted">
              {updatedAt ? `Updated ${updatedAt.toLocaleTimeString()}` : 'Updating…'} · refreshes every 15s
            </p>
          </div>
          <a href={pdfUrl()} target="_blank" rel="noreferrer" className="btn-gold">
            ⬇ Daily PDF report
          </a>
        </div>
      </div>

      {/* Champion */}
      <AnimatePresence>
        {champion && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative overflow-hidden rounded-3xl border border-gold/40 bg-gradient-to-r from-gold/15 to-hot/10 p-6 text-center shadow-glow"
          >
            <p className="eyebrow">Champions decided</p>
            <p className="mt-2 font-display text-4xl text-gold">
              {champion.flag} {champion.team}
            </p>
            <p className="mt-2 text-white/85">
              {champion.winners.length} winning predictor{champion.winners.length === 1 ? '' : 's'}:
            </p>
            <p className="mt-1 text-sm text-white/70">
              {champion.winners.map((w) => w.full_name).join(' · ') || '—'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatTile label="Total participants" value={stats.total} accent="gold" />
        <StatTile label="Still in contest" value={stats.remaining} accent="grass" sub="active predictors" />
        <StatTile label="Eliminated" value={stats.eliminated} accent="hot" sub="knocked out" />
      </div>

      {/* Eliminated today */}
      <AnimatePresence>
        {eliminatedToday.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="panel overflow-hidden p-4"
          >
            <p className="eyebrow text-hot">Eliminated today</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {eliminatedToday.map((t) => (
                <span
                  key={t.name}
                  className="inline-flex items-center gap-1.5 rounded-full border border-hot/40 bg-hot/10 px-3 py-1 text-sm text-white"
                >
                  {t.flag} {t.name}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Team breakdown */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-head text-lg font-bold text-white">Team-wise predictions</h2>
          <span className="text-xs text-muted">{teamBreakdown.length} teams with entries</span>
        </div>
        <motion.div layout className="grid gap-2.5 sm:grid-cols-2">
          {teamBreakdown.map((t, i) => (
            <TeamRow key={t.name} team={t} max={maxActive} rank={i} />
          ))}
          {teamBreakdown.length === 0 && (
            <p className="panel p-6 text-center text-muted">No predictions yet. Be the first!</p>
          )}
        </motion.div>
      </section>

      {/* Eliminated teams overall */}
      {teamsOut.length > 0 && (
        <section>
          <h2 className="mb-2 font-head text-lg font-bold text-white">Knocked out</h2>
          <div className="flex flex-wrap gap-2">
            {teamsOut.map((t) => (
              <span
                key={t.name}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/60 line-through"
              >
                {t.flag} {t.name}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
