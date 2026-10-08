import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Movie } from '@/types';
import { useAudio } from '@/hooks/use-audio';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { SkeletonCard } from '@/components/common/SkeletonCard';
import { 
  X, 
  Film, 
  Sparkles, 
  Users, 
  Calendar, 
  Clock, 
  Award, 
  ExternalLink,
  MessageCircle
} from 'lucide-react';

interface TrailerModalProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TrailerModal: React.FC<TrailerModalProps> = ({
  movie,
  isOpen,
  onClose,
}) => {
  const { playClick, playPageFlip } = useAudio();
  const prefersReduced = useReducedMotion();
  const [isClosing, setIsClosing] = useState(false);
  const [activeTab, setActiveTab] = useState<'trailer' | 'trivia'>('trailer');
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Reseta estado de carregamento do player ao trocar de filme ou abrir modal
  useEffect(() => {
    if (isOpen) {
      setIsIframeLoaded(false);
    }
  }, [isOpen, movie?.trailerId]);

  // Fechamento suave com feedback sonoro
  const handleClose = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    playClick();

    const timer = setTimeout(() => {
      onClose();
      setIsClosing(false);
      setActiveTab('trailer');
    }, 250);

    return () => clearTimeout(timer);
  }, [isClosing, playClick, onClose]);

  // Trava de Scroll no Background e Foco Inicial
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    document.body.style.overflow = 'hidden';

    const focusTimer = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    return () => {
      clearTimeout(focusTimer);
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [isOpen]);

  // Atalho de Teclado ESC
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  if (typeof document === 'undefined') return null;
  if (!isOpen && !isClosing) return null;
  if (!movie) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="trailer-modal-title"
      className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 transition-all duration-300 ${
        isClosing
          ? 'opacity-0 backdrop-blur-none bg-slate-950/0'
          : 'opacity-100 backdrop-blur-md bg-slate-950/85'
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      {/* Container Principal do Modal de Cinema */}
      <div
        className={`relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-slate-900 border-2 border-slate-700/80 rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden text-white transition-all duration-300 ease-out ${
          prefersReduced
            ? isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
            : isClosing ? 'scale-90 opacity-0' : 'scale-100 opacity-100'
        }`}
      >
        {/* Cabeçalho do Modal: Título, Badge de Streaming e Botão Fechar */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <span
              className="px-3 py-1 rounded-full text-xs font-bold font-heading text-white shadow-xs uppercase tracking-wider"
              style={{ backgroundColor: movie.badgeColor }}
            >
              {movie.platformLabel}
            </span>

            <div>
              <h3 
                id="trailer-modal-title"
                className="text-lg sm:text-xl font-heading font-black text-white leading-tight"
              >
                {movie.title}
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                {movie.year} · Direção de {movie.director} · {movie.duration || 'Longa-metragem'}
              </p>
            </div>
          </div>

          {/* Botão de Fechar com Atalho ESC */}
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex text-[11px] text-slate-400 font-mono">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[10px]">ESC</kbd>
            </span>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={handleClose}
              aria-label="Fechar trailer do filme (ESC)"
              className="p-2 rounded-full bg-slate-800 hover:bg-pop-pink text-slate-300 hover:text-white transition-all transform hover:scale-105 active:scale-95 shadow-md border border-slate-700 focus:outline-none focus:ring-2 focus:ring-sun-yellow"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Abas Alternadoras: Trailer vs Bastidores */}
        <div className="px-4 sm:px-5 pt-3 pb-2 bg-slate-950/40 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                playClick();
                setActiveTab('trailer');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold font-heading transition-all flex items-center gap-1.5 ${
                activeTab === 'trailer'
                  ? 'bg-sun-yellow text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Trailer Oficial</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playPageFlip();
                setActiveTab('trivia');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold font-heading transition-all flex items-center gap-1.5 ${
                activeTab === 'trivia'
                  ? 'bg-sun-yellow text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Bastidores da Thalita</span>
            </button>
          </div>

          <a
            href={`https://www.youtube.com/watch?v=${movie.trailerId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-mono text-slate-400 hover:text-sun-yellow flex items-center gap-1 transition-colors"
          >
            <span>Ver no YouTube</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Conteúdo Central: Player Sob Demanda ou Bastidores */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[65vh]">
          {activeTab === 'trailer' ? (
            <div className="space-y-4">
              {/* Reprodutor de Trailer em Iframe Carregado Estritamente Sob Demanda */}
              <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black border border-slate-700 shadow-2xl">
                {movie.trailerId ? (
                  <>
                    {!isIframeLoaded && (
                      <SkeletonCard
                        variant="trailer-player"
                        className="absolute inset-0 z-10 w-full h-full"
                      />
                    )}
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${movie.trailerId}?autoplay=1&rel=0&modestbranding=1`}
                      title={`Trailer oficial de ${movie.title}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      onLoad={() => setIsIframeLoaded(true)}
                      className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${
                        isIframeLoaded ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400 p-6 text-center space-y-2">
                    <Film className="w-10 h-10 text-slate-600" />
                    <p className="text-sm">Trailer disponível no canal oficial da distribuidora.</p>
                  </div>
                )}
              </div>

              {/* Informações Complementares do Filme */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-2.5">
                  <Award className="w-4 h-4 text-sun-yellow shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-200 font-heading">Reconhecimento</strong>
                    <span className="text-slate-400">{movie.highlight}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-sun-yellow shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-200 font-heading">Duração & Formato</strong>
                    <span className="text-slate-400">{movie.duration || '1h 40min'} · Formato Longa-Metragem</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-2.5">
                  <Calendar className="w-4 h-4 text-sun-yellow shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-200 font-heading">Lançamento</strong>
                    <span className="text-slate-400">Estreia Oficial em {movie.year}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Aba: Bastidores & Curiosidades das Telas Contados pela Autora */
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-pink-950/40 via-slate-950 to-slate-950 border border-pink-500/30 space-y-3">
                <div className="flex items-center gap-2 text-pop-pink font-heading font-black text-sm uppercase tracking-wider">
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Segredos de Bastidores por Thalita Rebouças 💬</span>
                </div>
                <p className="text-slate-200 text-sm sm:text-base leading-relaxed font-body">
                  {movie.trivia || 'Thalita acompanhou de perto cada detalhe da produção, garantindo que a essência divertida e acolhedora dos livros chegasse com perfeição às telas.'}
                </p>
              </div>

              {/* Sinopse da Adaptação */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-heading">
                  Sinopse Oficial
                </h4>
                <p className="text-slate-300 text-sm leading-relaxed font-body">
                  {movie.synopsis}
                </p>
              </div>

              {/* Elenco Completo */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-heading font-bold">
                  <Users className="w-3.5 h-3.5 text-sun-yellow" />
                  <span>Elenco Estrelar da Adaptação:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {movie.cast.map((actor) => (
                    <span
                      key={actor}
                      className="px-3 py-1 rounded-lg bg-slate-800 text-slate-200 text-xs font-mono border border-slate-700/80"
                    >
                      {actor}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Rodapé do Modal */}
        <div className="p-3.5 sm:p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="font-handwriting text-base text-sun-yellow">
            Cine-Thalita · Da literatura para o mundo 🎬
          </span>
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-heading font-bold text-xs transition-colors"
          >
            Fechar Janela
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
