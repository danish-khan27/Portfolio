export default function Contact() {
  const email = 'dkhans2001@gmail.com';
  return (
    <section id="contact" className="contact">
      <h2 className="contact-title">Ready When You Are</h2>
      <p className="contact-sub">Send a message.</p>
      <a className="contact-email" href={`mailto:${email}`}>
        {email}
      </a>
    </section>
  );
}
