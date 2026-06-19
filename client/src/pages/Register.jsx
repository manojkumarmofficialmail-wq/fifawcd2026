import { useEffect, useMemo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, Navigate } from 'react-router-dom';
import { getTeams, getDashboard, getEmployees, register } from '../api';
import CountdownTimer from '../components/CountdownTimer.jsx';
import ImageHero from '../components/ImageHero.jsx';
import TeamSelect from '../components/TeamSelect.jsx';
import SearchSelect from '../components/SearchSelect.jsx';

const EMPTY = { full_name: '', designation: '', section: '', whatsapp: '', team: '' };

export default function Register() {
  const [teams, setTeams] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [sections, setSections] = useState([]);
  const [win, setWin] = useState(null);
  const [visibility, setVisibility] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [serverMsg, setServerMsg] = useState(null);
  const [done, setDone] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const refresh = useCallback(() => {
    getDashboard()
      .then((d) => {
        setWin(d.window);
        setVisibility(d.visibility || { show_register: true, show_live: true });
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  useEffect(() => {
    getTeams().then((d) => setTeams(d.teams)).catch(() => {});
    getEmployees()
      .then((d) => { setEmployees(d.employees || []); setSections(d.sections || []); })
      .catch(() => {});
    refresh();
    const id = setInterval(refresh, 20000);
    return () => clearInterval(id);
  }, [refresh]);

  const now = Date.now();
  const startsAt = win?.start_time ? new Date(win.start_time).getTime() : null;
  const closesAt = win?.end_time ? new Date(win.end_time).getTime() : null;
  const notYetOpen = startsAt && now < startsAt;
  const closed = closesAt && now > closesAt;
  const open = !notYetOpen && !closed;

  const showRegister = visibility ? visibility.show_register : true;
  const showLive = visibility ? visibility.show_live : true;
  const registerAvailable = showRegister && !closed;

  // Allowlist mode is on once an employee list has been uploaded.
  const useAllowlist = employees.length > 0;
  const namesForSection = useMemo(
    () => employees.filter((e) => e.section === form.section).map((e) => e.name),
    [employees, form.section]
  );
  const activeTeams = useMemo(() => teams.filter((t) => !t.is_eliminated), [teams]);

  const setField = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((er) => ({ ...er, [k]: undefined }));
    setServerMsg(null);
  };
  const onText = (k) => (e) => setField(k, e.target.value);

  function validate() {
    const er = {};
    if (!form.section.trim()) er.section = 'Select your section.';
    if (!form.full_name.trim()) er.full_name = useAllowlist ? 'Select your name.' : 'Enter your full name.';
    if (!form.designation.trim()) er.designation = 'Enter your designation.';
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
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-md text-center">
          <p className="eyebrow">Prediction locked</p>
          <h2 className="hero-title mt-2 font-display text-5xl text-gold sm:text-6xl">YOU'RE IN!</h2>
          <p className="hero-sub mt-3 text-lg text-white">
            Backing <span className="font-bold text-gold">{done.team}</span> all the way.
          </p>
          <p className="hero-sub mt-1 text-sm text-white/80">When your team falls, you're out. Survive to the final to win.</p>
          <div className="mt-7 flex justify-center gap-3">
            {showLive && <Link to="/live" className="btn-gold">Watch live tracker</Link>}
            <button className="btn-ghost" onClick={() => setDone(null)}>Done</button>
          </div>
        </motion.div>
      </ImageHero>
    );
  }

  if (loaded && !registerAvailable) {
    if (showLive) return <Navigate to="/live" replace />;
    return (
      <ImageHero src="/hero-register.jpg" overlay="center" eager className="mx-auto mt-6 max-w-2xl min-h-[360px]">
        <div className="mx-auto text-center">
          <p className="eyebrow text-hot">Registration closed</p>
          <h2 className="hero-title mt-2 font-display text-4xl text-white sm:text-5xl">Predictions are closed</h2>
          <p className="hero-sub mt-3 text-white/85">Thank you — entries are no longer being accepted.</p>
        </div>
      </ImageHero>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
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
          {notYetOpen && (
            <>
              <p className="eyebrow mb-2 text-grass">Predictions open in</p>
              <CountdownTimer target={win.start_time} onExpire={refresh} />
            </>
          )}
          {open && closesAt && (
            <>
              <p className="eyebrow mb-2 text-hot">Predictions close in</p>
              <CountdownTimer target={win.end_time} onExpire={refresh} />
            </>
          )}
        </div>
      </ImageHero>

      <section className="panel p-6 sm:p-7">
        <h2 className="font-head text-xl font-bold text-white">Enter your prediction</h2>
        <p className="mb-5 mt-1 text-sm text-muted">
          {notYetOpen ? 'Registration opens soon. Come back when the countdown ends.' : 'All fields are required.'}
        </p>

        <div className="space-y-4">
          {/* Section first */}
          <Field label="Section" error={errors.section}>
            {useAllowlist ? (
              <SearchSelect
                options={sections}
                value={form.section}
                onChange={(s) => { setField('section', s); setField('full_name', ''); }}
                placeholder="Type to search your section…"
                disabled={!open}
              />
            ) : (
              <input className="field-input" value={form.section} onChange={onText('section')} placeholder="e.g. ICDS" disabled={!open} />
            )}
          </Field>

          {/* Then name (filtered by section) */}
          <Field label="Full name" error={errors.full_name}>
            {useAllowlist ? (
              <SearchSelect
                options={namesForSection}
                value={form.full_name}
                onChange={(n) => setField('full_name', n)}
                placeholder={form.section ? 'Type to search your name…' : 'Select a section first'}
                disabled={!open || !form.section}
                emptyText="No matching name in this section."
              />
            ) : (
              <input className="field-input" value={form.full_name} onChange={onText('full_name')} placeholder="e.g. Adarsh A" disabled={!open} />
            )}
          </Field>

          <Field label="Designation" error={errors.designation}>
            <input className="field-input" value={form.designation} onChange={onText('designation')} placeholder="e.g. Senior Clerk" disabled={!open} />
          </Field>

          <Field label="WhatsApp number" error={errors.whatsapp}>
            <input className="field-input" value={form.whatsapp} onChange={onText('whatsapp')} inputMode="numeric" placeholder="Digits only" maxLength={15} disabled={!open} />
          </Field>

          <Field label="Predicted winning team" error={errors.team}>
            <TeamSelect teams={teams} value={form.team} onChange={(name) => setField('team', name)} />
          </Field>

          <AnimatePresence>
            {serverMsg && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`rounded-xl px-4 py-3 text-sm ${serverMsg.type === 'error' ? 'bg-hot/15 text-hot' : 'bg-grass/15 text-grass'}`}
              >
                {serverMsg.text}
              </motion.p>
            )}
          </AnimatePresence>

          <button className="btn-gold w-full" onClick={onSubmit} disabled={submitting || !open}>
            {submitting ? 'Submitting…' : open ? 'Lock my prediction' : notYetOpen ? 'Opens soon' : 'Predictions closed'}
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
