const paths = {
  mark: 'M12 3 3.5 20h3.2l1.8-3.8h7L17.3 20h3.2L12 3Zm0 6.1 2.4 5.1H9.6L12 9.1Z',
  mail: 'M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm0 2v.3l8 5 8-5V7H4Zm16 2.6-8 5-8-5V17h16V9.6Z',
  phone:
    'M6.6 3h3l1.6 4-2 1.3a12 12 0 0 0 6.5 6.5L17 12.8l4 1.6v3A2.6 2.6 0 0 1 18.4 20 15.4 15.4 0 0 1 4 5.6 2.6 2.6 0 0 1 6.6 3Z',
  linkedin:
    'M6.5 8.5H3.6V21h2.9V8.5ZM5 3a1.7 1.7 0 1 0 0 3.4A1.7 1.7 0 0 0 5 3Zm15.4 10.3c0-3.3-1.8-5-4.4-5-1.9 0-2.8 1-3.3 1.8V8.5h-2.9V21h2.9v-6.2c0-1.6.3-3.2 2.3-3.2s2.4 1.7 2.4 3.3V21h3v-7.7Z',
  github:
    'M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.2-3.4-1.2-.4-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.6 2.4 1.1 3 .9.1-.7.4-1.1.6-1.4-2.2-.2-4.6-1.1-4.6-4.9 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.6 9.6 0 0 1 5 0c1.9-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.8-2.3 4.7-4.6 4.9.4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A10 10 0 0 0 12 2Z',
} as const;

export type IconName = keyof typeof paths;

/** A 24×24 single-path icon. Purely decorative: label the surrounding control. */
export function Icon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d={paths[name]} />
    </svg>
  );
}
