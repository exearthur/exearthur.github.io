import { useCallback, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { features, site } from '../../config/site';
import { CliSpinner, type CliSpinnerVariant } from './CliSpinner';

/** The overlay's bottom edge: bowed down while it covers the page, flat by the time it's gone. */
const curved = 'M0 0 H100 V0 Q50 100 0 0 Z';
const flat = 'M0 0 H100 V0 Q50 0 0 0 Z';

const ease = [0.76, 0, 0.24, 1] as const;

export const INTRO_CLASS = 'show-intro';
export const INTRO_SEEN_KEY = 'intro-seen';

/**
 * A welcome screen on the first visit of a session. What plays inside it is
 * `features.introStyle`: a terminal that "boots" the site, or greetings in
 * several languages. Either way the panel then lifts off the page with a
 * curved edge and the hero animates in underneath.
 *
 * Whether it plays is decided before first paint by the inline script in
 * index.html, which adds `html.show-intro` (first visit this session, motion
 * allowed). The prerendered overlay is hidden by CSS without that class, so
 * returning visitors never see a flash of it. Click or any key skips it.
 * index.html also releases the page after 8s in case the app never loads,
 * so each style must finish well inside that.
 */
export function Intro() {
  const [phase, setPhase] = useState<'play' | 'exit' | 'done'>('play');
  // Set once hydrated and confirmed to be playing; keeps the panel shown
  // through the lift, after the <html> flag has been removed.
  const [active, setActive] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (!features.intro || !root.classList.contains(INTRO_CLASS)) {
      root.classList.remove(INTRO_CLASS);
      setPhase('done');
      return;
    }
    setActive(true);

    const skip = () => setPhase('exit');
    window.addEventListener('pointerdown', skip, { once: true });
    window.addEventListener('keydown', skip, { once: true });
    return () => {
      window.removeEventListener('pointerdown', skip);
      window.removeEventListener('keydown', skip);
    };
  }, []);

  // The page is released as the panel starts to lift, so the hero's own
  // entrance plays while it is being uncovered.
  useEffect(() => {
    if (phase !== 'exit') return;
    document.documentElement.classList.remove(INTRO_CLASS);
    try {
      sessionStorage.setItem(INTRO_SEEN_KEY, '1');
    } catch {
      // Storage blocked: the intro may simply play again next load.
    }
  }, [phase]);

  const finish = useCallback(() => setPhase((p) => (p === 'play' ? 'exit' : p)), []);

  if (phase === 'done') return null;
  const exiting = phase === 'exit';

  return (
    <motion.div
      className={active ? 'intro is-active' : 'intro'}
      aria-hidden="true"
      initial={false}
      animate={{ y: exiting ? '-100vh' : 0 }}
      transition={{ duration: 0.8, ease, delay: 0.15 }}
      onAnimationComplete={() => exiting && setPhase('done')}
    >
      <motion.div
        className="intro-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: exiting ? 0 : 1 }}
        transition={{ duration: exiting ? 0.25 : 0.6 }}
      >
        {features.introStyle === 'terminal' ? (
          <TerminalIntro running={active && !exiting} onDone={finish} />
        ) : (
          <GreetingsIntro running={active && !exiting} onDone={finish} />
        )}
      </motion.div>
      <svg className="intro-edge" viewBox="0 0 100 100" preserveAspectRatio="none">
        <motion.path
          initial={false}
          animate={{ d: exiting ? flat : curved }}
          transition={{ duration: 0.8, ease, delay: 0.25 }}
        />
      </svg>
    </motion.div>
  );
}

interface IntroContentProps {
  /** False before hydration and once the exit has begun. */
  running: boolean;
  onDone: () => void;
}

/* ---------- Greetings ---------- */

/** "Hello" first and held, a quick run of languages, then the welcome. */
const words = ['Hello', 'Olá', 'Hola', 'Bonjour', 'Ciao', '안녕하세요', 'Hallo', 'Welcome.'];
const FIRST_MS = 900;
const STEP_MS = 160;
const LAST_MS = 700;

