import React from 'react';
import { useParallax } from '../hooks/useParallax';

interface ParallaxBackgroundProps {
  colors?: string[];
}

export const ParallaxBackground: React.FC<ParallaxBackgroundProps> = ({
  colors = ['#87CEEB', '#98D8C8', '#F7DC6F'],
}) => {
  const { offsetX, offsetY } = useParallax();

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute inset-0 transition-transform duration-1000 ease-out"
        style={{
          background: `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1] || colors[0]} 50%, ${colors[2] || colors[1] || colors[0]} 100%)`,
          transform: `translate(${offsetX * 0.5}px, ${offsetY * 0.5}px)`,
        }}
      />

      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div
        className="absolute top-10 left-10 w-64 h-32 bg-white/20 rounded-full blur-3xl cloud-float"
        style={{ transform: `translate(${offsetX * 0.8}px, ${offsetY * 0.8}px)` }}
      />
      <div
        className="absolute top-40 right-20 w-48 h-24 bg-white/15 rounded-full blur-2xl cloud-float"
        style={{
          transform: `translate(${offsetX * 0.6}px, ${offsetY * 0.6}px)`,
          animationDelay: '-3s',
        }}
      />
      <div
        className="absolute bottom-40 left-1/4 w-56 h-28 bg-white/10 rounded-full blur-3xl cloud-float"
        style={{
          transform: `translate(${offsetX * 0.4}px, ${offsetY * 0.4}px)`,
          animationDelay: '-6s',
        }}
      />

      <div
        className="absolute top-20 left-1/4 w-2 h-2 bg-white rounded-full star-twinkle"
        style={{ animationDelay: '0s' }}
      />
      <div
        className="absolute top-32 right-1/3 w-3 h-3 bg-white/80 rounded-full star-twinkle"
        style={{ animationDelay: '-1s' }}
      />
      <div
        className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-white/60 rounded-full star-twinkle"
        style={{ animationDelay: '-2s' }}
      />
      <div
        className="absolute top-1/4 right-1/4 w-2 h-2 bg-white/70 rounded-full star-twinkle"
        style={{ animationDelay: '-0.5s' }}
      />

      <svg
        className="absolute top-1/4 left-10 w-8 h-16 text-ghibli-grass/30 leaf-float"
        style={{ animationDelay: '0s' }}
        viewBox="0 0 24 48"
        fill="currentColor"
      >
        <path d="M12 0C6 0 0 6 0 12c0 6 6 12 12 12s12-6 12-12C24 6 18 0 12 0zm0 20c-4 0-8-2-8-6s4-6 8-6 8 2 8 6-4 6-8 6z" />
      </svg>
      <svg
        className="absolute top-1/3 right-20 w-6 h-12 text-ghibli-forest/25 leaf-float"
        style={{ animationDelay: '-5s' }}
        viewBox="0 0 24 48"
        fill="currentColor"
      >
        <path d="M12 0C6 0 0 6 0 12c0 6 6 12 12 12s12-6 12-12C24 6 18 0 12 0zm0 20c-4 0-8-2-8-6s4-6 8-6 8 2 8 6-4 6-8 6z" />
      </svg>
      <svg
        className="absolute top-1/2 left-1/4 w-10 h-20 text-ghibli-warm/20 leaf-float"
        style={{ animationDelay: '-10s' }}
        viewBox="0 0 24 48"
        fill="currentColor"
      >
        <path d="M12 0C6 0 0 6 0 12c0 6 6 12 12 12s12-6 12-12C24 6 18 0 12 0zm0 20c-4 0-8-2-8-6s4-6 8-6 8 2 8 6-4 6-8 6z" />
      </svg>

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/10" />
    </div>
  );
};
