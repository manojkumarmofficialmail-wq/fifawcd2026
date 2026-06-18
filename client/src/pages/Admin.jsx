import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  adminLogin,
  getSettings,
  setTime,
  getTeams,
  eliminateTeam,
  getUsers,
} from '../api';
import ImageHero from '../components/ImageHero.jsx';
import Flag from '../components/Flag.jsx';
import { metaFor } from '../teamMeta.js';

// ISO -> value for <input type="datetime-local"> in the browser's local zone
function toLocalInput(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

export default function Admin() {
  const [authed, setAuthed] = useState(!!localStorage.getItem('wcd_admin_key'));
  const [keyInput, setKeyInput] = useState('');
  const [loginErr, setLoginErr] = useState(null);

  async function doLogin() {
    setLoginErr(null);
    try {
      await adminLogin(keyInput.trim());
      localStorage.setItem('wcd_admin_key', keyInput.trim());
      setAuthed(true);
    } catch {
      setLoginErr('Incorrect admin key.');
    }
  }

  function logout() {
    localStorage.removeItem('wcd_admin_key');
    setAuthed(false);
  }

  if (!authed) {
    return (
      <ImageHero src="/hero-admin.jpg" overlay="center" eager className="mx-auto mt-6 max-w-md min-h-[460px]">
        <div className="mx-auto w-full max-w-sm rounded-2xl border border-white/10 bg-ink/55 p-6 backdrop-blur-md">
          <p className="eyebrow">Restricted</p>
          <h1 className="hero-title mt-1 font-display text-3xl text-white">Admin sign-in</h1>
          <p className="mb-5 mt-1 text-sm text-white/75">Enter the committee admin key.</p>
          <input
            type="password"
            className="field-input"
            placeholder="Admin key"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && doLogin()}
          />
          {loginErr && <p className="mt-2 text-xs text-hot">{loginErr}</p>}
          <button className="btn-gold mt-4 w-full" onClick={doLogin}>
            Sign in
          </button>
        </div>
      </ImageHero>
    );
  }

  return <AdminPanel onLogout={logout} />;
}