function GreetingsIntro({ running, onDone }: IntroContentProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!running) return;
    const last = index === words.length - 1;
    const delay = index === 0 ? FIRST_MS : last ? LAST_MS : STEP_MS;
    const timer = window.setTimeout(() => {
      if (last) onDone();
      else setIndex(index + 1);
    }, delay);
    return () => window.clearTimeout(timer);
  }, [running, index, onDone]);

  return (
    <p className="intro-word">
      <span className="intro-dot" />
      {words[index]}
    </p>
  );
}

/* ---------- Terminal ---------- */

const host = site.url.replace(/^https?:\/\//, '');
const command = `open ${host}`;

/** Each task spins from `start` (ms after typing ends) for `ms`, then ticks off. */
const tasks: { label: string; spinner: CliSpinnerVariant; start: number; ms: number }[] = [
  { label: 'Loading projects', spinner: 'braille-spin', start: 150, ms: 520 },
  { label: 'Loading experience', spinner: 'arc', start: 420, ms: 520 },
  { label: 'Fetching GitHub activity', spinner: 'line-dash', start: 690, ms: 560 },
];

const START_MS = 250; // pause before typing
const TYPE_MS = 26; // per character
const WELCOME_GAP_MS = 220; // after the last task ticks
const HOLD_MS = 650; // on "Welcome." before the lift

/**
 * A small terminal that "opens" the site: the command types itself, three
 * tasks spin (CLI Spinner Loader) and tick off, then "Welcome." Every line is
 * laid out from the start and only revealed, so the window never resizes.
 */
function TerminalIntro({ running, onDone }: IntroContentProps) {
  const [elapsed, setElapsed] = useState(0);

  // One clock drives the whole sequence; it stops when the exit begins.
  useEffect(() => {
    if (!running) return;
    let frame = 0;
    const t0 = performance.now() - elapsed;
    const tick = (now: number) => {
      setElapsed(now - t0);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
    // `elapsed` only seeds the clock; re-running on every tick would restart it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const typedEnd = START_MS + command.length * TYPE_MS;
  const tasksEnd = typedEnd + Math.max(...tasks.map((t) => t.start + t.ms));
  const welcomeAt = tasksEnd + WELCOME_GAP_MS;
  const doneAt = welcomeAt + HOLD_MS;

  useEffect(() => {
    if (running && elapsed >= doneAt) onDone();
  }, [running, elapsed, doneAt, onDone]);

  const typed = command.slice(0, Math.max(0, Math.floor((elapsed - START_MS) / TYPE_MS)));
  const typing = elapsed < typedEnd;
  const welcome = elapsed >= welcomeAt;

  return (
    <div className="term">
      <div className="term-bar">
        <span />
        <span />
        <span />
        <p className="term-title">zsh — {host}</p>
      </div>
      <div className="term-body">
        <p className="term-line">
          <span className="term-prompt">~ %</span> {typed}
          {typing && <span className="term-caret" />}
        </p>
        {tasks.map((task) => {
          const at = elapsed - typedEnd;
          const shown = at >= task.start;
          const done = at >= task.start + task.ms;
          return (
            <p className="term-line" key={task.label} style={{ visibility: shown ? 'visible' : 'hidden' }}>
              <span className={done ? 'term-status is-done' : 'term-status'}>
                {done ? '✓' : shown ? <CliSpinner variant={task.spinner} ariaLabel={task.label} /> : null}
              </span>
              <span className={done ? 'term-task is-done' : 'term-task'}>{task.label}</span>
            </p>
          );
        })}
        <p className="term-line term-welcome" style={{ visibility: welcome ? 'visible' : 'hidden' }}>
          Welcome.
          <span className="term-caret is-blink" />
        </p>
      </div>
    </div>
  );
}
