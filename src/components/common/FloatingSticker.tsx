import React, { useState, useRef, useEffect } from 'react';
import { useAudio } from '@/hooks/use-audio';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { Sparkles } from 'lucide-react';

export interface StickerData {
  id: string;
  label: string;
  subtitle?: string;
  icon: string;
  bgGradient: string;
  borderColor: string;
  textColor: string;
  defaultPosition: { top?: string; bottom?: string; left?: string; right?: string };
  defaultRotation: number;
}

export interface FloatingStickerProps {
  sticker: StickerData;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

export const FloatingSticker: React.FC<FloatingStickerProps> = ({
  sticker,
  onDragStart,
  onDragEnd,
}) => {
  const { playPinPop, playClick } = useAudio();
  const prefersReduced = useReducedMotion();

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isWiggling, setIsWiggling] = useState(false);

  const stickerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ clientX: number; clientY: number; posX: number; posY: number }>({
    clientX: 0,
    clientY: 0,
    posX: 0,
    posY: 0,
  });

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Apenas botão principal (esquerdo) ou toque
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    e.stopPropagation();
    setIsDragging(true);
    playPinPop();
    onDragStart?.();

    dragStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      posX: position.x,
      posY: position.y,
    };

    try {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // Ignora erro se ponteiro já estiver capturado
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    const deltaX = e.clientX - dragStartRef.current.clientX;
    const deltaY = e.clientY - dragStartRef.current.clientY;

    setPosition({
      x: dragStartRef.current.posX + deltaX,
      y: dragStartRef.current.posY + deltaY,
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    setIsDragging(false);
    playPinPop();
    onDragEnd?.();

    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignora se o pointer capture já foi liberado
    }
  };

  const handleDoubleClick = () => {
    // Retorna para a posição original
    playClick();
    setPosition({ x: 0, y: 0 });
  };

  // Suporte a teclado acessível (Enter / Espaço faz o adesivo balançar)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      playClick();
      setIsWiggling(true);
      setTimeout(() => setIsWiggling(false), 500);
    }
  };

  // Garante que se o usuário soltar o ponteiro fora do alvo, o arraste seja finalizado
  useEffect(() => {
    const handleWindowPointerUp = () => {
      if (isDragging) {
        setIsDragging(false);
        onDragEnd?.();
      }
    };

    window.addEventListener('pointerup', handleWindowPointerUp);
    return () => window.removeEventListener('pointerup', handleWindowPointerUp);
  }, [isDragging, onDragEnd]);

  const rotation = isDragging
    ? sticker.defaultRotation + 6
    : isHovered
    ? sticker.defaultRotation - 3
    : sticker.defaultRotation;

  return (
    <div
      ref={stickerRef}
      role="button"
      tabIndex={0}
      aria-label={`Adesivo holográfico: ${sticker.label}. Clique e arraste para colar em qualquer lugar da tela, ou dê um duplo clique para restaurar a posição.`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onDoubleClick={handleDoubleClick}
      onKeyDown={handleKeyDown}
      className={`fixed z-30 select-none cursor-grab active:cursor-grabbing touch-none focus:outline-none focus-visible:ring-4 focus-visible:ring-pop-pink/60 rounded-2xl ${
        isWiggling ? 'animate-bounce' : ''
      }`}
      style={{
        ...sticker.defaultPosition,
        transform: prefersReduced
          ? `translate3d(${position.x}px, ${position.y}px, 0)`
          : `translate3d(${position.x}px, ${position.y}px, 0) rotate(${rotation}deg) scale(${
              isDragging ? 1.14 : isHovered ? 1.06 : 1
            })`,
        transition: isDragging ? 'none' : 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
      title="✦ Adesivo Arrastável! Arraste para colar onde quiser ✦"
    >
      {/* O Adesivo Vinílico em Si */}
      <div
        className={`relative px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl border-2 sm:border-3 ${sticker.borderColor} bg-gradient-to-tr ${sticker.bgGradient} ${
          isDragging
            ? 'shadow-2xl ring-4 ring-white/80'
            : isHovered
            ? 'shadow-xl'
            : 'shadow-md'
        } transition-shadow overflow-hidden flex items-center gap-2`}
      >
        {/* Camada Holográfica Shimmer (Reflexo Metálico) */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30 mix-blend-overlay"
          style={{
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,105,180,0.4) 25%, rgba(0,255,255,0.4) 50%, rgba(255,215,0,0.5) 75%, rgba(255,255,255,0.7) 100%)',
          }}
        />

        {/* Borda Vinílica Branca Estilo Sticker Recortado (Die-Cut) */}
        <div className="absolute inset-0.5 rounded-xl border border-white/60 pointer-events-none" />

        {/* Ícone / Emoji */}
        <span className="text-xl sm:text-2xl filter drop-shadow-xs transform transition-transform group-hover:scale-110">
          {sticker.icon}
        </span>

        {/* Textos do Adesivo */}
        <div className="flex flex-col">
          <span className={`font-heading font-black text-xs sm:text-sm tracking-tight ${sticker.textColor} leading-none`}>
            {sticker.label}
          </span>
          {sticker.subtitle && (
            <span className="font-handwriting text-[11px] sm:text-xs text-slate-700 leading-tight">
              {sticker.subtitle}
            </span>
          )}
        </div>

        {/* Brilho Estelar Pequeno */}
        <Sparkles className="w-3.5 h-3.5 text-sun-yellow fill-current opacity-80 shrink-0" />
      </div>
    </div>
  );
};
