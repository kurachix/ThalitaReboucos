import { useEffect, useCallback } from 'react';
import { useAppStore } from '@/store/use-app-store';
import { triggerHaptic } from '@/utils/haptics';
import { useAudio } from '@/hooks/use-audio';

export const SECTION_IDS = [
  'hero',
  'timeline',
  'bookshelf',
  'cinema',
  'advices',
  'quiz',
  'fan-wall',
] as const;

export type SectionId = typeof SECTION_IDS[number];

/**
 * Hook de Navegação Global por Teclado (Modo Power-User & Acessibilidade)
 * Mapeia teclas de atalho:
 * - [?] : Abre/fecha o Guia de Atalhos
 * - [M] : Alterna mudo/som
 * - [J] / [↓] : Avança suavemente para o próximo ato biográfico
 * - [K] / [↑] : Retorna ao ato biográfico anterior
 * - [Espaço] : Dispara a ação focal do ato ativo (claquete, alavanca de conselhos)
 * - [ESC] : Fecha qualquer modal aberto
 */
export function useKeyboardNavigation() {
  const toggleAudio = useAppStore((state) => state.toggleAudio);
  const toggleKeyboardModal = useAppStore((state) => state.toggleKeyboardModal);
  const closeAllModals = useAppStore((state) => state.closeAllModals);
  const isAnyModalOpen = useAppStore(
    (state) =>
      state.isBookModalOpen ||
      state.isMovieModalOpen ||
      state.isAdviceCardModalOpen ||
      state.isKeyboardModalOpen
  );
  const { playClick } = useAudio();

  // Determina qual seção está atualmente visível na tela
  const getCurrentSectionIndex = useCallback((): number => {
    if (typeof window === 'undefined') return 0;
    const scrollPosition = window.scrollY + 260;

    for (let i = SECTION_IDS.length - 1; i >= 0; i--) {
      const el = document.getElementById(SECTION_IDS[i]);
      if (el && el.offsetTop <= scrollPosition) {
        return i;
      }
    }
    return 0;
  }, []);

  // Navega para um índice específico de seção com scroll suave
  const navigateToSection = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(SECTION_IDS.length - 1, index));
    const targetId = SECTION_IDS[clamped];
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      triggerHaptic('light');
    }
  }, []);

  // Dispara a ação focal da seção ativa
  const triggerFocalAction = useCallback((): boolean => {
    const currentIndex = getCurrentSectionIndex();
    const currentSectionId = SECTION_IDS[currentIndex];

    // Se estiver no Cine-Thalita, bate a claquete
    if (currentSectionId === 'cinema') {
      const clapperEl = document.querySelector<HTMLElement>('[data-focal-action="clapperboard"]');
      if (clapperEl) {
        clapperEl.click();
        return true;
      }
    }

    // Se estiver na Máquina de Conselhos, puxa a alavanca
    if (currentSectionId === 'advices') {
      const leverEl = document.querySelector<HTMLElement>('[data-focal-action="advice-lever"]');
      if (leverEl) {
        leverEl.click();
        return true;
      }
    }

    return false;
  }, [getCurrentSectionIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignora teclas de controle (Ctrl/Cmd/Alt)
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      const activeEl = document.activeElement;
      const tagName = activeEl?.tagName?.toLowerCase();
      const isInput = tagName === 'input' || tagName === 'textarea' || tagName === 'select';

      // ESC sempre fecha modais abertos
      if (e.key === 'Escape') {
        if (isAnyModalOpen) {
          e.preventDefault();
          closeAllModals();
          triggerHaptic('light');
        }
        return;
      }

      // Se o usuário estiver preenchendo um formulário (ex: post-it), não intercepta teclas normais
      if (isInput) return;

      // [?] ou [Shift + /]: Modal de Atalhos de Teclado
      if (e.key === '?' || (e.key === '/' && e.shiftKey)) {
        e.preventDefault();
        playClick();
        toggleKeyboardModal();
        triggerHaptic('medium');
        return;
      }

      // [M] ou [m]: Alterna Som/Mudo
      if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        playClick();
        toggleAudio();
        triggerHaptic('light');
        return;
      }

      // Se nenhum modal estiver aberto, permite navegação por atos e ações focais
      if (!isAnyModalOpen) {
        // [J] ou [Seta para Baixo]: Próxima seção
        if (e.key === 'j' || e.key === 'J' || e.key === 'ArrowDown') {
          e.preventDefault();
          const current = getCurrentSectionIndex();
          navigateToSection(current + 1);
          return;
        }

        // [K] ou [Seta para Cima]: Seção anterior
        if (e.key === 'k' || e.key === 'K' || e.key === 'ArrowUp') {
          e.preventDefault();
          const current = getCurrentSectionIndex();
          navigateToSection(current - 1);
          return;
        }

        // [Espaço]: Dispara ação focal interativa da seção ativa
        if (e.key === ' ') {
          const handled = triggerFocalAction();
          if (handled) {
            e.preventDefault();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isAnyModalOpen,
    closeAllModals,
    playClick,
    toggleKeyboardModal,
    toggleAudio,
    getCurrentSectionIndex,
    navigateToSection,
    triggerFocalAction,
  ]);

  return {
    getCurrentSectionIndex,
    navigateToSection,
    triggerFocalAction,
  };
}
