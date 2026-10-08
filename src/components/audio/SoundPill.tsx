import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useAudio } from '@/hooks/use-audio';

export const SoundPill: React.FC = () => {
  const { isMuted, toggleAudio, playClick } = useAudio();

  const handleClick = () => {
    // Se estava mudo e vai ligar, ou vice-versa, toca feedback sonoro se possível
    playClick();
    toggleAudio();
  };

  return (
    <button
      onClick={handleClick}
      type="button"
      aria-pressed={!isMuted}
      aria-label={isMuted ? 'Ativar efeitos sonoros e trilha lo-fi' : 'Mutar áudio da experiência'}
      className={`group relative flex items-center gap-2.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full border transition-all duration-300 select-none shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-pop-pink ${
        isMuted
          ? 'bg-white/80 hover:bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-700'
          : 'bg-gradient-to-r from-pink-500/10 to-amber-500/10 border-pink-400/50 text-pink-600 hover:border-pink-500 shadow-pink-100'
      }`}
    >
      {/* Ícone de Som */}
      <span className="shrink-0 transition-transform duration-200 group-hover:scale-110">
        {isMuted ? (
          <VolumeX className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
        ) : (
          <Volume2 className="w-4 h-4 text-pink-600 animate-pulse" />
        )}
      </span>

      {/* Equalizador Animado (CSS GPU-Accelerated) */}
      <div className="flex items-end gap-[2px] h-3.5 w-4" aria-hidden="true">
        <span
          className={`w-[2.5px] rounded-full transition-all duration-300 ${
            isMuted
              ? 'h-1 bg-slate-300'
              : 'h-full bg-pink-500 animate-eq-1'
          }`}
        />
        <span
          className={`w-[2.5px] rounded-full transition-all duration-300 ${
            isMuted
              ? 'h-1.5 bg-slate-300'
              : 'h-full bg-pink-500 animate-eq-2'
          }`}
        />
        <span
          className={`w-[2.5px] rounded-full transition-all duration-300 ${
            isMuted
              ? 'h-1 bg-slate-300'
              : 'h-full bg-pink-500 animate-eq-3'
          }`}
        />
        <span
          className={`w-[2.5px] rounded-full transition-all duration-300 ${
            isMuted
              ? 'h-2 bg-slate-300'
              : 'h-full bg-pink-500 animate-eq-4'
          }`}
        />
      </div>

      {/* Rótulo de Texto */}
      <span className="text-xs font-semibold font-heading hidden xs:inline tracking-wide">
        {isMuted ? 'Som Mudo' : 'Som Lo-Fi'}
      </span>

      {/* Indicador sutil de pulso quando ativo */}
      {!isMuted && (
        <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500" />
        </span>
      )}
    </button>
  );
};
