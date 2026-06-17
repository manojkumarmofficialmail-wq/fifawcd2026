import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getTeams, getDashboard, register } from '../api';
import CountdownTimer from '../components/CountdownTimer.jsx';

const EMPTY = { full_name: '', designation: '', section: '', whatsapp: '', team: '' };

export default function Register() {
  const [teams, setTeams] = useState([]);
  const [win, setWin] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [serverMsg, setServerMsg] = useState(null);
  const [done, setDone] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getTeams().then((d) => setTeams(d.teams)).catch(() => {});
    getDashboard().then((d) => setWin(d.window)).catch(() => {});
  }, []);

  const now = Date.now();
  const opensAt = win?.start_time ? new Date(win.start_time).getTime() : null;
  const closesAt = win?.end_time ? new Date(win.end_time).getTime() : null;
  const notYetOpen = opensAt && now < opensAt;
  const closed = closesAt && now > closesAt;
  const open = !notYetOpen && !closed;

  const activeTeams = useMemo(() => teams.filter((t) => !t.is_eliminated), [teams]);

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k]: undefined }));
    setServerMsg(null);
  };

  function validate() {
    const er = {};
    if (!form.full_name.trim()) er.full_name = 'Enter your full name.';
    if (!form.designation.trim()) er.designation = 'Enter your designation.';
    if (!form.section.trim()) er.section = 'Enter your section.';
    if (!/^\d{10,15}$/.test(form.whatsapp.trim()))
      er.whatsapp = 'Use digits only (10–15).';
    if (!form.team) er.team = 'Pick a team.';
    setErrors(er);
    return Object.keys(er).length === 0;
  }

  async function onSubmit() {
    setServerMsg(null);
    if (!open) {
      setServerMsg({ type: 'error', text: closed ? 'Predictions are closed.' : 'Predictions are not open yet.' });
      return;
    }
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await register({ ...form, whatsapp: form.whatsapp.trim() });
      setDone(res.user);
      setForm(EMPTY);
    } catch (err) {
      setServerMsg({ type: 'error', text: err?.response?.data?.error || 'Submission failed. Try again.' });
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="panel mx-auto mt-8 max-w-lg p-8 text-center"
      >
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-grass/20 text-3xl">
          ⚽
        </div>
        <h2 className="font-display text-3xl text-gold">You're in!</h2>
        <p className="mt-2 text-white/80">
          Your prediction for <span className="font-bold text-white">{done.team}</span> is locked.
        </p>
        <p className="mt-1 text-sm text-muted">Follow the knockouts on the live tracker.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/live" className="btn-gold">
            Watch live tracker
          </Link>
          <button className="btn-ghost" onClick={() => setDone(null)}>
            Register another
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-ink-2 to-ink p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 animate-float opacity-20">
          <img src="/ball.svg" alt="" className="h-full w-full" />
        </div>
        <p className="eyebrow">FIFA World Cup 2026 · Staff Contest</p>
        <h1 className="mt-3 font-display text-4xl leading-[0.95] text-white sm:text-6xl">
          PICK YOUR
          <br />
          <span className="text-gold">CHAMPION.</span>
        </h1>
        <p className="mt-4 max-w-md text-white/75">
          One prediction per person. When your team is knocked out, you're out. Last predictor
          standing wins. Make it count.
        </p>

        <div className="mt-7">
          {open && closesAt && (
            <>
              <p className="eyebrow mb-2 text-hot">Predictions close in</p>
              <CountdownTimer target={win.end_time} onExpire={() => setWin({ ...win })} />
            </>
          )}
          {notYetOpen && (
            <p className="rounded-xl bg-white/5 px-4 py-3 text-sm text-white/80">
              The window opens {new Date(win.start_time).toLocaleString()}.
            </p>
          )}
          {closed && (
            <p className="rounded-xl bg-hot/15 px-4 py-3 text-sm text-hot">
              The prediction window has closed. Head to the live tracker.
            </p>
          )}
        </div>
      </section>

      {/* Form */}
      <section className="panel p-6 sm:p-7">
        <h2 className="font-head text-xl font-bold text-white">Enter your prediction</h2>
        <p className="mb-5 mt-1 text-sm text-muted">All fields are required.</p>

        <div className="space-y-4">
          <Field label="Full name" error={errors.full_name}>
            <input className="field-input" value={form.full_name} onChange={set('full_name')} placeholder="e.g. Anjali Menon" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Designation" error={errors.designation}>
              <input className="field-input" value={form.designation} onChange={set('designation')} placeholder="e.g. Project Officer" />
            </Field>
            <Field label="Section" error={errors.section}>
              <input className="field-input" value={form.section} onChange={set('section')} placeholder="e.g. ICDS" />
            </Field>
          </div>
          <Field label="WhatsApp number" error={errors.whatsapp}>
            <input
              className="field-input"
              value={form.whatsapp}
              onChange={set('whatsapp')}
              inputMode="numeric"
              placeholder="Digits only"
              maxLength={15}
            />
          </Field>
          <Field label="Predicted winning team" error={errors.team}>
            <select className="field-input" value={form.team} onChange={set('team')}>
              <option value="">Select a team…</option>
              {activeTeams.map((t) => (
                <option key={t.id} value={t.name}>
                  {t.flag} {t.name}
                </option>
              ))}
            </select>
          </Field>

          <AnimatePresence>
            {serverMsg && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`rounded-xl px-4 py-3 text-sm ${
                  serverMsg.type === 'error' ? 'bg-hot/15 text-hot' : 'bg-grass/15 text-grass'
                }`}
              >
                {serverMsg.text}
              </motion.p>
            )}
          </AnimatePresence>

          <button className="btn-gold w-full" onClick={onSubmit} disabled={submitting || !open}>
            {submitting ? 'Submitting…' : open ? 'Lock my prediction' : 'Predictions closed'}
          </button>
        </div>
      </section>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-head text-[12px] font-semibold uppercase tracking-wide text-white/70">
        {label}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs text-hot">{error}</span>}
    </label>
  );
}
