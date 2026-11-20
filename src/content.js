/**
 * ============================================================
 *  EDIT ME: this is every word, link and number on the site.
 *  Layout lives in src/components, styling in src/styles and
 *  src/components/*.css, the 3D scene in src/world.
 * ============================================================
 */

export const site = {
  name: 'Erik Taylor',
  handle: 'hoodeez', // shown in the top-left brand
  year: 2026,
  footer: 'rendered in ASCII, one frame at a time',
};

// Top navigation. `id` must match a section id. `hideOnSmall` hides it on narrow screens.
export const nav = [
  { id: 'about', label: 'about', hideOnSmall: true },
  { id: 'projects', label: 'projects' },
  { id: 'work', label: 'experience' },
  { id: 'contact', label: 'contact' },
];

// Text in the bottom-left HUD, keyed by section id.
export const stageLabels = {
  start: 'stage 0 · start',
  about: 'stage 1 · about',
  projects: 'stage 2 · projects',
  work: 'stage 3 · experience',
  contact: 'stage 4 · contact',
};

export const hero = {
  roles: ['software engineer', 'game developer', 'ethical hacker'], // first three get pink / lavender / blue
  lede: "I build software that's fast, secure, and fun to use. I break things on purpose, so they cannot break by accident.",
  primaryCta: { label: 'see my work →', href: '#projects' },
  secondaryCta: { label: 'get in touch', href: '#contact' },
};

export const about = {
  kicker: '01 · about',
  title: 'Player Profile',
  text: "A short paragraph about you: what you love building, the kind of problems you're best at, and what you're looking for next. Two or three sentences is plenty. Recruiters skim, so lead with your strongest point.",
  // `icon` is a little ASCII glyph shown next to each slot
  loadout: [
    { icon: '</>', label: 'class', value: 'tech nerd' },
    { icon: 'o==o', label: 'garage', value: 'Honda S2000' },
    { icon: '/||\\', label: 'uniform', value: 'hoodie... always' },
    { icon: '=^.^=', label: 'companions', value: "Shino & Neji" },
  ],
  skills: ['TS/JS', 'React', 'C#', '.NET', 'Unity', 'PostgreSQL', 'Unix'],
};

export const projects = {
  kicker: '02 · projects',
  title: 'Builds',

  // The big card on the left.
  featured: {
    mediaLabel: 'screenshot or gameplay clip goes here',
    tags: ['game', 'solo project', 'shipped'],
    title: 'Project Title',
    text: `One or two sentences: what it is, who it's for, and the most interesting problem you solved building it. Concrete beats clever, for example "netcode for 8 players at 60 tick".`,
    meta: [
      { label: 'role', value: 'Everything' },
      { label: 'stack', value: 'Unity · C#' },
      { label: 'year', value: '2026' },
    ],
    // First link is the solid button, the rest are outlined.
    links: [
      { label: 'play / live ↗', href: '#' },
      { label: 'source ↗', href: '#' },
      { label: 'write-up ↗', href: '#' },
    ],
  },

  // The small "coming soon" cards on the right. Add or remove freely.
  upcoming: [
    {
      slot: 'slot 02',
      status: 'in development',
      title: 'Next build',
      text: "A one-line teaser of what you're working on now.",
      progress: 62, // percent
    },
    {
      slot: 'slot 03',
      status: 'locked',
      title: '???',
      text: "Unlocks when it's ready. Could be a CTF write-up, a tool or a game jam entry.",
      progress: 8,
    },
  ],
};

export const experience = {
  kicker: '03 · experience',
  title: 'The road so far',

  // One checkpoint gate is drawn on the road for each of these (plus the final one below).
  roles: [
    {
      title: 'Junior Software Engineer',
      company: 'HHSterling',
      period: '2025 to 2026',
      bullets: [
        'Modernized legacy code',
        '',
        'Developed open-source software',
      ],
      tech: ['C#/.NET', 'ReactJS', 'MySQL', 'AWS'],
    },
    {
      title: 'Junior Software Engineer',
      company: 'FSLSO',
      period: '2026 to now',
      bullets: [
        'Integrated AI into an insurance compliance system',
        'Resolved ',
        'Mentoring, leading or cross-team work.',
      ],
      tech: ['C#/.NET', 'ReactJS', 'MySQL', 'AWS'],
    },
  ],

  // The final checkpoint (the finish line).
  next: {
    title: 'Next: your team?',
    text: "I'm looking for a role where I can work across engineering, games and security. If that sounds like your team, let's talk.",
    cta: { label: 'start a conversation →', href: '#contact' },
  },
};

export const contact = {
  title: "Let's Build Together",
  text: 'Don\'t be shy, my cats won\'t bite.',
  terminalTitle: '~/contact: zsh',
  email: 'you@example.com',
  links: [
    { label: 'github', text: 'github.com/ErikMTaylor', href: '#' },
    { label: 'linkedin', text: 'linkedin.com/in/ErikMTaylor', href: '#' },
    { label: 'resume', text: 'resume.pdf', href: '#' },
  ],
};
