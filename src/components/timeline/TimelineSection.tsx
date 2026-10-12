import React, { useRef, useState, useEffect, useCallback } from 'react';
import { TIMELINE_MILESTONES } from '@/data/biography';
import { PolaroidCard } from './PolaroidCard';
import { Clock, ChevronLeft, ChevronRight, Stamp, Sparkles } from 'lucide-react';
import { useAudio } from '@/hooks/use-audio';

export const TimelineSection: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const { playClick } = useAudio();

  const handleScrollUpdate = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll > 0) {
      const progress = Math.min(100, Math.max(0, (scrollLeft / maxScroll) * 100));
      setScrollProgress(progress);

      const totalItems = TIMELINE_MILESTONES.length;
      const index = Math.min(
        totalItems - 1,
        Math.max(0, Math.round((scrollLeft / maxScroll) * (totalItems - 1)))
      );
      setActiveIndex(index);
    }
  };

  const scrollToPercent = (percent: number) => {
    if (!scrollContainerRef.current) return;
    const { scrollWidth, clientWidth } = scrollContainerRef.current;
    const maxScroll = scrollWidth - clientWidth;
    const targetScroll = (percent / 100) * maxScroll;
    scrollContainerRef.current.scrollTo({ left: targetScroll, behavior: 'smooth' });
  };

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = Math.min(100, Math.max(0, (clickX / rect.width) * 100));
    playClick();
    scrollToPercent(percent);
  };

  const handleScrubberDrag = useCallback((clientX: number) => {
    if (!trackRef.current || !scrollContainerRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const dragX = clientX - rect.left;
    const percent = Math.min(100, Math.max(0, (dragX / rect.width) * 100));
    const { scrollWidth, clientWidth } = scrollContainerRef.current;
    const maxScroll = scrollWidth - clientWidth;
    scrollContainerRef.current.scrollLeft = (percent / 100) * maxScroll;
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingRef.current) {
        handleScrubberDrag(e.clientX);
      }
    };
    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (isDraggingRef.current && e.touches[0]) {
        handleScrubberDrag(e.touches[0].clientX);
      }
    };
    const handleTouchEnd = () => {
      isDraggingRef.current = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleScrubberDrag]);

  const handleScroll = (direction: 'left' | 'right') => {
    playClick();
    if (!scrollContainerRef.current) return;
    const scrollAmount = direction === 'left' ? -380 : 380;
    scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <section 
      id="timeline" 
      className="scroll-mt-24 py-8 sm:py-12 relative"
      aria-label="Ato 2: Álbum de Figurinhas de Memórias"
    >
      {/* Cabeçalho da Seção com Identidade Scrapbook */}
      <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6 mb-10 text-center md:text-left">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 border border-sky-300 text-sky-900 text-xs font-bold uppercase tracking-wider shadow-sticker">
            <Clock className="w-3.5 h-3.5 text-sea-blue" />
            <span>Ato 2 · Álbum de Figurinhas de Memórias</span>
          </div>

          <h2 className="text-3xl sm:text-4xl xl:text-5xl font-black text-slate-900 font-heading tracking-tight">
            A Linha do Tempo em Polaroids
          </h2>

          <p className="text-slate-600 font-body text-base sm:text-lg">
            Role horizontalmente para folhear os capítulos marcantes: da máquina de escrever na infância carioca até a conquista do streaming global.
          </p>
        </div>

        {/* Controles de Navegação do Carrossel Desktop */}
        <div className="flex items-center gap-3">
          {/* Carimbo de Selo Scrapbook */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-dashed border-amber-300 text-amber-800 bg-amber-50/80 text-xs font-bold font-heading rotate-[-2deg]">
            <Stamp className="w-4 h-4 text-pop-pink" />
            <span>Bienal do Livro Oficial</span>
          </div>

          <div className="flex items-center gap-2 bg-white/90 p-1.5 rounded-full border border-slate-200/80 shadow-xs">
            <button
              type="button"
              onClick={() => handleScroll('left')}
              aria-label="Rolar memórias para a esquerda"
              className="p-2 rounded-full hover:bg-slate-100 text-slate-700 hover:text-pop-pink transition-colors active:scale-90"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => handleScroll('right')}
              aria-label="Rolar memórias para a direita"
              className="p-2 rounded-full hover:bg-slate-100 text-slate-700 hover:text-pop-pink transition-colors active:scale-90"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Faixa / Trilho de Anos em Destaque */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-2 scrollbar-none">
        {TIMELINE_MILESTONES.map((item, idx) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              playClick();
              if (scrollContainerRef.current) {
                const targetCard = scrollContainerRef.current.children[idx] as HTMLElement;
                if (targetCard) {
                  targetCard.scrollIntoView({ behavior: 'smooth', inline: 'center' });
                }
              }
            }}
            className={`shrink-0 px-3 py-1 rounded-full text-xs font-heading font-bold transition-all flex items-center gap-1 shadow-2xs ${
              idx === activeIndex
                ? 'bg-pop-pink text-white shadow-sm scale-105 ring-2 ring-pop-pink/30'
                : 'bg-white/80 hover:bg-sun-yellow/40 border border-slate-200/70 text-slate-700'
            }`}
          >
            <Sparkles className={`w-3 h-3 ${idx === activeIndex ? 'text-sun-yellow' : 'text-pop-pink'}`} />
            <span>{item.year}</span>
          </button>
        ))}
      </div>

      {/* Carrossel de Polaroids com Barra de Rolagem Estilizada, Tilt 3D e Aceleração GPU */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScrollUpdate}
        className="flex gap-8 overflow-x-auto pb-6 pt-4 px-2 snap-x snap-mandatory scroll-smooth timeline-scrollbar items-stretch gpu-accelerated-scroll"
      >
        {TIMELINE_MILESTONES.map((milestone, index) => (
          <div key={milestone.id} className="snap-center">
            <PolaroidCard milestone={milestone} index={index} />
          </div>
        ))}
      </div>

      {/* Barra de Rolagem / Régua Interativa de Memórias */}
      <div className="mt-4 px-1 select-none">
        <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-scrapbook flex flex-col gap-3">
          
          {/* Topo da Régua: Capítulo Ativo e Dica de Navegação */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs font-heading font-bold text-slate-600">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-pop-pink animate-pulse shrink-0" />
              <span className="text-slate-800 font-extrabold text-sm truncate">
                Capítulo em foco: <span className="text-pop-pink">{TIMELINE_MILESTONES[activeIndex]?.year}</span> — {TIMELINE_MILESTONES[activeIndex]?.title}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-body self-end sm:self-auto">
              <span>Arraste ou clique na régua</span>
              <span className="text-sun-yellow font-bold">✨</span>
            </div>
          </div>

          {/* Trilho Interativo / Régua com Efeito Scrapbook */}
          <div
            ref={trackRef}
            onClick={handleTrackClick}
            className="relative h-5 bg-amber-50/90 rounded-full border border-amber-200/90 shadow-inner cursor-pointer flex items-center px-1 group transition-colors hover:bg-amber-100/80"
            title="Clique ou arraste para navegar na linha do tempo"
          >
            {/* Linha pontilhada de costura retrô */}
            <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 h-0.5 border-t border-dashed border-amber-300 pointer-events-none" />

            {/* Barra de Preenchimento Gradiente Suave */}
            <div
              className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-pop-pink via-tangerine to-sun-yellow rounded-full transition-all duration-100 shadow-xs opacity-90"
              style={{ width: `${Math.max(3, scrollProgress)}%` }}
            />

            {/* Marcadores de Anos no Trilho */}
            {TIMELINE_MILESTONES.map((m, idx) => {
              const positionPercent = (idx / (TIMELINE_MILESTONES.length - 1)) * 100;
              const isPastOrCurrent = idx <= activeIndex;
              return (
                <div
                  key={m.id}
                  className="absolute -translate-x-1/2 flex flex-col items-center pointer-events-none transition-transform z-10"
                  style={{ left: `${positionPercent}%` }}
                >
                  <div
                    className={`w-2.5 h-2.5 rounded-full border-2 border-white transition-all ${
                      idx === activeIndex
                        ? 'bg-pop-pink scale-150 shadow-md ring-2 ring-pop-pink/40'
                        : isPastOrCurrent
                          ? 'bg-amber-400 scale-110'
                          : 'bg-slate-300'
                    }`}
                  />
                </div>
              );
            })}

            {/* Marcador Deslizante / Thumb com Ícone */}
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white border-2 border-pop-pink shadow-md flex items-center justify-center cursor-grab active:cursor-grabbing hover:scale-110 transition-transform z-20 group-hover:shadow-lg"
              style={{ left: `${scrollProgress}%` }}
              onMouseDown={(e) => {
                e.stopPropagation();
                isDraggingRef.current = true;
              }}
              onTouchStart={(e) => {
                e.stopPropagation();
                isDraggingRef.current = true;
              }}
            >
              <Sparkles className="w-4 h-4 text-pop-pink animate-pulse" />
            </div>
          </div>

          {/* Marcadores Inferiores de Progresso */}
          <div className="flex justify-between items-center text-[11px] font-mono font-bold text-slate-400 px-1 pt-0.5">
            <span>{TIMELINE_MILESTONES[0]?.year} (Início)</span>
            <span className="text-slate-600 font-heading bg-amber-100/70 px-2.5 py-0.5 rounded-full border border-amber-200/60 shadow-2xs">
              {Math.round(scrollProgress)}% da Linha do Tempo
            </span>
            <span>{TIMELINE_MILESTONES[TIMELINE_MILESTONES.length - 1]?.year} (Hoje)</span>
          </div>

        </div>
      </div>

      {/* Dica de Toque para Celulares */}
      <div className="text-center md:hidden pt-3 text-xs text-slate-400 font-body">
        👈 Deslize para os lados para explorar todas as memórias 👉
      </div>
    </section>
  );
};
