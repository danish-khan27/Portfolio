import { useEffect, useState } from 'react';

const STORAGE_KEY = 'portfolio-stars';
const BASE_COUNT = 56;

export default function Footer() {
  const [count, setCount] = useState(BASE_COUNT);
  const [liked, setLiked] = useState(false);
  const [bump, setBump] = useState(false);

  useEffect(() => {
    const stored = Number(localStorage.getItem(STORAGE_KEY));
    if (Number.isFinite(stored) && stored >= BASE_COUNT) setCount(stored);
    setLiked(localStorage.getItem(STORAGE_KEY + ':liked') === '1');
  }, []);

  const handleClick = () => {
    const next = count + 1;
    setCount(next);
    setLiked(true);
    setBump(true);
    localStorage.setItem(STORAGE_KEY, String(next));
    localStorage.setItem(STORAGE_KEY + ':liked', '1');
    setTimeout(() => setBump(false), 350);
  };

  return (
    <footer className="footer">
      <button
        type="button"
        className={`star-btn ${liked ? 'liked' : ''} ${bump ? 'bump' : ''}`}
        onClick={handleClick}
        aria-label="Give a star"
      >
        <svg
          className="star-icon"
          viewBox="0 0 24 24"
          fill={liked ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
        <span className="star-count">{count}</span>
      </button>
      <p className="footer-copy">&copy; {new Date().getFullYear()} Danish Khan</p>
    </footer>
  );
}
