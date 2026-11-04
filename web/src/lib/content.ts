/* All homepage copy lives here so sections stay reusable: pass different data, get a different page. */

export type Person = { name: string; role: string; photo?: string; initials?: string; tone?: 'a1' | 'a2' | 'a3' | 'a4' };

export const brand = {
  name: 'E-Africa',
  suffix: ' Services',
  logo: '/brand/eafrica-logo.png',
  email: 'info@eafricaservices.com',
  phone: '+2349076628205',
  phoneDisplay: '+234 907 662 8205',
};

export const nav = {
  menuLabel: 'For Employers',
  menu: [
    { title: 'Customer Experience', sub: 'Support, success & technical support', href: '#ready', tab: 'cx' },
    { title: 'Operations & Admin', sub: 'Virtual & executive assistants, PMs', href: '#ready', tab: 'ops' },
    { title: 'Sales & Revenue', sub: 'SDRs, lead gen, account executives', href: '#ready', tab: 'sales' },
    { title: 'Technology & Creative', sub: 'Developers, analysts, marketers, editors', href: '#ready', tab: 'tech' },
    { title: 'Multilingual Talent', sub: 'English, French, Portuguese, Spanish & more', href: '#ready', tab: 'lang' },
    { title: 'How hiring works', sub: 'Three steps from role to onboarded', href: '#how' },
  ],
  menuAll: { label: 'See all talent solutions ›', href: '#ready' },
  links: [
    { label: 'For Job Seekers', href: '#talent' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'About', href: '#about' },
    { label: 'Resources', href: '#faq' },
    { label: 'Contact', href: '#contact' },
  ],
  secondary: { label: 'Join Talent Pool', href: '#talent' },
  cta: { label: 'Hire Talent', href: '#contact' },
};

export const hero = {
  eyebrow: "Africa's fastest-growing talent platform",
  titleBefore: 'Hire exceptional African talent you can actually ',
  titleUnderlined: 'trust',
  lede: [
    "Finding great people overseas shouldn't feel like a gamble.",
    'We help founders and growing teams hire vetted African professionals who communicate exceptionally and consistently deliver results.',
  ],
  pickTitle: 'What are you hiring for?',
  chips: [
    { label: 'Customer Experience', tab: 'cx' },
    { label: 'Operations & Admin', tab: 'ops' },
    { label: 'Sales & Revenue', tab: 'sales' },
    { label: 'Technology & Creative', tab: 'tech' },
    { label: 'Multilingual', tab: 'lang' },
    { label: 'Something else', href: '#contact' },
  ],
  fine: 'Prefer to chat? Talk to our hiring team.',
  cta: { label: 'Hire Talent', href: '#contact' },
  altCta: { label: 'Looking for work? Find your next opportunity', href: '#talent' },
};

export const heroStage = {
  notes: [
    { cls: 'n1', person: { name: 'Operations & Admin', role: 'Virtual & executive assistants', photo: '/people/kwame.jpg' }, tag: 'Remote-ready' },
    { cls: 'n3', person: { name: 'Customer Experience', role: 'Support & success specialists', photo: '/people/amara.jpg' }, tag: 'Pre-vetted' },
    { cls: 'n2', person: { name: 'Sales & Revenue', role: 'SDRs & account executives', photo: '/people/zainab.jpg' }, tag: 'Interview-ready' },
  ],
  card: {
    photo: '/people/wanjiru.jpg',
    title: 'Vetted Professional',
    sub: 'Customer Success · Remote',
    badge: 'VETTED™',
    status: 'Interview-ready',
    barsLabel: 'Multi-stage vetting for your role',
    bars: [
      { label: 'English testing', v: 95, level: 'Strong fit', tone: 'l0' },
      { label: 'Role assessment', v: 90, level: 'Aligned match', tone: 'l1' },
      { label: 'Communication', v: 96, level: 'Strong fit', tone: 'l0' },
    ],
    handleLabel: 'What we handle',
    fitLabel: 'Ready to work with you',
    fit: ['US & EU hours', 'Fluent English', 'Contracts handled', 'Payroll set up'],
    handle: 'Sourcing, assessments, shortlisting, contracts, and payroll setup, so you only meet finalists.',
    intro: { label: 'You interview finalists · we onboard', href: '#how' },
  },
};

