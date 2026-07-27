import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { MovieDetail } from './pages/MovieDetail';
import { WarawaraSprite } from './components/WarawaraSprite';
import { EasterEggs } from './components/EasterEggs';

export default function App() {
  return (
    <Router>
      <WarawaraSprite />
      <EasterEggs />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
      </Routes>
    </Router>
  );
}
