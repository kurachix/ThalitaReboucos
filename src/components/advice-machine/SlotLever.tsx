import React, { useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { useAudio } from '@/hooks/use-audio';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { triggerHaptic } from '@/utils/haptics';
import { Sparkles, RotateCcw } from 'lucide-react';
import { MagneticButton } from '@/components/common/MagneticButton';

interface SlotLeverProps {
  isSpinning: boolean;
  onPull: () => void;
}

export const SlotLever: React.FC<SlotLeverProps> = ({ isSpinning, onPull }) => {
  const { playSlotLever } = useAudio();
  const prefersReduced = useReducedMotion();

  const knobRef = useRef<HTMLDivElement>(null);
  const shaftRef = useRef<HTMLDivElement>(null);
  const leverContainerRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [dragProgress, setDragProgress] = useState(0); // 0 a 1
  const [isPulled, setIsPulled] = useState(false);
  const dragStartY = useRef(0);

  // Executa a animação física mecânica de puxar a alavanca (GSAP)
  const triggerLeverAnimation = useCallback(() => {
    if (isSpinning) return;

    playSlotLever();
    triggerHaptic('heavy');
    setIsPulled(true);

    if (prefersReduced) {
      onPull();
      setTimeout(() => setIsPulled(false), 300);
      return;
    }

    const knob = knobRef.current;
    const shaft = shaftRef.current;

    if (!knob || !shaft) {
      onPull();
      return;
    }

    // Timeline GSAP com física de compressão mecânica e retorno elástico (mola)
    const tl = gsap.timeline({
      onComplete: () => {
        setIsPulled(false);
      },
    });

    // 1. Descida enérgica: a alavanca desce ~70px e a haste inclina
    tl.to(knob, {
      y: 72,
      scale: 0.92,
      duration: 0.18,
      ease: 'power2.in',
    }, 0);

    tl.to(shaft, {
      scaleY: 0.45,
      transformOrigin: 'bottom center',
      duration: 0.18,
      ease: 'power2.in',
    }, 0);

    // Dispara o sorteio na metade do movimento
    tl.add(() => {
      onPull();
    }, 0.16);

    // 2. Retorno com snap elástico da mola interna da máquina vintage
    tl.to(knob, {
      y: 0,
      scale: 1,
      duration: 0.48,
      ease: 'elastic.out(1.2, 0.45)',
    }, 0.2);

    tl.to(shaft, {
      scaleY: 1,
      duration: 0.48,
      ease: 'elastic.out(1.2, 0.45)',
    }, 0.2);
  }, [isSpinning, onPull, playSlotLever, prefersReduced]);

  // Manipulação de Arraste por Toque ou Mouse (Interatividade Tátil)
  const handlePointerDown = (e: React.PointerEvent) => {
    if (isSpinning || isPulled) return;
    setIsDragging(true);
    dragStartY.current = e.clientY;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || isSpinning || isPulled) return;
    const deltaY = Math.max(0, e.clientY - dragStartY.current);
    const progress = Math.min(1, deltaY / 70);
    setDragProgress(progress);

    if (knobRef.current && shaftRef.current) {
      gsap.set(knobRef.current, { y: progress * 65 });
      gsap.set(shaftRef.current, { scaleY: 1 - progress * 0.5, transformOrigin: 'bottom center' });
    }

    // Se puxou o suficiente (>70%), engata o disparo!
    if (progress >= 0.85) {
      setIsDragging(false);
      setDragProgress(0);
      triggerLeverAnimation();
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);

    if (dragProgress >= 0.5) {
      triggerLeverAnimation();
    } else {
      // Retorna suave se soltou antes do gatilho
      if (knobRef.current && shaftRef.current) {
        gsap.to(knobRef.current, { y: 0, duration: 0.25, ease: 'back.out(1.5)' });
        gsap.to(shaftRef.current, { scaleY: 1, duration: 0.25, ease: 'back.out(1.5)' });
      }
    }
    setDragProgress(0);
  };

  return (
    <div className="flex flex-col items-center justify-center select-none">
      {/* ======================================================== */}
      {/* ALAVANCA MECÂNICA RETRÔ ESTILO ONE-ARMED BANDIT          */}
      {/* ======================================================== */}
      <div
        ref={leverContainerRef}
        onClick={() => {
          if (!isDragging && !isSpinning) triggerLeverAnimation();
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        role="button"
        tabIndex={0}
        aria-label="Puxar alavanca da máquina de conselhos"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            triggerLeverAnimation();
          }
        }}
        className={`group relative flex flex-col items-center cursor-grab active:cursor-grabbing p-2 focus:outline-none focus:ring-4 focus:ring-sun-yellow/80 rounded-2xl transition-transform ${
          isSpinning ? 'opacity-80 pointer-events-none' : 'hover:scale-105'
        }`}
        title="Puxe para baixo ou clique para girar a roleta!"
      >
        {/* Esfera Vermelha / Pop-Pink com Efeito 3D Specular */}
        <div
          ref={knobRef}
          className="relative z-20 w-16 h-16 sm:w-18 sm:h-18 rounded-full border-4 border-white shadow-[0_12px_28px_rgba(255,42,133,0.45)] flex items-center justify-center transition-shadow group-hover:shadow-[0_16px_36px_rgba(255,42,133,0.65)]"
          style={{
            background: 'radial-gradient(circle at 35% 30%, #FFF59D 0%, #FF2A85 45%, #C2185B 80%, #880E4F 100%)',
          }}
        >
          {/* Brilho Especular Superior do Vidro/Baquelite */}
          <div className="absolute top-1.5 left-2.5 w-6 h-3 bg-white/60 rounded-full blur-[1px] rotate-[-25deg] pointer-events-none" />
          
          <Sparkles className="w-7 h-7 text-white drop-shadow-md animate-pulse" />

          {/* Anel Cromado de Junção da Esfera com a Haste */}
          <div className="absolute -bottom-2 w-6 h-3 bg-gradient-to-r from-slate-400 via-white to-slate-500 rounded-sm border border-slate-600 shadow-xs" />
        </div>

        {/* Haste de Aço Inox Cromada com Gradiente Metálico Realista */}
        <div
          ref={shaftRef}
          className="w-4 h-24 sm:h-28 bg-gradient-to-r from-slate-400 via-white to-slate-500 border-x border-slate-600 shadow-md relative z-10 rounded-xs"
        >
          {/* Linha de reflexo vertical de alta definição */}
          <div className="absolute inset-y-0 left-1 w-1 bg-white/80 blur-[0.5px]" />
        </div>

        {/* Base Mecânica / Caixa de Engrenagens de Ferro Fundido */}
        <div className="relative z-20 w-20 sm:w-24 bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 rounded-xl border-2 border-slate-600 shadow-2xl p-2 flex flex-col items-center">
          {/* Parafusos metálicos industriais nos cantos */}
          <div className="w-full flex justify-between px-1 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 border border-slate-600" />
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 border border-slate-600" />
          </div>

          {/* Display LED de status da alavanca */}
          <div className="px-2 py-0.5 rounded-md bg-black/80 border border-slate-700 text-[10px] font-mono font-black text-center w-full">
            {isSpinning ? (
              <span className="text-amber-400 animate-pulse flex items-center justify-center gap-1">
                <RotateCcw className="w-2.5 h-2.5 animate-spin" /> GIRANDO
              </span>
            ) : isDragging ? (
              <span className="text-emerald-400 animate-bounce">SOLTE!</span>
            ) : (
              <span className="text-sun-yellow tracking-wider">PUXE ⇊</span>
            )}
          </div>

          <div className="w-full flex justify-between px-1 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 border border-slate-600" />
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 border border-slate-600" />
          </div>
        </div>
      </div>

      {/* Botão Magnético Auxiliar para Acionamento Instantâneo */}
      <MagneticButton
        type="button"
        disabled={isSpinning}
        onClick={triggerLeverAnimation}
        className={`mt-4 px-6 py-2.5 rounded-full font-heading font-black text-xs uppercase tracking-wider shadow-lg transition-all active:scale-95 flex items-center gap-2 ${
          isSpinning
            ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-pop-pink to-rose-600 hover:from-pop-pink-dark hover:to-rose-700 text-white shadow-pop-pink/40 hover:scale-105'
        }`}
      >
        <RotateCcw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
        <span>{isSpinning ? 'Girando Roleta...' : 'Puxar Alavanca! 🎰'}</span>
      </MagneticButton>
    </div>
  );
};
