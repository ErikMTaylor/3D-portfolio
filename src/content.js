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
    {id: 'about', label: 'about', hideOnSmall: true},
    {id: 'projects', label: 'projects'},
    {id: 'work', label: 'experience'},
    {id: 'contact', label: 'contact'},
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
    // one line each
    lede: [
        'I build software that is fast, secure, and fun to use.',
        'I break things on purpose, so they will not break by accident.',
        'I like to create tools that are affordable for everyone to use.',
    ],
    primaryCta: {label: 'see my work →', href: '#projects'},
    secondaryCta: {label: 'get in touch', href: '#contact'},
};

export const about = {
    kicker: '01 · about',
    title: 'Player Profile',
    text: 'For me, technology was never just a tool. It was a whole new world. Somewhere to breathe, build, and be someone else for a while. Now I spend my time making sure that escape stays safe for everyone.',
    // `icon` is a little ASCII glyph shown next to each slot
    loadout: [
        {icon: '</>', label: 'class', value: 'Tech Nerd'},
        {icon: 'o==o', label: 'garage', value: 'Honda S2000'},
        {icon: '/||\\', label: 'uniform', value: 'Hoodie'},
        {icon: '=^.^=', label: 'companions', value: "Shino & Neji"},
    ],
    skills: ['TS/JS', 'React', 'C#/.NET', 'Unity', 'PostgreSQL', 'Docker', 'AI', 'Unix'],
};

export const projects = {
    kicker: '02 · projects',
    title: 'Builds',

    // The big card on the left.
    featured: {
        // Screenshot in /public (16:9, 1600x900). Leave out to show the ASCII texture instead.
        image: '/projects/ink-social.webp',
        imageAlt: 'Ink Social Co. storefront showing the product grid',
        title: 'Ink Social Co.',
        stack: ['C#/.NET', 'React', 'Stripe'],
        // one line each
        text: [
            'Rebuilt an online sales platform from the ground up for secure, scalable, and seamless checkout.',
            'Reduced website runtime cost by 50%.',
        ],
        // First link is the solid button, the rest are outlined.
        links: [{label: 'visit site ↗', href: 'https://inksocialco.com'}],
    },

    // The small "coming soon" cards on the right. Add or remove freely.
    upcoming: [
        {
            slot: 'slot 02',
            status: 'in development',
            title: 'Scrub',
            text: "An affordable digital fingerprint scrubber.",
            progress: 62, // percent
        },
        {
            slot: 'slot 03',
            status: 'locked',
            title: '???',
            text: "Unlocks when it's ready. What could it be?",
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
            title: 'Full-Stack Software Engineer',
            company: 'HH Sterling',
            period: '2025 to 2026',
            bullets: [
                'Built responsive React front ends and modular, testable .NET / C# back ends behind RESTful APIs.',
                'Optimized MySQL access with CQRS: Dapper for queries, Entity Framework Core for data modeling.',
                'Reviewed pull requests daily with senior engineers and refined user stories weekly with stakeholders.',
            ],
            tech: ['C#/.NET', 'React', 'MySQL', 'Dapper', 'Enity Framework Core'],
        },
        {
            title: 'Junior Software Engineer',
            company: 'Florida Surplus Lines Service Office',
            period: '2026 to now',
            bullets: [
                "Integrated AI into Florida's compliance system, cutting analysts' examination time.",
                'Built safe environments for developers to use AI without leaking confidential data or credentials.',
                "Took sole ownership of Florida's auditing software: development, maintenance, deployments and architecture.",
            ],
            tech: ['C#/.NET', 'React', 'AWS', 'Docker', 'AI'],
        },
    ],

    // The final checkpoint (the finish line).
    next: {
        title: 'Always building',
        text: "Beyond the day job, I work on games, security research and side projects across engineering. If you have something interesting in mind, let's talk.",
        cta: {label: 'start a conversation →', href: '#contact'},
    },
};

export const contact = {
    title: "Let's Build Together",
    text: "Don't be shy, my cats won't bite.",
    terminalTitle: '~/contact: zsh',
    email: 'erikm.taylor30@gmail.com',
    links: [
        {label: 'github', text: 'github.com/ErikMTaylor', href: 'https://github.com/ErikMTaylor'},
        {label: 'linkedin', text: 'linkedin.com/in/ErikMTaylor', href: 'https://linkedin.com/in/ErikMTaylor'},
        // file lives in public/ and is served from the site root
        {label: 'resume', text: 'ErikTaylor_Resume.pdf', href: '/ErikTaylor_Resume.pdf'},
    ],
};
