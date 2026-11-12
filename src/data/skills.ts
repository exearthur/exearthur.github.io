export interface SkillGroup {
  label: string;
  items: string[];
}

export const skills: SkillGroup[] = [
  {
    label: 'Languages',
    items: ['Java', 'C / C++', 'Python', 'TypeScript', 'JavaScript', 'HTML', 'CSS'],
  },
  {
    label: 'Frameworks & libraries',
    items: ['React', 'FastAPI', 'Spring Boot', 'Node.js', 'Tailwind CSS'],
  },
  {
    label: 'Databases',
    items: ['MySQL', 'MongoDB'],
  },
  {
    label: 'Tools & testing',
    items: ['Git', 'GitHub Actions', 'Vite', 'pytest'],
  },
];
