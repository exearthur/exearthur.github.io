export interface School {
  period: string;
  name: string;
  degree: string;
  location: string;
  gpa: string;
}

export const schools: School[] = [
  {
    period: 'Expected December 2026',
    name: 'University of Georgia',
    degree: 'B.S. in Computer Science',
    location: 'Athens, Georgia',
    gpa: '3.37 / 4.00',
  },
  {
    period: 'August 2023 - 2024',
    name: 'Sogang University',
    degree: 'Study Abroad',
    location: 'Seoul, South Korea',
    gpa: '3.57 / 4.30',
  },
];

export const coursework = [
  'Algorithms',
  'Computer Networks',
  'Systems Programming',
  'Software Engineering',
  'Data Structures',
  'Data & AI',
];

export const honors: { name: string; terms: string }[] = [
  { name: 'Presidential Scholar', terms: 'Summer 2026' },
  { name: "Dean's List", terms: 'Summer 2025, Spring 2023, Fall 2022' },
];