function AdminPanel({ onLogout }) {
  const [win, setWin] = useState({ start: '', end: '' });
  const [winMsg, setWinMsg] = useState(null);
  const [teams, setTeams] = useState([]);
  const [actionMsg, setActionMsg] = useState(null);

  // participants
  const [filterTeam, setFilterTeam] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [q, setQ] = useState('');
  const [users, setUsers] = useState([]);
  const [userCount, setUserCount] = useState(0);

  async function loadSettings() {
    const d = await getSettings();
    setWin({ start: toLocalInput(d.window?.start_time), end: toLocalInput(d.window?.end_time) });
  }
  async function loadTeams() {
    const d = await getTeams();
    setTeams(d.teams);
  }
  async function loadUsers() {
    const params = {};
    if (filterTeam) params.team = filterTeam;
    if (filterStatus) params.status = filterStatus;
    if (q.trim()) params.q = q.trim();
    const d = await getUsers(params);
    setUsers(d.users);
    setUserCount(d.count);
  }

  useEffect(() => {
    loadSettings();
    loadTeams();
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const id = setTimeout(loadUsers, 250); // debounce search/filter
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterTeam, filterStatus, q]);

  async function saveWindow() {
    setWinMsg(null);
    try {
      const startIso = new Date(win.start).toISOString();
      const endIso = new Date(win.end).toISOString();
      await setTime(startIso, endIso);
      setWinMsg({ type: 'ok', text: 'Prediction window saved.' });
    } catch (e) {
      setWinMsg({ type: 'error', text: e?.response?.data?.error || 'Could not save window.' });
    }
  }

  async function toggleTeam(team, eliminated) {
    setActionMsg(null);
    try {
      const r = await eliminateTeam(team, eliminated);
      setActionMsg({ type: 'ok', text: r.message });
      await Promise.all([loadTeams(), loadUsers()]);
    } catch (e) {
      setActionMsg({ type: 'error', text: e?.response?.data?.error || 'Action failed.' });
    }
  }

  const remaining = users.filter((u) => u.status === 'active').length;
  const grouped = teams
    .filter((t) => t.total_count > 0)
    .sort((a, b) => b.active_count - a.active_count);

  return (
    <div className="space-y-6">
      <ImageHero src="/hero-admin.jpg" overlay="left" eager className="min-h-[180px]">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow text-grass">Admin control</p>
            <h1 className="hero-title font-display text-3xl text-white sm:text-5xl">Contest console</h1>
          </div>
          <button className="btn-ghost backdrop-blur-sm" onClick={onLogout}>
            Sign out
          </button>
        </div>
      </ImageHero>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* A. Prediction window */}
        <section className="panel p-6">
          <h2 className="font-head text-lg font-bold text-white">A · Prediction window</h2>
          <p className="mb-4 mt-1 text-sm text-muted">Submissions are only accepted inside this window.</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-xs uppercase tracking-wide text-white/70">Start</span>
              <input
                type="datetime-local"
                className="field-input"
                value={win.start}
                onChange={(e) => setWin((w) => ({ ...w, start: e.target.value }))}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs uppercase tracking-wide text-white/70">End</span>
              <input
                type="datetime-local"
                className="field-input"
                value={win.end}
                onChange={(e) => setWin((w) => ({ ...w, end: e.target.value }))}
              />
            </label>
          </div>
          {winMsg && (
            <p className={`mt-3 text-sm ${winMsg.type === 'error' ? 'text-hot' : 'text-grass'}`}>
              {winMsg.text}
            </p>
          )}
          <button className="btn-gold mt-4" onClick={saveWindow}>
            Save window
          </button>
        </section>

        {/* D. Daily summary */}
        <section className="panel p-6">
          <h2 className="font-head text-lg font-bold text-white">D · Daily summary</h2>
          <p className="mb-4 mt-1 text-sm text-muted">Active contestants grouped by team.</p>
          <div className="mb-4 flex gap-3">
            <Stat label="Showing" value={userCount} />
            <Stat label="Active" value={remaining} accent="grass" />
          </div>
          <div className="thin-scroll max-h-60 space-y-2 overflow-y-auto pr-1">
            {grouped.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2"
              >
                <span className={`flex items-center gap-2 text-sm ${t.is_eliminated ? 'text-white/50' : 'text-white'}`}>
                  <Flag code={metaFor(t.name).code} size="0.9rem" />
                  <span className={t.is_eliminated ? 'line-through' : ''}>{t.name}</span>
                </span>
                <span className="stat-num text-base text-gold">
                  {t.active_count}
                  <span className="ml-1 text-xs text-muted">/ {t.total_count}</span>
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* C. Match result / eliminations */}
      <section className="panel p-6">
        <h2 className="font-head text-lg font-bold text-white">C · Match results — knockouts</h2>
        <p className="mb-4 mt-1 text-sm text-muted">
          Mark a team eliminated to knock out everyone who picked it. Restore if entered by mistake.
        </p>
        {actionMsg && (
          <p className={`mb-3 text-sm ${actionMsg.type === 'error' ? 'text-hot' : 'text-grass'}`}>
            {actionMsg.text}
          </p>
        )}
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {teams.map((t) => (
            <motion.div
              layout
              key={t.id}
              className={`flex items-center justify-between rounded-xl border px-3 py-2 ${
                t.is_eliminated ? 'border-hot/30 bg-hot/5' : 'border-white/10 bg-white/5'
              }`}
            >
              <span className="flex items-center gap-2 text-sm">
                <Flag code={metaFor(t.name).code} size="0.9rem" />
                <span className={t.is_eliminated ? 'text-white/50 line-through' : 'text-white'}>
                  {t.name}
                </span>
                <span className="text-xs text-muted">({t.active_count})</span>
              </span>
              {t.is_eliminated ? (
                <button
                  className="rounded-lg border border-white/15 px-2.5 py-1 text-xs text-white/80 hover:bg-white/10"
                  onClick={() => toggleTeam(t.name, false)}
                >
                  Restore
                </button>
              ) : (
                <button
                  className="rounded-lg bg-hot px-2.5 py-1 text-xs font-semibold text-white hover:brightness-110"
                  onClick={() => toggleTeam(t.name, true)}
                >
                  Eliminate
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* B. Participants */}
      <section className="panel p-6">
        <h2 className="font-head text-lg font-bold text-white">B · Participants</h2>
        <div className="my-4 grid gap-3 sm:grid-cols-3">
          <input
            className="field-input"
            placeholder="Search name or section…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <select className="field-input" value={filterTeam} onChange={(e) => setFilterTeam(e.target.value)}>
            <option value="">All teams</option>
            {teams.map((t) => (
              <option key={t.id} value={t.name}>
                {t.name}
              </option>
            ))}
          </select>
          <select className="field-input" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">Any status</option>
            <option value="active">Active</option>
            <option value="eliminated">Eliminated</option>
          </select>
        </div>

        <div className="thin-scroll max-h-[26rem] overflow-auto rounded-xl border border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 bg-ink-2 text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Designation</th>
                <th className="px-3 py-2">Section</th>
                <th className="px-3 py-2">Team</th>
                <th className="px-3 py-2">WhatsApp</th>
                <th className="px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-white/5">
                  <td className="px-3 py-2 text-white">{u.full_name}</td>
                  <td className="px-3 py-2 text-white/80">{u.designation}</td>
                  <td className="px-3 py-2 text-white/80">{u.section}</td>
                  <td className="px-3 py-2 text-white/80">{u.team}</td>
                  <td className="px-3 py-2 text-white/60">{u.whatsapp}</td>
                  <td className="px-3 py-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        u.status === 'active' ? 'bg-grass/15 text-grass' : 'bg-hot/15 text-hot'
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-3 py-8 text-center text-muted">
                    No participants match these filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value, accent = 'gold' }) {
  return (
    <div className="flex-1 rounded-xl bg-white/5 px-3 py-2">
      <p className="text-[10px] uppercase tracking-widest text-muted">{label}</p>
      <p className={`stat-num text-2xl ${accent === 'grass' ? 'text-grass' : 'text-gold'}`}>{value}</p>
    </div>
  );
}
