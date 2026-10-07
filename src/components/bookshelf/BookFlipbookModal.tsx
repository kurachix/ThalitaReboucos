import React, { useEffect, useState, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useAppStore } from '@/store/use-app-store';
import { useAudio } from '@/hooks/use-audio';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { BOOKS_CATALOG } from '@/data/books';
import { 
  X, 
  BookOpen, 
  Calendar, 
  Layers, 
  Building2, 
  Sparkles, 
  Quote, 
  ChevronLeft, 
  ChevronRight, 
  Copy, 
  Check, 
  Heart, 
  Bookmark, 
  Film,
  Award
} from 'lucide-react';

export const BookFlipbookModal: React.FC = () => {
  const isBookModalOpen = useAppStore((state) => state.isBookModalOpen);
  const activeBookId = useAppStore((state) => state.activeBookId);
  const closeBookModal = useAppStore((state) => state.closeBookModal);
  const openBookModal = useAppStore((state) => state.openBookModal);

  const { playPageFlip, playClick } = useAudio();
  const prefersReduced = useReducedMotion();

  const [isClosing, setIsClosing] = useState(false);
  const [activeTab, setActiveTab] = useState<'synopsis' | 'excerpt'>('synopsis');
  const [copiedQuote, setCopiedQuote] = useState(false);
  const [mobilePage, setMobilePage] = useState<'left' | 'right'>('right');

  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Busca o livro selecionado no catálogo
  const currentIndex = BOOKS_CATALOG.findIndex((b) => b.id === activeBookId);
  const currentBook = currentIndex !== -1 ? BOOKS_CATALOG[currentIndex] : BOOKS_CATALOG[0];
  const totalBooks = BOOKS_CATALOG.length;

  const prevBook = currentIndex > 0 ? BOOKS_CATALOG[currentIndex - 1] : BOOKS_CATALOG[totalBooks - 1];
  const nextBook = currentIndex < totalBooks - 1 ? BOOKS_CATALOG[currentIndex + 1] : BOOKS_CATALOG[0];

  // Fechamento suave com animação realista
  const handleClose = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    playPageFlip();

    const timer = setTimeout(() => {
      closeBookModal();
      setIsClosing(false);
      setActiveTab('synopsis');
      setMobilePage('right');
    }, 280);

    return () => clearTimeout(timer);
  }, [isClosing, closeBookModal, playPageFlip]);

  // Navegação entre livros adjacentes
  const handleNavigatePrev = useCallback(() => {
    playPageFlip();
    setCopiedQuote(false);
    openBookModal(prevBook.id);
  }, [playPageFlip, openBookModal, prevBook.id]);

  const handleNavigateNext = useCallback(() => {
    playPageFlip();
    setCopiedQuote(false);
    openBookModal(nextBook.id);
  }, [playPageFlip, openBookModal, nextBook.id]);

  // Cópia da citação marcante com feedback
  const handleCopyQuote = useCallback(() => {
    if (!currentBook) return;
    playClick();
    const textToCopy = `"${currentBook.highlightQuote}" — Thalita Rebouças (${currentBook.title})`;
    navigator.clipboard?.writeText(textToCopy);
    setCopiedQuote(true);
    setTimeout(() => setCopiedQuote(false), 2400);
  }, [currentBook, playClick]);

  // Trava de Scroll no Background e Foco de Acessibilidade
  useEffect(() => {
    if (!isBookModalOpen) return;

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    document.body.style.overflow = 'hidden';

    // Foco inicial para acessibilidade
    const focusTimer = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    return () => {
      clearTimeout(focusTimer);
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [isBookModalOpen]);

  // Atalhos de Teclado (ESC fecha, Setas navegam)
  useEffect(() => {
    if (!isBookModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleNavigatePrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNavigateNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isBookModalOpen, handleClose, handleNavigatePrev, handleNavigateNext]);

  if (typeof document === 'undefined') return null;
  if (!isBookModalOpen && !isClosing) return null;
  if (!currentBook) return null;

  // Fallback de trecho inicial se não especificado no modelo
  const bookExcerpt = currentBook.excerpt || 
    `"— Tudo começou naquele instante em que a vida resolveu me dar uma sacudida daquelas! — confessa o relato de abertura. As páginas de ${currentBook.title} convidam os leitores a mergulhar em um diálogo íntimo, repleto de risadas sinceras, cumplicidade incondicional e o calor inconfundível do Rio de Janeiro. Uma jornada inesquecível pelo coração de Thalita Rebouças."`;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="book-modal-title"
      aria-describedby="book-modal-synopsis"
      ref={modalRef}
      className={`fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 md:p-6 transition-all duration-300 ${
        isClosing 
          ? 'opacity-0 backdrop-blur-none bg-slate-950/0' 
          : 'opacity-100 backdrop-blur-md bg-slate-950/75'
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      {/* Container de Perspectiva 3D do Livro Aberto */}
      <div
        className={`relative w-full max-w-5xl max-h-[92vh] flex flex-col transition-all duration-300 ease-out select-none ${
          prefersReduced
            ? isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
            : isClosing
              ? 'scale-90 -rotate-y-12 opacity-0'
              : 'scale-100 rotate-y-0 opacity-100'
        }`}
        style={{
          perspective: '1800px',
        }}
      >
        {/* Barra Superior de Controles e Atalhos */}
        <div className="flex items-center justify-between pb-2 sm:pb-3 px-2 text-white">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-bold text-white shadow-xs">
              <BookOpen className="w-3.5 h-3.5 text-sun-yellow" />
              <span>Livro Aberto · {currentIndex + 1} de {totalBooks}</span>
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-white/70 font-mono">
              Use as setas <kbd className="px-1.5 py-0.5 rounded bg-white/20 text-white font-mono text-[10px]">←</kbd> <kbd className="px-1.5 py-0.5 rounded bg-white/20 text-white font-mono text-[10px]">→</kbd> para folhear
            </span>
          </div>

          {/* Botão de Fechar com Efeito Tátil e Chip ESC */}
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex text-[11px] text-white/60 font-mono">
              Pressione <kbd className="px-1.5 py-0.5 rounded bg-white/20 text-white font-mono text-[10px]">ESC</kbd>
            </span>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={handleClose}
              aria-label="Fechar livro aberto (ESC)"
              className="p-2 sm:p-2.5 rounded-full bg-white/20 hover:bg-pop-pink text-white hover:text-white backdrop-blur-md border border-white/30 transition-all duration-200 transform hover:scale-110 active:scale-95 shadow-md flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-pop-pink"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Alternador de Páginas para Telas Pequenas (Mobile Switcher) */}
        <div className="flex md:hidden items-center justify-center gap-2 mb-2">
          <button
            type="button"
            onClick={() => {
              playClick();
              setMobilePage('left');
            }}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
              mobilePage === 'left'
                ? 'bg-sun-yellow text-slate-900 shadow-xs'
                : 'bg-white/20 text-white/80'
            }`}
          >
            Pág. Esquerda (Capa & Ficha)
          </button>
          <button
            type="button"
            onClick={() => {
              playClick();
              setMobilePage('right');
            }}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
              mobilePage === 'right'
                ? 'bg-sun-yellow text-slate-900 shadow-xs'
                : 'bg-white/20 text-white/80'
            }`}
          >
            Pág. Direita (Sinopse & Bastidores)
          </button>
        </div>

        {/* Estrutura Física do Livro Aberto (Spread com Capa Dura, Páginas e Lombada) */}
        <div className="relative bg-paper rounded-2xl md:rounded-3xl book-stacked-edges overflow-hidden border-4 border-amber-950/20 shadow-2xl flex flex-col md:flex-row min-h-[480px] md:min-h-[560px] max-h-[80vh] md:max-h-[76vh]">
          
          {/* Fita Marcador de Página de Cetim (Silk Ribbon Bookmark) */}
          <div 
            className="absolute -top-1 left-1/2 -translate-x-1/2 w-4 sm:w-5 h-16 sm:h-20 z-30 pointer-events-none book-ribbon-tail shadow-md"
            style={{
              backgroundColor: currentBook.coverAccent || '#FF2A85',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.25)',
            }}
          />

          {/* Sombra Central da Lombada e Vinco de Dobradura (Central Spine Gutter) */}
          <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-12 book-gutter-shadow pointer-events-none z-20" />

          {/* ======================================================== */}
          {/* PÁGINA ESQUERDA: CAPA REALISTA & ESTATÍSTICAS EDITORIAIS */}
          {/* ======================================================== */}
          <div className={`w-full md:w-1/2 p-5 sm:p-7 md:p-8 flex flex-col justify-between bg-gradient-to-br from-amber-50/90 via-amber-50/50 to-orange-50/30 md:border-r border-amber-200/60 overflow-y-auto ${
            mobilePage === 'left' ? 'flex' : 'hidden md:flex'
          }`}>
            
            {/* Cabeçalho da Página Esquerda */}
            <div className="flex items-center justify-between pb-3 border-b border-amber-200/50 text-slate-500 text-[11px] font-mono">
              <div className="flex items-center gap-1.5 font-bold text-amber-900">
                <Bookmark className="w-3.5 h-3.5 text-pop-pink" />
                <span>COLEÇÃO OFICIAL</span>
              </div>
              <span>CATÁLOGO #{currentIndex + 1}</span>
            </div>

            {/* Réplica Estilizada da Capa do Livro */}
            <div className="my-auto py-3">
              <div
                className="relative mx-auto w-48 sm:w-56 h-64 sm:h-72 rounded-r-2xl rounded-l-xs p-5 flex flex-col justify-between text-white shadow-2xl transform transition-transform duration-300 hover:scale-[1.02]"
                style={{
                  backgroundColor: currentBook.coverAccent,
                  boxShadow: `
                    -6px 0 12px -2px rgba(0, 0, 0, 0.4),
                    8px 12px 24px -2px rgba(0, 0, 0, 0.35),
                    inset -3px 0 6px rgba(255, 255, 255, 0.3),
                    inset 5px 0 10px rgba(0, 0, 0, 0.3)
                  `,
                }}
              >
                {/* Efeito de Costura e Relevo da Lombada */}
                <div className="absolute top-0 left-0 bottom-0 w-3.5 bg-black/25 border-r border-white/20 rounded-l-xs flex flex-col justify-between py-3 items-center pointer-events-none">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                  <div className="w-1 h-12 bg-white/20 rounded-full" />
                  <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                </div>

                {/* Topo da Capa: Ano e Badge */}
                <div className="pl-2 flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold bg-black/30 px-2 py-0.5 rounded-sm backdrop-blur-xs">
                    {currentBook.year}
                  </span>
                  {currentBook.tags.includes('Cinema') && (
                    <span className="text-[10px] font-heading font-extrabold uppercase bg-sun-yellow text-amber-950 px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                      <Film className="w-3 h-3" />
                      <span>Filme</span>
                    </span>
                  )}
                </div>

                {/* Centro da Capa: Título e Nome da Autora */}
                <div className="pl-2 my-auto text-center space-y-2">
                  <h3 
                    id="book-modal-title"
                    className="text-lg sm:text-xl font-heading font-black leading-tight drop-shadow-sm text-white"
                  >
                    {currentBook.title}
                  </h3>
                  <div className="w-10 h-0.5 bg-white/60 mx-auto rounded-full" />
                  <p className="font-handwriting text-xl text-white/95 tracking-wide">
                    Thalita Rebouças
                  </p>
                </div>

                {/* Base da Capa: Selo da Editora e Páginas */}
                <div className="pl-2 flex items-center justify-between text-[11px] text-white/80 font-mono border-t border-white/20 pt-2">
                  <span>{currentBook.publisher?.split(' ')[0] || 'Rocco'}</span>
                  <span>{currentBook.pages} págs</span>
                </div>

                {/* Brilho Especular Fosco / Verniz Localizado */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none rounded-r-2xl" />
              </div>
            </div>

            {/* Ficha Catalográfica e Estatísticas Editoriais */}
            <div className="bg-white/90 rounded-xl p-3.5 sm:p-4 border border-amber-200/70 shadow-xs space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 font-heading">
                <Layers className="w-3.5 h-3.5 text-pop-pink" />
                <span>Estatísticas Editoriais</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase">Lançamento</span>
                    <strong className="text-slate-800 font-mono">{currentBook.year}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-slate-600">
                  <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase">Extensão</span>
                    <strong className="text-slate-800 font-mono">{currentBook.pages} páginas</strong>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-slate-600">
                  <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase">Editora</span>
                    <strong className="text-slate-800 line-clamp-1">{currentBook.publisher || 'Editora Rocco'}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-slate-600">
                  <Award className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase">Classificação</span>
                    <strong className="text-slate-800">Juvenil / Livre</strong>
                  </div>
                </div>
              </div>

              {/* Tags Temáticas em Pílulas */}
              <div className="pt-1.5 border-t border-slate-100 flex flex-wrap gap-1">
                {currentBook.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-md bg-amber-100/70 text-amber-900 text-[10px] font-bold font-heading"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* =================================================================== */}
          {/* PÁGINA DIREITA: SINOPSE, CITAÇÃO & BASTIDORES CONTADOS PELA AUTORA */}
          {/* =================================================================== */}
          <div className={`w-full md:w-1/2 p-5 sm:p-7 md:p-8 flex flex-col justify-between bg-paper bg-paper-ruled overflow-y-auto ${
            mobilePage === 'right' ? 'flex' : 'hidden md:flex'
          }`}>

            {/* Cabeçalho da Página Direita com Número de Página */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-slate-500 text-[11px] font-mono">
              <span className="font-handwriting text-base text-pop-pink font-bold">
                Thalita Rebouças · Acervo Biográfico
              </span>
              <span>Pág. {currentIndex * 2 + 1}</span>
            </div>

            {/* Título da Obra & Abas de Navegação de Conteúdo */}
            <div className="pt-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black font-heading text-slate-900 leading-tight">
                    {currentBook.title}
                  </h2>
                  <p className="text-xs font-mono text-pop-pink mt-0.5">
                    {currentBook.year} · {currentBook.pages} páginas
                  </p>
                </div>

                {/* Abas Alternadoras: Sinopse vs Degustação */}
                <div className="inline-flex rounded-lg bg-slate-100 p-0.5 border border-slate-200 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      playClick();
                      setActiveTab('synopsis');
                    }}
                    className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                      activeTab === 'synopsis'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Sinopse & Bastidores
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      playClick();
                      setActiveTab('excerpt');
                    }}
                    className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                      activeTab === 'excerpt'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    1º Capítulo
                  </button>
                </div>
              </div>
            </div>

            {/* Conteúdo Central da Página Direita */}
            <div className="my-auto py-3 space-y-4">
              {activeTab === 'synopsis' ? (
                <>
                  {/* Sinopse Oficial */}
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-heading">
                      Sinopse da Obra
                    </h4>
                    <p 
                      id="book-modal-synopsis"
                      className="text-slate-700 font-body text-sm sm:text-base leading-relaxed"
                    >
                      {currentBook.synopsis}
                    </p>
                  </div>

                  {/* Citação Marcante em Bloco de Scrapbook */}
                  <div className="relative p-3.5 sm:p-4 rounded-xl bg-sun-yellow/15 border-l-4 border-sun-yellow space-y-2">
                    <Quote className="w-5 h-5 text-sun-yellow-dark absolute top-2 right-3 opacity-60" />
                    
                    <p className="font-handwriting text-lg sm:text-xl text-slate-800 leading-snug pr-6">
                      "{currentBook.highlightQuote}"
                    </p>

                    <div className="flex items-center justify-between pt-1 border-t border-amber-200/40 text-xs">
                      <span className="text-[11px] text-slate-500 font-heading">
                        — Frase marcante da edição
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyQuote}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white hover:bg-amber-100 text-slate-700 hover:text-slate-900 text-[11px] font-bold font-heading shadow-xs transition-colors"
                        title="Copiar citação para compartilhar"
                      >
                        {copiedQuote ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-700">Copiada! ✨</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-slate-500" />
                            <span>Copiar Citação</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Bastidores & Segredos Contados pela Autora */}
                  <div className="relative p-3.5 sm:p-4 rounded-xl bg-pink-50 border border-pink-200 shadow-xs space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-pop-pink font-heading">
                      <Heart className="w-3.5 h-3.5 fill-current" />
                      <span>Bastidores contados pela Thalita 💬</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 font-body leading-relaxed">
                      {currentBook.trivia}
                    </p>
                  </div>
                </>
              ) : (
                /* Aba: Degustação do 1º Capítulo */
                <div className="space-y-3 p-3 bg-white/70 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 font-heading">
                    <Sparkles className="w-3.5 h-3.5 text-sun-yellow-dark" />
                    <span>Primeiras Linhas · Degustação Literária</span>
                  </div>
                  <div className="font-serif text-slate-800 text-sm sm:text-base leading-relaxed space-y-2 italic">
                    <p className="first-letter:text-4xl first-letter:font-bold first-letter:text-pop-pink first-letter:mr-1.5 first-letter:float-left">
                      {bookExcerpt}
                    </p>
                  </div>
                  <div className="pt-2 text-center text-xs text-slate-500 font-handwriting text-base">
                    Disponível no catálogo oficial das livrarias e plataformas digitais. ❤️
                  </div>
                </div>
              )}
            </div>

            {/* Rodapé: Navegação Entre Livros Adjacentes */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs font-heading font-bold text-slate-600">
              <button
                type="button"
                onClick={handleNavigatePrev}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full hover:bg-slate-100 text-slate-700 hover:text-slate-900 transition-colors"
                title={`Folhear para "${prevBook.title}"`}
              >
                <ChevronLeft className="w-4 h-4 text-pop-pink" />
                <span className="hidden sm:inline line-clamp-1 max-w-[120px] text-left">
                  {prevBook.title}
                </span>
                <span className="sm:hidden">Anterior</span>
              </button>

              <span className="font-mono text-[11px] text-slate-400">
                {currentIndex + 1} / {totalBooks}
              </span>

              <button
                type="button"
                onClick={handleNavigateNext}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full hover:bg-slate-100 text-slate-700 hover:text-slate-900 transition-colors"
                title={`Folhear para "${nextBook.title}"`}
              >
                <span className="hidden sm:inline line-clamp-1 max-w-[120px] text-right">
                  {nextBook.title}
                </span>
                <span className="sm:hidden">Próximo</span>
                <ChevronRight className="w-4 h-4 text-pop-pink" />
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>,
    document.body
  );
};