export const stats = {
  // `to` marks the figure that counts up on first view (the reference animates one figure only)
  items: [
    { label: 'Companies served', value: '100+' },
    { label: 'Professionals placed', value: '500+' },
    { label: 'African countries', value: '25+' },
    { label: 'Professionals in our pool', value: '1,000+', to: 1000, suffix: '+' },
  ] as { label: string; value: string; to?: number; suffix?: string }[],
  hub: { title: 'Pan-African', label: 'Remote-first delivery across Africa' },
};

export const partners = {
  title: 'Trusted by global partners',
  rows: [
    [['aws', 'AWS'], ['zendesk', 'Zendesk'], ['hubspot', 'HubSpot'], ['deel', 'Deel'], ['gtbank', 'GTBank'], ['moniepoint', 'Moniepoint']],
    [['kuda-bank', 'Kuda'], ['cadana-pay', 'Cadana'], ['hirebloom', 'HireBloom'], ['byu-pathway', 'BYU-Pathway'], ['baobab-bank', 'Baobab']],
    [['eassist-dental', 'eAssist Dental'], ['balance-of-nature', 'Balance of Nature'], ['cyberiad-labs', 'Cyberiad Labs'], ['maxmigold', 'MaxMigold'], [null, 'E-Amplify']],
  ] as [string | null, string][][],
};

export const problem = {
  eyebrow: 'The problem',
  title: "Hiring overseas shouldn't feel like a gamble",
  rows: [
    { title: 'Hiring on your own is inconsistent', body: 'Job boards and freelance platforms leave you sorting through unvetted profiles.', answer: 'Pre-vetted professionals, ready for global teams' },
    { title: 'Communication breaks down', body: 'Language gaps and unclear expectations slow your remote team down.', answer: 'Multilingual, accent-neutral communication' },
    { title: 'Then the admin lands on you', body: 'Cross-border payroll, contracts and compliance pile up after every hire.', answer: 'Payroll, compliance & onboarding handled by us' },
  ],
};

export const standard = {
  eyebrow: 'The E-Africa standard',
  title: ['Global talent solutions,', 'built for remote teams'],
  sub: 'Remote-ready professionals across every key business function.',
  /* A newline escape in a card title renders as a <br> (same line breaks as the reference layout). */
  blueprint: {
    title: 'Blueprinted to your role',
    body: 'We blueprint role outcomes, team structure, language needs, and performance expectations before we source a single candidate.',
    head: 'Role blueprint',
    sub: 'Your needs and your hire',
    badge: 'Matched',
    photo: '/people/wanjiru.jpg',
    axes: [
      { left: 'Async', right: 'Live', you: 20, hire: 76, shared: false },
      { left: 'Chat & email', right: 'Voice', you: 26, hire: 68, shared: false },
      { left: 'Generalist', right: 'Specialist', you: 62, hire: 68, shared: true },
      { left: 'English', right: 'Multilingual', you: 28, hire: 34, shared: true },
    ],
    key: { you: 'You', hire: 'Your hire', fill: 'Coverage', share: 'Shared style' },
  },
  clocks: {
    title: 'Talent that works your hours',
    body: 'Professionals anywhere in Africa, with global timezone coordination Monday to Friday.',
    cities: [
      { cc: 'NG', city: 'Lagos', tz: 'Africa/Lagos' },
      { cc: 'KE', city: 'Nairobi', tz: 'Africa/Nairobi' },
      { cc: 'GH', city: 'Accra', tz: 'Africa/Accra' },
    ],
  },
  ladder: {
    title: 'Entry-level to expert',
    body: 'Customer support, VA, sales, tech, creative and finance roles at every level.',
    /* on = a level we place; the last one is highlighted */
    levels: [['Entry', false], ['Junior', false], ['Mid', true], ['Senior', true], ['Expert', true]] as [string, boolean][],
    key: 'Levels we place',
  },
  receipt: { title: 'Employed right,\nhandled by us', body: 'Clients pay E-Africa. We handle cross-border payroll, structured contracts and compliance alignment.', head: 'Handled by us', tag: 'Every hire', items: ['Contracts', 'Cross-border payroll', 'Compliance', 'Onboarding & training'] },
  scale: {
    title: 'Built to scale\nwith you',
    body: 'Our infrastructure supports rapid deployment, from 10 to 1,000+ team members, with ongoing support.',
    now: '10 hires · Scaling',
    /* first mark is unlabelled, like the reference timeline */
    marks: [['', 0], ['5', 15.5], ['10', 33.3], ['100', 66.6], ['1k+', 100]] as [string, number][],
    phases: ['Onboard', 'Train', 'Support'],
  },
  guarantee: {
    title: 'Making African excellence the global first choice',
    body: '500+ professionals placed and 100+ companies supported across 25+ African talent markets, in 6 business languages.',
    chips: ['Risk-free hiring', '6 business languages'],
    seal: 'HIRE AFRICAN TALENT · RISK-FREE ·',
  },
};

