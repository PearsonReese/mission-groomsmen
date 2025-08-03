import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { apiService } from '@/services/api';

interface AudioManagerProps {
  audio: ReturnType<typeof import('@/hooks/useAudio').useAudio>;
  onAudioEnabled?: () => void;
  showDialog?: boolean;
}

export function AudioManager({ audio, onAudioEnabled, showDialog = true }: AudioManagerProps) {

  const handleEnableAudio = async () => {
    console.log('🎵 User clicked Enable Audio');
    try {
      await audio.play();
      console.log('🎵 Audio started successfully');
      // Log audio enable event
      await apiService.logAudioEvent('play');
    } catch (error) {
      console.error('🎵 Failed to start audio:', error);
    }
    audio.dismissAudioPrompt();
    onAudioEnabled?.();
  };

  const handleSkip = () => {
    console.log('🎵 User clicked Continue Silent');
    // Log audio skip event
    apiService.logAudioEvent('skip').catch(console.error);
    audio.dismissAudioPrompt();
    onAudioEnabled?.();
  };

  const handleDialogChange = (open: boolean) => {
    // Prevent closing the dialog by clicking outside or pressing escape
    // Users must click one of the action buttons
    return;
  };

  // Enhanced mobile touch handlers for better iOS compatibility
  const handlePlayPauseClick = async (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🎵 Play/Pause button clicked');
    await audio.togglePlay();
    // Log audio toggle event
    const action = audio.isPlaying ? 'pause' : 'play';
    await apiService.logAudioEvent(action);
  };



  // Audio permission dialog
  return (
    <>
      {showDialog && (
        <Dialog open={audio.showAudioPrompt} onOpenChange={handleDialogChange}>
          <DialogContent 
            className="audio-permission-dialog bg-black border-yellow-500 border-2 shadow-2xl shadow-yellow-500/20 max-w-md mx-auto"
            showCloseButton={false}
          >
            <DialogHeader>
              <DialogTitle className="audio-dialog-title text-yellow-400 text-lg sm:text-xl font-bold text-center leading-tight">
                🎵 AUDIO ENHANCEMENT AVAILABLE 🎵
              </DialogTitle>
              <DialogDescription className="audio-dialog-description text-green-400 text-sm text-center">
                For the full Mission Impossible experience, enable audio to hear the iconic music during your briefing.
              </DialogDescription>
              {audio.isLoading && (
                <div className="audio-loading-indicator mt-2 text-yellow-400 text-xs text-center">
                  Loading audio file...
                </div>
              )}
              {audio.hasError && (
                <div className="audio-error-indicator mt-2 text-red-400 text-xs text-center">
                  Audio file not found. Check console for details.
                </div>
              )}
            </DialogHeader>
            <DialogFooter className="audio-dialog-footer flex flex-col sm:flex-row gap-3 justify-center sm:justify-center">
              <Button 
                onClick={handleEnableAudio}
                disabled={!audio.canPlay || audio.isLoading}
                className="audio-enable-button bg-green-600 hover:bg-green-700 text-black font-bold disabled:opacity-50"
              >
                {audio.isLoading ? '🔄 Loading...' : '🔊 Enable Audio'}
              </Button>
              <Button 
                onClick={handleSkip}
                variant="outline"
                className="audio-skip-button border-yellow-500 text-black hover:bg-yellow-500/10 hover:text-white"
              >
                Continue Silent
              </Button>
            </DialogFooter>
            <div className="audio-disclaimer text-green-400 text-xs text-center">
              (Audio will loop in the background at low volume)
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Audio controls for the terminal footer */}
      <div className="audio-controls-container flex items-center justify-between gap-2">
        <div className="audio-status-display text-green-400 text-sm flex items-center space-x-2 flex-1 min-w-0">
          <span className={`audio-icon ${audio.isPlaying ? 'animate-pulse' : ''}`}>
            🎵
          </span>
          <span className="audio-track-name truncate">Mission: Impossible Theme</span>
          {audio.isLoading && (
            <span className="audio-loading-status text-yellow-400 text-xs flex-shrink-0">(Loading...)</span>
          )}
          {audio.hasError && (
            <span className="audio-error-status text-red-400 text-xs flex-shrink-0">(Audio error)</span>
          )}
          {!audio.canPlay && !audio.isLoading && !audio.hasError && (
            <span className="audio-unavailable-status text-yellow-400 text-xs flex-shrink-0">(Audio not available)</span>
          )}
        </div>
        
        <div className="audio-control-buttons flex space-x-2 flex-shrink-0">
          {audio.canPlay && !audio.isLoading && !audio.hasError && (
            <Button 
              onClick={handlePlayPauseClick}
              onTouchEnd={handlePlayPauseClick}
              variant="outline" 
              size="sm" 
              className="audio-play-pause-button border-green-500 text-green-400 hover:bg-green-500/10 touch-manipulation"
            >
              {audio.isPlaying ? '⏸️' : '▶️'}
            </Button>
          )}
        </div>
      </div>
    </>
  );
}