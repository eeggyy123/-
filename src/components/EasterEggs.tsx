import React, { useState, useEffect, useCallback } from 'react';
import { Sparkles, Heart, Music, Star, Cloud, Moon, Sun, Rainbow, HelpCircle, Zap } from 'lucide-react';
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

export const EasterEggs: React.FC = () => {
  const { isPlaying, currentTime } = useAudioStore();
  const [eggs, setEggs] = useState<EasterEgg[]>([
    { id: 'double-click', name: '双击惊喜', description: '双击任意电影卡片', hint: '试试用鼠标快速点击两下...', icon: <Sparkles className="w-5 h-5" />, unlocked: false },
    { id: 'music-10s', name: '音乐鉴赏家', description: '播放音乐超过10秒', hint: '让久石让的音乐多陪伴你一会儿', icon: <Music className="w-5 h-5" />, unlocked: false, progress: 0, total: 10 },
    { id: 'explorer', name: '探索达人', description: '浏览5部以上电影', hint: '多看看不同的电影世界吧', icon: <Star className="w-5 h-5" />, unlocked: false, progress: 0, total: 5 },
    { id: 'night-owl', name: '夜猫子', description: '在22点后访问网站', hint: '深夜的吉卜力有特别的魔力', icon: <Moon className="w-5 h-5" />, unlocked: false },
    { id: 'rainbow', name: '彩虹祝福', description: '连续点击5次彩虹图标', hint: '左下角有一道彩虹...', icon: <Rainbow className="w-5 h-5" />, unlocked: false, progress: 0, total: 5 },
  ]);
  
  const [showNotification, setShowNotification] = useState<string | null>(null);
  const [showEggPanel, setShowEggPanel] = useState(false);
  const [visitCount, setVisitCount] = useState(0);
  const [rainbowClicks, setRainbowClicks] = useState(0);
  const [showHintBubble, setShowHintBubble] = useState(false);

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
    setVisitCount(count);
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
  }, []);

  useEffect(() => {
    if (isPlaying && currentTime >= 10) {
      const musicEgg = eggs.find(e => e.id === 'music-10s');
      if (musicEgg && !musicEgg.unlocked) {
        unlockEgg('music-10s');
      }
    }
    
    setEggs(prev => prev.map(egg => 
      egg.id === 'music-10s' 
        ? { ...egg, progress: Math.min(Math.floor(currentTime), egg.total || 10) } 
        : egg
    ));
  }, [isPlaying, currentTime, eggs]);

  useEffect(() => {
    setEggs(prev => prev.map(egg => 
      egg.id === 'rainbow' ? { ...egg, progress: rainbowClicks } : egg
    ));
  }, [rainbowClicks]);

  const unlockEgg = useCallback((eggId: string) => {
    setEggs(prev => prev.map(egg => {
      if (egg.id === eggId && !egg.unlocked) {
        showNotificationToast(egg.name);
        const event = new CustomEvent('egg-unlocked', { detail: { eggId, eggName: egg.name } });
        window.dispatchEvent(event);
        return { ...egg, unlocked: true };
      }
      return egg;
    }));
  }, []);

  const showNotificationToast = (eggName: string) => {
    setShowNotification(eggName);
    setTimeout(() => setShowNotification(null), 3000);
  };

  const handleRainbowClick = () => {
    const newCount = rainbowClicks + 1;
    setRainbowClicks(newCount);
    
    if (newCount === 5) {
      unlockEgg('rainbow');
      setRainbowClicks(0);
    }
  };

  const handleMovieVisit = () => {
    const newCount = visitCount + 1;
    setVisitCount(newCount);
    sessionStorage.setItem('movieVisitCount', newCount.toString());
    
    if (newCount >= 5) {
      unlockEgg('explorer');
    }
  };

  React.useEffect(() => {
    (window as any).handleMovieVisit = handleMovieVisit;
    (window as any).unlockEgg = unlockEgg;
  }, [handleMovieVisit, unlockEgg]);

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
        className="fixed top-20 left-6 z-[100] glass-effect rounded-full w-12 h-12 flex items-center justify-center hover:bg-white/30 transition-all hover:scale-110 shadow-xl animate-pulse"
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
        <div className="fixed top-36 left-6 z-[99] glass-effect rounded-2xl p-6 w-80 animate-slide-in-left max-h-[70vh] overflow-y-auto">
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

function LockIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );
}
