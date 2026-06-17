import { useEffect, useRef, useState } from 'react';

// A lightweight, royalty-free "stadium" groove synthesised with the Web Audio
// API — a four-on-the-floor kick, claps, and a bouncing bassline. No audio
// files, no licensing concerns.
export default function MusicToggle() {
  const [on, setOn] = useState(false);
  const ctxRef = useRef(null);
  const timerRef = useRef(null);
  const gainRef = useRef(null);

  function kick(ctx, t) {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.frequency.setValueAtTime(150, t);
    o.frequency.exponentialRampToValueAtTime(50, t + 0.12);
    g.gain.setValueAtTime(0.9, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
    o.connect(g).connect(gainRef.current);
    o.start(t);
    o.stop(t + 0.2);
  }

  function clap(ctx, t) {
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.2, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.25, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 1200;
    src.connect(hp).connect(g).connect(gainRef.current);
    src.start(t);
    src.stop(t + 0.2);
  }

  function bass(ctx, t, freq) {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sawtooth';
    o.frequency.value = freq;
    g.gain.setValueAtTime(0.0, t);
    g.gain.linearRampToValueAtTime(0.18, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 600;
    o.connect(lp).connect(g).connect(gainRef.current);
    o.start(t);
    o.stop(t + 0.25);
  }

  function start() {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    ctxRef.current = ctx;
    const master = ctx.createGain();
    master.gain.value = 0.5;
    master.connect(ctx.destination);
    gainRef.current = master;

    const bpm = 120;
    const beat = 60 / bpm;
    const notes = [98, 98, 130.81, 110]; // G2 G2 C3 A2 — simple anthem-y motif
    let step = 0;
    let next = ctx.currentTime + 0.1;

    const schedule = () => {
      while (next < ctx.currentTime + 0.3) {
        kick(ctx, next);
        if (step % 4 === 2) clap(ctx, next);
        bass(ctx, next, notes[Math.floor(step / 1) % notes.length]);
        next += beat / 2;
        step++;
      }
    };
    timerRef.current = setInterval(schedule, 60);
  }

  function stop() {
    clearInterval(timerRef.current);
    if (ctxRef.current) {
      ctxRef.current.close();
      ctxRef.current = null;
    }
  }

  useEffect(() => () => stop(), []);

  const toggle = () => {
    if (on) {
      stop();
      setOn(false);
    } else {
      start();
      setOn(true);
    }
  };

  return (
    <button
      onClick={toggle}
      aria-pressed={on}
      title={on ? 'Turn match anthem off' : 'Turn match anthem on'}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-ink/60 text-lg transition hover:bg-white/10"
    >
      {on ? '🔊' : '🔈'}
    </button>
  );
}
