import React from 'react';
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

  return (
    <div
      onClick={handleCardClick}
      {...prefetchHandlers}
      className={`group relative flex flex-col justify-between rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden select-none ${
        isSelected
          ? 'bg-slate-900 border-sun-yellow shadow-[0_0_30px_rgba(255,209,59,0.25)] ring-2 ring-sun-yellow/40 scale-[1.02]'
          : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90 hover:-translate-y-1'
      }`}
    >
      {/* Topo do Card: Furinhos de Película 35mm & Badge de Streaming */}
      <div className="p-4 sm:p-5 pb-3">
        {/* Furinhos simulando borda de rolo de filme de 35mm */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 text-[10px] font-mono text-slate-500">
          <div className="flex items-center gap-1">
            <Film className="w-3 h-3 text-slate-400" />
            <span>FITA 0{index + 1}</span>
          </div>
          <span>{movie.year}</span>
        </div>

        {/* Badge da Plataforma e Duração */}
        <div className="flex items-center justify-between pt-3 gap-2">
          <span
            className="px-2.5 py-0.5 rounded-full text-[10px] font-heading font-extrabold uppercase tracking-wider text-white shadow-xs"
            style={{ backgroundColor: movie.badgeColor }}
          >
            {movie.platformLabel}
          </span>

          <span className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
            <Clock className="w-3 h-3 text-slate-500" />
            <span>{movie.duration || 'Longa'}</span>
          </span>
        </div>

        {/* Título da Obra */}
        <div className="mt-3 space-y-1">
          <h3 className="font-heading font-black text-lg sm:text-xl text-white group-hover:text-sun-yellow transition-colors leading-snug line-clamp-2">
            {movie.title}
          </h3>
          <p className="text-xs font-mono text-slate-400 truncate">
            Direção de {movie.director}
          </p>
        </div>

        {/* Marco / Destaque de Bilheteria */}
        <div className="mt-3 p-2.5 rounded-xl bg-slate-950/90 border border-slate-800/90 flex items-start gap-2">
          <Award className="w-4 h-4 text-sun-yellow shrink-0 mt-0.5" />
          <p className="text-xs text-slate-300 font-medium line-clamp-2 leading-tight">
            {movie.highlight}
          </p>
        </div>

        {/* Elenco Principal Resumido */}
        <div className="mt-3 space-y-1.5">
          <div className="flex items-center gap-1 text-[11px] font-heading font-bold text-slate-400">
            <Users className="w-3 h-3 text-pop-pink" />
            <span>Elenco:</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {movie.cast.slice(0, 3).map((actor) => (
              <span
                key={actor}
                className="px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 text-[10px] font-mono border border-slate-700/50"
              >
                {actor}
              </span>
            ))}
            {movie.cast.length > 3 && (
              <span className="px-1.5 py-0.5 text-[10px] font-mono text-slate-500">
                +{movie.cast.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Rodapé do Card: Ação Primária de Assistir Trailer */}
      <div className="p-4 pt-3 border-t border-slate-800/80 bg-slate-950/60 flex items-center justify-between gap-2">
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
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-sun-yellow px-2">
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
