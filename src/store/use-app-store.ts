import { create } from 'zustand';

export type ActiveModalType = 'book' | 'movie' | 'advice-card' | 'new-note' | null;

export interface AppState {
  // Áudio e Trilha
  isMuted: boolean;
  isAudioMuted: boolean;
  hasInteracted: boolean;

  // Livros e Flipbook
  activeBookId: string | null;
  isBookModalOpen: boolean;

  // Cinema e Mídia
  selectedMovieId: string | null;
  isMovieModalOpen: boolean;

  // Card de Conselho para Redes Sociais
  isAdviceCardModalOpen: boolean;

  // Acessibilidade: Movimento Reduzido (a11y)
  isReducedMotion: boolean;

  // Gamificação (Stickers Colecionados)
  collectedStickers: string[];

  // Modais Globais
  activeModal: ActiveModalType;

  // Ações
  toggleAudio: () => void;
  setAudioMuted: (muted: boolean) => void;
  setHasInteracted: (interacted: boolean) => void;
  openBookModal: (bookId: string) => void;
  closeBookModal: () => void;
  setActiveBook: (bookId: string | null) => void;
  openMovieModal: (movieId: string) => void;
  closeMovieModal: () => void;
  setSelectedMovieId: (movieId: string | null) => void;
  openAdviceCardModal: () => void;
  closeAdviceCardModal: () => void;
  toggleReducedMotion: () => void;
  setReducedMotion: (value: boolean) => void;
  collectSticker: (stickerId: string) => void;
  closeAllModals: () => void;
}

function getInitialReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const saved = localStorage.getItem('thalita_reduced_motion');
    if (saved !== null) {
      return saved === 'true';
    }
  } catch {}
  return window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;
}

export const useAppStore = create<AppState>((set) => ({
  // Estado Inicial: Áudio mudo por padrão (política estrita de opt-in)
  isMuted: true,
  isAudioMuted: true,
  hasInteracted: false,

  isReducedMotion: getInitialReducedMotion(),

  activeBookId: null,
  isBookModalOpen: false,

  selectedMovieId: null,
  isMovieModalOpen: false,

  isAdviceCardModalOpen: false,

  collectedStickers: [],
  activeModal: null,

  // Alternar Áudio
  toggleAudio: () =>
    set((state) => {
      const nextMuted = !state.isMuted;
      return {
        isMuted: nextMuted,
        isAudioMuted: nextMuted,
        hasInteracted: true,
      };
    }),

  // Definir Áudio Explicitamente
  setAudioMuted: (muted: boolean) =>
    set({
      isMuted: muted,
      isAudioMuted: muted,
      hasInteracted: true,
    }),

  setHasInteracted: (hasInteracted: boolean) => set({ hasInteracted }),

  // Controle de Livros
  openBookModal: (bookId: string) =>
    set({
      activeBookId: bookId,
      isBookModalOpen: true,
      activeModal: 'book',
    }),

  closeBookModal: () =>
    set({
      activeBookId: null,
      isBookModalOpen: false,
      activeModal: null,
    }),

  setActiveBook: (bookId: string | null) =>
    set({
      activeBookId: bookId,
      isBookModalOpen: bookId !== null,
      activeModal: bookId !== null ? 'book' : null,
    }),

  // Controle de Filmes
  openMovieModal: (movieId: string) =>
    set({
      selectedMovieId: movieId,
      isMovieModalOpen: true,
      activeModal: 'movie',
    }),

  closeMovieModal: () =>
    set({
      selectedMovieId: null,
      isMovieModalOpen: false,
      activeModal: null,
    }),

  setSelectedMovieId: (movieId: string | null) =>
    set({
      selectedMovieId: movieId,
    }),

  // Controle do Card de Conselho para Redes
  openAdviceCardModal: () =>
    set({
      isAdviceCardModalOpen: true,
      activeModal: 'advice-card',
    }),

  closeAdviceCardModal: () =>
    set({
      isAdviceCardModalOpen: false,
      activeModal: null,
    }),

  // Acessibilidade: Controle de Movimento Reduzido (a11y)
  toggleReducedMotion: () =>
    set((state) => {
      const next = !state.isReducedMotion;
      try {
        localStorage.setItem('thalita_reduced_motion', String(next));
        if (typeof document !== 'undefined') {
          document.documentElement.setAttribute('data-reduced-motion', String(next));
        }
      } catch {}
      return { isReducedMotion: next };
    }),

  setReducedMotion: (value: boolean) => {
    try {
      localStorage.setItem('thalita_reduced_motion', String(value));
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-reduced-motion', String(value));
      }
    } catch {}
    set({ isReducedMotion: value });
  },

  // Desbloquear e Colecionar Adesivos (Sem duplicatas)
  collectSticker: (stickerId: string) =>
    set((state) => ({
      collectedStickers: state.collectedStickers.includes(stickerId)
        ? state.collectedStickers
        : [...state.collectedStickers, stickerId],
    })),

  // Fechar qualquer modal ativo
  closeAllModals: () =>
    set({
      activeBookId: null,
      isBookModalOpen: false,
      selectedMovieId: null,
      isMovieModalOpen: false,
      isAdviceCardModalOpen: false,
      activeModal: null,
    }),
}));
