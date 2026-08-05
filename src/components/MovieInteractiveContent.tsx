import React, { useState } from 'react';
import { Lightbulb } from 'lucide-react';
import { Movie } from '../data/movies';

interface MovieInteractiveContentProps {
  movie: Movie;
}

export const MovieInteractiveContent: React.FC<MovieInteractiveContentProps> = ({ movie }) => {
  const [activeTrivia, setActiveTrivia] = useState<number | null>(null);

  return (
    <section className="glass-effect rounded-3xl p-6" aria-labelledby="movie-trivia-title">
      <h2 id="movie-trivia-title" className="mb-6 flex items-center gap-3 font-serif text-xl font-semibold text-white">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ghibli-sunset text-white">
          <Lightbulb className="h-5 w-5" />
        </span>
        幕后趣事
      </h2>

      <div className="space-y-3">
        {movie.trivia.map((trivia, index) => {
          const active = activeTrivia === index;
          return (
            <button
              key={trivia}
              type="button"
              onClick={() => setActiveTrivia(active ? null : index)}
              className={`flex w-full items-start gap-3 rounded-xl p-4 text-left transition-all ${active ? 'bg-white/20' : 'bg-white/5 hover:bg-white/10'}`}
              aria-pressed={active}
            >
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors ${active ? 'bg-ghibli-sunset text-white' : 'bg-white/10 text-white/60'}`}>
                <Lightbulb className="h-4 w-4" />
              </span>
              <span className="font-serif text-sm leading-7 text-white/80">{trivia}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
