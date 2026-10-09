import React from 'react';
import { Film, BookOpen, Play } from 'lucide-react';

export type SkeletonVariant = 'book' | 'movie' | 'trailer-player' | 'note';

interface SkeletonCardProps {
  variant?: SkeletonVariant;
  className?: string;
  count?: number;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  variant = 'movie',
  className = '',
}) => {
  if (variant === 'movie') {
    return (
      <div
        role="status"
        aria-label="Carregando card de cinema..."
        className={`h-full relative flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-950/70 p-3.5 sm:p-4 overflow-hidden animate-scrapbook-shimmer ${className}`}
      >
        {/* Furinhos de película 35mm no topo */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
          <div className="flex items-center gap-1">
            <Film className="w-3.5 h-3.5 text-slate-700 animate-pulse" />
            <div className="w-16 h-2 rounded bg-slate-800/80 animate-pulse" />
          </div>
          <div className="w-10 h-2 rounded bg-slate-800/80 animate-pulse" />
        </div>

        {/* Placeholder do Cartaz 2:3 Padronizado */}
        <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden my-3 bg-slate-900/90 border border-slate-800 animate-pulse flex items-center justify-center">
          <Film className="w-8 h-8 text-slate-800/80" />
        </div>

        {/* Título e Diretor (Altura Padronizada) */}
        <div className="space-y-1 h-14">
          <div className="w-3/4 h-4 rounded bg-slate-800 animate-pulse" />
          <div className="w-1/2 h-3 rounded bg-slate-800/60 animate-pulse" />
        </div>

        {/* Destaque / Citação de Bilheteria (Altura Padronizada) */}
        <div className="mt-2 p-2 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1.5 h-[68px]">
          <div className="w-full h-2.5 rounded bg-slate-800 animate-pulse" />
          <div className="w-4/5 h-2.5 rounded bg-slate-800/80 animate-pulse" />
        </div>

        {/* Elenco (Altura Padronizada) */}
        <div className="mt-2 flex gap-1 h-16 sm:h-20">
          <div className="w-16 h-3.5 rounded bg-slate-800/70 animate-pulse" />
          <div className="w-16 h-3.5 rounded bg-slate-800/70 animate-pulse" />
        </div>

        {/* Botão Assistir Trailer Fixado na Base */}
        <div className="mt-auto pt-2 border-t border-slate-800/80">
          <div className="w-full h-9 rounded-xl bg-slate-800 flex items-center justify-center gap-2 animate-pulse">
            <Play className="w-3.5 h-3.5 text-slate-600 fill-slate-600" />
            <div className="w-24 h-3 rounded bg-slate-700" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'book') {
    return (
      <div
        role="status"
        aria-label="Carregando livro da estante..."
        className={`relative flex flex-col justify-between w-40 sm:w-44 h-64 rounded-r-xl rounded-l-xs p-4 bg-amber-100/80 border border-amber-200 shadow-md overflow-hidden animate-scrapbook-shimmer ${className}`}
      >
        {/* Lombada com costura e relevo */}
        <div className="absolute top-0 left-0 bottom-0 w-3 bg-amber-300/40 border-r border-amber-300/50 flex flex-col justify-between py-2 items-center pointer-events-none">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <div className="w-1 h-8 bg-amber-400/60 rounded-full" />
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
        </div>

        {/* Topo do Livro: Ano */}
        <div className="pl-2 flex items-center justify-between">
          <div className="w-10 h-4 rounded bg-amber-200/90 animate-pulse" />
          <div className="w-12 h-4 rounded-full bg-amber-200/90 animate-pulse" />
        </div>

        {/* Centro: Título do livro */}
        <div className="pl-2 space-y-2 my-auto">
          <div className="w-5/6 h-4 rounded bg-amber-200/90 animate-pulse" />
          <div className="w-4/6 h-4 rounded bg-amber-200/80 animate-pulse" />
          <div className="w-3/6 h-3 rounded bg-amber-200/60 animate-pulse mt-1" />
        </div>

        {/* Base do Livro: Páginas */}
        <div className="pl-2 pt-2 border-t border-amber-200/60 flex items-center justify-between">
          <div className="w-12 h-3 rounded bg-amber-200/80 animate-pulse" />
          <div className="w-14 h-4 rounded-full bg-amber-200/80 flex items-center justify-center gap-1">
            <BookOpen className="w-2.5 h-2.5 text-amber-600/70" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'trailer-player') {
    return (
      <div
        role="status"
        aria-label="Carregando player de trailer..."
        className={`relative aspect-video w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex flex-col items-center justify-center animate-scrapbook-shimmer ${className}`}
      >
        <div className="relative flex flex-col items-center justify-center space-y-3 z-10 text-center px-4">
          <div className="w-14 h-14 rounded-full bg-sun-yellow/20 border-2 border-sun-yellow/60 flex items-center justify-center shadow-lg animate-pulse">
            <Play className="w-6 h-6 text-sun-yellow fill-sun-yellow/80 ml-0.5" />
          </div>
          <div className="space-y-1.5">
            <div className="w-32 h-3.5 rounded bg-slate-800 mx-auto animate-pulse" />
            <div className="w-48 h-2.5 rounded bg-slate-800/60 mx-auto animate-pulse" />
          </div>
        </div>

        {/* Efeito de película de fundo suave */}
        <div className="absolute inset-0 bg-radial from-slate-900/60 via-slate-950 to-black pointer-events-none" />
      </div>
    );
  }

  // Variant: 'note' / polaroid
  return (
    <div
      role="status"
      aria-label="Carregando nota de scrapbook..."
      className={`relative p-5 rounded-2xl bg-amber-50/90 border border-amber-200/80 shadow-md space-y-3 overflow-hidden animate-scrapbook-shimmer ${className}`}
    >
      {/* Fita Washi Tape decorativa no topo */}
      <div className="w-16 h-3 bg-amber-200/70 mx-auto -mt-2 rounded-xs rotate-[-2deg]" />

      <div className="w-2/3 h-4 rounded bg-amber-200/90 animate-pulse" />
      <div className="space-y-2">
        <div className="w-full h-3 rounded bg-amber-200/70 animate-pulse" />
        <div className="w-5/6 h-3 rounded bg-amber-200/70 animate-pulse" />
        <div className="w-4/6 h-3 rounded bg-amber-200/60 animate-pulse" />
      </div>
    </div>
  );
};
