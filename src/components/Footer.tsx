import { routes, site } from '../config/site';
import { external } from '../lib/cx';
import type { PageId } from './Nav';

export function Footer({ page }: { page: PageId }) {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <p>
          &copy; {site.copyrightYear} {site.name}
        </p>
        <ul className="footer-links">
          {page !== 'home' && (
            <li>
              <a href={routes.home}>Home</a>
            </li>
          )}
          <li>
            <a href={`mailto:${site.email}`}>Email</a>
          </li>
          <li>
            <a href={site.linkedin.url} {...external}>
              LinkedIn
            </a>
          </li>
          <li>
            <a href={site.github.url} {...external}>
              GitHub
            </a>
          </li>
          <li>
            <a href={site.resume} {...external}>
              Résumé
            </a>
          </li>
          {page !== 'contact' && (
            <li>
              <a href={routes.contact}>Contact</a>
            </li>
          )}
        </ul>
      </div>
    </footer>
  );
}
