import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { AudioWaveform } from './AudioWaveform.jsx';

export const AudioPlayer = ({ audioUrl, onEnded }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
        setCurrentTime(audio.currentTime);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      if (onEnded) onEnded();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [onEnded]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(err => {
        console.warn('Playback blocked:', err);
      });
    }
  };

  const handleReplay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    audio.play().then(() => setIsPlaying(true)).catch(() => {});
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    audio.currentTime = percentage * duration;
  };

  const formatTime = (secs) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!audioUrl) return null;

  return (
    <div className="flex items-center gap-3 bg-purple-50/70 border border-purple-100 rounded-xl px-3 py-2 text-xs text-purple-900 mt-2 max-w-sm">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      {/* Play/Pause Button */}
      <button
        onClick={togglePlay}
        className="w-7 h-7 rounded-full bg-violet-600 text-white flex items-center justify-center hover:bg-violet-700 transition-colors shrink-0 shadow-xs"
        title={isPlaying ? 'Pause' : 'Play Audio'}
      >
        {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
      </button>

      {/* Replay Button */}
      <button
        onClick={handleReplay}
        className="text-purple-600 hover:text-purple-800 p-1 rounded transition-colors shrink-0"
        title="Replay from start"
      >
        <RotateCcw className="w-3.5 h-3.5" />
      </button>

      {/* Progress Bar & Wave */}
      <div className="flex-1 flex flex-col justify-center min-w-0">
        <div
          onClick={handleSeek}
          className="h-1.5 bg-purple-200/80 rounded-full cursor-pointer relative overflow-hidden"
        >
          <div
            className="h-full bg-violet-600 rounded-full transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[10px] text-purple-600 mt-1">
          <span>{formatTime(currentTime)}</span>
          <AudioWaveform isPlaying={isPlaying} barCount={6} className="h-2 opacity-80" />
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
};
