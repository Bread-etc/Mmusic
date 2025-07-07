import { Button } from "@/components/ui/button";
import { NeteaseSongItem, NeteaseSongQuality } from "@/types/NeteaseTypes";
import { usePlayerStore } from "@/store/player";
import { useAudioPlayer, SongInfo } from "./useAudioPlayer";
import { songDetailNetease, songUrlNetease } from "@/lib/music/neteaseService";
import {
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  Shuffle,
  Heart,
  HeartOff,
  Repeat1,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

function Dock() {
  const { playlist, currentIndex, isPlaying, play, pause, playNext, playPrev } = usePlayerStore();

  // 使用 useAudioPlayer Hook 进行音频管理
  const {
    audioState,
    playlist: audioPlaylist,
    currentSong,
    isLiked,
    togglePlay,
    playPrevious,
    playNext: audioPlayNext,
    setPlaylistSongs,
    setVolume,
    toggleMute,
    setProgress,
    toggleShuffle,
    toggleRepeat,
    toggleLike,
    formatTime,
    getProgressPercentage,
    getVolumePercentage,
    handleLoadedMetadata,
    handleTimeUpdate,
    handleAudioEnded,
    handleAudioError,
  } = useAudioPlayer();


  const audioRef = useRef<HTMLAudioElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isVolumeVisible, setIsVolumeVisible] = useState(false);

  const currentNeteaseSong = playlist[currentIndex];

  /**
   * 将 NeteaseSongItem 转换为 SongInfo 格式
   * @param neteaseSong 网易云歌曲数据
   * @param audioUrl 播放URL
   * @returns SongInfo 对象
   */
  const convertToSongInfo = async (neteaseSong: NeteaseSongItem, audioUrl: string): Promise<SongInfo> => {
    const detailRes = await songDetailNetease(neteaseSong.id.toString());
    const songDetail = detailRes.success ? detailRes.data.songs[0] : neteaseSong;

    return {
      id: neteaseSong.id.toString(),
      title: neteaseSong.name,
      artist: neteaseSong.artists?.map(a => a.name).join(", ") || "未知艺术家",
      album: songDetail.al?.name || neteaseSong.album?.name || "未知专辑", // 修复：使用可选链
      cover: songDetail.al?.picUrl || neteaseSong.album?.picUrl || "", // 修复：使用可选链
      url: audioUrl,
      duration: neteaseSong.duration ? Math.floor(neteaseSong.duration / 1000) : 0,
      source: "netease",
      quality: "standard"
    }
  }

  /**
   * 获取歌曲播放URL
   * @param song 网易云音乐歌曲数据
   * @returns 播放URL或undefined
   */
  const getSongUrl = async (song: NeteaseSongItem): Promise<string | undefined> => {
    try {
      const quality: NeteaseSongQuality = "standard";
      const urlRes = await songUrlNetease(song.id.toString(), quality);

      if (urlRes.success && urlRes.data.data?.[0]?.url) {
        return urlRes.data.data[0].url;
      }
      return undefined;
    } catch (error) {
      console.error("获取歌曲URL失败:", error);
      return undefined;
    }
  }

  /**
   * 处理歌曲点击播放
   * 当用户点击播放按钮或切换歌曲时调用
   */
  const handlePlaySong = async () => {
    if (!currentNeteaseSong) return;

    try {
      // 获取播放URL
      const audioUrl = await getSongUrl(currentNeteaseSong);
      if (!audioUrl) {
        console.error("无法获取歌曲播放链接");
        return;
      }

      // 转换为SongInfo格式
      const songInfo = await convertToSongInfo(currentNeteaseSong, audioUrl);

      // 设置播放列表（这里只设置当前歌曲，您可以根据需要设置整个播放列表）
      setPlaylistSongs([songInfo], 0);

      // 开始播放
      if (!isPlaying) {
        togglePlay();
      }
    } catch (error) {
      console.error("播放歌曲失败:", error);
    }
  };

  /**
   * 处理上一首
   */
  const handlePrevious = () => {
    playPrev();
    setTimeout(() => {
      handlePlaySong();
    }, 100);
  };

  /**
   * 处理下一首
   */
  const handleNext = () => {
    playNext(); // 调用store中的下一首方法
    // 播放新歌曲
    setTimeout(() => {
      handlePlaySong();
    }, 100);
  };

  /**
   * 处理进度条拖拽
   */
  const handleProgressMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleProgressClick(e);
  };

  const handleProgressClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = ((e.clientX - rect.left) / rect.width) * 100;
    setProgress(Math.max(0, Math.min(100, percent)));
  };

  const handleProgressMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    const progressBar = document.getElementById('progress-bar');
    if (!progressBar) return;

    const rect = progressBar.getBoundingClientRect();
    const percent = ((e.clientX - rect.left) / rect.width) * 100;
    setProgress(Math.max(0, Math.min(100, percent)));
  };

  const handleProgressMouseUp = () => {
    setIsDragging(false);
  };

  /**
 * 处理音量调节
 */
  const handleVolumeChange = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = ((e.clientX - rect.left) / rect.width);
    setVolume(Math.max(0, Math.min(1, percent)));
  };

  // 监听全局鼠标事件（用于进度条拖拽）
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleProgressMouseMove);
      document.addEventListener('mouseup', handleProgressMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleProgressMouseMove);
        document.removeEventListener('mouseup', handleProgressMouseUp);
      };
    }
  }, [isDragging]);

  // 同步音频元素状态
  useEffect(() => {
    if (!audioRef.current || !currentSong) return;

    const audio = audioRef.current;
    audio.src = currentSong.url;

    if (audioState.isPlaying) {
      audio.play().catch(console.error);
    } else {
      audio.pause();
    }
  }, [audioState.isPlaying, currentSong]);

  // 同步音频元素音量
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = audioState.isMuted ? 0 : audioState.volume;
  }, [audioState.volume, audioState.isMuted]);

  // 同步音频元素播放时间
  useEffect(() => {
    if (!audioRef.current || isDragging) return;
    audioRef.current.currentTime = audioState.currentTime;
  }, [audioState.currentTime, isDragging]);

  // 当store中的歌曲变化时，自动播放新歌曲
  useEffect(() => {
    if (currentNeteaseSong) {
      handlePlaySong();
    }
  }, [currentNeteaseSong]);

  return (
    <div className="h-[15%] flex items-center w-full px-6 bg-white/80 dark:bg-black/80 backdrop-blur-md border-t border-gray-200 dark:border-gray-700">
      {/* 隐藏的音频元素 */}
      <audio
        ref={audioRef}
        onLoadedMetadata={(e) => handleLoadedMetadata(e.currentTarget.duration)}
        onTimeUpdate={(e) => handleTimeUpdate(e.currentTarget.currentTime)}
        onEnded={handleAudioEnded}
        onError={() => handleAudioError("音频加载失败")}
        preload="auto"
      />

      {/* 左侧：歌曲信息 */}
      <div className="flex items-center flex-1 min-w-0 mr-4">
        {/* 专辑封面 */}
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0 mr-3">
          {currentSong?.cover ? (
            <img
              src={currentSong.cover}
              alt={currentSong.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex-center text-gray-400">
              <Heart className="w-6 h-6" />
            </div>
          )}
        </div>

        {/* 歌曲信息 */}
        <div className="flex-1 min-w-0">
          {currentSong ? (
            <>
              <div className="font-bold text-sm theme-text truncate">
                {currentSong.title}
              </div>
              <div className="text-xs text-gray-500 truncate">
                {currentSong.artist}
              </div>
            </>
          ) : (
            <div className="text-gray-400 text-sm">暂无播放</div>
          )}
        </div>

        {/* 收藏按钮 */}
        <Button
          size="icon"
          variant="ghost"
          className="w-8 h-8 ml-2 flex-shrink-0"
          onClick={toggleLike}
        >
          {isLiked ? (
            <Heart className="w-4 h-4 text-red-500 fill-current" />
          ) : (
            <HeartOff className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* 中间：播放控制区域 */}
      <div className="flex flex-col items-center flex-1 max-w-md mx-4">
        {/* 播放控制按钮 */}
        <div className="flex items-center gap-2 mb-2">
          {/* 随机播放 */}
          <Button
            size="icon"
            variant="ghost"
            className={`w-8 h-8 ${audioState.isShuffled ? 'text-blue-500' : ''}`}
            onClick={toggleShuffle}
          >
            <Shuffle className="w-4 h-4" />
          </Button>

          {/* 上一首 */}
          <Button size="icon" variant="ghost" className="w-8 h-8" onClick={handlePrevious}>
            <SkipBack className="w-4 h-4" />
          </Button>

          {/* 播放/暂停 */}
          <Button
            size="icon"
            variant="ghost"
            className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all"
            onClick={audioState.isPlaying ? togglePlay : handlePlaySong}
          >
            {audioState.isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" />
            )}
          </Button>

          {/* 下一首 */}
          <Button size="icon" variant="ghost" className="w-8 h-8" onClick={handleNext}>
            <SkipForward className="w-4 h-4" />
          </Button>

          {/* 循环模式 */}
          <Button
            size="icon"
            variant="ghost"
            className={`w-8 h-8 ${audioState.repeatMode !== 'none' ? 'text-blue-500' : ''}`}
            onClick={toggleRepeat}
          >
            {audioState.repeatMode === 'one' ? (
              <Repeat1 className="w-4 h-4" />
            ) : (
              <Repeat className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* 进度条 */}
        <div className="flex items-center gap-2 w-full">
          <span className="text-xs text-gray-500 w-10 text-right">
            {formatTime(audioState.currentTime)}
          </span>
          <div
            id="progress-bar"
            className="flex-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer relative"
            onClick={handleProgressClick}
            onMouseDown={handleProgressMouseDown}
          >
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-150"
              style={{ width: `${getProgressPercentage()}%` }}
            />
            <div
              className="absolute top-1/2 transform -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full opacity-0 hover:opacity-100 transition-opacity"
              style={{ left: `${getProgressPercentage()}%`, marginLeft: '-6px' }}
            />
          </div>
          <span className="text-xs text-gray-500 w-10">
            {formatTime(audioState.duration)}
          </span>
        </div>
      </div>

      {/* 右侧：音量控制 */}
      <div className="flex items-center flex-1 justify-end">
        <div
          className="flex items-center gap-2 relative"
          onMouseEnter={() => setIsVolumeVisible(true)}
          onMouseLeave={() => setIsVolumeVisible(false)}
        >
          <Button
            size="icon"
            variant="ghost"
            className="w-8 h-8"
            onClick={toggleMute}
          >
            {audioState.isMuted || audioState.volume === 0 ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </Button>

          {/* 音量条 */}
          <div
            className={`w-20 h-1 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer transition-all duration-300 ${isVolumeVisible ? 'opacity-100' : 'opacity-0'
              }`}
            onClick={handleVolumeChange}
          >
            <div
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${getVolumePercentage()}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dock;
