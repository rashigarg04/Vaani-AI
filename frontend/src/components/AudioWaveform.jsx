import React from 'react';

export const AudioWaveform = ({
  levels = [],
  isRecording = false,
  isPlaying = false,
  barCount = 16,
  className = ''
}) => {
  // If actual frequency levels from useAudioRecorder are provided
  if (isRecording && levels.length > 0) {
    return (
      <div className={`flex items-center justify-center gap-1.5 h-12 px-4 ${className}`}>
        {levels.map((lvl, idx) => (
          <div
            key={idx}
            className="w-1.5 bg-gradient-to-t from-violet-600 to-purple-400 rounded-full transition-all duration-75"
            style={{
              height: `${Math.max(12, lvl)}%`,
              minHeight: '6px'
            }}
          />
        ))}
      </div>
    );
  }

  // Active playing wave bars
  if (isPlaying) {
    const heights = [30, 60, 95, 45, 80, 50, 70, 90, 40, 85, 60, 35];
    return (
      <div className={`flex items-center justify-center gap-1 h-8 ${className}`}>
        {heights.slice(0, barCount).map((h, i) => (
          <div
            key={i}
            className="w-1 bg-violet-600 rounded-full animate-pulse"
            style={{
              height: `${h}%`,
              animationDelay: `${i * 100}ms`,
              animationDuration: '800ms'
            }}
          />
        ))}
      </div>
    );
  }

  // Idle state static visualizer
  return (
    <div className={`flex items-center justify-center gap-1.5 h-6 opacity-30 ${className}`}>
      {[20, 35, 50, 65, 45, 30, 20, 40, 60, 30, 15].map((h, i) => (
        <div
          key={i}
          className="w-1 bg-gray-400 rounded-full"
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  );
};
