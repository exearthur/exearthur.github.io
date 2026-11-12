import type { ReactNode } from 'react';
import { Footer } from './Footer';
import { Nav, type PageId } from './Nav';

interface LayoutProps {
  page: PageId;
  showAvatar: boolean;
  children: ReactNode;
}

/** The frame every page shares: skip link, sticky nav, main area, footer. */
export function Layout({ page, showAvatar, children }: LayoutProps) {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Nav page={page} showAvatar={showAvatar} />
      <main id="main">{children}</main>
      <Footer page={page} />
    </>
  );
}
