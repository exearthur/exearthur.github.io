import { Icon, type IconName } from '../components/Icon';
import { Layout } from '../components/Layout';
import { Reveal } from '../components/Reveal';
import { HelloScript } from '../components/ui/HelloScript';
import { features, site } from '../config/site';
import { contactCopy } from '../data/profile';
import { external } from '../lib/cx';

interface ContactMethod {
  icon: IconName;
  label: string;
  value: string;
  href: string;
  /** Opens in a new tab. */
  external?: boolean;
}

const methods: ContactMethod[] = [
  { icon: 'mail', label: 'Email', value: site.email, href: `mailto:${site.email}` },
  { icon: 'phone', label: 'Phone', value: site.phone.display, href: site.phone.href },
  {
    icon: 'linkedin',
    label: 'LinkedIn',
    value: site.linkedin.handle,
    href: site.linkedin.url,
    external: true,
  },
  {
    icon: 'github',
    label: 'GitHub',
    value: site.github.username,
    href: site.github.url,
    external: true,
  },
];

export function ContactPage() {
  return (
    <Layout page="contact" showAvatar>
      <header className="hero hero-compact">
        <div className="container">
          {features.helloScript ? (
            <h1 className="hero-title hero-hello">
              <span className="sr-only">{contactCopy.title}</span>
              <HelloScript />
            </h1>
          ) : (
            <h1 className="hero-title">
              <span className="mask">
                <span className="mask-in">{contactCopy.title}</span>
              </span>
            </h1>
          )}
          <p className="hero-lead">{contactCopy.lead}</p>
        </div>
      </header>

      <section className="section section-alt contact-section">
        <div className="container contact-grid">
          <div className="contact-cards stagger">
            {methods.map((method) => (
              <Reveal
                as="a"
                className="contact-card card lift"
                href={method.href}
                key={method.label}
                data-spotlight
                {...(method.external ? external : {})}
              >
                <Icon name={method.icon} className="icon-badge" />
                <div>
                  <p className="meta">{method.label}</p>
                  <p className="contact-value">{method.value}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {features.contactForm.enabled && <ContactForm />}
        </div>
      </section>
    </Layout>
  );
}

/**
 * A plain HTML form posted straight to FormSubmit, so it works without
 * JavaScript. `_subject` and `_honey` (a spam honeypot) are FormSubmit fields.
 */
function ContactForm() {
  const { endpoint, subject } = features.contactForm;
  return (
    <Reveal as="form" className="form card" method="POST" action={endpoint}>
      <input type="hidden" name="_subject" value={subject} />
      <input type="text" name="_honey" hidden tabIndex={-1} autoComplete="off" />

      <h2 className="form-title">{contactCopy.formTitle}</h2>

      {/* The single-space placeholders drive the floating labels in CSS. */}
      <div className="field">
        <input type="text" id="name" name="name" placeholder=" " required autoComplete="name" />
        <label htmlFor="name">Name</label>
      </div>
      <div className="field">
        <input type="email" id="email" name="email" placeholder=" " required autoComplete="email" />
        <label htmlFor="email">Email</label>
      </div>
      <div className="field">
        <textarea id="message" name="message" placeholder=" " rows={5} required />
        <label htmlFor="message">Message</label>
      </div>

      <button className="btn btn-block" type="submit">
        Send message
      </button>
      <p className="form-note">{contactCopy.formNote}</p>
    </Reveal>
  );
}
