import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getTeams, getDashboard, register } from '../api';
import CountdownTimer from '../components/CountdownTimer.jsx';
import ImageHero from '../components/ImageHero.jsx';
import TeamSelect from '../components/TeamSelect.jsx';

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
    if (!/^\d{10,15}$/.test(form.whatsapp.trim())) er.whatsapp = 'Use digits only (10–15).';
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
      <ImageHero src="/success.jpg" overlay="center" eager className="mx-auto mt-6 max-w-2xl min-h-[460px]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-md text-center"
        >
          <p className="eyebrow">Prediction locked</p>
          <h2 className="hero-title mt-2 font-display text-5xl text-gold sm:text-6xl">YOU'RE IN!</h2>
          <p className="hero-sub mt-3 text-lg text-white">
            Backing <span className="font-bold text-gold">{done.team}</span> all the way.
          </p>
          <p className="hero-sub mt-1 text-sm text-white/80">
            When your team falls, you're out. Survive to the final to win.
          </p>
          <div className="mt-7 flex justify-center gap-3">
            <Link to="/live" className="btn-gold">Watch live tracker</Link>
            <button className="btn-ghost" onClick={() => setDone(null)}>Register another</button>
          </div>
        </motion.div>
      </ImageHero>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      {/* Cinematic hero */}
      <ImageHero src="/hero-register.jpg" overlay="left" eager className="min-h-[340px] lg:min-h-[560px]">
        <p className="eyebrow">FIFA World Cup 2026 · Staff Contest</p>
        <h1 className="hero-title mt-3 font-display text-5xl leading-[0.92] text-white sm:text-7xl">
          PICK YOUR
          <br />
          <span className="text-gold">CHAMPION.</span>
        </h1>
        <p className="hero-sub mt-4 max-w-md text-white/85">
          One prediction per person. When your team is knocked out, you're out. The last predictors
          standing win. Make it count.
        </p>

        <div className="mt-6">
          {open && closesAt && (
            <>
              <p className="eyebrow mb-2 text-hot">Predictions close in</p>
              <CountdownTimer target={win.end_time} onExpire={() => setWin({ ...win })} />
            </>
          )}
          {notYetOpen && (
            <p className="hero-sub rounded-xl bg-black/35 px-4 py-3 text-sm text-white/90 backdrop-blur-sm">
              The window opens {new Date(win.start_time).toLocaleString()}.
            </p>
          )}
          {closed && (
            <p className="rounded-xl bg-hot/25 px-4 py-3 text-sm font-semibold text-white backdrop-blur-sm">
              The prediction window has closed. Head to the live tracker.
            </p>
          )}
        </div>
      </ImageHero>

      {/* Form */}
      <section className="panel p-6 sm:p-7">
        <h2 className="font-head text-xl font-bold text-white">Enter your prediction</h2>
        <p className="mb-5 mt-1 text-sm text-muted">All fields are required.</p>

        <div className="space-y-4">
          <Field label="Full name" error={errors.full_name}>
            <input className="field-input" value={form.full_name} onChange={set('full_name')} placeholder="e.g. Adarsh A" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Designation" error={errors.designation}>
              <input className="field-input" value={form.designation} onChange={set('designation')} placeholder="e.g. Senior Clerk" />
            </Field>
            <Field label="Section" error={errors.section}>
              <input className="field-input" value={form.section} onChange={set('section')} placeholder="e.g. Account Section" />
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
            <TeamSelect teams={teams} value={form.team} onChange={(name) => { setForm((f) => ({ ...f, team: name })); setErrors((er) => ({ ...er, team: undefined })); }} />
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
