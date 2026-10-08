import { useEffect } from 'react';
import { useAppStore } from '@/store/use-app-store';

/**
 * Hook para detectar preferência por movimento reduzido (a11y)
 * Retorna boolean reativo conectado ao store global, media query do SO e localStorage.
 */
export function useReducedMotion(): boolean {
  const isReducedMotion = useAppStore((state) => state.isReducedMotion);
  const setReducedMotion = useAppStore((state) => state.setReducedMotion);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    // Sincroniza o atributo HTML no documentElement
    document.documentElement.setAttribute('data-reduced-motion', String(isReducedMotion));

    // Ouve alterações no SO quando não houver preferência salva manual
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const listener = (event: MediaQueryListEvent) => {
      try {
        const saved = localStorage.getItem('thalita_reduced_motion');
        if (saved === null) {
          setReducedMotion(event.matches);
        }
      } catch {
        setReducedMotion(event.matches);
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    } else {
      mediaQuery.addListener(listener);
      return () => mediaQuery.removeListener(listener);
    }
  }, [isReducedMotion, setReducedMotion]);

  return isReducedMotion;
}

/**
 * Hook com métodos para inspecionar e alternar o modo de movimento reduzido
 */
export function useReducedMotionControls() {
  const isReducedMotion = useAppStore((state) => state.isReducedMotion);
  const toggleReducedMotion = useAppStore((state) => state.toggleReducedMotion);
  const setReducedMotion = useAppStore((state) => state.setReducedMotion);

  return {
    isReducedMotion,
    toggleReducedMotion,
    setReducedMotion,
  };
}
