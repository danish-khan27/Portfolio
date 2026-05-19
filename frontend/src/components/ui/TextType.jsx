import { useEffect, useState } from 'react';

export default function TextType({ text, speed = 60 }) {
  const [typed, setTyped] = useState('');

  useEffect(() => {
    setTyped('');
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setTyped(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);

  return (
    <span className="text-type">
      {typed}
      <span className="text-type-caret" aria-hidden="true">|</span>
    </span>
  );
}
