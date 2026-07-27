import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Sparkles, Heart, Music, Star, Moon, Rainbow, HelpCircle, Zap } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useAudioStore } from '../store/audioStore';

interface EasterEgg {
  id: string;
  name: string;
  description: string;
  hint: string;
  icon: React.ReactNode;
  unlocked: boolean;
  progress?: number;
  total?: number;
}

const eggNames: Record<string, string> = {
  'double-click': '双击惊喜',
  'music-10s': '音乐鉴赏家',
  explorer: '探索达人',
  'night-owl': '夜猫子',
  rainbow: '彩虹祝福',
};

const readUnlockedEggs = () => {
  try {
    const saved = JSON.parse(sessionStorage.getItem('ghibli-unlocked-eggs') || '[]');
    return new Set<string>(Array.isArray(saved) ? saved : []);
  } catch {
    return new Set<string>();
  }
};

export const EasterEggs: React.FC = () => {
  const location = useLocation();
  const isMoviePage = location.pathname.startsWith('/movie/');
  const { isPlaying, currentTime } = useAudioStore();
  const [eggs, setEggs] = useState<EasterEgg[]>(() => {
    const unlocked = readUnlockedEggs();
    return [
      { id: 'double-click', name: '双击惊喜', description: '双击任意电影卡片', hint: '试试用鼠标快速点击两下...', icon: <Sparkles className="w-5 h-5" />, unlocked: unlocked.has('double-click') },
      { id: 'music-10s', name: '音乐鉴赏家', description: '播放音乐超过10秒', hint: '让久石让的音乐多陪伴你一会儿', icon: <Music className="w-5 h-5" />, unlocked: unlocked.has('music-10s'), progress: 0, total: 10 },
      { id: 'explorer', name: '探索达人', description: '浏览5部以上电影', hint: '多看看不同的电影世界吧', icon: <Star className="w-5 h-5" />, unlocked: unlocked.has('explorer'), progress: 0, total: 5 },
      { id: 'night-owl', name: '夜猫子', description: '在22点后访问网站', hint: '深夜的吉卜力有特别的魔力', icon: <Moon className="w-5 h-5" />, unlocked: unlocked.has('night-owl') },
      { id: 'rainbow', name: '彩虹祝福', description: '连续点击5次彩虹图标', hint: '左下角有一道彩虹...', icon: <Rainbow className="w-5 h-5" />, unlocked: unlocked.has('rainbow'), progress: 0, total: 5 },
    ];
  });
  
  const [showNotification, setShowNotification] = useState<string | null>(null);
  const [showEggPanel, setShowEggPanel] = useState(false);
  const [rainbowClicks, setRainbowClicks] = useState(0);
  const [showHintBubble, setShowHintBubble] = useState(false);
  const unlockedEggsRef = useRef(readUnlockedEggs());

  const showNotificationToast = useCallback((eggName: string) => {
    setShowNotification(eggName);
    window.setTimeout(() => setShowNotification(null), 3000);
  }, []);

  const unlockEgg = useCallback((eggId: string) => {
    if (unlockedEggsRef.current.has(eggId)) return;

    const eggName = eggNames[eggId];
    if (!eggName) return;

    unlockedEggsRef.current.add(eggId);
    sessionStorage.setItem('ghibli-unlocked-eggs', JSON.stringify([...unlockedEggsRef.current]));
    setEggs(prev => prev.map(candidate =>
      candidate.id === eggId ? { ...candidate, unlocked: true } : candidate
    ));
    showNotificationToast(eggName);
    const event = new CustomEvent('egg-unlocked', { detail: { eggId, eggName } });
    window.dispatchEvent(event);
  }, [showNotificationToast]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const hasSeenHint = sessionStorage.getItem('hasSeenEggHint');
      if (!hasSeenHint) {
        setShowHintBubble(true);
        sessionStorage.setItem('hasSeenEggHint', 'true');
        setTimeout(() => setShowHintBubble(false), 5000);
      }
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const count = parseInt(sessionStorage.getItem('movieVisitCount') || '0');
    setEggs(prev => prev.map(egg => 
      egg.id === 'explorer' ? { ...egg, progress: Math.min(count, egg.total || 5) } : egg
    ));
    
    if (count >= 5) {
      unlockEgg('explorer');
    }

    const hour = new Date().getHours();
    if (hour >= 22 || hour < 6) {
      unlockEgg('night-owl');
    }

    const handleDoubleClick = () => {
      unlockEgg('double-click');
    };

    window.addEventListener('dblclick', handleDoubleClick);
    return () => window.removeEventListener('dblclick', handleDoubleClick);
  }, [unlockEgg]);

  useEffect(() => {
    if (isPlaying && currentTime >= 10) {
      unlockEgg('music-10s');
    }

    setEggs(prev => {
      const nextProgress = Math.min(Math.floor(currentTime), 10);
      const currentProgress = prev.find(egg => egg.id === 'music-10s')?.progress;
      if (currentProgress === nextProgress) return prev;

      return prev.map(egg =>
        egg.id === 'music-10s'
          ? { ...egg, progress: Math.min(nextProgress, egg.total || 10) }
          : egg
      );
    });
  }, [isPlaying, currentTime, unlockEgg]);

  useEffect(() => {
    setEggs(prev => prev.map(egg => 
      egg.id === 'rainbow' ? { ...egg, progress: rainbowClicks } : egg
    ));
  }, [rainbowClicks]);

  const handleRainbowClick = () => {
    const newCount = rainbowClicks + 1;
    setRainbowClicks(newCount);
    
    if (newCount === 5) {
      unlockEgg('rainbow');
      setRainbowClicks(0);
    }
  };

  return (
    <>
      {showNotification && (
        <div className="fixed top-20 right-6 z-[200] glass-effect rounded-2xl px-6 py-4 animate-slide-in-right flex items-center gap-3 shadow-xl">
          <Sparkles className="w-6 h-6 text-ghibli-sunset animate-pulse" />
          <div>
            <p className="text-white font-semibold">🎉 解锁彩蛋！</p>
            <p className="text-white/70 text-sm">{showNotification}</p>
          </div>
        </div>
      )}

      {showHintBubble && (
        <div className="fixed top-24 left-20 z-[150] glass-effect rounded-2xl px-4 py-3 animate-bounce shadow-xl max-w-xs">
          <div className="flex items-start gap-2">
            <HelpCircle className="w-5 h-5 text-ghibli-sunset flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-white font-semibold text-sm">💡 小提示</p>
              <p className="text-white/70 text-xs mt-1">
                点击左上角的星星图标，发现隐藏的彩蛋吧！
              </p>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setShowEggPanel(!showEggPanel)}
        className={`easter-egg-toggle fixed z-[100] glass-effect rounded-lg w-12 h-12 flex items-center justify-center hover:bg-white/30 transition hover:scale-105 shadow-xl animate-pulse ${isMoviePage ? 'left-[9.25rem] top-5' : 'left-5 top-20'}`}
        title="查看彩蛋收集"
      >
        <Sparkles className="w-6 h-6 text-ghibli-sunset" />
        {!eggs.every(e => e.unlocked) && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
            !
          </span>
        )}
      </button>

      {showEggPanel && (
        <div className={`fixed left-5 z-[99] glass-effect rounded-2xl p-6 w-80 animate-slide-in-left max-h-[70vh] overflow-y-auto ${isMoviePage ? 'top-20' : 'top-36'}`}>
          <h3 className="font-serif text-xl font-bold text-white mb-2 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400" />
            彩蛋收集
          </h3>
          <p className="text-white/60 text-xs mb-4 flex items-center gap-1">
            <HelpCircle className="w-3 h-3" />
            完成各种有趣的挑战来解锁彩蛋
          </p>
          
          <div className="space-y-3">
            {eggs.map((egg) => (
              <div
                key={egg.id}
                className={`flex items-start gap-3 p-3 rounded-xl transition-all ${
                  egg.unlocked 
                    ? 'bg-white/20' 
                    : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  egg.unlocked 
                    ? 'bg-ghibli-sunset text-white' 
                    : 'bg-white/10 text-white/50'
                }`}>
                  {egg.unlocked ? egg.icon : <HelpCircle className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`font-semibold text-sm ${egg.unlocked ? 'text-white' : 'text-white/80'}`}>
                    {egg.unlocked ? egg.name : egg.name}
                  </h4>
                  <p className={`text-xs mt-0.5 ${egg.unlocked ? 'text-white/70' : 'text-white/50'}`}>
                    {egg.unlocked ? egg.description : egg.hint}
                  </p>
                  {!egg.unlocked && egg.progress !== undefined && egg.total !== undefined && (
                    <div className="mt-2">
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-ghibli-sunset to-ghibli-warm rounded-full transition-all duration-300"
                          style={{ width: `${(egg.progress / egg.total) * 100}%` }}
                        />
                      </div>
                      <p className="text-white/40 text-xs mt-1 flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        进度: {egg.progress} / {egg.total}
                      </p>
                    </div>
                  )}
                </div>
                {egg.unlocked && (
                  <div className="text-ghibli-sunset flex-shrink-0">
                    <Heart className="w-5 h-5 fill-current" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/60 text-sm">收集进度</span>
              <span className="text-white font-semibold">
                {eggs.filter(e => e.unlocked).length} / {eggs.length}
              </span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-ghibli-sunset to-ghibli-warm rounded-full transition-all duration-500"
                style={{ width: `${(eggs.filter(e => e.unlocked).length / eggs.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      <button
        onClick={handleRainbowClick}
        className={`fixed bottom-32 left-6 z-[90] glass-effect rounded-full w-10 h-10 flex items-center justify-center hover:bg-white/30 transition-all hover:scale-110 ${
          rainbowClicks > 0 ? 'animate-pulse' : ''
        }`}
        title={`彩虹彩蛋 (${rainbowClicks}/5)`}
      >
        <Rainbow className={`w-5 h-5 transition-all ${rainbowClicks > 0 ? 'text-ghibli-sunset' : 'text-white/60'}`} />
        {rainbowClicks > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-ghibli-sunset rounded-full text-white text-xs flex items-center justify-center font-bold">
            {rainbowClicks}
          </span>
        )}
      </button>
    </>
  );
};
