import { useState, useEffect } from 'react';

export interface DeviceCapabilities {
  isLowEnd: boolean;
  isTouchDevice: boolean;
  isMobile: boolean;
  enable3D: boolean;
  enableBlurFilters: boolean;
  particleCount: number;
}

/**
 * Hook para detectar perfil de hardware e ajustar o nível de fidelidade gráfica (Tiering)
 * Garante 60-120 FPS em celulares econômicos e evita sobrecarga em redes 3G/4G
 */
export function useDeviceCapability(): DeviceCapabilities {
  const [capabilities, setCapabilities] = useState<DeviceCapabilities>(() => {
    if (typeof window === 'undefined') {
      return {
        isLowEnd: false,
        isTouchDevice: false,
        isMobile: false,
        enable3D: true,
        enableBlurFilters: true,
        particleCount: 60,
      };
    }

    const nav = navigator as Navigator & {
      deviceMemory?: number;
      connection?: { saveData?: boolean; effectiveType?: string };
    };

    const isTouch = 'ontouchstart' in window || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);
    const isMobileViewport = window.innerWidth < 768;

    const lowCores = typeof nav.hardwareConcurrency === 'number' && nav.hardwareConcurrency <= 4;
    const lowMemory = typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 4;
    const saveData = Boolean(nav.connection?.saveData);
    const slowNetwork = nav.connection?.effectiveType === '2g' || nav.connection?.effectiveType === '3g';

    const isLow = Boolean(saveData || (lowCores && lowMemory) || slowNetwork);

    return {
      isLowEnd: isLow,
      isTouchDevice: Boolean(isTouch),
      isMobile: isMobileViewport,
      enable3D: !isLow,
      enableBlurFilters: !isLow,
      particleCount: isLow ? 15 : 50,
    };
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const nav = navigator as Navigator & {
      deviceMemory?: number;
      connection?: { saveData?: boolean; effectiveType?: string };
    };

    const isTouch = 'ontouchstart' in window || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);
    const isMobileViewport = window.innerWidth < 768;

    const lowCores = typeof nav.hardwareConcurrency === 'number' && nav.hardwareConcurrency <= 4;
    const lowMemory = typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 4;
    const saveData = Boolean(nav.connection?.saveData);
    const slowNetwork = nav.connection?.effectiveType === '2g' || nav.connection?.effectiveType === '3g';

    const isLow = Boolean(saveData || (lowCores && lowMemory) || slowNetwork);

    setCapabilities({
      isLowEnd: isLow,
      isTouchDevice: Boolean(isTouch),
      isMobile: isMobileViewport,
      enable3D: !isLow,
      enableBlurFilters: !isLow,
      particleCount: isLow ? 15 : 50,
    });

    // Sincroniza atributos no DOM para otimizações CSS automáticas
    document.documentElement.setAttribute('data-low-end', String(isLow));
    document.documentElement.setAttribute('data-touch', String(Boolean(isTouch)));

    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setCapabilities((prev) => {
        if (prev.isMobile !== mobile) {
          return { ...prev, isMobile: mobile };
        }
        return prev;
      });
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return capabilities;
}
