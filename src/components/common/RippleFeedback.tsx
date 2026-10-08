import React, { useState, useCallback, useRef, useEffect } from 'react';
import { triggerHaptic, HapticPattern } from '@/utils/haptics';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

export interface RippleItem {
  id: number;
  x: number;
  y: number;
  size: number;
  color?: string;
}

export interface BurstParticle {
  id: number;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  rotation: number;
  emoji?: string;
  color?: string;
}

export interface RippleFeedbackProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  rippleColor?: string;
  haptic?: HapticPattern | false;
  enableBurst?: boolean;
  burstEmojis?: string[];
  disabled?: boolean;
  className?: string;
}

const DEFAULT_BURST_EMOJIS = ['✨', '⭐', '💛', '🌸', '💖'];

/**
 * RippleFeedback / RippleContainer:
 * Envolve elementos interativos adicionando ondulação elástica ("ripple pop")
 * micro-burst festivo de partículas e resposta física háptica (mobile vibration).
 */
export const RippleFeedback: React.FC<RippleFeedbackProps> = ({
  children,
  rippleColor = 'rgba(255, 42, 133, 0.28)', // Rosa pop translúcido padrão
  haptic = 'medium',
  enableBurst = true,
  burstEmojis = DEFAULT_BURST_EMOJIS,
  disabled = false,
  className = '',
  onPointerDown,
  ...rest
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const [ripples, setRipples] = useState<RippleItem[]>([]);
  const [particles, setParticles] = useState<BurstParticle[]>([]);
  const nextIdRef = useRef(0);

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    onPointerDown?.(e);

    if (disabled || !containerRef.current) return;

    // Dispara a vibração física no smartphone
    if (haptic) {
      triggerHaptic(haptic);
    }

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const size = Math.max(rect.width, rect.height) * 2;

    const rippleId = ++nextIdRef.current;
    const newRipple: RippleItem = {
      id: rippleId,
      x,
      y,
      size,
      color: rippleColor,
    };

    setRipples((prev) => [...prev, newRipple]);

    // Micro-burst de partículas caso não haja preferência por redução de movimento
    if (enableBurst && !prefersReduced) {
      const particleCount = 4;
      const newParticles: BurstParticle[] = [];

      for (let i = 0; i < particleCount; i++) {
        const angle = (i * (360 / particleCount) + Math.random() * 30 - 15) * (Math.PI / 180);
        const distance = 26 + Math.random() * 28;
        const targetX = Math.cos(angle) * distance;
        const targetY = Math.sin(angle) * distance;
        const emoji = burstEmojis[Math.floor(Math.random() * burstEmojis.length)];

        newParticles.push({
          id: ++nextIdRef.current,
          x,
          y,
          targetX,
          targetY,
          rotation: Math.random() * 70 - 35,
          emoji,
        });
      }

      setParticles((prev) => [...prev, ...newParticles]);
    }
  }, [disabled, haptic, rippleColor, enableBurst, prefersReduced, burstEmojis, onPointerDown]);

  // Limpeza automática de ripples após o término da animação
  useEffect(() => {
    if (ripples.length === 0) return;

    const timer = setTimeout(() => {
      setRipples((prev) => prev.slice(1));
    }, 600);

    return () => clearTimeout(timer);
  }, [ripples]);

  // Limpeza automática de partículas
  useEffect(() => {
    if (particles.length === 0) return;

    const timer = setTimeout(() => {
      setParticles([]);
    }, 550);

    return () => clearTimeout(timer);
  }, [particles]);

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      className={`relative overflow-hidden select-none ${className}`}
      {...rest}
    >
      {children}

      {/* Camada visual de ripples elásticos */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10" aria-hidden="true">
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="absolute rounded-full animate-ripple-pop"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: ripple.size,
              height: ripple.size,
              backgroundColor: ripple.color,
            }}
          />
        ))}

        {/* Micro-burst de partículas */}
        {particles.map((p) => (
          <span
            key={p.id}
            className="absolute text-xs animate-particle-burst select-none"
            style={{
              left: p.x,
              top: p.y,
              ['--tw-burst-x' as string]: `${p.targetX}px`,
              ['--tw-burst-y' as string]: `${p.targetY}px`,
              ['--tw-burst-rot' as string]: `${p.rotation}deg`,
            }}
          >
            {p.emoji}
          </span>
        ))}
      </div>
    </div>
  );
};
