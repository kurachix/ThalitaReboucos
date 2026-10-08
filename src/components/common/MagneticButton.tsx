import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { useDeviceCapability } from '@/hooks/use-device-capability';
import { useAudio } from '@/hooks/use-audio';

export interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  strength?: number; // Intensidade do magnetismo (0.1 a 0.6)
  maxOffset?: number; // Deslocamento máximo em pixels para manter elegância
  activeAudio?: boolean; // Se deve tocar som de clique padrão
  className?: string;
}

/**
 * MagneticButton: Botão com microinteração magnética suave.
 * Atrai-se suavemente em direção ao cursor no desktop e desativa-se
 * automaticamente em dispositivos touch ou quando movimento reduzido estiver ativo.
 */
export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  strength = 0.32,
  maxOffset = 18,
  activeAudio = true,
  className = '',
  onClick,
  disabled = false,
  ...rest
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const prefersReduced = useReducedMotion();
  const { isTouchDevice } = useDeviceCapability();
  const { playClick } = useAudio();

  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isPointerMoving, setIsPointerMoving] = useState(false);
  const rafId = useRef<number | null>(null);

  // Desativa magnetismo em telas sensíveis ao toque ou modo a11y
  const isDisabledMagnetic = disabled || prefersReduced || isTouchDevice;

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLButtonElement>) => {
    if (isDisabledMagnetic || !buttonRef.current) return;

    if (rafId.current) cancelAnimationFrame(rafId.current);

    rafId.current = requestAnimationFrame(() => {
      if (!buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;

      // Limita dentro do raio máximo estético
      const clampedX = Math.max(-maxOffset, Math.min(maxOffset, deltaX));
      const clampedY = Math.max(-maxOffset, Math.min(maxOffset, deltaY));

      setIsPointerMoving(true);
      setOffset({ x: clampedX, y: clampedY });
    });
  }, [isDisabledMagnetic, strength, maxOffset]);

  const handlePointerEnter = () => {
    if (!isDisabledMagnetic) {
      setIsHovered(true);
    }
  };

  const handlePointerLeave = () => {
    if (isDisabledMagnetic) return;
    if (rafId.current) cancelAnimationFrame(rafId.current);

    setIsHovered(false);
    setIsPointerMoving(false);
    // Efeito de mola de retorno para o centro original
    setOffset({ x: 0, y: 0 });
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (activeAudio) {
      playClick();
    }
    onClick?.(e);
  };

  useEffect(() => {
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <button
      ref={buttonRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onClick={handleClick}
      disabled={disabled}
      className={`relative inline-flex items-center justify-center transition-all select-none will-change-transform ${className}`}
      style={{
        transform: isDisabledMagnetic
          ? 'none'
          : `translate3d(${offset.x}px, ${offset.y}px, 0px) ${isHovered ? 'scale(1.02)' : 'scale(1)'}`,
        transition: isPointerMoving
          ? 'transform 0.08s ease-out'
          : 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease',
      }}
      {...rest}
    >
      {children}
    </button>
  );
};
