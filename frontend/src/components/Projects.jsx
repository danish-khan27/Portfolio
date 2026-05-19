const RepoIcon = () => (
  <svg
    className="repo-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const ExternalIcon = () => (
  <svg
    className="external-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const projects = [
  {
    title: 'Portfolio',
    description:
      'A personal portfolio website built with React, Vite, and Node/Express to showcase my projects, skills, and contact information.',
    tags: ['React', 'Vite', 'CSS', 'Node.js'],
    links: [
      { label: 'Code', href: 'https://github.com/danish-khan27/Portfolio' },
    ],
  },
  {
    title: 'Typing Speed Test',
    description:
      'A responsive typing speed test web app that measures WPM and accuracy in real time, with difficulty levels, two modes, and persistent personal best tracking.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Canvas API'],
    links: [
      { label: 'Demo', href: 'https://danish-khan27.github.io/TypingSpeedTest/' },
      { label: 'Code', href: 'https://github.com/danish-khan27/TypingSpeedTest' },
    ],
  },
];

export default function Projects() {
  return (
    <section id="projects" className="projects">
      <h2 className="section-title">Projects</h2>
      <div className="project-grid">
        {projects.map((p) => (
          <article key={p.title} className="project-card">
            <header className="card-header">
              <div className="card-title">
                <RepoIcon />
                <h3>{p.title}</h3>
              </div>
              <span className="badge">Public</span>
            </header>

            <p className="card-desc">{p.description}</p>

            <div className="tech-tags">
              {p.tags.map((t) => (
                <span key={t} className="tag">
                  {t}
                </span>
              ))}
            </div>

            <div className="card-divider" />

            <div className="card-footer">
              {p.links.map((l) => (
                <a
                  key={l.href}
                  className="demo-btn"
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {l.label}
                  <ExternalIcon />
                </a>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
