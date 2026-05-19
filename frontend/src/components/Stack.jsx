const stack = [
  { group: 'Frontend', items: ['JavaScript', 'HTML', 'CSS', 'ReactJS'] },
  { group: 'Backend', items: ['Python', 'Java', 'Node.js'] },
  { group: 'Database', items: ['SQL'] },
  { group: 'Tools', items: ['Git', 'GitHub'] },
];

export default function Stack() {
  return (
    <section id="stack" className="stack">
      <h2 className="section-title">Stack</h2>
      {stack.map((s) => (
        <div key={s.group} className="toolkit-group">
          <h3>{s.group}</h3>
          <ul>
            {s.items.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
