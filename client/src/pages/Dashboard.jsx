import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getDashboard, pdfUrl } from '../api';
import StatTile from '../components/StatTile.jsx';
import TeamRow from '../components/TeamRow.jsx';
import ImageHero from '../components/ImageHero.jsx';
import Flag from '../components/Flag.jsx';
import { metaFor } from '../teamMeta.js';

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
    const id = setInterval(load, 15000);
    return () => clearInterval(id);
  }, []);

  if (!data) {
    return (
      <ImageHero src="/hero-dashboard.jpg" overlay="center" eager className="mt-6 min-h-[300px]">
        <p className="mx-auto text-center text-white/85">{err || 'Loading the live tracker…'}</p>
      </ImageHero>
    );
  }

  if (data.visibility && data.visibility.show_live === false) {
    return (
      <ImageHero src="/hero-dashboard.jpg" overlay="center" eager className="mt-6 min-h-[320px]">
        <div className="mx-auto text-center">
          <p className="eyebrow text-gold">Coming soon</p>
          <h2 className="hero-title mt-2 font-display text-4xl text-white sm:text-5xl">
            The live tracker isn't public yet
          </h2>
          <p className="hero-sub mt-3 text-white/85">Please check back once the contest is underway.</p>
        </div>
      </ImageHero>
    );
  }

  const { stats, teamBreakdown, teamsOut, eliminatedToday, champion } = data;
  const maxActive = Math.max(1, ...teamBreakdown.map((t) => t.active_count));

  return (
    <div className="space-y-6">
      {/* Cinematic hero band */}
      <ImageHero src="/hero-dashboard.jpg" overlay="left" eager className="min-h-[260px] sm:min-h-[300px]">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow text-grass">
              <span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-grass align-middle" />
              Live tracker
            </p>
            <h1 className="hero-title mt-1 font-display text-4xl text-white sm:text-6xl">CONTEST STANDINGS</h1>
            <p className="hero-sub mt-1 text-sm text-white/80">
              {updatedAt ? `Updated ${updatedAt.toLocaleTimeString()}` : 'Updating…'} · refreshes every 15s
            </p>
          </div>
          <a href={pdfUrl()} target="_blank" rel="noreferrer" className="btn-gold">
            ⬇ Daily PDF report
          </a>
        </div>
      </ImageHero>

      {/* Champion */}
      <AnimatePresence>
        {champion && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}>
            <ImageHero src="/champion.jpg" overlay="center" className="min-h-[280px] ring-1 ring-gold/40">
              <div className="mx-auto text-center">
                <p className="eyebrow">Champions decided</p>
                <p className="hero-title mt-2 flex items-center justify-center gap-3 font-display text-5xl text-gold sm:text-6xl">
                  <Flag code={metaFor(champion.team).code} size="2.4rem" />
                  {champion.team}
                </p>
                <p className="hero-sub mt-3 text-white">
                  {champion.winners.length} winning predictor{champion.winners.length === 1 ? '' : 's'} — ranked by who predicted first
                </p>
              </div>
            </ImageHero>

            {/* Prize ranking — ordered by prediction date & time (earliest = 1st prize) */}
            <div className="panel mt-4 p-5">
              <p className="eyebrow text-gold">Prize ranking · first to predict {champion.team}</p>
              <div className="thin-scroll mt-3 max-h-96 space-y-2 overflow-y-auto pr-1">
                {champion.winners.map((w, i) => {
                  const medal = ['🥇', '🥈', '🥉'][i] || null;
                  const when = w.created_at
                    ? new Date(w.created_at).toLocaleString(undefined, {
                        day: '2-digit', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit', second: '2-digit',
                      })
                    : '';
                  return (
                    <div
                      key={i}
                      className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 ${
                        i === 0 ? 'border-gold/50 bg-gold/10 shadow-glow' : 'border-white/10 bg-white/5'
                      }`}
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-bold text-gold">
                        {medal || i + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-head text-sm font-bold text-white">
                          {w.full_name}
                          {i === 0 && <span className="ml-2 text-[10px] uppercase tracking-wide text-gold">First prize</span>}
                        </p>
                        <p className="truncate text-xs text-muted">
                          {[w.designation, w.section].filter(Boolean).join(' · ')}
                        </p>
                      </div>
                      <span className="shrink-0 text-right text-[11px] leading-tight text-white/70">
                        {when}
                      </span>
                    </div>
                  );
                })}
                {champion.winners.length === 0 && (
                  <p className="px-2 py-3 text-sm text-muted">No winning predictors.</p>
                )}
              </div>
              <p className="mt-3 text-[11px] text-muted">
                Rank is decided purely by prediction time — the earliest correct prediction wins.
              </p>
            </div>
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
                  <Flag code={metaFor(t.name).code} size="0.9rem" /> {t.name}
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
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/60"
              >
                <Flag code={metaFor(t.name).code} size="0.9rem" className="opacity-70" />
                <span className="line-through">{t.name}</span>
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
