import { useEffect, useState } from 'react';
import { enabledSections, type SectionId } from '../../config/site';
import { Icon, type IconName } from '../Icon';
import type { LiquidNavItem, NimbusFx } from './LiquidNavbar';

/** Icon for each home page section, shared by the desktop nav and phone bar. */
export const sectionIcons: Record<SectionId, IconName> = {
  projects: 'grid',
  experience: 'briefcase',
  skills: 'code',
  education: 'cap',
  github: 'github',
};

/** The little scene each icon plays when tapped in a liquid bar. */
const sectionFx: Record<SectionId, NimbusFx> = {
  projects: 'pop',
  experience: 'glow',
  skills: 'spin',
  education: 'wave',
  github: 'drop',
};

export const sectionIds: SectionId[] = enabledSections.map((section) => section.id);

/** The enabled sections as LiquidNavbar items. `base` prefixes the anchors ('' on the home page). */
export function liquidSectionItems(base = ''): LiquidNavItem[] {
  return enabledSections.map(({ id, label }) => ({
    label,
    href: `${base}#${id}`,
    icon: <Icon name={sectionIcons[id]} />,
    fx: sectionFx[id],
  }));
}

/** Whether the visitor's system is in dark mode; false until mounted. */
export function useDarkScheme(): boolean {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const update = () => setDark(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return dark;
}
