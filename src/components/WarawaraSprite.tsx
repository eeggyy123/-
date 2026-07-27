import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Sparkles, Heart, Settings, X, Sun, Moon, Volume2, Move, ZoomIn, Eye } from 'lucide-react';

type SpriteState = 'idle' | 'flying' | 'dragging' | 'sleeping' | 'interacting' | 'celebrating';
type ExpressionType = 'happy' | 'normal' | 'surprised' | 'shy' | 'laughing' | 'blinking' | 'starry';

const aiResponses: Record<string, string[]> = {
  hello: ['你好呀！我是哇啦哇啦~', '哇！有人跟我说话了！', '你好你好，很高兴见到你！'],
  hi: ['嗨~', '你好呀！', '哇啦哇啦！'],
  你好: ['你好呀！我是哇啦哇啦~', '哇！有人跟我说话了！', '你好你好，很高兴见到你！'],
  可爱: ['谢谢夸奖！(*^▽^*)', '哇啦哇啦~ 你也很可爱！', '嘻嘻~'],
  喜欢: ['我也喜欢你！', '哇啦哇啦最喜欢你了！', '❤️'],
  电影: ['宫崎骏的电影都超好看！', '你最喜欢哪部电影呢？', '我来自《你想活出什么样的人生》！'],
  音乐: ['久石让的音乐太棒了！', '🎵 哇啦哇啦跟着音乐跳舞~', '音乐可以治愈心灵哦！'],
  再见: ['再见啦！下次再来找我玩！', '哇啦哇啦会想你的！', '拜拜~'],
  default: ['哇啦哇啦~', '(*^▽^*)', '你在说什么呀？', '嘻嘻~'],
};

const defaultSettings = {
  size: 80,
  opacity: 0.95,
  speed: 2,
  behaviorFrequency: 3000,
  enableAI: true,
};

