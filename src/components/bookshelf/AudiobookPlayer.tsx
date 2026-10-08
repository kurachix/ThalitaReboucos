import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, VolumeX, Play, Pause, RotateCcw, Sparkles } from 'lucide-react';
import { useAudio } from '@/hooks/use-audio';
import { triggerHaptic } from '@/utils/haptics';

export interface AudiobookPlayerProps {
  bookTitle: string;
  textToNarrate: string;
  className?: string;
}

/**
 * AudiobookPlayer: Player de narração em tempo real do trecho do livro
 * utilizando Web Speech API (Voz em Português) com barras de áudio animadas,
 * controle de progresso e fallbacks elegantes.
 */
export const AudiobookPlayer: React.FC<AudiobookPlayerProps> = ({
  bookTitle,
  textToNarrate,
  className = '',
}) => {
  const { playClick } = useAudio();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isSupported, setIsSupported] = useState(false);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const progressTimerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const estimatedDurationRef = useRef<number>(10); // Segundos estimados

  // Verifica suporte à síntese de voz no navegador
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);
    }
  }, []);

  // Para narração imediatamente se o livro mudar ou componente desmontar
  const stopNarration = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
    setIsPlaying(false);
    setIsPaused(false);
    setProgress(0);
  }, []);

  useEffect(() => {
    stopNarration();
    return () => {
      stopNarration();
    };
  }, [bookTitle, textToNarrate, stopNarration]);

  // Inicia ou retoma a narração
  const handleTogglePlay = () => {
    playClick();
    triggerHaptic('medium');

    if (!isSupported) return;

    // Se estiver pausado, retoma
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPlaying(true);
      setIsPaused(false);
      return;
    }

    // Se já estiver tocando, pausa
    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
      setIsPaused(true);
      return;
    }

    // Inicia nova narração
    window.speechSynthesis.cancel();

    // Texto limpo sem pontuações excessivas
    const cleanText = `${bookTitle}. ${textToNarrate.replace(/["—]/g, '')}`;
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utteranceRef.current = utterance;

    // Configuração de voz e entonação afetuosa
    utterance.lang = 'pt-BR';
    utterance.rate = 1.02; // Ritmo natural e caloroso
    utterance.pitch = 1.06; // Tom levemente brilhante

    // Tenta encontrar voz em Português brasileiro
    const voices = window.speechSynthesis.getVoices();
    const ptVoice = voices.find(
      (v) => v.lang === 'pt-BR' || v.lang.startsWith('pt') || v.name.toLowerCase().includes('brazil')
    );
    if (ptVoice) {
      utterance.voice = ptVoice;
    }

    // Estima a duração média baseada no número de palavras (~135 palavras por minuto)
    const wordCount = cleanText.split(/\s+/).length;
    const estimatedSeconds = Math.max(6, Math.round((wordCount / 135) * 60));
    estimatedDurationRef.current = estimatedSeconds;
    startTimeRef.current = Date.now();

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
      setProgress(0);

      // Rastreador suave de progresso em tempo real
      progressTimerRef.current = window.setInterval(() => {
        const elapsed = (Date.now() - startTimeRef.current) / 1000;
        const currentPercent = Math.min(96, Math.round((elapsed / estimatedDurationRef.current) * 100));
        setProgress(currentPercent);
      }, 250);
    };

    utterance.onend = () => {
      setProgress(100);
      setTimeout(() => {
        stopNarration();
      }, 500);
    };

    utterance.onerror = () => {
      stopNarration();
    };

    window.speechSynthesis.speak(utterance);
  };

  // Reiniciar do início
  const handleRestart = () => {
    stopNarration();
    setTimeout(() => {
      handleTogglePlay();
    }, 100);
  };

  if (!isSupported) {
    return null;
  }

  return (
    <div
      className={`rounded-2xl bg-gradient-to-r from-amber-50 via-pink-50/60 to-amber-50 p-3 sm:p-4 border border-amber-200/80 shadow-xs space-y-2.5 ${className}`}
    >
      <div className="flex items-center justify-between gap-3">
        {/* Identificação do Audiobook Preview */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-full bg-pop-pink/10 text-pop-pink flex items-center justify-center shrink-0">
            {isPlaying ? (
              <Volume2 className="w-4 h-4 animate-pulse text-pop-pink" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-bold text-xs text-slate-800 truncate">
                Ouvir Trecho Narrado
              </span>
              <span className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-xs bg-pop-pink/15 text-pop-pink text-[9px] font-extrabold uppercase font-heading">
                <Sparkles className="w-2.5 h-2.5" />
                Voz
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-body leading-none truncate">
              {isPlaying ? 'Narrando sinopse oficial...' : isPaused ? 'Pausado' : 'Clique para ouvir a sinopse em áudio'}
            </p>
          </div>
        </div>

        {/* Controles de Play, Pause e Reset */}
        <div className="flex items-center gap-1.5 shrink-0">
          {isPlaying && (
            <button
              type="button"
              onClick={handleRestart}
              aria-label="Reiniciar narração"
              title="Reiniciar narração"
              className="p-1.5 rounded-full hover:bg-white text-slate-500 hover:text-slate-800 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={handleTogglePlay}
            aria-label={isPlaying ? 'Pausar narração' : 'Ouvir trecho em áudio'}
            className={`px-3 py-1.5 rounded-full font-heading font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all active:scale-95 ${
              isPlaying
                ? 'bg-amber-400 hover:bg-amber-500 text-slate-900 border border-amber-500'
                : 'bg-pop-pink hover:bg-pink-600 text-white shadow-md'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pausar</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isPaused ? 'Continuar' : 'Ouvir'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Visualizador de Ondas Sonoras e Barra de Progresso */}
      <div className="flex items-center gap-2 pt-1">
        {/* Equalizador animado quando tocando */}
        <div className="flex items-end gap-0.5 h-3.5 w-8 shrink-0">
          {[0, 1, 2, 3].map((idx) => (
            <span
              key={idx}
              className={`w-1 rounded-full transition-all duration-200 ${
                isPlaying ? 'bg-pop-pink animate-pulse' : 'bg-slate-300 h-1'
              }`}
              style={{
                height: isPlaying ? `${40 + (idx % 2 === 0 ? 55 : 25)}%` : '20%',
                animationDelay: `${idx * 140}ms`,
              }}
            />
          ))}
        </div>

        {/* Linha de progresso */}
        <div className="flex-1 h-1.5 bg-amber-200/50 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-sun-yellow to-pop-pink rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <span className="text-[10px] font-mono text-slate-400 w-7 text-right">
          {progress}%
        </span>
      </div>
    </div>
  );
};
