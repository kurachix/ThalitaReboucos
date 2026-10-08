import { useState, useEffect, useRef, useCallback } from 'react';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { useDeviceCapability } from '@/hooks/use-device-capability';

export interface CursorSparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  emoji: string;
  driftX: number;
  driftY: number;
}

const TRAIL_EMOJIS = ['✨', '⭐', '💫', '🌸', '💛'];
const MAX_SPARKLES = 10;
const THROTTLE_MS = 48; // Intervalo ideal para fluidez contínua sem pesar CPU/GPU

/**
 * Hook para gerenciar a emissão de micro-estrelas/brilhos mágicos
 * que seguem o cursor no desktop com aceleração por GPU.
 * Desativa-se automaticamente em dispositivos touch e sob movimento reduzido.
 */
export function useCursorTrail() {
  const prefersReduced = useReducedMotion();
  const { isTouchDevice } = useDeviceCapability();
  const [sparkles, setSparkles] = useState<CursorSparkle[]>([]);

  const lastEmitTimeRef = useRef(0);
  const nextIdRef = useRef(0);

  const addSparkle = useCallback((clientX: number, clientY: number) => {
    if (prefersReduced || isTouchDevice) return;

    const now = performance.now();
    if (now - lastEmitTimeRef.current < THROTTLE_MS) return;
    lastEmitTimeRef.current = now;

    const emoji = TRAIL_EMOJIS[Math.floor(Math.random() * TRAIL_EMOJIS.length)];
    const driftAngle = Math.random() * Math.PI * 2;
    const driftDist = 10 + Math.random() * 16;
    const driftX = Math.cos(driftAngle) * driftDist;
    const driftY = Math.sin(driftAngle) * driftDist - 12; // Leve flutuação para cima

    const newSparkle: CursorSparkle = {
      id: ++nextIdRef.current,
      x: clientX,
      y: clientY,
      size: 11 + Math.random() * 6,
      rotation: Math.random() * 60 - 30,
      emoji,
      driftX,
      driftY,
    };

    setSparkles((prev) => {
      const slice = prev.length >= MAX_SPARKLES ? prev.slice(prev.length - MAX_SPARKLES + 1) : prev;
      return [...slice, newSparkle];
    });
  }, [prefersReduced, isTouchDevice]);

  // Limpeza automática dos brilhos após a animação de saída
  useEffect(() => {
    if (sparkles.length === 0) return;

    const timer = setTimeout(() => {
      setSparkles((prev) => (prev.length > 0 ? prev.slice(1) : prev));
    }, 450);

    return () => clearTimeout(timer);
  }, [sparkles]);

  return {
    sparkles,
    addSparkle,
    isEnabled: !prefersReduced && !isTouchDevice,
  };
}
