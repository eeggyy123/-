import React, { useEffect, useRef } from 'react';
import { Film, Sparkles } from 'lucide-react';
import { audioManager, useAudioStore } from '../store/audioStore';

export const SummerCinema: React.FC = () => {
  const pausedMusicForVideo = useRef(false);

  const handleVideoPlay = () => {
    if (pausedMusicForVideo.current) return;
    if (useAudioStore.getState().isPlaying) {
      pausedMusicForVideo.current = true;
      audioManager.pause();
    }
  };

  const resumeMusic = () => {
    if (!pausedMusicForVideo.current) return;
    pausedMusicForVideo.current = false;
    audioManager.resume();
  };

  useEffect(() => () => resumeMusic(), []);

  return (
    <section id="summer-cinema" className="summer-cinema relative overflow-hidden border-b border-white/15 px-4 pb-20 pt-40 text-white md:px-8 md:py-20" aria-label="宫崎骏的夏天放映室">
      <div className="relative mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="mb-3 flex items-center gap-2 text-xs tracking-[0.22em] text-amber-100/75">
              <Sparkles className="h-4 w-4" />
              A SUMMER WITH THE WIND
            </p>
            <h2 className="font-serif text-4xl font-semibold md:text-5xl">宫崎骏的夏天</h2>
          </div>
          <p className="max-w-md font-serif text-sm leading-7 text-white/58 md:text-right">
            云影越过屋檐，蝉声停在风里。银幕替这个夏天保存了一段不会褪色的光。
          </p>
        </header>

        <div className="summer-cinema-frame">
          <div className="summer-film-strip summer-film-strip-top" aria-hidden="true" />
          <div className="summer-cinema-screen">
            <video
              src="/videos/宫崎骏的夏天.mp4"
              className="h-full w-full object-contain"
              controls
              preload="metadata"
              playsInline
              onPlay={handleVideoPlay}
              onEnded={resumeMusic}
            >
              你的浏览器不支持 HTML5 视频播放。
            </video>
            <div className="summer-screen-light" aria-hidden="true" />
          </div>
          <div className="summer-film-strip summer-film-strip-bottom" aria-hidden="true" />

          <div className="summer-cinema-plaque">
            <Film className="h-5 w-5 text-amber-200" />
            <div>
              <p className="font-serif text-base font-semibold">风经过的放映室</p>
              <p className="mt-0.5 text-xs tracking-[0.16em] text-white/45">GHIBLI SUMMER REEL</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
