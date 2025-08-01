import { useState, useEffect, useRef } from 'react';

interface AudioState {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  canPlay: boolean;
  showAudioPrompt: boolean;
  isLoading: boolean;
  hasError: boolean;
}

export function useAudio(src: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [state, setState] = useState<AudioState>({
    isPlaying: false,
    isMuted: false,
    volume: 0.2, // Default volume at 20%
    canPlay: false,
    showAudioPrompt: true,
    isLoading: true,
    hasError: false
  });

  useEffect(() => {
    console.log('🎵 Initializing audio with src:', src);
    
    // Create audio element
    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = state.volume;
    audio.preload = 'auto';
    
    audioRef.current = audio;

    // Audio event handlers
    const handleLoadStart = () => {
      console.log('🎵 Audio loading started');
      setState(prev => ({ ...prev, isLoading: true, hasError: false }));
    };

    const handleCanPlay = () => {
      console.log('🎵 Audio can play');
      setState(prev => ({ ...prev, canPlay: true, isLoading: false }));
    };

    const handlePlay = () => {
      console.log('🎵 Audio started playing');
      setState(prev => ({ ...prev, isPlaying: true }));
    };

    const handlePause = () => {
      console.log('🎵 Audio paused');
      setState(prev => ({ ...prev, isPlaying: false }));
    };

    const handleError = (event: Event) => {
      const audioElement = event.target as HTMLAudioElement;
      console.error('🎵 Audio error:', audioElement.error);
      console.error('🎵 Audio network state:', audioElement.networkState);
      console.error('🎵 Audio ready state:', audioElement.readyState);
      setState(prev => ({ 
        ...prev, 
        canPlay: false, 
        isLoading: false, 
        hasError: true 
      }));
    };

    const handleLoad = () => {
      console.log('🎵 Audio loaded successfully');
      setState(prev => ({ ...prev, isLoading: false }));
    };

    // Add all event listeners
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('error', handleError);
    audio.addEventListener('load', handleLoad);

    // Try to load the audio
    audio.load();

    return () => {
      console.log('🎵 Cleaning up audio');
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('load', handleLoad);
      audio.pause();
      audio.src = '';
    };
  }, [src]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = state.isMuted ? 0 : state.volume;
    }
  }, [state.volume, state.isMuted]);

  const play = async () => {
    console.log('🎵 Attempting to play audio');
    if (audioRef.current && state.canPlay) {
      try {
        console.log('🎵 Audio element ready, calling play()');
        console.log('🎵 Audio state before play:', {
          readyState: audioRef.current.readyState,
          networkState: audioRef.current.networkState,
          paused: audioRef.current.paused,
          currentTime: audioRef.current.currentTime
        });
        
        await audioRef.current.play();
        console.log('🎵 Audio play() successful');
        setState(prev => ({ ...prev, showAudioPrompt: false }));
      } catch (error) {
        console.error('🎵 Audio autoplay blocked by browser:', error);
        // Don't set error state for autoplay policy violations
        // The audio should still work on user interaction
        console.log('🎵 This is expected behavior - audio will work on user interaction');
      }
    } else {
      console.warn('🎵 Cannot play audio:', { 
        hasAudioRef: !!audioRef.current, 
        canPlay: state.canPlay,
        isLoading: state.isLoading,
        hasError: state.hasError
      });
    }
  };

  const pause = () => {
    console.log('🎵 Pausing audio');
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const togglePlay = async () => {
    console.log('🎵 Toggling audio play/pause');
    if (state.isPlaying) {
      pause();
    } else {
      await play();
    }
  };

  const toggleMute = () => {
    console.log('🎵 Toggling audio mute');
    setState(prev => ({ ...prev, isMuted: !prev.isMuted }));
  };

  const setVolume = (volume: number) => {
    setState(prev => ({ ...prev, volume: Math.max(0, Math.min(1, volume)) }));
  };

  const dismissAudioPrompt = () => {
    console.log('🎵 Dismissing audio prompt');
    setState(prev => ({ ...prev, showAudioPrompt: false }));
  };

  return {
    ...state,
    play,
    pause,
    togglePlay,
    toggleMute,
    setVolume,
    dismissAudioPrompt
  };
}