export type Role = { person: Person; title: string; cat: string; body: string; tags: string[] };
const R = (photo: string, title: string, cat: string, body: string, tags: string[]): Role => ({ person: { name: title, role: cat, photo }, title, cat, body, tags });

export const talent = {
  eyebrow: 'Service categories',
  title: ['Meet the talent', 'before you commit'],
  sub: 'Pick a function and see the roles we fill.',
  tabs: [
    { id: 'cx', label: 'Customer Experience', roles: [
      R('/people/amara.jpg', 'Support Specialist', 'Customer Experience · Remote', 'Resolves tickets across chat, email and voice with clear, accent-neutral English.', ['Ticketing', 'Live chat', 'De-escalation']),
      R('/people/chidi.jpg', 'Customer Success Manager', 'Customer Experience · Remote', 'Owns onboarding, renewals and the relationship with your key accounts.', ['Onboarding', 'Retention', 'QBRs']),
      R('/people/nia.jpg', 'Technical Support Agent', 'Customer Experience · Remote', 'Troubleshoots product issues and documents fixes for your knowledge base.', ['Troubleshooting', 'Tier 2', 'Docs']),
    ] },
    { id: 'ops', label: 'Operations & Admin', roles: [
      R('/people/adaeze.jpg', 'Virtual Assistant', 'Operations & Admin · Remote', 'Keeps inboxes, calendars and day-to-day admin moving while you focus on growth.', ['Inbox', 'Scheduling', 'Admin']),
      R('/people/kwame.jpg', 'Executive Assistant', 'Operations & Admin · Remote', 'Supports founders and leaders with prioritization, travel and meeting prep.', ['Exec support', 'Prioritizing', 'Travel']),
      R('/people/fatou.jpg', 'Project Manager', 'Operations & Admin · Remote', 'Coordinates operations and projects so deadlines and owners stay clear.', ['Planning', 'Coordination', 'Reporting']),
    ] },
    { id: 'sales', label: 'Sales & Revenue', roles: [
      R('/people/tunde.jpg', 'Sales Development Rep', 'Sales & Revenue · Remote', 'Books qualified meetings through outbound email, LinkedIn and calls.', ['Outbound', 'Prospecting', 'CRM']),
      R('/people/wanjiru.jpg', 'Lead Gen Specialist', 'Sales & Revenue · Remote', 'Builds targeted lead lists and keeps your pipeline full and clean.', ['Research', 'Lists', 'Enrichment']),
      R('/people/musa.jpg', 'Account Executive', 'Sales & Revenue · Remote', 'Runs demos, handles objections and closes deals with your buyers.', ['Demos', 'Closing', 'Cold calling']),
    ] },
    { id: 'tech', label: 'Technology & Creative', roles: [
      R('/people/kofi.jpg', 'Software Developer', 'Technology & Creative · Remote', 'Ships features and fixes alongside your in-house engineering team.', ['Web', 'APIs', 'QA']),
      R('/people/zainab.jpg', 'Data Analyst', 'Technology & Creative · Remote', 'Turns your data into dashboards and decisions your team can act on.', ['SQL', 'Dashboards', 'Insights']),
      R('/people/sipho.jpg', 'Digital Marketer', 'Technology & Creative · Remote', 'Plans campaigns, content and video edits that grow your audience.', ['Campaigns', 'Content', 'Video editing']),
    ] },
    { id: 'lang', label: 'Multilingual', roles: [
      R('/people/fatou.jpg', 'French–English Support', 'Multilingual · Remote', 'Bilingual customer service for teams serving Francophone markets.', ['French', 'English (C1)', 'Support']),
      R('/people/amara.jpg', 'Portuguese & Spanish', 'Multilingual · Remote', 'Serves Lusophone and Hispanic customers with native-level fluency.', ['Portuguese', 'Spanish', 'Sales']),
      R('/people/musa.jpg', 'German & Swahili', 'Multilingual · Remote', 'Covers East African and DACH customers across support and operations.', ['German', 'Swahili', 'Operations']),
    ] },
  ],
  cta: { label: 'Talk to Hiring Team', href: '#contact' },
  fine: 'Every professional passes English testing, role-specific assessments and communication checks. Example profiles use stock photos.',
};

