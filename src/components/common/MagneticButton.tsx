import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { useDeviceCapability } from '@/hooks/use-device-capability';
import { useAudio } from '@/hooks/use-audio';
import { triggerHaptic, HapticPattern } from '@/utils/haptics';

export interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  strength?: number; // Intensidade do magnetismo (0.1 a 0.6)
  maxOffset?: number; // Deslocamento máximo em pixels para manter elegância
  activeAudio?: boolean; // Se deve tocar som de clique padrão
  haptic?: HapticPattern | false; // Padrão de vibração física mobile
  enableRipple?: boolean; // Se deve renderizar o efeito Touch Ripple Pop
  rippleColor?: string; // Cor personalizada do efeito de ripple
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
  haptic = 'medium',
  enableRipple = true,
  rippleColor = 'rgba(255, 42, 133, 0.25)',
  className = '',
  onClick,
  onPointerDown,
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
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number; size: number }[]>([]);
  const nextRippleId = useRef(0);
  const rafId = useRef<number | null>(null);

  // Desativa magnetismo em telas sensíveis ao toque ou modo a11y
  const isDisabledMagnetic = disabled || prefersReduced || isTouchDevice;

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    onPointerDown?.(e);

    if (disabled) return;

    // Resposta física háptica no smartphone
    if (haptic) {
      triggerHaptic(haptic);
    }

    // Cria o ripple centrado no ponto do clique/toque
    if (enableRipple && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const size = Math.max(rect.width, rect.height) * 2;

      const rippleId = ++nextRippleId.current;
      setRipples((prev) => [...prev, { id: rippleId, x, y, size }]);
    }
  };

  // Limpeza de ripples antigos
  useEffect(() => {
    if (ripples.length === 0) return;
    const timer = setTimeout(() => {
      setRipples((prev) => prev.slice(1));
    }, 550);
    return () => clearTimeout(timer);
  }, [ripples]);

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
      onPointerDown={handlePointerDown}
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
      {/* Camada visual de ripples elásticos */}
      {enableRipple && (
        <span className="absolute inset-0 overflow-hidden rounded-[inherit] pointer-events-none z-0" aria-hidden="true">
          {ripples.map((ripple) => (
            <span
              key={ripple.id}
              className="absolute rounded-full animate-ripple-pop"
              style={{
                left: ripple.x,
                top: ripple.y,
                width: ripple.size,
                height: ripple.size,
                backgroundColor: rippleColor,
              }}
            />
          ))}
        </span>
      )}
      <span className="relative z-10 inline-flex items-center justify-center w-full h-full">
        {children}
      </span>
    </button>
  );
};

