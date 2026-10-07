import React, { useRef } from 'react';
import { TIMELINE_MILESTONES } from '@/data/biography';
import { PolaroidCard } from './PolaroidCard';
import { Clock, ChevronLeft, ChevronRight, Stamp, Sparkles } from 'lucide-react';
import { useAudio } from '@/hooks/use-audio';

export const TimelineSection: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { playClick } = useAudio();

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
            className="shrink-0 px-3 py-1 rounded-full text-xs font-heading font-bold bg-white/80 hover:bg-sun-yellow/40 border border-slate-200/70 text-slate-700 transition-colors flex items-center gap-1 shadow-2xs"
          >
            <Sparkles className="w-3 h-3 text-pop-pink" />
            <span>{item.year}</span>
          </button>
        ))}
      </div>

      {/* Carrossel de Polaroids com Tilt 3D */}
      <div
        ref={scrollContainerRef}
        className="flex gap-8 overflow-x-auto pb-10 pt-4 px-2 snap-x snap-mandatory scroll-smooth scrollbar-none items-stretch"
        style={{
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {TIMELINE_MILESTONES.map((milestone, index) => (
          <div key={milestone.id} className="snap-center">
            <PolaroidCard milestone={milestone} index={index} />
          </div>
        ))}
      </div>

      {/* Dica de Toque para Celulares */}
      <div className="text-center md:hidden pt-2 text-xs text-slate-400 font-body">
        👈 Deslize para os lados para explorar todas as memórias 👉
      </div>
    </section>
  );
};