export const steps = {
  eyebrow: 'How companies hire with E-Africa',
  title: 'Hire in three steps',
  items: [
    { title: 'Tell us your roles', body: 'Role outcomes, team structure, language needs and performance expectations.' },
    { title: 'We match & vet', body: 'Sourcing, assessments, shortlisting, contracts and payroll setup.' },
    { title: 'Interview & onboard', body: 'You interview finalists. We handle onboarding, training and support.' },
  ],
  callLabel: 'Hiring consultation',
  trio: ['/people/chidi.jpg', '/people/amara.jpg', '/people/kofi.jpg'],
  trioLabel: 'Vetted shortlist',
  done: ['Interviews', 'Onboarding', 'Training', 'Ongoing support'],
  more: { label: 'Start hiring', href: '#contact' },
};

export const testimonials = {
  title: 'Teams who hired with confidence',
  items: [
    { cls: 'w1', person: { name: 'Michael Torres', photo: '/people/t-michael.jpg', role: 'CTO, Launchpad Digital', initials: 'MT', tone: 'a2' }, quote: "As a startup, we couldn't afford hiring mistakes. E-Africa eliminated the risk entirely. Our remote team feels like an in-house extension." },
    { cls: 'w2', person: { name: 'Isabelle Dubois', photo: '/people/t-isabelle.jpg', role: 'Expansion Lead, EuroConnect', initials: 'ID', tone: 'a3' }, quote: 'The multilingual capabilities were a game-changer. We needed French and English speakers, and E-Africa delivered perfectly.' },
    { cls: 'w3', person: { name: 'Sarah Mitchell', photo: '/people/t-sarah.jpg', role: 'VP of Operations, TechScale Inc.', initials: 'SM', tone: 'a1' }, quote: 'We tried hiring independently through LinkedIn and Upwork. It was inconsistent. E-Africa delivered structured, reliable professionals who integrated seamlessly.' },
    { cls: 'w4', person: { name: 'Chidinma Okafor', photo: '/people/t-chidinma.jpg', role: 'Remote Customer Success Manager', initials: 'CO', tone: 'a4' }, quote: "I joined E-Africa's talent pool and within a month was placed at a US company. The process was professional from start to finish." },
  ] as { cls: string; person: Person; quote: string }[],
  tagline: ['Pan-African talent', 'Remote-first delivery'],
  cta: { label: 'Talk to Hiring Team', href: '#contact' },
};

