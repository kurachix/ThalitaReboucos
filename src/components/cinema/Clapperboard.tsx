import React, { useState, useRef, useCallback } from 'react';
import { Movie } from '@/types';
import { useAudio } from '@/hooks/use-audio';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { Sparkles, Film, Play, CheckCircle } from 'lucide-react';

interface ClapperboardProps {
  currentMovie: Movie;
  movieIndex: number;
  isProjectorOn: boolean;
  onClap: (movie: Movie) => void;
  className?: string;
}

export const Clapperboard: React.FC<ClapperboardProps> = ({
  currentMovie,
  movieIndex,
  isProjectorOn,
  onClap,
  className = '',
}) => {
  const { playClapper } = useAudio();
  const prefersReduced = useReducedMotion();

  // Estados de física e rotação da haste da claquete
  const [stickAngle, setStickAngle] = useState(0); // Em graus (0 a -32)
  const [isDragging, setIsDragging] = useState(false);
  const [isClapping, setIsClapping] = useState(false);
  const [showClackBurst, setShowClackBurst] = useState(false);
  const [takeCount, setTakeCount] = useState(1);

  const startYRef = useRef(0);
  const stickRef = useRef<HTMLDivElement>(null);

  // Executa o impacto realista da claquete
  const triggerClapImpact = useCallback(() => {
    setIsClapping(true);
    setStickAngle(0); // Bate rápido no batente fixo

    // Dispara o som de impacto imediato
    playClapper();
    setShowClackBurst(true);
    setTakeCount((prev) => prev + 1);

    // Notifica o componente pai para acender o feixe de luz do projetor
    onClap(currentMovie);

    // Remove o burst visual após 600ms
    const timer = setTimeout(() => {
      setIsClapping(false);
      setShowClackBurst(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [playClapper, onClap, currentMovie]);

  // Clique rápido para bater
  const handleQuickClap = useCallback(() => {
    if (isClapping) return;

    if (prefersReduced) {
      triggerClapImpact();
      return;
    }

    // Abre a haste para -28 graus e bate rapidamente com mola
    setIsClapping(true);
    setStickAngle(-28);

    setTimeout(() => {
      triggerClapImpact();
    }, 180);
  }, [isClapping, prefersReduced, triggerClapImpact]);

  // Suporte a Arrastar (Drag & Release) com Pointer Events
  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    startYRef.current = e.clientY;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaY = e.clientY - startYRef.current;
    // Puxar para cima (deltaY negativo) abre a haste (ângulo negativo)
    const newAngle = Math.max(-35, Math.min(0, deltaY * 0.45));
    setStickAngle(newAngle);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore se o pointer capture já foi liberado
    }

    // Se puxou pelo menos -8 graus, bate a claquete!
    if (stickAngle <= -8) {
      triggerClapImpact();
    } else {
      // Retorna suavemente para a posição fechada
      setStickAngle(0);
    }
  };

  // Suporte a teclado acessível (Enter ou Espaço)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleQuickClap();
    }
  };

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      
      {/* Balão de Impacto "CLACK! 💥 AÇÃO!" */}
      {showClackBurst && (
        <div className="absolute -top-12 z-40 animate-bounce pointer-events-none">
          <div className="px-3 py-1 rounded-full bg-sun-yellow text-slate-950 font-heading font-black text-xs uppercase tracking-wider shadow-lg border-2 border-white flex items-center gap-1.5 transform rotate-[-3deg] scale-110">
            <Sparkles className="w-4 h-4 text-amber-950 fill-current" />
            <span>CLACK! AÇÃO! 🎬</span>
          </div>
        </div>
      )}

      {/* Caixa de Sombreamento e Perspectiva da Claquete */}
      <div 
        role="button"
        tabIndex={0}
        aria-label={`Claquete de cinema para ${currentMovie.title}. Clique ou puxe a haste para bater.`}
        onKeyDown={handleKeyDown}
        onClick={handleQuickClap}
        className="group relative w-72 sm:w-80 cursor-pointer focus:outline-none focus:ring-4 focus:ring-sun-yellow/50 rounded-xl"
      >
        {/* ======================================================== */}
        {/* HASTE MÓVEL SUPERIOR (ARTICULADA NA DOBRADIÇA ESQUERDA) */}
        {/* ======================================================== */}
        <div className="relative h-9 z-20">
          <div
            ref={stickRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className={`absolute left-0 right-0 h-9 rounded-t-md border-2 border-slate-900 clapper-stripes shadow-md cursor-grab active:cursor-grabbing origin-bottom-left ${
              isDragging ? '' : 'transition-transform duration-200 ease-out'
            }`}
            style={{
              transform: `rotate(${stickAngle}deg)`,
              transformOrigin: '12px 100%',
              touchAction: 'none',
            }}
            title="Puxe a haste para cima e solte para bater a claquete!"
          >
            {/* Parafuso Metálico da Dobradiça (Hinge Bolt) */}
            <div className="absolute left-2.5 bottom-1.5 w-3.5 h-3.5 rounded-full bg-gradient-to-br from-slate-200 to-slate-400 border border-slate-700 shadow-inner flex items-center justify-center pointer-events-none">
              <div className="w-1.5 h-0.5 bg-slate-700 rotate-45" />
            </div>

            {/* Dica de arraste na haste */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-heading font-extrabold uppercase bg-black/60 text-white/90 px-1.5 py-0.5 rounded-xs backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Puxe ⇡
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* HASTE FIXA INFERIOR (BASE DE CONTATO DA BATIDA)          */}
        {/* ======================================================== */}
        <div className="relative h-7 rounded-none border-x-2 border-b-2 border-slate-900 clapper-stripes shadow-inner z-10">
          {/* Parafuso de fixação inferior */}
          <div className="absolute left-2.5 top-1.5 w-3.5 h-3.5 rounded-full bg-gradient-to-br from-slate-200 to-slate-400 border border-slate-700 shadow-inner flex items-center justify-center pointer-events-none">
            <div className="w-1.5 h-0.5 bg-slate-700 -rotate-45" />
          </div>
        </div>

        {/* ======================================================== */}
        {/* CORPO DA LOUSA (ARDÓSIA COM ESCRITA EM GIZ)              */}
        {/* ======================================================== */}
        <div className="bg-slate-950 text-white rounded-b-xl border-x-2 border-b-2 border-slate-800 p-4 shadow-2xl relative overflow-hidden">
          
          {/* Textura sutil de ardósia / giz */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-black/40 pointer-events-none" />

          {/* Cabeçalho da Produção */}
          <div className="flex items-center justify-between pb-2 border-b border-white/20 text-xs">
            <div className="flex items-center gap-1.5 font-heading font-black tracking-wider text-sun-yellow">
              <Film className="w-3.5 h-3.5" />
              <span>PRODUÇÃO: CINE-THALITA</span>
            </div>

            <div className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${isProjectorOn ? 'bg-red-500 animate-ping' : 'bg-slate-600'}`} />
              <span className="font-mono text-[10px] uppercase tracking-wider text-slate-300">
                {isProjectorOn ? 'REC 🔴' : 'STANDBY'}
              </span>
            </div>
          </div>

          {/* Grade de Informações de Gravação */}
          <div className="grid grid-cols-3 gap-2 py-2.5 border-b border-white/20 text-center font-mono">
            <div className="border-r border-white/20 pr-1">
              <span className="block text-[9px] text-slate-400 uppercase font-sans">CENA</span>
              <strong className="text-base text-white">0{movieIndex + 1}</strong>
            </div>

            <div className="border-r border-white/20 pr-1">
              <span className="block text-[9px] text-slate-400 uppercase font-sans">TAKE</span>
              <strong className="text-base text-sun-yellow font-bold">
                {takeCount.toString().padStart(2, '0')}
              </strong>
            </div>

            <div>
              <span className="block text-[9px] text-slate-400 uppercase font-sans">ANO</span>
              <strong className="text-base text-white">{currentMovie.year}</strong>
            </div>
          </div>

          {/* Dados do Filme Selecionado e Direção */}
          <div className="pt-2.5 space-y-1.5 font-mono text-left">
            <div>
              <span className="block text-[9px] text-slate-400 uppercase font-sans">FILME</span>
              <p className="text-sm font-bold text-white font-heading truncate">
                {currentMovie.title}
              </p>
            </div>

            <div className="flex items-center justify-between text-[11px] pt-1">
              <div>
                <span className="text-[9px] text-slate-400 uppercase font-sans block">DIREÇÃO</span>
                <span className="text-slate-300 truncate max-w-[150px] block">
                  {currentMovie.director}
                </span>
              </div>

              <div className="text-right">
                <span className="text-[9px] text-slate-400 uppercase font-sans block">PLATAFORMA</span>
                <span className="text-pop-pink font-bold uppercase text-[10px] font-sans">
                  {currentMovie.platformLabel.split(' ')[0]}
                </span>
              </div>
            </div>
          </div>

          {/* Rodapé Tátil da Claquete */}
          <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center gap-1 text-slate-300">
              <Play className="w-2.5 h-2.5 text-sun-yellow fill-current" />
              <span>Clique ou arraste a haste</span>
            </span>

            <span className="font-heading font-bold text-sun-yellow text-[11px] group-hover:scale-105 transition-transform">
              BATER! 🎬
            </span>
          </div>

        </div>
      </div>

      {/* Botão Secundário de Disparo Rápido */}
      <button
        type="button"
        onClick={handleQuickClap}
        className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-heading font-bold text-xs uppercase tracking-wider border border-slate-700 shadow-md transition-all active:scale-95 hover:border-sun-yellow hover:text-sun-yellow"
      >
        <Sparkles className="w-3.5 h-3.5 text-sun-yellow" />
        <span>Bater Claquete (Ação!)</span>
        {isProjectorOn && (
          <CheckCircle className="w-3.5 h-3.5 text-emerald-400 ml-1" />
        )}
      </button>

    </div>
  );
};
