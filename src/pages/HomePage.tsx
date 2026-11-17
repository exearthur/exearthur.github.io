import type { ComponentType } from 'react';
import { Layout } from '../components/Layout';
import { Intro } from '../components/ui/Intro';
import type { SectionProps } from '../components/Section';
import { enabledSections, NAV_HEIGHT, type SectionId } from '../config/site';
import { useInView } from '../hooks/useInView';
import { ContactCta } from '../sections/ContactCta';
import { Education } from '../sections/Education';
import { Experience } from '../sections/Experience';
import { GitHubActivity } from '../sections/GitHubActivity';
import { Hero } from '../sections/Hero';
import { Projects } from '../sections/Projects';
import { Skills } from '../sections/Skills';

/** Which component renders each section listed in `src/config/site.ts`. */
const sectionComponents: Record<SectionId, ComponentType<SectionProps>> = {
  projects: Projects,
  experience: Experience,
  skills: Skills,
  education: Education,
  github: GitHubActivity,
};

export function HomePage() {
  // Once the hero portrait has scrolled out from under the nav bar, the nav
  // swaps its brand glyph for a small avatar so the face stays with the visitor.
  const [portraitRef, portraitInView] = useInView<HTMLElement>({
    rootMargin: `-${NAV_HEIGHT}px 0px 0px 0px`,
    initial: true,
  });

  return (
    <Layout page="home" showAvatar={!portraitInView}>
      <Intro />
      <Hero portraitRef={portraitRef} />
      {enabledSections.map(({ id }, index) => {
        const SectionComponent = sectionComponents[id];
        // Backgrounds alternate white / grey down the page, whatever the order.
        return <SectionComponent alt={index % 2 === 1} key={id} />;
      })}
      <ContactCta alt={enabledSections.length % 2 === 1} />
    </Layout>
  );
}
