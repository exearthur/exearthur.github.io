import { routes, site, type SectionId } from '../config/site';
import { images } from '../data/images';
import { useActiveSection } from '../hooks/useActiveSection';
import { useScrolled } from '../hooks/useScrolled';
import { cx } from '../lib/cx';
import { Icon } from './Icon';
import { Picture } from './Picture';
import { LiquidNavbar, type LiquidNavItem } from './ui/LiquidNavbar';
import { liquidSectionItems, sectionIds, useDarkScheme } from './ui/sectionItems';

export type PageId = 'home' | 'contact';

interface NavProps {
  page: PageId;
  /** Swap the brand glyph for the small portrait avatar. */
  showAvatar: boolean;
}

/** The name and its glyph/avatar slot, as the pill's first item. */
const brandIcon = (
  <span className="nav-id">
    <Icon name="mark" className="nav-mark" />
    <span className="nav-avatar">
      <Picture image={images.headshot} alt="" />
    </span>
  </span>
);

function navItems(page: PageId): LiquidNavItem[] {
  const onHome = page === 'home';
  return [
    {
      label: site.name,
      href: onHome ? '#top' : routes.home,
      icon: brandIcon,
      fx: 'pop',
      className: 'nav-item-brand',
    },
    ...liquidSectionItems(onHome ? '' : routes.home),
    { label: 'Résumé', href: site.resume, icon: <Icon name="doc" />, fx: 'pop', external: true },
    {
      label: 'Contact',
      href: routes.contact,
      icon: <Icon name="mail" />,
      fx: 'plane',
      className: 'nav-item-cta',
    },
  ];
}

const homeItems = navItems('home');
const contactItems = navItems('contact');

// Positions in the pill: the name first, then the sections, Résumé, Contact.
const BRAND = 0;
const sectionIndex = (id: SectionId) => 1 + sectionIds.indexOf(id);
const CONTACT = homeItems.length - 1;

const noSections: string[] = [];

/**
 * The site's only navigation: one liquid glass pill (LiquidNavbar.tsx) with
 * the name, the home page sections, Résumé and Contact. It floats at the top
 * on wider screens and at the bottom on phones (`.nav` in style.css).
 *
 * The drop always marks where you are: on the name over the hero, on the
 * section you're reading, on Contact on the contact page. Only at the
 * closing call to action, past every section, is nothing selected.
 */
export function Nav({ page, showAvatar }: NavProps) {
  const onHome = page === 'home';
  const activeSection = useActiveSection(onHome ? sectionIds : noSections);
  const pastHero = useScrolled(320);
  const dark = useDarkScheme();

  let active = -1;
  if (!onHome) active = CONTACT;
  else if (activeSection) active = sectionIndex(activeSection as SectionId);
  else if (!pastHero) active = BRAND;

  return (
    <div className={cx('nav', showAvatar && 'has-avatar')}>
      <LiquidNavbar
        className="nav-pill"
        items={onHome ? homeItems : contactItems}
        active={active}
        tone={dark ? 'dark' : 'light'}
        ariaLabel="Primary"
      />
    </div>
  );
}
