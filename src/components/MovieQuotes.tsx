import React from 'react';
import { Quote, Sparkles } from 'lucide-react';
import { Movie } from '../data/movies';
import { movieQuotes } from '../data/movieQuotes';

interface MovieQuotesProps {
  movie: Movie;
}

export const MovieQuotes: React.FC<MovieQuotesProps> = ({ movie }) => {
  const quotes = movieQuotes[movie.id] || [];
  if (quotes.length === 0) return null;

  const backgroundImage = movie.stills[Math.min(1, movie.stills.length - 1)] || movie.cover;

  return (
    <section
      className="movie-quotes"
      aria-label={`《${movie.title}》里的话`}
      style={{ '--quote-background': `url("${backgroundImage}")` } as React.CSSProperties}
    >
      <div className="movie-quotes-wash" aria-hidden="true" />
      <div className="movie-quotes-inner">
        <header className="movie-quotes-heading">
          <span className="movie-quotes-seal"><Quote className="h-5 w-5" /></span>
          <div>
            <p>留在风里的字句</p>
            <h2>《{movie.title}》里的话</h2>
          </div>
          <Sparkles className="movie-quotes-sparkle h-5 w-5" aria-hidden="true" />
        </header>

        <div className="movie-quotes-list">
          {quotes.map((quote, index) => (
            <figure key={quote.text} className="movie-quote" style={{ '--quote-delay': `${index * 0.16}s` } as React.CSSProperties}>
              <span className="movie-quote-mark" aria-hidden="true">“</span>
              <blockquote>{quote.text}</blockquote>
              {quote.english && <p>{quote.english}</p>}
              <figcaption>《{movie.title}》</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};
