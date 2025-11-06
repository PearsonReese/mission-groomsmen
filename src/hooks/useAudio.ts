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
  const defaultSrcRef = useRef(src);
  const currentSrcRef = useRef(src);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [state, setState] = useState<AudioState>({
    isPlaying: false,
    isMuted: false,
    volume: 0.1, // Default volume at 10%
    canPlay: false,
    showAudioPrompt: true,
    isLoading: true,
    hasError: false
  });

  useEffect(() => {
    const initialSrc = defaultSrcRef.current;
    console.log('🎵 Initializing audio with src:', initialSrc);
    
    // Create audio element
    const audio = new Audio(initialSrc);
    audio.loop = true;
    audio.volume = state.volume;
    audio.preload = 'auto';
    
    // iOS-specific audio settings
    (audio as any).playsInline = true; // Prevents fullscreen video on iOS
    (audio as any).webkitPlaysinline = true; // Legacy iOS support
    
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
  }, []);

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
    
    // Force volume update immediately for mobile
    if (audioRef.current) {
      audioRef.current.volume = state.isMuted ? state.volume : 0;
    }
  };

  const setVolume = (volume: number) => {
    setState(prev => ({ ...prev, volume: Math.max(0, Math.min(1, volume)) }));
  };

  const dismissAudioPrompt = () => {
    console.log('🎵 Dismissing audio prompt');
    setState(prev => ({ ...prev, showAudioPrompt: false }));
  };

  const setSource = async (
    newSrc: string,
    options: { autoplay?: boolean; fallbackSrc?: string } = {}
  ): Promise<boolean> => {
    const audioElement = audioRef.current;
    if (!audioElement) {
      console.warn('🎵 Cannot switch audio source: audio element not ready');
      return false;
    }

    const requestedSrc = newSrc || defaultSrcRef.current;
    const fallbackSrc = options.fallbackSrc ?? defaultSrcRef.current;

    const loadSource = (source: string, usedFallback: boolean): Promise<boolean> => {
      return new Promise(resolve => {
        console.log('🎵 Switching audio source to:', source);

        const cleanupListeners = () => {
          audioElement.removeEventListener('canplay', handleCanPlayOnce);
          audioElement.removeEventListener('error', handleErrorOnce);
        };

        const handleCanPlayOnce = async () => {
          cleanupListeners();
          currentSrcRef.current = source;
          setState(prev => ({
            ...prev,
            canPlay: true,
            isLoading: false,
            hasError: false,
            isPlaying: false
          }));

          audioElement.volume = state.isMuted ? 0 : state.volume;
          audioElement.muted = state.isMuted;

          if (options.autoplay) {
            try {
              await audioElement.play();
              setState(prev => ({ ...prev, isPlaying: true, showAudioPrompt: false }));
            } catch (error) {
              console.warn('🎵 Autoplay failed after source switch (likely policy):', error);
            }
          }

          resolve(true);
        };

        const handleErrorOnce = () => {
          cleanupListeners();
          console.error('🎵 Failed to load audio source:', source);

          if (!usedFallback && fallbackSrc && fallbackSrc !== source) {
            console.warn('🎵 Attempting fallback audio source:', fallbackSrc);
            loadSource(fallbackSrc, true).then(resolve);
            return;
          }

          setState(prev => ({
            ...prev,
            canPlay: false,
            isLoading: false,
            hasError: true,
            isPlaying: false
          }));

          resolve(false);
        };

        // Reset listeners before assigning new ones
        cleanupListeners();

        audioElement.addEventListener('canplay', handleCanPlayOnce);
        audioElement.addEventListener('error', handleErrorOnce);

        setState(prev => ({
          ...prev,
          isPlaying: false,
          canPlay: false,
          isLoading: true,
          hasError: false
        }));

        audioElement.pause();
        audioElement.currentTime = 0;
        audioElement.src = source;
        audioElement.load();
      });
    };

    const result = await loadSource(requestedSrc, false);
    if (!result && fallbackSrc && fallbackSrc !== requestedSrc) {
      currentSrcRef.current = fallbackSrc;
    }
    return result;
  };

  return {
    ...state,
    play,
    pause,
    togglePlay,
    toggleMute,
    setVolume,
    dismissAudioPrompt,
    setSource,
    currentSource: currentSrcRef.current,
    defaultSource: defaultSrcRef.current
  };
}