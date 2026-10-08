import React, { useState, useCallback, useRef } from 'react';
import { MOVIES_CATALOG } from '@/data/movies';
import { Movie } from '@/types';
import { Clapperboard } from './Clapperboard';
import { MovieCard } from './MovieCard';
import { TrailerModal } from './TrailerModal';
import { useAudio } from '@/hooks/use-audio';
import { useHoverPrefetch, prefetchYouTubeTrailer } from '@/hooks/use-prefetch';
import { 
  Film, 
  Sparkles, 
  Tv, 
  Users, 
  Award, 
  Clapperboard as ClapperIcon,
  Play,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Eye
} from 'lucide-react';

export const CinemaSection: React.FC = () => {
  const [selectedMovieIndex, setSelectedMovieIndex] = useState(0);
  const [isProjectorOn, setIsProjectorOn] = useState(true);
  const [spotlightPulse, setSpotlightPulse] = useState(false);
  
  // Estado do Trailer Modal (Lightbox Acessível)
  const [trailerMovie, setTrailerMovie] = useState<Movie | null>(null);
  const [isTrailerModalOpen, setIsTrailerModalOpen] = useState(false);

  const carouselRef = useRef<HTMLDivElement>(null);
  const { playClick, playPageFlip } = useAudio();

  const currentMovie = MOVIES_CATALOG[selectedMovieIndex];
  const totalMovies = MOVIES_CATALOG.length;

  // Pré-conexão e cache antecipado ao pairar sobre os botões do filme projetado
  const prefetchTrailerHandlers = useHoverPrefetch(() => {
    prefetchYouTubeTrailer(currentMovie.trailerId);
  }, 100);

  // Disparo da batida da claquete: acende e pulsa o feixe de luz do projetor
  const handleClap = useCallback((_movie: Movie) => {
    setIsProjectorOn(true);
    setSpotlightPulse(true);

    const timer = setTimeout(() => {
      setSpotlightPulse(false);
    }, 700);

    return () => clearTimeout(timer);
  }, []);

  // Seleção de filme
  const handleSelectMovie = (index: number) => {
    playClick();
    setSelectedMovieIndex(index);
    setIsProjectorOn(true);
    setSpotlightPulse(true);
    setTimeout(() => setSpotlightPulse(false), 500);
  };

  // Navegação no carrossel
  const handlePrevMovie = () => {
    playPageFlip();
    const prevIdx = selectedMovieIndex > 0 ? selectedMovieIndex - 1 : totalMovies - 1;
    handleSelectMovie(prevIdx);
  };

  const handleNextMovie = () => {
    playPageFlip();
    const nextIdx = selectedMovieIndex < totalMovies - 1 ? selectedMovieIndex + 1 : 0;
    handleSelectMovie(nextIdx);
  };

  // Abertura de trailer sob demanda
  const handleOpenTrailer = (movie: Movie) => {
    playClick();
    setTrailerMovie(movie);
    setIsTrailerModalOpen(true);
  };

  const handleCloseTrailer = () => {
    setIsTrailerModalOpen(false);
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
              {/* Badge de Plataforma, Ano e Duração */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-800">
                <span 
                  className="px-3 py-1 rounded-full text-xs font-bold font-heading text-white shadow-xs"
                  style={{ backgroundColor: currentMovie.badgeColor }}
                >
                  {currentMovie.platformLabel}
                </span>

                <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                  <span>Lançamento: <strong className="text-white">{currentMovie.year}</strong></span>
                  <span>•</span>
                  <span>{currentMovie.duration || 'Longa-metragem'}</span>
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
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-start gap-3 my-2">
                <Award className="w-5 h-5 text-sun-yellow shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[11px] uppercase tracking-wider text-slate-400 font-heading font-bold">
                    Marco do Cinema & Streaming
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
              <div className="pt-2 border-t border-slate-800/80 space-y-2">
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

              {/* Botões de Ação na Tela Principal: Assistir Trailer e Ver Bastidores */}
              <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleOpenTrailer(currentMovie)}
                  {...prefetchTrailerHandlers}
                  className="px-4 py-2 rounded-xl bg-sun-yellow hover:bg-sun-yellow-dark text-slate-950 font-heading font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center gap-2 shadow-md active:scale-95"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Assistir Trailer Oficial</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleOpenTrailer(currentMovie);
                  }}
                  {...prefetchTrailerHandlers}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-heading font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 border border-slate-700 active:scale-95"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-pop-pink" />
                  <span>Curiosidades da Thalita</span>
                </button>
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

        {/* =================================================================== */}
        {/* CARROSSEL DE FILMES & BASTIDORES DAS TELAS (CAROUSEL DE CARDS)      */}
        {/* =================================================================== */}
        <div className="mt-10 pt-8 border-t border-slate-800/80">
          
          {/* Cabeçalho do Carrossel com Controles Anterior / Próximo */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-heading font-bold uppercase tracking-wider text-sun-yellow">
                <Tv className="w-4 h-4" />
                <span>Carrossel de Obras Audiovisuais</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black font-heading text-white tracking-tight mt-0.5">
                Os 5 Filmes Adaptados
              </h3>
            </div>

            {/* Controles do Carrossel */}
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-slate-400 mr-2 hidden sm:inline">
                Filme {selectedMovieIndex + 1} de {totalMovies}
              </span>

              <button
                type="button"
                onClick={handlePrevMovie}
                aria-label="Filme anterior"
                className="p-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-all border border-slate-700 active:scale-95"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleNextMovie}
                aria-label="Próximo filme"
                className="p-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-all border border-slate-700 active:scale-95"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Grid e Carrossel Fluído de Filmes */}
          <div 
            ref={carouselRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
          >
            {MOVIES_CATALOG.map((movie, idx) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                index={idx}
                isSelected={idx === selectedMovieIndex}
                onSelect={(_m, index) => handleSelectMovie(index)}
                onWatchTrailer={handleOpenTrailer}
              />
            ))}
          </div>

          {/* Dica de Navegação Rápida */}
          <div className="mt-4 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-500 font-mono">
            <span className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-sun-yellow" />
              <span>Clique em qualquer cartaz para carregar na claquete ou assista ao trailer.</span>
            </span>
            <span className="hidden sm:inline">
              100% sob demanda sem carregamentos pesados
            </span>
          </div>

        </div>

      </div>

      {/* Modal Lightbox Acessível para Reprodução de Trailer Sob Demanda */}
      <TrailerModal
        movie={trailerMovie}
        isOpen={isTrailerModalOpen}
        onClose={handleCloseTrailer}
      />
    </section>
  );
};
