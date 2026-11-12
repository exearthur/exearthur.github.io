export interface Experience {
  when: string;
  where: string;
  title: string;
  /** Line under the title: an employer (optionally linked) or a single role. */
  subtitle?: { text: string; href?: string };
  /** Several roles held at the same organisation, newest first. */
  roles?: { title: string; period: string }[];
  /** Bulleted accomplishments. */
  points?: string[];
  /** A short paragraph, used instead of (or after) bullets. */
  summary?: string;
}

export const experience: Experience[] = [
  {
    when: 'Jul 2024 - Aug 2024',
    where: 'Seoul, South Korea',
    title: 'Tech Consulting Intern',
    subtitle: { text: 'IRC Consulting', href: 'https://ircconsultingkorea.com/' },
    points: [
      'Built a Python tool using the OpenAI API to automate business card contact entry from trade show leads, eliminating manual data entry and improving intake accuracy.',
      "Diagnosed and restored a broken WordPress site, integrating Google Analytics 4 to enable traffic and engagement tracking for the firm's web presence.",
      'Supported market entry strategy for technology companies entering the U.S. and Korean markets, conducting industry research and engaging clients at international trade shows on behalf of the Georgia Department of Economic Development.',
    ],
  },
  {
    when: 'Dec 2024 - Present',
    where: 'University of Georgia',
    title: 'Xi Kappa Fraternity Inc.',
    roles: [
      { title: 'Chapter President', period: 'Apr 2026 - Present' },
      { title: 'External Vice President', period: '2025 - 2026' },
      { title: 'Public Relations Specialist', period: '2024 - 2025' },
    ],
    summary:
      "Lead the executive board and manage compliance with the university Greek Life office and the national board. Before that, built partnerships with campus organizations and grew the chapter's social media engagement by 200%.",
  },
  {
    when: 'Nov 2025 - Present',
    where: 'University of Georgia',
    title: 'Multicultural Greek Council',
    subtitle: { text: 'Vice President of Public Relations' },
    summary:
      "Maintain the council's website and run its social channels, growing Instagram reach to more than 100,000 monthly viewers.",
  },
];
