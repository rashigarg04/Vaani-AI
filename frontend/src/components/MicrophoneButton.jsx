import React from 'react';
import { Mic, Square, Loader2, Volume2, Sparkles, AlertCircle } from 'lucide-react';
import { useAudioRecorder } from '../hooks/useAudioRecorder.js';
import { useChat } from '../context/ChatContext.jsx';
import { AudioWaveform } from './AudioWaveform.jsx';

export const MicrophoneButton = () => {
  const {
    isRecording,
    recordingDuration,
    audioLevels,
    permissionStatus,
    errorMessage: recorderError,
    startRecording,
    stopRecording,
    cancelRecording,
    clearError
  } = useAudioRecorder();

  const {
    sendAudioRecording,
    isProcessing,
    processingStage,
    transcriptionPreview,
    currentlyPlayingId,
    error: chatError,
    clearError: clearChatError
  } = useChat();

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleMicClick = async () => {
    if (isRecording) {
      // User requested stop
      const result = await stopRecording();
      if (result && result.blob) {
        await sendAudioRecording(result.blob);
      }
    } else {
      if (isProcessing) return;
      clearError();
      clearChatError();
      await startRecording();
    }
  };

  const activeError = recorderError || chatError;

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {/* Error alert pill */}
      {activeError && (
        <div className="mb-4 max-w-md w-full bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-xl text-xs flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{activeError}</span>
          </div>
          <button
            onClick={() => {
              clearError();
              clearChatError();
            }}
            className="text-red-500 hover:text-red-800 font-bold ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Dynamic Processing Status Indicator */}
      <div className="h-7 mb-2 flex items-center justify-center">
        {isRecording && (
          <div className="flex items-center gap-2 text-xs font-medium text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-200/60 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
            <span>Recording... {formatDuration(recordingDuration)}</span>
          </div>
        )}

        {isProcessing && (
          <div className="flex items-center gap-2 text-xs font-medium text-violet-700 bg-violet-50 px-3 py-1 rounded-full border border-violet-200">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-violet-600" />
            <span>
              {processingStage === 'transcribing' && 'Transcribing with Gnani Prisma...'}
              {processingStage === 'thinking' && 'Reasoning & generating answer...'}
              {processingStage === 'synthesizing' && 'Synthesizing voice with Gnani Timbre...'}
              {processingStage === 'speaking' && 'Speaking response...'}
              {processingStage === 'idle' && 'Processing...'}
            </span>
          </div>
        )}

        {!isRecording && !isProcessing && (
          <span className="text-xs text-gray-400 font-normal">
            Click microphone and speak in Hindi, English, or Hinglish
          </span>
        )}
      </div>

      {/* Waveform while recording */}
      {isRecording && (
        <div className="w-64 max-w-full my-2">
          <AudioWaveform levels={audioLevels} isRecording={true} />
        </div>
      )}

      {/* Transcription Preview Bubble */}
      {transcriptionPreview && (
        <div className="mb-3 max-w-lg bg-purple-50/80 border border-purple-200 text-purple-900 px-4 py-2 rounded-2xl text-xs sm:text-sm text-center shadow-xs">
          <span className="text-[10px] uppercase font-bold text-purple-600 block mb-0.5">Heard Speech:</span>
          "{transcriptionPreview}"
        </div>
      )}

      {/* Big Animated Circular Microphone Button */}
      <div className="relative flex items-center justify-center">
        {/* Animated glowing wave rings while recording */}
        {isRecording && (
          <>
            <span className="absolute w-28 h-28 rounded-full bg-red-400/20 animate-ping" />
            <span className="absolute w-36 h-36 rounded-full bg-violet-400/10 animate-pulse" />
          </>
        )}

        {isProcessing && (
          <span className="absolute w-24 h-24 rounded-full border-2 border-dashed border-violet-400 animate-spin" />
        )}

        <button
          onClick={handleMicClick}
          disabled={isProcessing}
          aria-label={isRecording ? 'Stop recording' : 'Start voice recording'}
          className={`relative z-10 w-20 h-20 sm:w-22 sm:h-22 rounded-full flex items-center justify-center transition-all duration-300 transform active:scale-95 shadow-lg ${
            isRecording
              ? 'bg-gradient-to-tr from-red-600 to-rose-500 text-white shadow-red-500/30 scale-105'
              : isProcessing
              ? 'bg-violet-100 text-violet-400 cursor-not-allowed shadow-none'
              : 'bg-gradient-to-tr from-violet-600 to-purple-600 text-white hover:from-violet-700 hover:to-purple-700 shadow-purple-500/30 hover:scale-105'
          }`}
        >
          {isRecording ? (
            <Square className="w-8 h-8 fill-current" />
          ) : isProcessing ? (
            <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
          ) : (
            <Mic className="w-9 h-9" />
          )}
        </button>
      </div>

      {/* Actions below button */}
      <div className="mt-3 flex items-center gap-3">
        {isRecording ? (
          <button
            onClick={cancelRecording}
            className="text-xs text-gray-500 hover:text-red-600 px-3 py-1 rounded-md hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
        ) : (
          <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
            <span className={`w-1.5 h-1.5 rounded-full ${permissionStatus === 'granted' ? 'bg-emerald-500' : 'bg-gray-300'}`} />
            <span>{permissionStatus === 'granted' ? 'Microphone ready' : 'Tap to start recording'}</span>
          </div>
        )}
      </div>
    </div>
  );
};
