import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lightbulb, Sparkles, Heart, Star, ArrowRight, Gift, Moon, Sun, Cloud, Mountain } from 'lucide-react';
import { Movie, getMovieById, movies } from '../data/movies';

interface MovieInteractiveContentProps {
  movie: Movie;
}

const moodIcons: Record<string, React.ReactNode> = {
  adventure: <Mountain className="w-5 h-5" />,
  fantasy: <Sparkles className="w-5 h-5" />,
  romantic: <Heart className="w-5 h-5" />,
  heartwarming: <Sun className="w-5 h-5" />,
  epic: <Star className="w-5 h-5" />,
  nostalgic: <Moon className="w-5 h-5" />,
};

const moodLabels: Record<string, string> = {
  adventure: '冒险',
  fantasy: '奇幻',
  romantic: '浪漫',
  heartwarming: '温馨',
  epic: '史诗',
  nostalgic: '怀旧',
};

const moodColors: Record<string, string> = {
  adventure: '#3498DB',
  fantasy: '#9B59B6',
  romantic: '#E74C3C',
  heartwarming: '#F39C12',
  epic: '#2ECC71',
  nostalgic: '#7F8C8D',
};

export const MovieInteractiveContent: React.FC<MovieInteractiveContentProps> = ({ movie }) => {
  const navigate = useNavigate();
  const [activeTrivia, setActiveTrivia] = useState<number | null>(null);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [easterEggCount, setEasterEggCount] = useState(0);
  const [selectedTab, setSelectedTab] = useState<'trivia' | 'recommendations' | 'mood'>('trivia');

  const recommendedMovies = movie.recommendations
    .map(id => getMovieById(id))
    .filter(Boolean);

  const handleTriviaClick = (index: number) => {
    setActiveTrivia(activeTrivia === index ? null : index);
    
    if (activeTrivia === null && index === 0) {
      setEasterEggCount(prev => prev + 1);
      if (easterEggCount >= 2) {
        setTimeout(() => setShowEasterEgg(true), 500);
      }
    }
  };

  const handleEasterEggClose = () => {
    setShowEasterEgg(false);
    setEasterEggCount(0);
  };

  const handleRecommendClick = (movieId: string) => {
    sessionStorage.setItem('scrollPosition', '0');
    navigate(`/movie/${movieId}`);
  };

  const moodMatches = getMoodMatches(movie);

  return (
    <div className="space-y-6">
      <div className="glass-effect rounded-3xl p-6">
        <div className="flex gap-2 mb-6">
          {(['trivia', 'recommendations', 'mood'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                selectedTab === tab
                  ? 'bg-ghibli-sunset text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {tab === 'trivia' && <span className="flex items-center gap-2"><Lightbulb className="w-4 h-4" />幕后趣事</span>}
              {tab === 'recommendations' && <span className="flex items-center gap-2"><Star className="w-4 h-4" />推荐观看</span>}
              {tab === 'mood' && <span className="flex items-center gap-2"><Heart className="w-4 h-4" />心情匹配</span>}
            </button>
          ))}
        </div>

        {selectedTab === 'trivia' && (
          <div className="space-y-3">
            {movie.trivia.map((trivia, index) => (
              <div
                key={index}
                onClick={() => handleTriviaClick(index)}
                className={`p-4 rounded-xl cursor-pointer transition-all ${
                  activeTrivia === index
                    ? 'bg-white/20 scale-[1.02]'
                    : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                    activeTrivia === index ? 'bg-ghibli-sunset' : 'bg-white/10'
                  }`}>
                    <Lightbulb className={`w-4 h-4 ${activeTrivia === index ? 'text-white' : 'text-white/60'}`} />
                  </div>
                  <p className="text-white/80 text-sm leading-relaxed font-serif">
                    {trivia}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedTab === 'recommendations' && (
          <div className="space-y-4">
            {recommendedMovies.map((recMovie) => (
              <div
                key={recMovie?.id}
                onClick={() => recMovie && handleRecommendClick(recMovie.id)}
                className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer transition-all group"
              >
                <img
                  src={recMovie?.cover}
                  alt={recMovie?.title}
                  className="w-14 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h4 className="font-serif text-white font-semibold">{recMovie?.title}</h4>
                  <p className="text-white/60 text-xs">{recMovie?.year}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-white/40 group-hover:text-white/80 transition-colors" />
              </div>
            ))}
          </div>
        )}

        {selectedTab === 'mood' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-white/10">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: moodColors[movie.mood] }}
              >
                {moodIcons[movie.mood]}
              </div>
              <div>
                <p className="text-white/60 text-sm">当前心情标签</p>
                <p className="font-serif text-white font-semibold text-lg">{moodLabels[movie.mood]}</p>
              </div>
            </div>
            
            <p className="text-white/60 text-sm mb-4">探索同类型的电影：</p>
            
            <div className="grid grid-cols-2 gap-3">
              {moodMatches.map((match) => (
                <div
                  key={match.id}
                  onClick={() => handleRecommendClick(match.id)}
                  className="p-3 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer transition-all text-center"
                >
                  <div className="w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: moodColors[match.mood] }}
                  >
                    {moodIcons[match.mood]}
                  </div>
                  <p className="font-serif text-white text-sm">{match.title}</p>
                  <p className="text-white/50 text-xs">{match.year}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="glass-effect rounded-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-serif text-lg font-semibold text-white flex items-center gap-2">
            <Gift className="w-5 h-5 text-ghibli-sunset" />
            特别彩蛋
          </h4>
          <span className="text-white/40 text-xs">点击3次第一条趣事</span>
        </div>
        
        <div className="relative h-32 rounded-xl overflow-hidden bg-gradient-to-br from-white/5 to-white/10">
          {showEasterEgg ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center animate-fade-in">
              <Sparkles className="w-12 h-12 text-ghibli-sunset mb-2" />
              <p className="font-serif text-white font-semibold">恭喜发现彩蛋！</p>
              <p className="text-white/70 text-sm">你解锁了隐藏内容</p>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Cloud className="w-8 h-8 text-white/20 mx-auto mb-2" />
                <p className="text-white/40 text-sm">探索页面发现惊喜</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {showEasterEgg && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in" onClick={handleEasterEggClose}>
          <div className="glass-effect rounded-3xl p-8 max-w-sm mx-4 text-center" onClick={(e) => e.stopPropagation()}>
            <Sparkles className="w-16 h-16 text-ghibli-sunset mx-auto mb-4" />
            <h3 className="font-serif text-2xl font-bold text-white mb-2">惊喜彩蛋！</h3>
            <p className="text-white/70 font-serif mb-6">
              你发现了宫崎骏电影世界的一个小秘密！<br />
              继续探索，看看还能发现什么...
            </p>
            <button
              onClick={handleEasterEggClose}
              className="px-6 py-3 rounded-full bg-ghibli-sunset text-white font-semibold hover:bg-ghibli-warm transition-all"
            >
              继续探索
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

function getMoodMatches(movie: Movie) {
  return movies
    .filter(m => m.id !== movie.id && m.mood === movie.mood)
    .slice(0, 4);
}