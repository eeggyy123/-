import React, { useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, X, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { Movie } from '../data/movies';

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
  duration: string;
  movieId: string;
}

const defaultVideos: Video[] = [
  {
    id: '1',
    title: '天空之城 - 经典主题曲MV',
    thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Castle%20in%20the%20Sky%20anime%20scene%20with%20floating%20castle%20Studio%20Ghibli%20style&image_size=landscape_16_9',
    url: 'https://www.youtube.com/embed/4G5iWqL82lY',
    duration: '4:32',
    movieId: 'castle-in-the-sky',
  },
  {
    id: '2',
    title: '千与千寻 - 主题曲《Always With Me》',
    thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Spirited%20Away%20Chihiro%20anime%20scene%20Studio%20Ghibli%20style&image_size=landscape_16_9',
    url: 'https://www.youtube.com/embed/Tx788298eJc',
    duration: '5:18',
    movieId: 'spirited-away',
  },
  {
    id: '3',
    title: '哈尔的移动城堡 - 人生的旋转木马',
    thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Howls%20Moving%20Castle%20walking%20castle%20Studio%20Ghibli%20style&image_size=landscape_16_9',
    url: 'https://www.youtube.com/embed/3y0G9x2R9sM',
    duration: '6:45',
    movieId: 'howls-moving-castle',
  },
  {
    id: '4',
    title: '龙猫 - 风之甬道',
    thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=My%20Neighbor%20Totoro%20forest%20scene%20Studio%20Ghibli%20style&image_size=landscape_16_9',
    url: 'https://www.youtube.com/embed/HWf1t22Dn8M',
    duration: '3:56',
    movieId: 'my-neighbor-totoro',
  },
  {
    id: '5',
    title: '幽灵公主 - 主题曲',
    thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Princess%20Mononoke%20forest%20spirits%20Studio%20Ghibli%20style&image_size=landscape_16_9',
    url: 'https://www.youtube.com/embed/4K5A67F9dDY',
    duration: '5:23',
    movieId: 'princess-mononoke',
  },
  {
    id: '6',
    title: '悬崖上的金鱼姬 - 主题曲',
    thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Ponyo%20goldfish%20girl%20Studio%20Ghibli%20style&image_size=landscape_16_9',
    url: 'https://www.youtube.com/embed/74qk1jE5K2M',
    duration: '4:12',
    movieId: 'ponyo',
  },
];

interface VideoSectionProps {
  movie?: Movie;
}

