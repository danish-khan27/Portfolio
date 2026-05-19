import TextType from './ui/TextType.jsx';

export default function Hero() {
  return (
    <section id="top" className="hero">
      <p className="code-line">
        <span className="green">const</span> developer = "Danish Khan";
      </p>
      <h2 className="hero-title">
        <TextType text="Full Stack Developer" speed={70} />
      </h2>
      <p className="hero-sub">
        I don&apos;t just study Computer Science; I build with it.
        I create applications and solve problems through code.
      </p>
    </section>
  );
}
