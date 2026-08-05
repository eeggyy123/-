import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Music } from 'lucide-react';
import { Movie } from '../data/movies';
import { useAppStore } from '../store/appStore';
import { navigateWithWind } from '../lib/viewTransition';
import { JourneyLocationState } from '../lib/journeyNavigation';

interface MovieCardProps {
  movie: Movie;
  isActive?: boolean;
  onDrag?: (direction: 'left' | 'right') => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, isActive = false, onDrag }) => {
  const navigate = useNavigate();
  const { setCurrentMovie, togglePlay, setShowAudioPlayer } = useAppStore();
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setOffsetX(0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const diff = e.clientX - startX;
    setOffsetX(diff);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    if (Math.abs(offsetX) > 100 && onDrag) {
      onDrag(offsetX > 0 ? 'right' : 'left');
    }
    
    setOffsetX(0);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setOffsetX(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const diff = e.touches[0].clientX - startX;
    setOffsetX(diff);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    if (Math.abs(offsetX) > 100 && onDrag) {
      onDrag(offsetX > 0 ? 'right' : 'left');
    }
    
    setOffsetX(0);
  };

  const handleClick = () => {
    sessionStorage.setItem('scrollPosition', window.scrollY.toString());
    cardRef.current?.style.setProperty('view-transition-name', 'movie-poster');
    navigateWithWind(() => navigate(`/movie/${movie.id}`, {
      state: {
        scrollTo: 'top',
        passage: {
          id: `home-movie-card-${movie.id}`,
          kind: 'home',
          eyebrow: '十三个世界仍在原处等待',
          title: `《${movie.title}》身后，主页还留着你刚才浏览的位置`,
          description: '看完这部电影，风会把你送回电影列表，继续挑选下一段旅程。',
          returnLabel: '回到十三个电影世界',
          returnPath: '/',
          returnAnchor: 'movies',
        },
      } satisfies JourneyLocationState,
    }));
  };

  const handlePlayMusic = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentMovie(movie);
    togglePlay();
    setShowAudioPlayer(true);
  };

  return (
    <div
      ref={cardRef}
      className={`relative rounded-3xl overflow-hidden shadow-xl cursor-pointer card-hover select-none ${
        isActive ? 'ring-4 ring-ghibli-sunset scale-105' : ''
      }`}
      style={{
        transform: isDragging ? `translateX(${offsetX}px) rotate(${offsetX * 0.05}deg)` : 'none',
        transition: isDragging ? 'none' : 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={handleClick}
      role="link"
      tabIndex={0}
      aria-label={`进入《${movie.title}》`}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') handleClick();
      }}
    >
      <div className="relative aspect-[3/4]">
        <img
          src={movie.cover}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        
        <div className="absolute top-3 right-3">
          <button
            onClick={handlePlayMusic}
            className="w-10 h-10 rounded-full glass-effect flex items-center justify-center hover:bg-white/30 transition-all hover:scale-110"
          >
            <Music className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
          <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all hover:scale-110">
            <Play className="w-10 h-10 text-white ml-1" />
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="px-3 py-1 rounded-full text-xs font-semibold text-white"
              style={{ backgroundColor: movie.colorTheme[0] || '#87CEEB' }}
            >
              {movie.year}
            </span>
          </div>
          <h3 className="font-serif text-white text-xl font-semibold mb-1">
            {movie.title}
          </h3>
          <p className="font-cursive text-white/70 text-sm">
            {movie.titleEn}
          </p>
        </div>

        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
      </div>

      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex gap-1 opacity-0 hover:opacity-100 transition-all duration-300 group-hover:bottom-2">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-white/50"
            style={{ backgroundColor: movie.colorTheme[i % movie.colorTheme.length] }}
          />
        ))}
      </div>
    </div>
  );
};
