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
  collectSticker: (stickerId: string) => void;
  closeAllModals: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Estado Inicial: Áudio mudo por padrão (política estrita de opt-in)
  isMuted: true,
  isAudioMuted: true,
  hasInteracted: false,

  activeBookId: null,
  isBookModalOpen: false,

  selectedMovieId: null,
  isMovieModalOpen: false,

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
      activeModal: null,
    }),
}));
