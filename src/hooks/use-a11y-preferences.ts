import { useState, useEffect, useCallback } from 'react';

export type FontSizeOption = 'normal' | 'large' | 'xlarge';

export interface A11yPreferences {
  fontSize: FontSizeOption;
  dyslexicFont: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
  readingRuler: boolean;
  vlibrasEnabled: boolean;
}

const DEFAULT_PREFS: A11yPreferences = {
  fontSize: 'normal',
  dyslexicFont: false,
  highContrast: false,
  reducedMotion: false,
  readingRuler: false,
  vlibrasEnabled: false,
};

const STORAGE_KEY = 'thalita_a11y_prefs';

/**
 * Inicializador da Suíte Oficial de Tradução em LIBRAS (VLibras - Governo Federal)
 */
export function mountVLibrasScript() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  // Evita reinjeção se o container já estiver presente
  if (document.getElementById('vlibras-widget-container')) {
    const accessBtn = document.querySelector('[vw-access-button]') as HTMLElement;
    if (accessBtn) {
      accessBtn.style.display = 'block';
    }
    return;
  }

  // 1. Cria a estrutura DOM exigida pelo VLibras
  const container = document.createElement('div');
  container.id = 'vlibras-widget-container';
  container.innerHTML = `
    <div vw class="enabled">
      <div vw-access-button class="active"></div>
      <div vw-plugin-wrapper>
        <div class="vw-plugin-top-wrapper"></div>
      </div>
    </div>
  `;
  document.body.appendChild(container);

  // 2. Carrega o script oficial do VLibras
  const existingScript = document.getElementById('vlibras-plugin-script');
  if (!existingScript) {
    const script = document.createElement('script');
    script.id = 'vlibras-plugin-script';
    script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
    script.async = true;
    script.onload = () => {
      try {
        if ((window as any).VLibras) {
          new (window as any).VLibras.Widget('https://vlibras.gov.br/app');
        }
      } catch (err) {
        console.warn('[A11y/VLibras] Falha na inicialização do widget:', err);
      }
    };
    document.body.appendChild(script);
  } else if ((window as any).VLibras) {
    try {
      new (window as any).VLibras.Widget('https://vlibras.gov.br/app');
    } catch {}
  }
}

/**
 * Oculta visualmente o botão do VLibras quando desativado pelo usuário
 */
export function hideVLibrasWidget() {
  if (typeof document === 'undefined') return;
  const accessBtn = document.querySelector('[vw-access-button]') as HTMLElement;
  if (accessBtn) {
    accessBtn.style.display = 'none';
  }
}

export function useA11yPreferences() {
  const [preferences, setPreferences] = useState<A11yPreferences>(() => {
    if (typeof window === 'undefined') return DEFAULT_PREFS;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...DEFAULT_PREFS, ...JSON.parse(saved) } : DEFAULT_PREFS;
    } catch {
      return DEFAULT_PREFS;
    }
  });

  // Salva no localStorage sempre que houver modificação
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch {}
  }, [preferences]);

  // Aplica as classes e estilos diretamente no DOM raiz (html)
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;

    // Tamanho da fonte
    root.classList.remove('font-size-large', 'font-size-xlarge');
    if (preferences.fontSize === 'large') {
      root.classList.add('font-size-large');
    } else if (preferences.fontSize === 'xlarge') {
      root.classList.add('font-size-xlarge');
    }

    // Fonte amigável para dislexia
    if (preferences.dyslexicFont) {
      root.classList.add('dyslexic-friendly');
    } else {
      root.classList.remove('dyslexic-friendly');
    }

    // Alto contraste
    if (preferences.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Redução de movimento
    if (preferences.reducedMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }

    // VLibras
    if (preferences.vlibrasEnabled) {
      mountVLibrasScript();
    } else {
      hideVLibrasWidget();
    }
  }, [preferences]);

  // Setters com persistência
  const setFontSize = useCallback((fontSize: FontSizeOption) => {
    setPreferences((prev) => ({ ...prev, fontSize }));
  }, []);

  const toggleDyslexicFont = useCallback(() => {
    setPreferences((prev) => ({ ...prev, dyslexicFont: !prev.dyslexicFont }));
  }, []);

  const toggleHighContrast = useCallback(() => {
    setPreferences((prev) => ({ ...prev, highContrast: !prev.highContrast }));
  }, []);

  const toggleReducedMotion = useCallback(() => {
    setPreferences((prev) => ({ ...prev, reducedMotion: !prev.reducedMotion }));
  }, []);

  const toggleReadingRuler = useCallback(() => {
    setPreferences((prev) => ({ ...prev, readingRuler: !prev.readingRuler }));
  }, []);

  const toggleVLibras = useCallback(() => {
    setPreferences((prev) => {
      const next = !prev.vlibrasEnabled;
      if (next) {
        mountVLibrasScript();
      } else {
        hideVLibrasWidget();
      }
      return { ...prev, vlibrasEnabled: next };
    });
  }, []);

  const openVLibrasWidget = useCallback(() => {
    mountVLibrasScript();
    setPreferences((prev) => ({ ...prev, vlibrasEnabled: true }));
    setTimeout(() => {
      const accessBtn = document.querySelector('[vw-access-button]') as HTMLElement;
      if (accessBtn) {
        accessBtn.click();
      }
    }, 400);
  }, []);

  const resetPreferences = useCallback(() => {
    setPreferences(DEFAULT_PREFS);
    hideVLibrasWidget();
  }, []);

  return {
    preferences,
    setFontSize,
    toggleDyslexicFont,
    toggleHighContrast,
    toggleReducedMotion,
    toggleReadingRuler,
    toggleVLibras,
    openVLibrasWidget,
    resetPreferences,
  };
}
