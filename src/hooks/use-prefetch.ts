import { useRef, useCallback, useEffect } from 'react';

// Conjunto para evitar injeções repetidas de tags link no <head>
const preconnectedOrigins = new Set<string>();
const prefetchedAssets = new Set<string>();

/**
 * Pré-conecta a uma origem externa inserindo tags <link rel="preconnect"> e <link rel="dns-prefetch">
 */
export function preconnectOrigin(originUrl: string) {
  if (typeof document === 'undefined') return;
  if (preconnectedOrigins.has(originUrl)) return;

  preconnectedOrigins.add(originUrl);

  try {
    // 1. DNS Prefetch (resolução antecipada de IP)
    const dnsLink = document.createElement('link');
    dnsLink.rel = 'dns-prefetch';
    dnsLink.href = originUrl;
    document.head.appendChild(dnsLink);

    // 2. Preconnect (handshake TCP/TLS antecipado)
    const preconnectLink = document.createElement('link');
    preconnectLink.rel = 'preconnect';
    preconnectLink.href = originUrl;
    preconnectLink.crossOrigin = 'anonymous';
    document.head.appendChild(preconnectLink);
  } catch (err) {
    console.warn('[use-prefetch] Falha ao pré-conectar com origem:', originUrl, err);
  }
}

/**
 * Pré-carrega uma imagem diretamente no cache de memória do navegador
 */
export function prefetchImage(imageUrl: string): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || prefetchedAssets.has(imageUrl)) {
      resolve();
      return;
    }

    prefetchedAssets.add(imageUrl);
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve(); // Resolução suave mesmo se 404
    img.src = imageUrl;
  });
}

/**
 * Otimização de Latência Zero para Trailers do YouTube:
 * Pré-aquece conexões com o YouTube nocookie, CDN de imagens e carrega a thumbnail HD
 */
export function prefetchYouTubeTrailer(trailerId: string | undefined) {
  if (!trailerId) return;

  // Pré-conectar aos domínios essenciais de streaming do YouTube
  preconnectOrigin('https://www.youtube-nocookie.com');
  preconnectOrigin('https://www.youtube.com');
  preconnectOrigin('https://i.ytimg.com');
  preconnectOrigin('https://googleads.g.doubleclick.net');

  // Pré-carregar a thumbnail oficial de alta qualidade da miniatura do filme
  const thumbnailUrl = `https://i.ytimg.com/vi/${trailerId}/hqdefault.jpg`;
  prefetchImage(thumbnailUrl);
}

/**
 * Pré-aquece recursos e sintetizador de voz para um livro específico
 */
export function prefetchBookDetails(bookId: string) {
  if (typeof window === 'undefined') return;
  
  // Aquece vozes do sintetizador de fala (Web Speech API) caso o usuário queira ouvir o trecho
  if ('speechSynthesis' in window) {
    try {
      window.speechSynthesis.getVoices();
    } catch {}
  }

  prefetchedAssets.add(`book-${bookId}`);
}

/**
 * Hook utilitário para disparar pré-carregamento com atraso intencional ao passar o mouse (> 100ms)
 * Evita chamadas desnecessárias se o usuário apenas cruzar a tela com o ponteiro do mouse rapidamente.
 */
export function useHoverPrefetch(
  prefetchFn: () => void,
  delayMs: number = 100
) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startPrefetchTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      prefetchFn();
      timerRef.current = null;
    }, delayMs);
  }, [prefetchFn, delayMs]);

  const cancelPrefetchTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Em dispositivos móveis (touch), disparamos imediatamente no toque inicial
  const handleTouchStart = useCallback(() => {
    prefetchFn();
  }, [prefetchFn]);

  // Limpeza de timers ao desmontar o componente
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return {
    onMouseEnter: startPrefetchTimer,
    onMouseLeave: cancelPrefetchTimer,
    onFocus: startPrefetchTimer,
    onBlur: cancelPrefetchTimer,
    onTouchStart: handleTouchStart,
  };
}
