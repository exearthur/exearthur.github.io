import { enabledSections, routes, site } from '../config/site';
import { images } from '../data/images';
import { useActiveSection } from '../hooks/useActiveSection';
import { useScrolled } from '../hooks/useScrolled';
import { cx, external } from '../lib/cx';
import { Icon } from './Icon';
import { Picture } from './Picture';

export type PageId = 'home' | 'contact';

interface NavProps {
  page: PageId;
  /** Swap the brand glyph for the small portrait avatar. */
  showAvatar: boolean;
}

const sectionIds = enabledSections.map((section) => section.id);
const noSections: string[] = [];

export function Nav({ page, showAvatar }: NavProps) {
  const onHome = page === 'home';
  const scrolled = useScrolled();
  // Only the home page has sections to spy on.
  const activeSection = useActiveSection(onHome ? sectionIds : noSections);

  return (
    <nav
      className={cx('nav', scrolled && 'is-scrolled', showAvatar && 'has-avatar')}
      aria-label="Primary"
    >
      <div className="nav-inner">
        <a
          className="nav-brand"
          href={onHome ? '#top' : routes.home}
          aria-label={`${site.name}, ${onHome ? 'back to top' : 'home'}`}
        >
          <span className="nav-id" aria-hidden="true">
            <Icon name="mark" className="nav-mark" />
            <span className="nav-avatar">
              <Picture image={images.headshot} alt="" />
            </span>
          </span>
          {site.name}
        </a>
        <ul className="nav-links">
          {enabledSections.map(({ id, label }) => (
            <li className="nav-section" key={id}>
              <a
                href={onHome ? `#${id}` : `${routes.home}#${id}`}
                className={activeSection === id ? 'is-active' : undefined}
              >
                {label}
              </a>
            </li>
          ))}
          <li>
            <a href={site.resume} {...external}>
              Résumé
            </a>
          </li>
          <li>
            <a
              href={routes.contact}
              className="nav-cta"
              aria-current={page === 'contact' ? 'page' : undefined}
            >
              Contact
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
