import React, { useState } from 'react';
import { Movie } from '@/types';
import { useAudio } from '@/hooks/use-audio';
import { useHoverPrefetch, prefetchYouTubeTrailer } from '@/hooks/use-prefetch';
import { 
  Play, 
  Award, 
  Users, 
  Clock, 
  Sparkles, 
  Film
} from 'lucide-react';

interface MovieCardProps {
  movie: Movie;
  index: number;
  isSelected: boolean;
  onSelect: (movie: Movie, index: number) => void;
  onWatchTrailer: (movie: Movie) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  index,
  isSelected,
  onSelect,
  onWatchTrailer,
}) => {
  const { playClick } = useAudio();
  const [imageError, setImageError] = useState(false);

  // Otimização Preditiva: pré-conecta com YouTube e carrega thumbnail ao pairar cursor > 100ms
  const prefetchHandlers = useHoverPrefetch(() => {
    prefetchYouTubeTrailer(movie.trailerId);
  }, 100);

  const handleCardClick = () => {
    onSelect(movie, index);
  };

  const handleTrailerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    playClick();
    onWatchTrailer(movie);
  };

  const hasPoster = Boolean(movie.posterUrl) && !imageError;

  return (
    <div
      onClick={handleCardClick}
      {...prefetchHandlers}
      className={`group relative flex flex-col justify-between h-full rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden select-none ${
        isSelected
          ? 'bg-slate-900 border-sun-yellow shadow-[0_0_30px_rgba(255,209,59,0.25)] ring-2 ring-sun-yellow/40 scale-[1.02]'
          : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90 hover:-translate-y-1'
      }`}
    >
      {/* Topo do Card: Furinhos de Película 35mm & Cartaz Oficial */}
      <div className="p-3.5 sm:p-4 pb-2 flex-1 flex flex-col">
        {/* Furinhos simulando borda de rolo de filme de 35mm */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 text-[10px] font-mono text-slate-500">
          <div className="flex items-center gap-1">
            <Film className="w-3 h-3 text-slate-400" />
            <span>FITA 0{index + 1}</span>
          </div>
          <span>{movie.year}</span>
        </div>

        {/* Cartaz Oficial de Cinema (Proporção e Tamanho Padronizados 2:3) */}
        <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden my-3 bg-slate-900 border border-slate-800 shadow-md group-hover:border-slate-700 transition-all flex items-center justify-center">
          {hasPoster ? (
            <img
              src={movie.posterUrl}
              alt={`Cartaz oficial do filme ${movie.title}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 pointer-events-none select-none"
              loading="lazy"
              onError={() => setImageError(true)}
            />
          ) : (
            <div 
              className="w-full h-full flex flex-col items-center justify-center p-3 text-center"
              style={{ backgroundColor: movie.backdropColor }}
            >
              <Film className="w-8 h-8 text-white/80 mb-1" />
              <span className="text-xs font-heading font-black text-white line-clamp-2">
                {movie.title}
              </span>
            </div>
          )}

          {/* Gradiente Inferior com Badge de Plataforma e Duração */}
          <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex items-center justify-between pointer-events-none">
            <span
              className="px-2 py-0.5 rounded-full text-[9px] font-heading font-extrabold uppercase tracking-wider text-white shadow-2xs truncate"
              style={{ backgroundColor: movie.badgeColor }}
            >
              {movie.platformLabel.split(' ')[0]}
            </span>

            <span className="flex items-center gap-1 text-[10px] font-mono text-white/90 drop-shadow-xs">
              <Clock className="w-2.5 h-2.5" />
              <span>{movie.duration || 'Longa'}</span>
            </span>
          </div>
        </div>

        {/* Título da Obra (Altura Padronizada para 1 ou 2 Linhas) */}
        <div className="space-y-0.5 h-14 flex flex-col justify-start">
          <h3 className="font-heading font-black text-base sm:text-lg text-white group-hover:text-sun-yellow transition-colors leading-snug line-clamp-2">
            {movie.title}
          </h3>
          <p className="text-[11px] font-mono text-slate-400 truncate">
            Direção de {movie.director}
          </p>
        </div>

        {/* Marco / Destaque de Bilheteria (Altura Padronizada) */}
        <div className="mt-2 p-2 rounded-xl bg-slate-950/90 border border-slate-800/90 flex items-start gap-2 h-[68px] overflow-hidden">
          <Award className="w-3.5 h-3.5 text-sun-yellow shrink-0 mt-0.5" />
          <p className="text-[11px] text-slate-300 font-medium line-clamp-2 leading-tight">
            {movie.highlight}
          </p>
        </div>

        {/* Elenco Principal Resumido (Altura Padronizada) */}
        <div className="mt-2 space-y-1 h-16 sm:h-20 overflow-hidden">
          <div className="flex items-center gap-1 text-[10px] font-heading font-bold text-slate-400">
            <Users className="w-3 h-3 text-pop-pink" />
            <span>Elenco:</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {movie.cast.slice(0, 3).map((actor) => (
              <span
                key={actor}
                className="px-1.5 py-0.5 rounded-md bg-slate-800/80 text-slate-300 text-[9px] font-mono border border-slate-700/50"
              >
                {actor}
              </span>
            ))}
            {movie.cast.length > 3 && (
              <span className="px-1 py-0.5 text-[9px] font-mono text-slate-500">
                +{movie.cast.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Rodapé do Card: Ação Primária de Assistir Trailer Fixada na Base */}
      <div className="p-3.5 pt-2 border-t border-slate-800/80 bg-slate-950/60 flex items-center justify-between gap-2 mt-auto">
        <button
          type="button"
          onClick={handleTrailerClick}
          className="flex-1 py-2 px-3 rounded-xl bg-sun-yellow hover:bg-sun-yellow-dark text-slate-950 font-heading font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 shadow-md active:scale-95"
          title={`Assistir ao trailer oficial de ${movie.title}`}
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Assistir Trailer</span>
        </button>

        {isSelected && (
          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono text-sun-yellow px-1.5 shrink-0">
            <Sparkles className="w-3 h-3 text-sun-yellow" />
            <span>Na Tela</span>
          </span>
        )}
      </div>

      {/* Indicador Luminoso de Seleção Ativa */}
      {isSelected && (
        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-sun-yellow/20 to-transparent pointer-events-none" />
      )}
    </div>
  );
};
