import { useEffect, useCallback } from 'react';
import { useAppStore } from '@/store/use-app-store';
import { soundEngine } from '@/utils/sound-effects';

export function useAudio() {
  const isMuted = useAppStore((state) => state.isMuted);
  const hasInteracted = useAppStore((state) => state.hasInteracted);
  const toggleAudio = useAppStore((state) => state.toggleAudio);
  const setAudioMuted = useAppStore((state) => state.setAudioMuted);

  // Sincroniza a trilha sonora com a preferência do usuário (opt-in)
  useEffect(() => {
    if (!isMuted && hasInteracted) {
      soundEngine.startAmbientBgm();
    } else {
      soundEngine.stopAmbientBgm();
    }

    return () => {
      soundEngine.stopAmbientBgm();
    };
  }, [isMuted, hasInteracted]);

  // Efeitos Sonoros Táteis protegidos pela flag isMuted
  const playTypewriterKey = useCallback(() => {
    if (!isMuted) soundEngine.playTypewriterKey();
  }, [isMuted]);

  const playPageFlip = useCallback(() => {
    if (!isMuted) soundEngine.playPageFlip();
  }, [isMuted]);

  const playClapper = useCallback(() => {
    if (!isMuted) soundEngine.playClapper();
  }, [isMuted]);

  const playSlotLever = useCallback(() => {
    if (!isMuted) soundEngine.playSlotLever();
  }, [isMuted]);

  const playSlotSpin = useCallback(() => {
    if (!isMuted) soundEngine.playSlotSpin();
  }, [isMuted]);

  const playSlotWin = useCallback(() => {
    if (!isMuted) soundEngine.playSlotWin();
  }, [isMuted]);

  const playPinPop = useCallback(() => {
    if (!isMuted) soundEngine.playPinPop();
  }, [isMuted]);

  const playConfettiPop = useCallback(() => {
    if (!isMuted) soundEngine.playConfettiPop();
  }, [isMuted]);

  const playClick = useCallback(() => {
    if (!isMuted) soundEngine.playClick();
  }, [isMuted]);

  return {
    isMuted,
    hasInteracted,
    toggleAudio,
    setAudioMuted,
    playTypewriterKey,
    playPageFlip,
    playClapper,
    playSlotLever,
    playSlotSpin,
    playSlotWin,
    playPinPop,
    playConfettiPop,
    playClick,
  };
}
