import React, { useEffect, useState, useRef } from 'react';
import { useCursorTrail } from '@/hooks/use-cursor-trail';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { useDeviceCapability } from '@/hooks/use-device-capability';

export type CursorContextType = 
  | 'default'
  | 'clickable'
  | 'pen'       // Ateliê & Mural
  | 'search'    // Estante de Livros
  | 'clapper'   // Cine-Thalita
  | 'slot';     // Máquina de Conselhos

const CONTEXT_BADGES: Record<CursorContextType, { emoji: string; label: string } | null> = {
  default: null,
  clickable: { emoji: '👆', label: 'Clique' },
  pen: { emoji: '✍️', label: 'Autógrafo' },
  search: { emoji: '🔍', label: 'Folhear' },
  clapper: { emoji: '🎬', label: 'Ação' },
  slot: { emoji: '🎰', label: 'Girar' },
};

/**
 * CustomCursor: Cursor customizado desktop com anel magnético de seguimento,
 * identidades contextuais reativas e rastro suave de brilhos mágicos.
 * Desativa-se automaticamente em dispositivos touch e sob prefers-reduced-motion.
 */
export const CustomCursor: React.FC = () => {
  const prefersReduced = useReducedMotion();
  const { isTouchDevice } = useDeviceCapability();
  const { sparkles, addSparkle, isEnabled } = useCursorTrail();

  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [followerPos, setFollowerPos] = useState({ x: -100, y: -100 });
  const [cursorType, setCursorType] = useState<CursorContextType>('default');
  const [isVisible, setIsVisible] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);

  const rafId = useRef<number | null>(null);
  const currentPosRef = useRef({ x: -100, y: -100 });
  const followerPosRef = useRef({ x: -100, y: -100 });

  // Desativa completamente em mobile ou modo de movimento reduzido
  if (!isEnabled || prefersReduced || isTouchDevice) {
    return null;
  }

  useEffect(() => {
    // Detecta contexto do elemento sob o cursor
    const detectContext = (target: HTMLElement | null): CursorContextType => {
      if (!target) return 'default';

      // 1. Verifica se é elemento interativo/clicável
      const clickable = target.closest('button, a, input, textarea, select, [role="button"], [data-interactive="true"]');
      if (clickable) {
        return 'clickable';
      }

      // 2. Seções contextuais
      if (target.closest('#hero')) return 'pen';
      if (target.closest('#bookshelf')) return 'search';
      if (target.closest('#cinema')) return 'clapper';
      if (target.closest('#advices')) return 'slot';
      if (target.closest('#fan-wall')) return 'pen';

      return 'default';
    };

    const handlePointerMove = (e: PointerEvent) => {
      // Ignora eventos gerados por toque
      if (e.pointerType === 'touch') return;

      setIsVisible(true);
      currentPosRef.current = { x: e.clientX, y: e.clientY };
      setMousePos({ x: e.clientX, y: e.clientY });

      // Emite estrela na trilha mágica
      addSparkle(e.clientX, e.clientY);

      // Atualiza contexto
      const target = e.target as HTMLElement | null;
      setCursorType(detectContext(target));
    };

    const handlePointerDown = () => setIsMouseDown(true);
    const handlePointerUp = () => setIsMouseDown(false);

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    // Loop de interpolação suave (LERP) para o anel de seguimento
    const updateFollower = () => {
      const lerpFactor = 0.22;
      followerPosRef.current.x += (currentPosRef.current.x - followerPosRef.current.x) * lerpFactor;
      followerPosRef.current.y += (currentPosRef.current.y - followerPosRef.current.y) * lerpFactor;

      setFollowerPos({
        x: followerPosRef.current.x,
        y: followerPosRef.current.y,
      });

      rafId.current = requestAnimationFrame(updateFollower);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    rafId.current = requestAnimationFrame(updateFollower);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [addSparkle]);

  if (!isVisible) return null;

  const badge = CONTEXT_BADGES[cursorType];

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* 1. Trilha de Brilhos e Micro-Estrelas Mágicas */}
      {sparkles.map((sparkle) => (
        <span
          key={sparkle.id}
          className="absolute animate-cursor-sparkle select-none drop-shadow-xs"
          style={{
            left: sparkle.x,
            top: sparkle.y,
            fontSize: `${sparkle.size}px`,
            ['--tw-drift-x' as string]: `${sparkle.driftX}px`,
            ['--tw-drift-y' as string]: `${sparkle.driftY}px`,
            ['--tw-drift-rot' as string]: `${sparkle.rotation}deg`,
          }}
        >
          {sparkle.emoji}
        </span>
      ))}

      {/* 2. Anel Magnético Suave de Seguimento (Elastic Follower) */}
      <div
        className={`absolute rounded-full border-2 transition-transform duration-75 ease-out -translate-x-1/2 -translate-y-1/2 pointer-events-none ${
          cursorType === 'clickable'
            ? 'w-10 h-10 border-pop-pink/70 bg-pop-pink/10 shadow-[0_0_12px_rgba(255,42,133,0.35)] scale-110'
            : cursorType !== 'default'
              ? 'w-9 h-9 border-sun-yellow/80 bg-sun-yellow/15 shadow-[0_0_10px_rgba(255,209,59,0.4)] scale-105'
              : 'w-7 h-7 border-slate-700/40 bg-transparent'
        } ${isMouseDown ? 'scale-75' : ''}`}
        style={{
          left: `${followerPos.x}px`,
          top: `${followerPos.y}px`,
        }}
      />

      {/* 3. Ponto Central do Cursor Principal com Badge Contextual */}
      <div
        className={`absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center transition-transform ${
          isMouseDown ? 'scale-90' : 'scale-100'
        }`}
        style={{
          left: `${mousePos.x}px`,
          top: `${mousePos.y}px`,
        }}
      >
        {/* Ponto Central Pop */}
        <div 
          className={`w-2.5 h-2.5 rounded-full shadow-xs transition-colors ${
            cursorType === 'clickable'
              ? 'bg-pop-pink'
              : cursorType !== 'default'
                ? 'bg-sun-yellow-dark'
                : 'bg-slate-900'
          }`}
        />

        {/* Emblema / Adesivo Contextual Flutuante */}
        {badge && (
          <div 
            className="absolute left-3.5 top-3.5 flex items-center gap-1 bg-white/95 text-slate-800 text-[10px] font-heading font-extrabold px-1.5 py-0.5 rounded-full shadow-md border border-amber-200/80 animate-in fade-in zoom-in duration-150 select-none whitespace-nowrap"
          >
            <span>{badge.emoji}</span>
            <span className="hidden sm:inline text-[9px] text-slate-600 font-bold">
              {badge.label}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
