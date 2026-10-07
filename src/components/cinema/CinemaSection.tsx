import React, { useState, useCallback } from 'react';
import { MOVIES_CATALOG } from '@/data/movies';
import { Movie } from '@/types';
import { Clapperboard } from './Clapperboard';
import { useAudio } from '@/hooks/use-audio';
import { 
  Film, 
  Sparkles, 
  Tv, 
  Users, 
  Award, 
  Clapperboard as ClapperIcon,
  Play
} from 'lucide-react';

export const CinemaSection: React.FC = () => {
  const [selectedMovieIndex, setSelectedMovieIndex] = useState(0);
  const [isProjectorOn, setIsProjectorOn] = useState(true);
  const [spotlightPulse, setSpotlightPulse] = useState(false);
  const { playClick } = useAudio();

  const currentMovie = MOVIES_CATALOG[selectedMovieIndex];

  // Disparo da batida da claquete: acende e pulsa o feixe de luz do projetor
  const handleClap = useCallback((_movie: Movie) => {
    setIsProjectorOn(true);
    setSpotlightPulse(true);

    const timer = setTimeout(() => {
      setSpotlightPulse(false);
    }, 700);

    return () => clearTimeout(timer);
  }, []);

  // Seleção de filme na tira de película 35mm
  const handleSelectMovie = (index: number) => {
    playClick();
    setSelectedMovieIndex(index);
    setIsProjectorOn(true);
    setSpotlightPulse(true);
    setTimeout(() => setSpotlightPulse(false), 500);
  };

  return (
    <section 
      id="cinema" 
      className="scroll-mt-24 py-8 sm:py-12"
      aria-label="Ato 4: Cine-Thalita e Streaming"
    >
      {/* Cabeçalho da Seção */}
      <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold uppercase tracking-wider shadow-sticker">
          <Film className="w-3.5 h-3.5 text-amber-700" />
          <span>Ato 4 · Do Papel Para as Telas</span>
        </div>

        <h2 className="text-3xl sm:text-4xl xl:text-5xl font-black text-slate-900 font-heading tracking-tight">
          Cine-Thalita & Streaming
        </h2>

        <p className="text-slate-600 font-body text-base sm:text-lg">
          As histórias de Thalita Rebouças conquistaram mais de 3 milhões de espectadores nas salas de cinema e alcançaram o topo mundial nos streamings da Netflix e Prime Video.
        </p>
      </div>

      {/* Cenário Retro Cine-Studio com Projetor, Feixe de Luz e Claquete */}
      <div className="relative bg-slate-950 text-white rounded-scrapbook shadow-2xl border-4 border-slate-800 p-6 sm:p-10 overflow-hidden">
        
        {/* Iluminação de Estúdio & Lâmpada do Projetor 35mm */}
        <div className="relative flex items-center justify-between pb-6 border-b border-slate-800 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-600 animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-wider text-slate-300">
              ESTÚDIO CINE-THALITA · ROLO 35MM
            </span>
          </div>

          {/* Botão de Controle do Projetor de Cinema */}
          <button
            type="button"
            onClick={() => {
              playClick();
              setIsProjectorOn(!isProjectorOn);
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-heading transition-all ${
              isProjectorOn 
                ? 'bg-sun-yellow text-slate-950 shadow-md' 
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Projetor: {isProjectorOn ? 'Ligado 💡' : 'Desligado'}</span>
          </button>
        </div>

        {/* ======================================================== */}
        {/* FEIXE DE LUZ DO PROJETOR DE CINEMA (VOLUMETRIC SPOTLIGHT) */}
        {/* ======================================================== */}
        {isProjectorOn && (
          <div 
            className={`absolute top-16 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[420px] pointer-events-none z-10 transition-opacity duration-500 projector-beam ${
              spotlightPulse ? 'opacity-100 scale-105' : 'opacity-70 scale-100'
            }`}
          >
            {/* Lente do Projetor no Topo com Brilho Intenso */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-4 bg-amber-200/80 rounded-full blur-xs" />
            <div className="absolute top-1 left-1/2 -translate-x-1/2 w-32 h-6 bg-sun-yellow/40 rounded-full blur-md" />
          </div>
        )}

        {/* Painel Central: Claquete Interativa & Tela de Projeção */}
        <div className="relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-8 pb-4">
          
          {/* Lado Esquerdo: A Claquete Interativa (Batida, Drag e Som) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-4">
            <div className="text-center space-y-1">
              <span className="text-xs font-mono uppercase tracking-wider text-sun-yellow font-bold flex items-center justify-center gap-1.5">
                <ClapperIcon className="w-3.5 h-3.5" />
                <span>Interação Tátil</span>
              </span>
              <p className="text-xs text-slate-400">
                Puxe a haste para cima e solte para bater a claquete!
              </p>
            </div>

            {/* O Componente Claquete */}
            <Clapperboard
              currentMovie={currentMovie}
              movieIndex={selectedMovieIndex}
              isProjectorOn={isProjectorOn}
              onClap={handleClap}
            />
          </div>

          {/* Lado Direito: Tela de Projeção com o Filme Iluminado pelo Feixe */}
          <div className="lg:col-span-7">
            <div 
              className={`relative rounded-2xl border-2 transition-all duration-300 p-6 sm:p-8 ${
                isProjectorOn 
                  ? 'bg-slate-900/90 border-sun-yellow/60 shadow-[0_0_50px_rgba(255,209,59,0.15)] ring-1 ring-sun-yellow/30' 
                  : 'bg-slate-900/40 border-slate-800 opacity-60'
              }`}
            >
              {/* Badge de Plataforma e Ano */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-800">
                <span 
                  className="px-3 py-1 rounded-full text-xs font-bold font-heading text-white shadow-xs"
                  style={{ backgroundColor: currentMovie.badgeColor }}
                >
                  {currentMovie.platformLabel}
                </span>

                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                  <span>Lançamento: <strong className="text-white">{currentMovie.year}</strong></span>
                </div>
              </div>

              {/* Título do Filme e Direção */}
              <div className="py-4 space-y-2">
                <h3 className="text-2xl sm:text-3xl font-black font-heading text-white tracking-tight">
                  {currentMovie.title}
                </h3>
                <p className="text-xs font-mono text-sun-yellow">
                  Direção de {currentMovie.director}
                </p>
              </div>

              {/* Destaque de Bilheteria / Recorde de Audiência */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-start gap-3 my-3">
                <Award className="w-5 h-5 text-sun-yellow shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[11px] uppercase tracking-wider text-slate-400 font-heading font-bold">
                    Marco do Cinema
                  </span>
                  <p className="text-xs sm:text-sm text-slate-200 font-semibold">
                    {currentMovie.highlight}
                  </p>
                </div>
              </div>

              {/* Sinopse da Adaptação */}
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-body py-2">
                {currentMovie.synopsis}
              </p>

              {/* Elenco Consagrado */}
              <div className="pt-3 border-t border-slate-800/80 space-y-2">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-heading font-bold">
                  <Users className="w-3.5 h-3.5 text-pop-pink" />
                  <span>Elenco Principal:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {currentMovie.cast.map((actor) => (
                    <span 
                      key={actor}
                      className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-200 text-xs font-mono border border-slate-700/60"
                    >
                      {actor}
                    </span>
                  ))}
                </div>
              </div>

              {/* Selo de Iluminação Ativa */}
              {isProjectorOn && (
                <div className="absolute top-4 right-4 hidden sm:flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sun-yellow/20 border border-sun-yellow/40 text-sun-yellow text-[10px] font-mono">
                  <Sparkles className="w-3 h-3" />
                  <span>ILUMINADO PELO PROJETOR</span>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* ======================================================== */}
        {/* TIRA DE PELÍCULA 35MM: SELETOR DOS 5 FILMES              */}
        {/* ======================================================== */}
        <div className="mt-8 pt-6 border-t border-slate-800/80">
          <div className="flex items-center justify-between mb-3 text-xs text-slate-400">
            <span className="font-heading font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Tv className="w-3.5 h-3.5 text-sun-yellow" />
              <span>Filmografia Adaptada (Selecione para rodar na claquete):</span>
            </span>
            <span className="font-mono text-[11px] text-slate-500 hidden sm:inline">
              5 Longas-Metragens Consagrados
            </span>
          </div>

          {/* Fotogramas da Tira de Filme */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {MOVIES_CATALOG.map((movie, idx) => {
              const isSelected = idx === selectedMovieIndex;
              return (
                <button
                  key={movie.id}
                  type="button"
                  onClick={() => handleSelectMovie(idx)}
                  className={`group relative text-left p-3 rounded-xl border transition-all duration-200 ${
                    isSelected
                      ? 'bg-slate-800 border-sun-yellow shadow-md ring-2 ring-sun-yellow/40 scale-[1.02]'
                      : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  {/* Furinhos simulando película 35mm no topo */}
                  <div className="flex justify-between items-center pb-2 border-b border-slate-800/60 text-[10px] font-mono text-slate-400">
                    <span>FILM 0{idx + 1}</span>
                    <span className="text-[10px] font-bold text-slate-300">{movie.year}</span>
                  </div>

                  <h4 className="font-heading font-bold text-xs text-white line-clamp-1 mt-2 group-hover:text-sun-yellow transition-colors">
                    {movie.title}
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400 block truncate mt-0.5">
                    {movie.director}
                  </span>

                  {/* Indicador de Seleção Ativa */}
                  {isSelected && (
                    <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-sun-yellow font-heading">
                      <Play className="w-2.5 h-2.5 fill-current" />
                      <span>Na Claquete</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