export const WarawaraSprite: React.FC = () => {
  const [position, setPosition] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 3 });
  const [velocity, setVelocity] = useState({ x: 1, y: -0.5 });
  const [state, setState] = useState<SpriteState>('flying');
  const [expression, setExpression] = useState<ExpressionType>('normal');
  const [showSpeech, setShowSpeech] = useState(false);
  const [speechText, setSpeechText] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [settings, setSettings] = useState(defaultSettings);
  const [sleepTimer, setSleepTimer] = useState(0);
  const [wakeUpTimer, setWakeUpTimer] = useState(0);
  const [flyingHeight, setFlyingHeight] = useState(window.innerHeight / 3);
  const [showParticles, setShowParticles] = useState(false);
  const [celebrateParticles, setCelebrateParticles] = useState(false);
  
  const spriteRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const dragOffsetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleEggUnlocked = (e: CustomEvent) => {
      const { eggName } = e.detail || {};
      startCelebration(eggName);
    };
    window.addEventListener('egg-unlocked', handleEggUnlocked as EventListener);
    return () => window.removeEventListener('egg-unlocked', handleEggUnlocked as EventListener);
  }, []);

  const startCelebration = useCallback((eggName?: string) => {
    if (state === 'celebrating') return;
    
    const prevState = state;
    setState('celebrating');
    setExpression('starry');
    setShowParticles(true);
    setCelebrateParticles(true);
    setShowSpeech(true);
    setSpeechText(eggName ? `🎉 解锁彩蛋：${eggName}！` : '🎉 太棒了！');
    
    setTimeout(() => {
      setState(prevState === 'sleeping' ? 'flying' : prevState);
      setExpression('happy');
      setShowParticles(false);
      setCelebrateParticles(false);
    }, 3000);
    
    setTimeout(() => {
      setShowSpeech(false);
      setExpression('normal');
    }, 5000);
  }, [state]);

  useEffect(() => {
    const handleAnimation = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const deltaTime = (timestamp - lastTimeRef.current) / 16.67;
      lastTimeRef.current = timestamp;

      setPosition(prev => {
        if (state === 'dragging') return prev;

        if (state === 'sleeping') {
          return {
            x: prev.x + Math.sin(timestamp / 1000) * 0.5,
            y: window.innerHeight - 120,
          };
        }

        if (state === 'celebrating') {
          return {
            x: prev.x + Math.sin(timestamp / 100) * 2,
            y: prev.y + Math.sin(timestamp / 80) * 3 - 0.5,
          };
        }

        setVelocity(v => {
          let newVx = v.x;
          let newVy = v.y;

          if (prev.x <= 50 || prev.x >= window.innerWidth - 50) {
            newVx = -v.x;
          }
          if (prev.y <= 50) {
            newVy = Math.abs(v.y);
          }
          if (prev.y >= flyingHeight) {
            newVy = -Math.abs(v.y);
          }

          if (Math.random() < 0.005) {
            newVx += (Math.random() - 0.5) * 0.5;
            newVy += (Math.random() - 0.5) * 0.3;
          }

          const speed = Math.sqrt(newVx * newVx + newVy * newVy);
          const maxSpeed = settings.speed;
          if (speed > maxSpeed) {
            newVx = (newVx / speed) * maxSpeed;
            newVy = (newVy / speed) * maxSpeed;
          }

          return { x: newVx, y: newVy };
        });

        setVelocity(v => ({
          x: prev.x <= 50 || prev.x >= window.innerWidth - 50 ? -v.x : v.x,
          y: prev.y <= 50 ? Math.abs(v.y) : prev.y >= flyingHeight ? -Math.abs(v.y) : v.y,
        }));

        return {
          x: prev.x + velocity.x * deltaTime * 0.5,
          y: prev.y + velocity.y * deltaTime * 0.5,
        };
      });

      animationRef.current = requestAnimationFrame(handleAnimation);
    };

    animationRef.current = requestAnimationFrame(handleAnimation);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [state, velocity, settings.speed, flyingHeight]);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      if (state !== 'sleeping' && state !== 'interacting') {
        setExpression('blinking');
        setTimeout(() => setExpression('normal'), 200);
      }
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(blinkInterval);
  }, [state]);

  useEffect(() => {
    const behaviorInterval = setInterval(() => {
      if (state === 'flying') {
        const behaviors = ['wiggle', 'spin', 'jump', 'float', 'nothing', 'starry'];
        const behavior = behaviors[Math.floor(Math.random() * behaviors.length)];
        
        if (behavior === 'wiggle') {
          setState('interacting');
          setExpression('happy');
          setTimeout(() => {
            setState('flying');
            setExpression('normal');
          }, 500);
        } else if (behavior === 'spin') {
          setState('interacting');
          setExpression('laughing');
          setTimeout(() => {
            setState('flying');
            setExpression('normal');
          }, 1000);
        } else if (behavior === 'jump') {
          setVelocity(v => ({ ...v, y: -3 }));
          setExpression('surprised');
          setTimeout(() => setExpression('normal'), 300);
        } else if (behavior === 'starry') {
          setExpression('starry');
          setTimeout(() => setExpression('normal'), 2000);
        }
      }
    }, settings.behaviorFrequency);

    return () => clearInterval(behaviorInterval);
  }, [state, settings.behaviorFrequency]);

  useEffect(() => {
    if (state === 'flying') {
      setSleepTimer(prev => {
        if (prev >= 60000) {
          setState('sleeping');
          setShowSpeech(true);
          setSpeechText('好困啊~ 睡一会儿...');
          setTimeout(() => setShowSpeech(false), 3000);
          return 0;
        }
        return prev + 1000;
      });
    } else {
      setSleepTimer(0);
    }
  }, [state]);

  useEffect(() => {
    if (state === 'sleeping') {
      setWakeUpTimer(prev => {
        if (prev >= 15000) {
          setState('flying');
          setShowSpeech(true);
          setSpeechText('睡醒啦！精神满满~');
          setTimeout(() => setShowSpeech(false), 3000);
          return 0;
        }
        return prev + 1000;
      });
    } else {
      setWakeUpTimer(0);
    }
  }, [state]);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 22 || hour < 6) {
      setState('sleeping');
    }
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (state === 'sleeping') {
      setState('flying');
      setExpression('surprised');
      setShowSpeech(true);
      setSpeechText('呀！被叫醒了~');
      setTimeout(() => {
        setShowSpeech(false);
        setExpression('happy');
      }, 2000);
      return;
    }

    setState('dragging');
    setExpression('shy');
    const rect = spriteRef.current?.getBoundingClientRect();
    if (rect) {
      dragOffsetRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  }, [state]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (state === 'dragging') {
      setPosition({
        x: e.clientX - dragOffsetRef.current.x,
        y: e.clientY - dragOffsetRef.current.y,
      });
    }
  }, [state]);

  const handleMouseUp = useCallback((e: MouseEvent) => {
    if (state === 'dragging') {
      setState('flying');
      setExpression('happy');
      setShowSpeech(true);
      setSpeechText('哇！我又要飞起来啦~');
      setShowParticles(true);
      setTimeout(() => {
        setShowSpeech(false);
        setShowParticles(false);
        setExpression('normal');
      }, 2000);
    }
  }, [state]);

  useEffect(() => {
    if (state === 'dragging') {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [state, handleMouseMove, handleMouseUp]);

  const handleClick = useCallback(() => {
    if (state !== 'dragging') {
      const expressions: ExpressionType[] = ['happy', 'laughing', 'surprised', 'starry'];
      const randomExpr = expressions[Math.floor(Math.random() * expressions.length)];
      
      setState('interacting');
      setExpression(randomExpr);
      setShowSpeech(true);
      setShowParticles(true);
      setSpeechText(aiResponses.default[Math.floor(Math.random() * aiResponses.default.length)]);
      
      setTimeout(() => {
        setState(state === 'sleeping' ? 'sleeping' : 'flying');
        setShowSpeech(false);
        setShowParticles(false);
        setExpression('normal');
      }, 2000);
    }
  }, [state]);

  const processInput = useCallback((input: string) => {
    const lowerInput = input.toLowerCase();
    let response = aiResponses.default;
    
    if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
      response = aiResponses.hello;
      setExpression('happy');
    } else if (lowerInput.includes('可爱') || lowerInput.includes('cute')) {
      response = aiResponses.可爱;
      setExpression('shy');
    } else if (lowerInput.includes('喜欢') || lowerInput.includes('love')) {
      response = aiResponses.喜欢;
      setExpression('starry');
    } else if (lowerInput.includes('电影') || lowerInput.includes('movie')) {
      response = aiResponses.电影;
      setExpression('normal');
    } else if (lowerInput.includes('音乐') || lowerInput.includes('music')) {
      response = aiResponses.音乐;
      setExpression('happy');
    } else if (lowerInput.includes('再见') || lowerInput.includes('bye')) {
      response = aiResponses.再见;
      setExpression('shy');
    } else if (lowerInput.includes('你好')) {
      response = aiResponses.你好;
      setExpression('happy');
    } else {
      setExpression('surprised');
    }
    
    setTimeout(() => setExpression('normal'), 2000);
    return response[Math.floor(Math.random() * response.length)];
  }, []);

  const handleInputSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const input = (e.target as HTMLFormElement).input.value;
    if (input.trim()) {
      const response = processInput(input);
      setState('interacting');
      setShowSpeech(true);
      setShowParticles(true);
      setSpeechText(response);
      
      setTimeout(() => {
        setState('flying');
        setShowSpeech(false);
        setShowParticles(false);
      }, 3000);
      
      (e.target as HTMLFormElement).input.value = '';
    }
  }, [processInput]);

  const handleSettingChange = useCallback((key: keyof typeof settings, value: number | boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  const renderEye = (side: 'left' | 'right') => {
    if (state === 'sleeping') {
      return (
        <div 
          className="rounded-full"
          style={{ 
            width: settings.size * 0.1, 
            height: settings.size * 0.025,
            background: '#cccccc',
            borderRadius: '5px',
            transform: side === 'left' ? 'rotate(-10deg)' : 'rotate(10deg)',
          }}
        />
      );
    }

    if (expression === 'blinking') {
      return (
        <div 
          className="rounded-full animate-[blink_0.2s_ease-in-out]"
          style={{ 
            width: settings.size * 0.15, 
            height: settings.size * 0.025,
            background: '#444444',
            borderRadius: '3px',
          }}
        />
      );
    }

    if (expression === 'surprised') {
      return (
        <div 
          className="rounded-full flex items-center justify-center animate-[surprisePop_0.3s_ease-out]"
          style={{ 
            width: settings.size * 0.16, 
            height: settings.size * 0.16,
            background: '#ffffff',
            border: `2.5px solid #333333`,
            borderRadius: '50%',
          }}
        >
          <div 
            className="rounded-full bg-gray-800"
            style={{ 
              width: settings.size * 0.07, 
              height: settings.size * 0.07,
            }}
          >
            <div 
              className="rounded-full bg-white absolute"
              style={{ 
                width: settings.size * 0.025, 
                height: settings.size * 0.025,
                top: settings.size * 0.012,
                left: settings.size * 0.012,
              }}
            />
          </div>
        </div>
      );
    }

    if (expression === 'starry') {
      return (
        <div 
          className="rounded-full flex items-center justify-center"
          style={{ 
            width: settings.size * 0.14, 
            height: settings.size * 0.14,
            background: '#ffffff',
            border: `2.5px solid #333333`,
            borderRadius: '50%',
          }}
        >
          <div className="flex flex-col gap-0.5">
            <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-b-[8px] border-transparent border-b-yellow-400 mx-auto" />
            <div className="flex gap-0.5">
              <div className="w-0 h-0 border-t-[4px] border-b-[4px] border-r-[8px] border-transparent border-r-yellow-400" />
              <div className="w-0 h-0 border-t-[4px] border-b-[4px] border-l-[8px] border-transparent border-l-yellow-400" />
            </div>
            <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-t-[8px] border-transparent border-t-yellow-400 mx-auto" />
          </div>
        </div>
      );
    }

    if (expression === 'laughing') {
      return (
        <div 
          className="rounded-full flex items-center justify-center"
          style={{ 
            width: settings.size * 0.14, 
            height: settings.size * 0.1,
            background: '#ffffff',
            borderBottom: `2.5px solid #333333`,
            borderRadius: `0 0 ${settings.size * 0.08}px ${settings.size * 0.08}px`,
          }}
        >
          <div 
            className="rounded-full bg-gray-800"
            style={{ 
              width: settings.size * 0.05, 
              height: settings.size * 0.05,
            }}
          />
        </div>
      );
    }

    return (
      <div 
        className="rounded-full flex items-center justify-center"
        style={{ 
          width: settings.size * 0.15, 
          height: settings.size * 0.15,
        }}
      >
        <div 
          className="rounded-full"
          style={{ 
            width: settings.size * 0.1, 
            height: settings.size * 0.1,
            background: '#444444',
            borderRadius: '50%',
          }}
        >
          <div 
            className="rounded-full bg-white absolute transition-all duration-200"
            style={{ 
              width: settings.size * 0.04, 
              height: settings.size * 0.04,
              top: settings.size * 0.02,
              left: settings.size * 0.02,
              transform: expression === 'shy' ? 'translate(0, 3px)' : 'none',
            }}
          />
        </div>
      </div>
    );
  };

  const renderMouth = () => {
    if (state === 'sleeping') {
      return (
        <div 
          className="rounded-full"
          style={{ 
            width: settings.size * 0.12, 
            height: settings.size * 0.03,
            background: '#d4d4d4',
            borderRadius: '1px',
          }}
        />
      );
    }

    if (expression === 'happy') {
      return (
        <div 
          className="relative animate-[happyMouth_0.3s_ease-out]"
          style={{ 
            width: settings.size * 0.25, 
            height: settings.size * 0.12,
          }}
        >
          <svg viewBox="0 0 100 50" className="w-full h-full" preserveAspectRatio="none">
            <path
              d="M5 40 Q25 10, 50 15 Q75 10, 95 40"
              fill="none"
              stroke="#ff8888"
              strokeWidth="6"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-white/60" />
            <div className="w-1.5 h-1.5 rounded-full bg-white/60" />
          </div>
        </div>
      );
    }

    if (expression === 'laughing') {
      return (
        <div 
          className="relative animate-[laughMouth_0.2s_ease-in-out_infinite]"
          style={{ 
            width: settings.size * 0.3, 
            height: settings.size * 0.18,
          }}
        >
          <svg viewBox="0 0 100 60" className="w-full h-full" preserveAspectRatio="none">
            <path
              d="M5 50 Q20 15, 50 20 Q80 15, 95 50"
              fill="none"
              stroke="#ff7777"
              strokeWidth="7"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-white/60" />
            <div className="w-1.5 h-1.5 rounded-full bg-white/60" />
            <div className="w-1.5 h-1.5 rounded-full bg-white/60" />
          </div>
        </div>
      );
    }

    if (expression === 'surprised') {
      return (
        <div 
          className="rounded-full animate-[surpriseMouth_0.3s_ease-out]"
          style={{ 
            width: settings.size * 0.12, 
            height: settings.size * 0.14,
            background: '#ff8888',
            borderRadius: '50%',
            border: '2px solid #ff6666',
          }}
        />
      );
    }

    if (expression === 'shy') {
      return (
        <div 
          className="relative"
          style={{ 
            width: settings.size * 0.15, 
            height: settings.size * 0.08,
          }}
        >
          <svg viewBox="0 0 60 30" className="w-full h-full" preserveAspectRatio="none">
            <path
              d="M5 25 Q15 10, 30 12 Q45 10, 55 25"
              fill="none"
              stroke="#ffaaaa"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
        </div>
      );
    }

    return (
      <div 
        className="relative"
        style={{ 
          width: settings.size * 0.22, 
          height: settings.size * 0.1,
        }}
      >
        <svg viewBox="0 0 80 35" className="w-full h-full" preserveAspectRatio="none">
          <path
            d="M5 30 Q15 28, 40 10 Q65 28, 75 30"
            fill="none"
            stroke="#ffaaaa"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    );
  };

  const renderCheeks = () => {
    const isShy = expression === 'shy';
    const isHappy = expression === 'happy' || expression === 'laughing' || expression === 'starry';
    
    const baseOpacity = 0.35;
    const opacity = isShy ? 0.7 : isHappy ? 0.55 : baseOpacity;
    const color = isShy ? '#ffaaaa' : isHappy ? '#ffd4d4' : '#ffe4e4';
    const sizeMultiplier = isShy ? 1.1 : isHappy ? 1.0 : 0.9;

    return (
      <>
        <div 
          className={`absolute transition-all duration-300 ${
            isShy ? 'animate-[blush_1s_ease-in-out_infinite]' : ''
          }`}
          style={{ 
            width: settings.size * 0.2 * sizeMultiplier, 
            height: settings.size * 0.12 * sizeMultiplier,
            background: color,
            opacity: opacity,
            left: settings.size * 0.05,
            top: settings.size * 0.6,
            borderRadius: '50%',
            filter: 'blur(4px)',
          }}
        />
        <div 
          className={`absolute transition-all duration-300 ${
            isShy ? 'animate-[blush_1s_ease-in-out_infinite]' : ''
          }`}
          style={{ 
            width: settings.size * 0.2 * sizeMultiplier, 
            height: settings.size * 0.12 * sizeMultiplier,
            background: color,
            opacity: opacity,
            right: settings.size * 0.05,
            top: settings.size * 0.6,
            borderRadius: '50%',
            filter: 'blur(4px)',
          }}
        />
      </>
    );
  };

  const renderExpressionDecorations = () => {
    if (state === 'sleeping') {
      return (
        <div className="absolute -top-4 flex gap-1">
          <div className="w-1 h-3 bg-gray-400 rounded-full opacity-60 animate-[floatUp_2s_ease-out_infinite]" />
          <div className="w-1 h-5 bg-gray-400 rounded-full opacity-80 animate-[floatUp_2s_ease-out_infinite]" style={{ animationDelay: '0.5s' }} />
          <div className="w-1 h-3 bg-gray-400 rounded-full opacity-60 animate-[floatUp_2s_ease-out_infinite]" style={{ animationDelay: '1s' }} />
        </div>
      );
    }

    if (expression === 'starry') {
      return (
        <div className="absolute -top-6 flex gap-1">
          <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
          <Heart className="w-3 h-3 text-pink-400 animate-bounce" />
          <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" style={{ animationDelay: '0.3s' }} />
          <Heart className="w-3 h-3 text-pink-400 animate-bounce" style={{ animationDelay: '0.5s' }} />
          <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" style={{ animationDelay: '0.6s' }} />
        </div>
      );
    }

    if (state === 'interacting' || expression === 'happy') {
      return (
        <div className="absolute -top-6 flex gap-1">
          <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
          <Heart className="w-3 h-3 text-pink-400 animate-bounce" />
          <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" style={{ animationDelay: '0.3s' }} />
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <div
        ref={spriteRef}
        className={`fixed z-[100] cursor-grab active:cursor-grabbing select-none transition-all ${
          state === 'dragging' ? '' : 'transition-none'
        }`}
        style={{
          left: position.x,
          top: position.y,
          opacity: settings.opacity,
        }}
        onMouseDown={handleMouseDown}
        onClick={handleClick}
      >
        {showParticles && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-[particleFly_1s_ease-out_forwards]"
                style={{
                  width: 8,
                  height: 8,
                  left: '50%',
                  top: '50%',
                  borderRadius: '50%',
                  background: ['#ffd700', '#ff69b4', '#87ceeb', '#98fb98'][i % 4],
                  animationDelay: `${i * 0.1}s`,
                  transform: `rotate(${i * 45}deg) translateY(0)`,
                }}
              />
            ))}
          </div>
        )}

        {celebrateParticles && (
          <div className="absolute inset-0 pointer-events-none overflow-visible">
            {[...Array(20)].map((_, i) => (
              <div
                key={`celebrate-${i}`}
                className="absolute animate-[celebrateParticle_2s_ease-out_forwards]"
                style={{
                  width: i % 3 === 0 ? 10 : 6,
                  height: i % 3 === 0 ? 10 : 6,
                  left: '50%',
                  top: '50%',
                  borderRadius: i % 2 === 0 ? '50%' : '2px',
                  background: ['#ffd700', '#ff69b4', '#87ceeb', '#98fb98', '#ff9f43', '#a29bfe'][i % 6],
                  animationDelay: `${i * 0.08}s`,
                  transform: `rotate(${i * 18}deg) translateY(-20px)`,
                }}
              />
            ))}
            {[...Array(8)].map((_, i) => (
              <div
                key={`star-${i}`}
                className="absolute animate-[celebrateStar_1.5s_ease-out_forwards]"
                style={{
                  left: '50%',
                  top: '50%',
                  animationDelay: `${i * 0.15}s`,
                  transform: `rotate(${i * 45}deg) translateY(-30px)`,
                }}
              >
                <Sparkles className="w-5 h-5 text-yellow-400" />
              </div>
            ))}
            {[...Array(6)].map((_, i) => (
              <div
                key={`heart-${i}`}
                className="absolute animate-[celebrateHeart_2s_ease-out_forwards]"
                style={{
                  left: '50%',
                  top: '50%',
                  animationDelay: `${i * 0.2}s`,
                  transform: `rotate(${-30 + i * 12}deg) translateY(-40px)`,
                }}
              >
                <Heart className="w-4 h-4 text-pink-400 fill-pink-400" />
              </div>
            ))}
          </div>
        )}

        <div 
          className={`relative shadow-xl flex items-center justify-center transition-all duration-300 ${
            state === 'sleeping' ? 'animate-[sleepBreathe_3s_ease-in-out_infinite]' : ''
          } ${state === 'interacting' ? 'animate-[wiggle_0.3s_ease-in-out_infinite]' : ''} ${
            state === 'flying' ? 'animate-[float_2s_ease-in-out_infinite]' : ''
          } ${state === 'celebrating' ? 'animate-[celebrateBounce_0.4s_ease-in-out_infinite]' : ''
          } ${expression === 'laughing' ? 'animate-[laugh_0.3s_ease-in-out_infinite]' : ''}`}
          style={{
            width: settings.size * 1.1,
            height: settings.size * 1.1,
            background: state === 'sleeping' 
              ? 'linear-gradient(180deg, #f8f8f8 0%, #f0f0f0 100%)'
              : state === 'celebrating'
              ? 'linear-gradient(180deg, #fffaf0 0%, #fff0e0 50%, #ffe8d0 100%)'
              : expression === 'shy'
              ? 'linear-gradient(180deg, #fff8f8 0%, #ffe8e8 60%, #ffd8d8 100%)'
              : 'linear-gradient(180deg, #ffffff 0%, #fafafa 50%, #f0f0f0 100%)',
            borderRadius: `${settings.size * 0.6}px`,
            boxShadow: state === 'celebrating'
              ? '0 0 40px rgba(255, 215, 0, 0.7), 0 0 80px rgba(255, 182, 193, 0.4), 0 15px 45px rgba(0,0,0,0.18)'
              : state === 'interacting' || expression === 'starry'
              ? '0 0 30px rgba(255, 215, 0, 0.5), 0 15px 45px rgba(0,0,0,0.18)'
              : '0 12px 36px rgba(0,0,0,0.12), inset 0 -6px 12px rgba(0,0,0,0.05), inset 0 6px 12px rgba(255,255,255,0.4)',
          }}
        >
          <div 
            className="absolute inset-2 rounded-full"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 100%)',
              borderRadius: 'inherit',
            }}
          />

          <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
            <div className="flex gap-2 mb-1" style={{ gap: settings.size * 0.08 }}>
              {renderEye('left')}
              {renderEye('right')}
            </div>

            {renderMouth()}

            {renderCheeks()}

            {renderExpressionDecorations()}
          </div>

          <div 
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-1"
            style={{ gap: settings.size * 0.05 }}
          >
            <div 
              className="rounded-full bg-gray-300"
              style={{ width: settings.size * 0.08, height: settings.size * 0.08 }}
            />
            <div 
              className="rounded-full bg-gray-300"
              style={{ width: settings.size * 0.08, height: settings.size * 0.08 }}
            />
          </div>

          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
            <div 
              className="flex gap-1"
              style={{ gap: settings.size * 0.03 }}
            >
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-full bg-white/40 animate-[wave_0.5s_ease-in-out_infinite]"
                  style={{ 
                    width: settings.size * 0.03, 
                    height: settings.size * 0.06,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {showSpeech && (
          <div 
            className="absolute left-1/2 -translate-x-1/2 mt-2 px-4 py-2 rounded-xl bg-white/95 backdrop-blur-sm shadow-lg animate-fade-in z-20"
            style={{ top: settings.size * 1.3 }}
          >
            <p className="text-gray-800 text-sm font-serif whitespace-nowrap">{speechText}</p>
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white/95 rotate-45" />
          </div>
        )}
      </div>

      <button
        onClick={() => setShowSettings(!showSettings)}
        className="fixed top-20 right-6 z-[100] glass-effect rounded-full w-10 h-10 flex items-center justify-center hover:bg-white/30 transition-all"
        title="精灵设置"
      >
        <Settings className="w-5 h-5 text-white" />
      </button>

      {showSettings && (
        <div className="fixed top-36 right-6 z-[99] glass-effect rounded-2xl p-6 w-80 animate-slide-in-right">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-lg font-bold text-white">精灵设置</h3>
            <button onClick={() => setShowSettings(false)} className="text-white/60 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-white/70 text-sm mb-2">
                <ZoomIn className="w-4 h-4" />
                大小: {settings.size}px
              </label>
              <input
                type="range"
                min="50"
                max="120"
                value={settings.size}
                onChange={(e) => handleSettingChange('size', parseInt(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-full appearance-none cursor-pointer"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-white/70 text-sm mb-2">
                <Eye className="w-4 h-4" />
                透明度: {Math.round(settings.opacity * 100)}%
              </label>
              <input
                type="range"
                min="50"
                max="100"
                value={settings.opacity * 100}
                onChange={(e) => handleSettingChange('opacity', parseInt(e.target.value) / 100)}
                className="w-full h-2 bg-white/20 rounded-full appearance-none cursor-pointer"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-white/70 text-sm mb-2">
                <Move className="w-4 h-4" />
                飞行速度: {settings.speed}x
              </label>
              <input
                type="range"
                min="1"
                max="5"
                value={settings.speed}
                onChange={(e) => handleSettingChange('speed', parseInt(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-full appearance-none cursor-pointer"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-white/70 text-sm mb-2">
                <Sparkles className="w-4 h-4" />
                行为频率: {settings.behaviorFrequency / 1000}秒
              </label>
              <input
                type="range"
                min="1000"
                max="10000"
                step="1000"
                value={settings.behaviorFrequency}
                onChange={(e) => handleSettingChange('behaviorFrequency', parseInt(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-full appearance-none cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-white/70 text-sm">
                <Volume2 className="w-4 h-4" />
                AI互动
              </label>
              <button
                onClick={() => handleSettingChange('enableAI', !settings.enableAI)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  settings.enableAI ? 'bg-ghibli-sunset' : 'bg-white/20'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.enableAI ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-white/70 text-sm">
                {state === 'sleeping' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                {state === 'sleeping' ? '唤醒' : '睡眠'}
              </label>
              <button
                onClick={() => setState(state === 'sleeping' ? 'flying' : 'sleeping')}
                className="px-3 py-1 rounded-full bg-white/10 text-white/70 text-xs hover:bg-white/20 transition-colors"
              >
                {state === 'sleeping' ? '唤醒' : '睡觉'}
              </button>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/10">
            <button
              onClick={() => {
                setSettings(defaultSettings);
                setShowSettings(false);
              }}
              className="w-full py-2 rounded-lg bg-white/10 text-white/70 text-sm hover:bg-white/20 transition-colors"
            >
              恢复默认
            </button>
          </div>
        </div>
      )}

      {settings.enableAI && (
        <button
          onClick={() => setShowChat(!showChat)}
          className="fixed bottom-24 right-6 z-[90] glass-effect rounded-full w-12 h-12 flex items-center justify-center hover:bg-white/30 transition-all hover:scale-110 shadow-xl"
          title="与哇啦哇啦聊天"
        >
          <Heart className="w-6 h-6 text-ghibli-sunset" />
        </button>
      )}

      {showChat && settings.enableAI && (
        <div className="fixed bottom-40 right-6 z-[89] glass-effect rounded-2xl p-4 w-80 animate-slide-up">
          <p className="text-white text-sm font-serif mb-3 text-center">
            <span className="text-xl">✨</span> 哇啦哇啦 <span className="text-xl">✨</span>
          </p>
          <form onSubmit={handleInputSubmit} className="flex gap-2">
            <input
              type="text"
              name="input"
              placeholder="跟我说说话吧~"
              className="flex-1 px-3 py-2 rounded-full bg-white/20 text-white placeholder-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-ghibli-sunset"
              autoComplete="off"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-full bg-ghibli-sunset text-white hover:bg-ghibli-warm transition-colors"
            >
              <Sparkles className="w-4 h-4" />
            </button>
          </form>
          <div className="flex justify-center gap-2 mt-3 flex-wrap">
            {['hello', '可爱', '电影', '音乐'].map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  const response = processInput(tag);
                  setState('interacting');
                  setShowSpeech(true);
                  setShowParticles(true);
                  setSpeechText(response);
                  setTimeout(() => {
                    setState('flying');
                    setShowSpeech(false);
                    setShowParticles(false);
                  }, 3000);
                }}
                className="px-3 py-1 rounded-full bg-white/10 text-white/70 text-xs hover:bg-white/20 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-5px) rotate(2deg); }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        @keyframes laugh {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.02) rotate(-2deg); }
          75% { transform: scale(1.02) rotate(2deg); }
        }
        @keyframes sleepBreathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        @keyframes sleepEye {
          0%, 48%, 52%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        @keyframes wave {
          0%, 100% { transform: scaleY(0.5); }
          50% { transform: scaleY(1); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        @keyframes blink {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(0.1); }
        }
        @keyframes surprisePop {
          0% { transform: scale(0.8); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        @keyframes surpriseMouth {
          0% { transform: scaleY(0.5); }
          50% { transform: scaleY(1.2); }
          100% { transform: scaleY(1); }
        }
        @keyframes happyMouth {
          0% { width: 0.15em; }
          50% { width: 0.25em; }
          100% { width: 0.2em; }
        }
        @keyframes laughMouth {
          0%, 100% { height: 0.15em; }
          50% { height: 0.18em; }
        }
        @keyframes blush {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.9; }
        }
        @keyframes floatUp {
          0% { transform: translateY(0) scale(1); opacity: 0.8; }
          100% { transform: translateY(-20px) scale(0); opacity: 0; }
        }
        @keyframes particleFly {
          0% { transform: rotate(var(--rotation)) translateY(0); opacity: 1; }
          100% { transform: rotate(var(--rotation)) translateY(-50px); opacity: 0; }
        }
        @keyframes celebrateBounce {
          0%, 100% { transform: translateY(0) scale(1); }
          25% { transform: translateY(-8px) scale(1.05); }
          50% { transform: translateY(0) scale(1); }
          75% { transform: translateY(-5px) scale(1.03); }
        }
        @keyframes celebrateParticle {
          0% { transform: scale(0) translateY(0); opacity: 1; }
          50% { transform: scale(1.2) translateY(-60px); opacity: 1; }
          100% { transform: scale(0.5) translateY(-120px); opacity: 0; }
        }
        @keyframes celebrateStar {
          0% { transform: scale(0) translateY(0) rotate(0deg); opacity: 1; }
          50% { transform: scale(1.3) translateY(-80px) rotate(180deg); opacity: 1; }
          100% { transform: scale(0.8) translateY(-150px) rotate(360deg); opacity: 0; }
        }
        @keyframes celebrateHeart {
          0% { transform: scale(0) translateY(0); opacity: 1; }
          30% { transform: scale(1.2) translateY(-50px); opacity: 1; }
          100% { transform: scale(0.6) translateY(-130px); opacity: 0; }
        }
      `}</style>
    </>
  );
};
