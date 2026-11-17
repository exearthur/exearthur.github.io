import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { features } from '../../config/site';

/** "Hello" first and held, a quick run of languages, then the welcome. */
const words = ['Hello', 'Olá', 'Hola', 'Bonjour', 'Ciao', '안녕하세요', 'Hallo', 'Welcome.'];
const FIRST_MS = 900;
const STEP_MS = 160;
const LAST_MS = 700;

/** The overlay's bottom edge: bowed down while it covers the page, flat by the time it's gone. */
const curved = 'M0 0 H100 V0 Q50 100 0 0 Z';
const flat = 'M0 0 H100 V0 Q50 0 0 0 Z';

const ease = [0.76, 0, 0.24, 1] as const;

export const INTRO_CLASS = 'show-intro';
export const INTRO_SEEN_KEY = 'intro-seen';

/**
 * A welcome screen on the first visit of a session: greetings flash by in
 * several languages, then the panel lifts off the page with a curved edge
 * and the hero animates in underneath.
 *
 * Whether it plays is decided before first paint by the inline script in
 * index.html, which adds `html.show-intro` (first visit this session, motion
 * allowed). The prerendered overlay is hidden by CSS without that class, so
 * returning visitors never see a flash of it. Click or any key skips it.
 */
export function Intro() {
  const [phase, setPhase] = useState<'words' | 'exit' | 'done'>('words');
  const [index, setIndex] = useState(0);
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

  // Step through the words, then start the exit.
  useEffect(() => {
    if (phase !== 'words') return;
    const last = index === words.length - 1;
    const delay = index === 0 ? FIRST_MS : last ? LAST_MS : STEP_MS;
    const timer = window.setTimeout(() => {
      if (last) setPhase('exit');
      else setIndex(index + 1);
    }, delay);
    return () => window.clearTimeout(timer);
  }, [phase, index]);

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
      <motion.p
        className="intro-word"
        initial={{ opacity: 0 }}
        animate={{ opacity: exiting ? 0 : 1 }}
        transition={{ duration: exiting ? 0.25 : 0.6 }}
      >
        <span className="intro-dot" />
        {words[index]}
      </motion.p>
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
