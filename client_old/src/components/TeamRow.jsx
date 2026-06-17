import { motion } from 'framer-motion';

// One team in the live breakdown. Eliminated teams desaturate, dim,
// and show a struck-through name. `max` scales the bar.
export default function TeamRow({ team, max, rank }) {
  const pct = max > 0 ? Math.round((team.active_count / max) * 100) : 0;
  const out = team.is_eliminated;
  const isLeader = rank === 0 && !out && team.active_count > 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: out ? 0.55 : 1, x: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 26 }}
      className={`panel flex items-center gap-3 p-3 ${
        isLeader ? 'shadow-glow ring-1 ring-gold/40' : ''
      } ${out ? 'grayscale' : ''}`}
    >
      <span className="w-6 text-center font-head text-xs text-muted">{rank + 1}</span>
      <span className="text-2xl leading-none" aria-hidden>
        {team.flag || '⚽'}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p
            className={`truncate font-head text-sm font-bold ${
              out ? 'text-white/60 line-through' : 'text-white'
            }`}
          >
            {team.name}
            {isLeader && <span className="ml-2 align-middle text-[10px] text-gold">★ TOP</span>}
            {out && <span className="ml-2 align-middle text-[10px] text-hot">OUT</span>}
          </p>
          <p className="stat-num shrink-0 text-lg text-white">{team.active_count}</p>
        </div>
        <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-white/10">
          <motion.div
            className={`h-full rounded-full ${out ? 'bg-hot/60' : 'bg-gradient-to-r from-grass to-gold'}`}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>
    </motion.div>
  );
}