export const VideoSection: React.FC<VideoSectionProps> = ({ movie }) => {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [showAddVideo, setShowAddVideo] = useState(false);
  const [videos, setVideos] = useState<Video[]>(defaultVideos);

  const filteredVideos = movie 
    ? videos.filter(v => v.movieId === movie.id) 
    : videos;

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (!isMuted) {
      setVolume(0);
    } else {
      setVolume(0.7);
    }
  };

  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const newVideo: Video = {
      id: Date.now().toString(),
      title: formData.get('title') as string,
      thumbnail: formData.get('thumbnail') as string,
      url: formData.get('url') as string,
      duration: formData.get('duration') as string,
      movieId: formData.get('movieId') as string,
    };
    setVideos([...videos, newVideo]);
    setShowAddVideo(false);
  };

  const handleClose = () => {
    setSelectedVideo(null);
    setIsPlaying(false);
  };

  const prevVideo = () => {
    if (!selectedVideo) return;
    const index = filteredVideos.findIndex(v => v.id === selectedVideo.id);
    if (index > 0) {
      setSelectedVideo(filteredVideos[index - 1]);
    } else {
      setSelectedVideo(filteredVideos[filteredVideos.length - 1]);
    }
  };

  const nextVideo = () => {
    if (!selectedVideo) return;
    const index = filteredVideos.findIndex(v => v.id === selectedVideo.id);
    if (index < filteredVideos.length - 1) {
      setSelectedVideo(filteredVideos[index + 1]);
    } else {
      setSelectedVideo(filteredVideos[0]);
    }
  };

  return (
    <div className="glass-effect rounded-3xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-3">
          <Play className="w-6 h-6 text-ghibli-sunset" />
          精彩视频
        </h2>
        <button
          onClick={() => setShowAddVideo(!showAddVideo)}
          className="px-4 py-2 rounded-full bg-ghibli-sunset/20 text-ghibli-sunset hover:bg-ghibli-sunset/30 transition-all text-sm font-semibold"
        >
          + 添加视频
        </button>
      </div>

      {showAddVideo && (
        <form onSubmit={handleAddVideo} className="space-y-4 mb-6 p-4 rounded-xl bg-white/5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-white/60 text-sm mb-1 block">视频标题</label>
              <input
                type="text"
                name="title"
                required
                className="w-full px-3 py-2 rounded-lg bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-ghibli-sunset"
                placeholder="视频标题"
              />
            </div>
            <div>
              <label className="text-white/60 text-sm mb-1 block">时长</label>
              <input
                type="text"
                name="duration"
                className="w-full px-3 py-2 rounded-lg bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-ghibli-sunset"
                placeholder="4:30"
              />
            </div>
          </div>
          <div>
            <label className="text-white/60 text-sm mb-1 block">视频URL (YouTube embed)</label>
            <input
              type="url"
              name="url"
              required
              className="w-full px-3 py-2 rounded-lg bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-ghibli-sunset"
              placeholder="https://www.youtube.com/embed/..."
            />
          </div>
          <div>
            <label className="text-white/60 text-sm mb-1 block">缩略图URL</label>
            <input
              type="url"
              name="thumbnail"
              className="w-full px-3 py-2 rounded-lg bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-ghibli-sunset"
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="text-white/60 text-sm mb-1 block">关联电影ID</label>
            <select
              name="movieId"
              className="w-full px-3 py-2 rounded-lg bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-ghibli-sunset"
            >
              <option value="">全部</option>
              <option value="castle-in-the-sky">天空之城</option>
              <option value="spirited-away">千与千寻</option>
              <option value="howls-moving-castle">哈尔的移动城堡</option>
              <option value="my-neighbor-totoro">龙猫</option>
              <option value="princess-mononoke">幽灵公主</option>
              <option value="ponyo">悬崖上的金鱼姬</option>
              <option value="nausicaa">风之谷</option>
              <option value="kiki-delivery-service">魔女宅急便</option>
              <option value="porco-rosso">红猪</option>
              <option value="the-wind-rises">起风了</option>
              <option value="only-yesterday">岁月的童话</option>
              <option value="whisper-of-the-heart">侧耳倾听</option>
              <option value="the-boy-and-the-heron">你想活出怎么样的人生</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 px-4 py-2 rounded-lg bg-ghibli-sunset text-white hover:bg-ghibli-warm transition-colors"
            >
              添加视频
            </button>
            <button
              type="button"
              onClick={() => setShowAddVideo(false)}
              className="px-4 py-2 rounded-lg bg-white/10 text-white/70 hover:bg-white/20 transition-colors"
            >
              取消
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVideos.map((video) => (
          <div
            key={video.id}
            onClick={() => handleVideoClick(video)}
            className="relative rounded-xl overflow-hidden cursor-pointer group"
          >
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full aspect-video object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all hover:scale-110">
                <Play className="w-7 h-7 text-white ml-1" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
              <h4 className="text-white font-semibold text-sm line-clamp-2">{video.title}</h4>
              <div className="flex items-center justify-between mt-1">
                <span className="text-white/60 text-xs">{video.duration}</span>
                <ExternalLink className="w-3 h-3 text-white/60" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedVideo && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[200] animate-fade-in" onClick={handleClose}>
          <div className="w-full max-w-4xl mx-4 aspect-video rounded-2xl overflow-hidden relative" onClick={(e) => e.stopPropagation()}>
            <iframe
              src={selectedVideo.url}
              title={selectedVideo.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <button
              onClick={prevVideo}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={nextVideo}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <div className="absolute bottom-4 left-4 right-4 flex items-center gap-4">
              <button
                onClick={togglePlay}
                className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>

              <div className="flex-1 flex items-center gap-2">
                <button onClick={toggleMute} className="text-white">
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => {
                    setVolume(parseFloat(e.target.value));
                    setIsMuted(parseFloat(e.target.value) === 0);
                  }}
                  className="flex-1 h-1 bg-white/30 rounded-full appearance-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:w-3
                    [&::-webkit-slider-thumb]:h-3
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-white"
                />
              </div>

              <button className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all">
                <Maximize className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
