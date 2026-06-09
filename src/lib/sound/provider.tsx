"use client";

import * as React from "react";

type SoundType = "click" | "hover" | "toggle" | "success" | "open";

type SoundContextValue = {
  enabled: boolean;
  setEnabled: (next: boolean) => void;
  toggle: () => void;
  play: (type: SoundType) => void;
  mounted: boolean;
  // Background music
  musicEnabled: boolean;
  toggleMusic: () => void;
};

const SoundContext = React.createContext<SoundContextValue | null>(null);
const STORAGE_KEY = "portfolio-sound";
const MUSIC_KEY = "portfolio-music";

/**
 * Lightweight sound system using Web Audio API — no external files.
 * Generates short tones programmatically (saved as audio buffer).
 * Respects user preference (localStorage) + (prefers-reduced-motion) tampers off-by-default.
 */
export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabledState] = React.useState(false);
  const [musicEnabled, setMusicEnabledState] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const ctxRef = React.useRef<AudioContext | null>(null);
  const musicNodesRef = React.useRef<{
    oscillators: OscillatorNode[];
    masterGain: GainNode;
    filter: BiquadFilterNode;
    lfo: OscillatorNode;
    lfoGain: GainNode;
    chordTimer: ReturnType<typeof setInterval> | null;
  } | null>(null);

  // Real audio file element (preferred path). Falls back to synth if file 404s.
  const audioElRef = React.useRef<HTMLAudioElement | null>(null);
  const fadeTimerRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  /**
   * Try to load the bgm file. Resolves true if file is reachable, false otherwise.
   * Detection via canplaythrough OR error event, with 1.5s timeout safety.
   */
  const probeAudioFile = React.useCallback(
    (src: string): Promise<HTMLAudioElement | null> =>
      new Promise((resolve) => {
        try {
          const audio = new Audio(src);
          audio.preload = "auto";
          audio.loop = true;
          audio.volume = 0;
          let settled = false;
          const settle = (result: HTMLAudioElement | null) => {
            if (settled) return;
            settled = true;
            resolve(result);
          };
          const onReady = () => settle(audio);
          const onErr = () => settle(null);
          audio.addEventListener("canplaythrough", onReady, { once: true });
          audio.addEventListener("error", onErr, { once: true });
          window.setTimeout(() => settle(null), 1500);
          audio.load();
        } catch {
          resolve(null);
        }
      }),
    [],
  );

  const clearFade = () => {
    if (fadeTimerRef.current) {
      clearInterval(fadeTimerRef.current);
      fadeTimerRef.current = null;
    }
  };

  const fadeTo = React.useCallback(
    (target: number, durationMs: number, onDone?: () => void) => {
      const audio = audioElRef.current;
      if (!audio) return;
      clearFade();
      const startVol = audio.volume;
      const steps = 24;
      const stepMs = Math.max(1, durationMs / steps);
      let i = 0;
      fadeTimerRef.current = setInterval(() => {
        i++;
        const t = i / steps;
        audio.volume = Math.max(0, Math.min(1, startVol + (target - startVol) * t));
        if (i >= steps) {
          clearFade();
          onDone?.();
        }
      }, stepMs);
    },
    [],
  );

  // Hold a stable ref to the current startMusic() so the mount effect can
  // call it from a user-gesture listener without depending on the function
  // identity (which changes each render).
  const startMusicRef = React.useRef<(() => void) | null>(null);

  React.useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "1") setEnabledState(true);
    const storedMusic = window.localStorage.getItem(MUSIC_KEY);
    if (storedMusic === "1") {
      // UI flips to ON immediately so the toggle reflects saved preference.
      setMusicEnabledState(true);
      // Browsers block audio.play() until a user gesture happens.
      // Defer the actual start until the first pointerdown/keydown, then
      // self-remove the listeners.
      const tryStart = () => {
        startMusicRef.current?.();
        window.removeEventListener("pointerdown", tryStart);
        window.removeEventListener("keydown", tryStart);
      };
      window.addEventListener("pointerdown", tryStart, { once: true });
      window.addEventListener("keydown", tryStart, { once: true });
    }
    setMounted(true);
  }, []);

  const ensureCtx = React.useCallback(() => {
    if (ctxRef.current) return ctxRef.current;
    try {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!Ctor) return null;
      ctxRef.current = new Ctor();
      return ctxRef.current;
    } catch {
      return null;
    }
  }, []);

  const playTone = React.useCallback(
    (freq: number, durationMs: number, gain = 0.05, type: OscillatorType = "sine") => {
      const ctx = ensureCtx();
      if (!ctx) return;
      try {
        if (ctx.state === "suspended") ctx.resume();
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        g.gain.setValueAtTime(gain, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(
          0.0001,
          ctx.currentTime + durationMs / 1000,
        );
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + durationMs / 1000);
      } catch {
        /* swallow */
      }
    },
    [ensureCtx],
  );

  const play = React.useCallback(
    (type: SoundType) => {
      if (!enabled) return;
      switch (type) {
        case "click":
          playTone(880, 60, 0.07, "triangle");
          break;
        case "hover":
          playTone(1320, 30, 0.025, "sine");
          break;
        case "toggle":
          playTone(660, 80, 0.06, "sine");
          setTimeout(() => playTone(990, 60, 0.05, "sine"), 60);
          break;
        case "success":
          playTone(523, 80, 0.06, "sine");
          setTimeout(() => playTone(659, 80, 0.06, "sine"), 80);
          setTimeout(() => playTone(784, 120, 0.06, "sine"), 160);
          break;
        case "open":
          playTone(440, 50, 0.04, "sine");
          setTimeout(() => playTone(660, 80, 0.04, "triangle"), 40);
          break;
      }
    },
    [enabled, playTone],
  );

  const setEnabled = React.useCallback(
    (next: boolean) => {
      setEnabledState(next);
      window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      if (next) {
        // Play confirmation when enabled
        const ctx = ensureCtx();
        if (ctx?.state === "suspended") ctx.resume();
        setTimeout(() => playTone(880, 100, 0.07, "sine"), 30);
      }
    },
    [ensureCtx, playTone],
  );

  const toggle = React.useCallback(() => setEnabled(!enabled), [enabled, setEnabled]);

  // ─── Background music: REAL FILE preferred, synth fallback ─
  const startMusic = React.useCallback(async () => {
    // PATH 1 — Real MP3 file. Skip probeAudioFile (its 1.5s timeout was
    // racing the cold-cache fetch on mobile and falling through to synth
    // on the first toggle, then playing the real file on the second toggle).
    // Just create the Audio element and call play() directly — play()'s
    // own promise tells us whether it actually started.
    if (!audioElRef.current) {
      try {
        const audio = new Audio("/music/portfolio-bgm.mp3");
        audio.preload = "auto";
        audio.loop = true;
        audio.volume = 0;
        audioElRef.current = audio;
        await audio.play();
        fadeTo(0.45, 2000);
        return;
      } catch {
        audioElRef.current = null;
      }
    } else {
      // Already created (paused mid-fade or after a previous stop) — resume.
      try {
        await audioElRef.current.play();
        fadeTo(0.45, 2000);
        return;
      } catch {
        audioElRef.current = null;
      }
    }

    // PATH 2 — Synth fallback only if the MP3 truly failed (file missing
    // or autoplay blocked despite gesture). Real users with the bundled
    // MP3 will never hit this branch.
    const ctx = ensureCtx();
    if (!ctx || musicNodesRef.current) return;
    try {
      if (ctx.state === "suspended") ctx.resume();

      // Master gain — start at 0, fade in
      // Upbeat pop volume — 18% for cheerful presence
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0, ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 2);

      // Even brighter lowpass — sparkle pop, party-ready
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 4800;
      filter.Q.value = 0.35;

      // Subtle LFO wah (kept slower / gentler — just adds organic feel)
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.12;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 250;
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start();

      // ── HAPPY POP PROGRESSION: C - G - Am - F (I-V-vi-IV, "Cup of Joe") ──
      // Each chord = [pad voice 1, pad voice 2] in C major scale
      const chordPad: number[][] = [
        [261.63, 329.63], // C maj: C4 + E4
        [196, 246.94], // G maj: G3 + B3
        [220, 261.63], // A min: A3 + C4
        [174.61, 220], // F maj: F3 + A3
      ];

      // ── Bouncy octave bass — pop/funky feel (100 BPM, beat = 600ms) ──
      // Pattern: root → octave up → fifth → octave (boom-boom-bap groove)
      const bassPattern: number[][] = [
        [65.41, 130.81, 98, 130.81], // C2 → C3 → G2 → C3 (around C)
        [49, 98, 73.42, 98], // G1 → G2 → D2 → G2 (around G)
        [55, 110, 82.41, 110], // A1 → A2 → E2 → A2 (around Am)
        [43.65, 87.31, 65.41, 87.31], // F1 → F2 → C2 → F2 (around F)
      ];

      // ── Cheerful arpeggio melody — ascending major-scale broken chords ──
      // Per chord, 8 notes (8th notes at 100 BPM = 300ms per note)
      const melodyPattern: number[][] = [
        [523.25, 659.25, 783.99, 1046.5, 783.99, 659.25, 523.25, 659.25], // C5 E5 G5 C6 G5 E5 C5 E5 (C maj)
        [392, 493.88, 587.33, 783.99, 587.33, 493.88, 392, 493.88], // G4 B4 D5 G5 D5 B4 G4 B4 (G maj)
        [440, 523.25, 659.25, 880, 659.25, 523.25, 440, 523.25], // A4 C5 E5 A5 E5 C5 A4 C5 (A min)
        [349.23, 440, 523.25, 698.46, 523.25, 440, 349.23, 440], // F4 A4 C5 F5 C5 A4 F4 A4 (F maj)
      ];

      // ── Sustain voices: 2 pad oscillators (chord voicing) ──
      const oscillators: OscillatorNode[] = chordPad[0].map((freq, i) => {
        const osc = ctx.createOscillator();
        osc.type = i === 0 ? "sine" : "triangle";
        osc.frequency.value = freq;
        osc.detune.value = (Math.random() - 0.5) * 6;
        const g = ctx.createGain();
        g.gain.value = i === 0 ? 0.32 : 0.22;
        osc.connect(g);
        g.connect(filter);
        osc.start();
        return osc;
      });

      filter.connect(masterGain);
      masterGain.connect(ctx.destination);

      // ── Cycle chord progression every 2.4s (faster, more energy) ──
      let chordIdx = 0;
      const CHORD_DURATION = 2.4; // seconds (was 4)
      const chordTimer = setInterval(() => {
        if (!ctx) return;
        chordIdx = (chordIdx + 1) % chordPad.length;
        const t = ctx.currentTime;
        const targetChord = chordPad[chordIdx];
        oscillators.forEach((osc, i) => {
          osc.frequency.cancelScheduledValues(t);
          osc.frequency.setValueAtTime(osc.frequency.value, t);
          osc.frequency.exponentialRampToValueAtTime(targetChord[i], t + 0.6);
        });
      }, CHORD_DURATION * 1000);

      // ── BOUNCY POP BASS: 100 BPM = 600ms per beat ──
      let bassStep = 0;
      const bassTimer = setInterval(() => {
        if (!ctx || !musicNodesRef.current) return;
        const bassNotes = bassPattern[chordIdx];
        const bassFreq = bassNotes[bassStep % bassNotes.length];

        try {
          const bassOsc = ctx.createOscillator();
          bassOsc.type = "sawtooth";
          bassOsc.frequency.value = bassFreq;

          const bassFilter = ctx.createBiquadFilter();
          bassFilter.type = "lowpass";
          bassFilter.frequency.value = 450; // Brighter than lo-fi (was 280)
          bassFilter.Q.value = 2.5;

          const bassGain = ctx.createGain();
          const now = ctx.currentTime;
          // Punchy pop envelope — sharp attack, quick decay (staccato bounce)
          bassGain.gain.setValueAtTime(0, now);
          bassGain.gain.linearRampToValueAtTime(0.13, now + 0.02);
          bassGain.gain.exponentialRampToValueAtTime(0.03, now + 0.25);
          bassGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);

          bassOsc.connect(bassFilter);
          bassFilter.connect(bassGain);
          bassGain.connect(masterGain);

          bassOsc.start(now);
          bassOsc.stop(now + 0.6);
        } catch {
          /* swallow */
        }
        bassStep++;
      }, 600); // 600ms per beat = 100 BPM (was 1000ms)

      // ── HAND CLAP on beats 2 & 4 — backbeat energy (kicks in after 600ms offset) ──
      let clapTimerId: ReturnType<typeof setInterval> | null = null;
      const clapStartTimeout = setTimeout(() => {
        clapTimerId = setInterval(() => {
          if (!ctx || !musicNodesRef.current) return;
          try {
            // White noise burst → bandpass filter → tight envelope = handclap
            const noiseBuf = ctx.createBuffer(
              1,
              Math.floor(ctx.sampleRate * 0.06),
              ctx.sampleRate,
            );
            const data = noiseBuf.getChannelData(0);
            for (let i = 0; i < data.length; i++) {
              data[i] = Math.random() * 2 - 1;
            }
            const src = ctx.createBufferSource();
            src.buffer = noiseBuf;

            const bp = ctx.createBiquadFilter();
            bp.type = "bandpass";
            bp.frequency.value = 1800;
            bp.Q.value = 1.5;

            const clapGain = ctx.createGain();
            const t0 = ctx.currentTime;
            clapGain.gain.setValueAtTime(0, t0);
            clapGain.gain.linearRampToValueAtTime(0.16, t0 + 0.002);
            clapGain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.08);

            src.connect(bp);
            bp.connect(clapGain);
            clapGain.connect(masterGain);

            src.start(t0);
            src.stop(t0 + 0.1);
          } catch {
            /* swallow */
          }
        }, 1200); // every 1.2s = beats 2,4 of measure (100 BPM, 600ms/beat)
      }, 600); // offset first clap to land on beat 2

      // Store clap cleanup
      (musicNodesRef as unknown as {
        clapHooks?: { timeout: number; intervalId: ReturnType<typeof setInterval> | null };
      }).clapHooks = {
        timeout: clapStartTimeout as unknown as number,
        intervalId: null,
      };
      // Update intervalId once it's set
      setTimeout(() => {
        if (
          (musicNodesRef as unknown as { clapHooks?: { intervalId: ReturnType<typeof setInterval> | null } }).clapHooks
        ) {
          (musicNodesRef as unknown as { clapHooks: { intervalId: ReturnType<typeof setInterval> | null } }).clapHooks.intervalId = clapTimerId;
        }
      }, 650);

      // ── BRIGHT MELODY: 8th-note arpeggio bells (300ms per note) ──
      let melodyStep = 0;
      const MELODY_INTERVAL = 300; // 8th notes at 100 BPM (was 500)
      const arpeggioTimer = setInterval(() => {
        if (!ctx || !musicNodesRef.current) return;
        const melodyNotes = melodyPattern[chordIdx];
        const freq = melodyNotes[melodyStep % melodyNotes.length];

        try {
          // Brighter bell: triangle + sine octave up + tiny sine 2 octave up sparkle
          const pluck1 = ctx.createOscillator();
          pluck1.type = "triangle";
          pluck1.frequency.value = freq;

          const pluck2 = ctx.createOscillator();
          pluck2.type = "sine";
          pluck2.frequency.value = freq * 2;

          const pluckGain = ctx.createGain();
          const now = ctx.currentTime;
          // Crystal bell envelope: instant attack, longer shimmer
          pluckGain.gain.setValueAtTime(0, now);
          pluckGain.gain.linearRampToValueAtTime(0.065, now + 0.004);
          pluckGain.gain.exponentialRampToValueAtTime(0.018, now + 0.25);
          pluckGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);

          const pluckFilter = ctx.createBiquadFilter();
          pluckFilter.type = "lowpass";
          pluckFilter.frequency.value = 5500; // Brighter (was 3500)
          pluckFilter.Q.value = 2;

          pluck1.connect(pluckFilter);
          pluck2.connect(pluckFilter);
          pluckFilter.connect(pluckGain);
          pluckGain.connect(masterGain);

          pluck1.start(now);
          pluck2.start(now);
          pluck1.stop(now + 1);
          pluck2.stop(now + 1);
        } catch {
          /* swallow */
        }
        melodyStep++;
      }, MELODY_INTERVAL);

      // Store all timers (including clap cleanup)
      const combinedTimer = {
        clear: () => {
          clearInterval(chordTimer);
          clearInterval(bassTimer);
          clearInterval(arpeggioTimer);
          // Clap cleanup
          const hooks = (musicNodesRef as unknown as {
            clapHooks?: {
              timeout: number;
              intervalId: ReturnType<typeof setInterval> | null;
            };
          }).clapHooks;
          if (hooks) {
            clearTimeout(hooks.timeout);
            if (hooks.intervalId) clearInterval(hooks.intervalId);
          }
        },
      };

      musicNodesRef.current = {
        oscillators,
        masterGain,
        filter,
        lfo,
        lfoGain,
        chordTimer: combinedTimer as unknown as ReturnType<typeof setInterval>,
      };
    } catch {
      /* swallow */
    }
  }, [ensureCtx]);

  const stopMusic = React.useCallback(() => {
    // PATH 1 — stop real audio file with fade-out
    // NOTE: keep audioElRef.current populated until the fade completes —
    // fadeTo() reads from that ref, so nulling it early aborts the fade and
    // leaves the track playing indefinitely.
    const audio = audioElRef.current;
    if (audio) {
      fadeTo(0, 800, () => {
        try {
          audio.pause();
          audio.currentTime = 0;
        } catch {
          /* swallow */
        }
        audioElRef.current = null;
      });
      return;
    }

    // PATH 2 — stop synth music
    const ctx = ensureCtx();
    const nodes = musicNodesRef.current;
    if (!ctx || !nodes) return;
    try {
      if (nodes.chordTimer) {
        const ct = nodes.chordTimer as unknown as { clear?: () => void };
        if (typeof ct.clear === "function") ct.clear();
        else clearInterval(nodes.chordTimer);
      }
      // Fade out then stop
      nodes.masterGain.gain.cancelScheduledValues(ctx.currentTime);
      nodes.masterGain.gain.setValueAtTime(
        nodes.masterGain.gain.value,
        ctx.currentTime,
      );
      nodes.masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.2);
      setTimeout(() => {
        try {
          nodes.oscillators.forEach((o) => o.stop());
          nodes.lfo.stop();
        } catch {
          /* swallow */
        }
        musicNodesRef.current = null;
      }, 1300);
    } catch {
      /* swallow */
    }
  }, [ensureCtx]);

  // Keep the gesture-deferred start path pointed at the latest startMusic.
  React.useEffect(() => {
    startMusicRef.current = startMusic;
  }, [startMusic]);

  const toggleMusic = React.useCallback(() => {
    const next = !musicEnabled;
    setMusicEnabledState(next);
    window.localStorage.setItem(MUSIC_KEY, next ? "1" : "0");
    if (next) startMusic();
    else stopMusic();
  }, [musicEnabled, startMusic, stopMusic]);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      stopMusic();
    };
  }, [stopMusic]);

  // Global click + hover listeners — opt-in via data attributes.
  React.useEffect(() => {
    if (!enabled) return;

    const onPointerDown = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      if (
        t.closest("button, a, [role='button'], [data-sound='click']")
      ) {
        play("click");
      }
    };

    const onPointerOver = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      const interactive = t.closest("a, button, [role='button'], [data-sound='hover']");
      if (interactive && interactive !== document.body) {
        // Only fire once per interactive element entry
        const last = (interactive as HTMLElement).dataset.lastHoverSound;
        const now = Date.now();
        if (!last || now - Number(last) > 250) {
          (interactive as HTMLElement).dataset.lastHoverSound = String(now);
          play("hover");
        }
      }
    };

    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerover", onPointerOver);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerover", onPointerOver);
    };
  }, [enabled, play]);

  const value = React.useMemo(
    () => ({
      enabled,
      setEnabled,
      toggle,
      play,
      mounted,
      musicEnabled,
      toggleMusic,
    }),
    [enabled, setEnabled, toggle, play, mounted, musicEnabled, toggleMusic],
  );

  return (
    <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
  );
}

export function useSound() {
  const ctx = React.useContext(SoundContext);
  if (!ctx) throw new Error("useSound must be used within SoundProvider");
  return ctx;
}
