import { useEffect, useState } from 'react';
import Portfolio from './pages/Portfolio.jsx';
import LoadingScreen from './components/LoadingScreen.jsx';
import './App.css';

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  return loading ? <LoadingScreen /> : <Portfolio />;
}