export const talentCta = {
  eyebrow: 'For job seekers · Paid in USD',
  title: "Join Africa's remote talent pool",
  lede: 'Get matched with global companies that pay in USD, and grow your career from home.',
  script: '1,000+ professionals are already in our pool…',
  cta: { label: 'Apply Now', href: '#contact' },
};

export const pricing = {
  eyebrow: 'The E-Africa Remote Job Starter Pack',
  title: 'Get more interviews. Stand out globally.',
  sub: ['Built for professionals chasing remote jobs', 'with international companies.'],
  operator: 'or',
  plans: [
    { label: '🥉 Foundation Pack', price: '₦15,000', body: 'For job seekers who want to do it themselves. ATS-optimized resume and cover letter templates, guides and checklists.' },
    { label: '🥈 Professional Pack', price: '₦35,000', body: 'Everything in Foundation, plus resume review, personalized feedback, LinkedIn headline optimization and email support.' },
    { label: '🥇 Executive Pack', price: '₦50,000', body: 'Everything in Professional, plus a custom resume rewrite, 1-on-1 strategy call, interview prep and direct talent pool consideration.', dark: true },
  ],
  rangeTitle: 'Choose the package that fits your career stage',
  rangeNote: 'This product does not guarantee employment. Results depend on your experience, effort, and the job market.',
  rangeLink: { label: 'Buy a pack', href: '#contact' },
};

export const faq = {
  title: 'Frequently asked questions',
  items: [
    ['How do payments work?', 'Clients pay E-Africa. We handle cross-border payroll.'],
    ['Who handles taxes and legal compliance?', 'Contractors manage their own taxes. We provide structured contracts and compliance alignment.'],
    ['Can I interview the talent myself?', 'Yes. You join final interviews and select from shortlisted candidates.'],
    ['How do I know your talent is qualified?', 'Multi-stage vetting includes English testing, role-specific assessments, and communication checks, especially for bilingual remote customer service roles.'],
    ['What if I need to scale quickly?', 'Our infrastructure supports rapid deployment, from 10 to 1,000+ team members. We are a staffing partner for startups that grows with you.'],
  ] as [string, string][],
};

export const closer = {
  title: 'Ready to build your global team, or start your remote career?',
  body: 'Share your hiring goals and we will design a talent solution for your remote team.',
  primary: { label: 'Talk to Hiring Team', href: 'mailto:info@eafricaservices.com?subject=Hiring%20consultation' },
  secondary: { label: 'Join Talent Pool', href: '#talent' },
  fine: 'Engagement hours: Mon–Fri with global timezone coordination.',
};

export const footer = {
  tagline: "Building Africa's future of work",
  body: 'Helping global companies outsource customer support, hire remote virtual assistant talent, and connect professionals with remote work from Africa.',
  contactLabel: 'Talk to our hiring team',
  peekLines: [
    'Psst. Your next great hire is in here 👀',
    '500+ professionals placed 🎉',
    'Talent from 25+ African countries 🌍',
    'Multilingual & interview-ready 💬',
    'Risk-free hiring, handled end to end ✨',
  ],
  cols: [
    { title: 'For employers', links: [['Hire Talent', '#contact'], ['Talent Solutions', '#solutions'], ['How it works', '#how'], ['Reviews', '#reviews']] },
    { title: 'For job seekers', links: [['Join Talent Pool', '#talent'], ['Starter Pack', '#pricing'], ['FAQ', '#faq']] },
    { title: 'Company', links: [['About Us', '#about'], ['Contact', '#contact'], ['Resources', '#faq']] },
  ],
  copyright: '© 2026 E-Africa Services. All rights reserved.',
  poweredBy: 'E-Amplify',
};
