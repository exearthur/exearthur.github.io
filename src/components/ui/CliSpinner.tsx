import { useEffect, useState } from 'react';
import { cx } from '../../lib/cx';

/**
 * A terminal-style text spinner. Adapted from "CLI Spinner Loader" by
 * @elements- on 21st.dev (https://21st.dev/@elements-/components/loader-cli-spinner).
 * The original ships 90 variants in a separate data file; only the few the
 * site uses are kept here (frames from the open-source cli-spinners set).
 */
export const CLI_SPINNERS = {
  'braille-spin': { interval: 80, frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'] },
  'line-dash': { interval: 130, frames: ['-', '\\', '|', '/'] },
  arc: { interval: 100, frames: ['◜', '◠', '◝', '◞', '◡', '◟'] },
} as const;

export type CliSpinnerVariant = keyof typeof CLI_SPINNERS;

export interface CliSpinnerProps {
  variant?: CliSpinnerVariant;
  /** Multiplies the frame rate. */
  speed?: number;
  paused?: boolean;
  ariaLabel?: string;
  className?: string;
}

export function CliSpinner({
  variant = 'braille-spin',
  speed = 1,
  paused = false,
  ariaLabel = 'Loading',
  className,
}: CliSpinnerProps) {
  const spinner = CLI_SPINNERS[variant];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
    if (paused || speed <= 0) return;
    const delay = Math.max(16, spinner.interval / speed);
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % spinner.frames.length);
    }, delay);
    return () => window.clearInterval(id);
  }, [spinner, speed, paused]);

  return (
    <output aria-label={ariaLabel} className={cx('cli-spinner', className)}>
      <span aria-hidden="true">{spinner.frames[index]}</span>
    </output>
  );
}
