import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { AdviceQuote } from '@/types';
import {
  CardFormat,
  CardThemeId,
  CARD_THEMES,
  downloadAdviceCard,
  copyAdviceCardImageToClipboard,
  copyAdviceTextToClipboard,
  shareAdviceCard,
} from '@/utils/card-generator';
import { useAudio } from '@/hooks/use-audio';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import {
  Download,
  Copy,
  Share2,
  Smartphone,
  Square,
  Sparkles,
  Palette,
  X,
  BookOpen,
  Quote,
  Image as ImageIcon,
  CheckCircle2,
  Loader2,
} from 'lucide-react';

export interface ShareableCardProps {
  advice: AdviceQuote;
  isOpen?: boolean;
  onClose?: () => void;
  initialFormat?: CardFormat;
  initialTheme?: CardThemeId;
}

interface ToastNotification {
  id: string;
  message: string;
  type: 'success' | 'info';
}

export const ShareableCard: React.FC<ShareableCardProps> = ({
  advice,
  isOpen = true,
  onClose,
  initialFormat = '9:16',
  initialTheme = 'rose-pop',
}) => {
  const { playClick, playCameraShutter } = useAudio();
  const prefersReduced = useReducedMotion();

  // Estados de Personalização
  const [format, setFormat] = useState<CardFormat>(initialFormat);
  const [themeId, setThemeId] = useState<CardThemeId>(initialTheme);

  // Estados de Ações e Feedback
  const [isDownloading, setIsDownloading] = useState(false);
  const [isCopyingImage, setIsCopyingImage] = useState(false);
  const [isCopyingText, setIsCopyingText] = useState(false);
  const [toast, setToast] = useState<ToastNotification | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const currentTheme = CARD_THEMES[themeId] || CARD_THEMES['rose-pop'];

  // Exibição e descarte automático de Toast
  const showToast = useCallback((message: string, type: 'success' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToast({ id, message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.id === id ? null : prev));
    }, 3200);
  }, []);

  // Fechamento suave do modal
  const handleClose = useCallback(() => {
    if (!onClose || isClosing) return;
    setIsClosing(true);
    playClick();

    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 200);
  }, [onClose, isClosing, playClick]);

  // Bloqueio de scroll do body e atalho ESC quando usado como modal
  useEffect(() => {
    if (!isOpen || !onClose) return;

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    const timer = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 60);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, handleClose]);

  // Ação 1: Copiar Frase de Texto
  const handleCopyPhrase = async () => {
    playClick();
    setIsCopyingText(true);
    const success = await copyAdviceTextToClipboard(advice.quote, advice.bookOrigin);
    setIsCopyingText(false);

    if (success) {
      showToast('✨ Frase copiada com sucesso! Pronta para colar no WhatsApp ou Twitter.');
    } else {
      showToast('Não foi possível copiar o texto automaticamente.', 'info');
    }
  };

  // Ação 2: Baixar Card (PNG em alta resolução 1080p via Canvas)
  const handleDownloadCard = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    playCameraShutter();

    const success = await downloadAdviceCard({
      quote: advice.quote,
      categoryLabel: advice.categoryLabel,
      bookOrigin: advice.bookOrigin,
      format,
      themeId,
    });

    setIsDownloading(false);

    if (success) {
      showToast('📸 Card salvo com sucesso em alta definição (1080p)!');
    } else {
      showToast('Erro ao gerar o download do card. Tente novamente.', 'info');
    }
  };

  // Ação 3: Copiar Imagem do Card diretamente para a área de transferência
  const handleCopyImage = async () => {
    if (isCopyingImage) return;
    setIsCopyingImage(true);
    playClick();

    const success = await copyAdviceCardImageToClipboard({
      quote: advice.quote,
      categoryLabel: advice.categoryLabel,
      bookOrigin: advice.bookOrigin,
      format,
      themeId,
    });

    setIsCopyingImage(false);

    if (success) {
      showToast('📋 Imagem copiada! Você pode colar com Ctrl+V onde quiser.');
    } else {
      showToast('Seu navegador não permite copiar imagens diretamente. Use o botão Baixar Imagem.', 'info');
    }
  };

  // Ação 4: Compartilhar Nativo (Web Share API)
  const handleShareCard = async () => {
    playClick();
    const success = await shareAdviceCard({
      quote: advice.quote,
      categoryLabel: advice.categoryLabel,
      bookOrigin: advice.bookOrigin,
      format,
      themeId,
    });

    if (success) {
      showToast('📲 Card compartilhado com carinho!');
    }
  };

  // Renderização do Conteúdo Principal do Card Studio
  const cardContent = (
    <div className="relative w-full max-w-5xl flex flex-col lg:flex-row gap-6 lg:gap-8 items-center justify-center">
      
      {/* =================================================================== */}
      {/* COLUNA 1: PRÉ-VISUALIZAÇÃO INTERATIVA DO CARD (ARTE SCRAPBOOK)       */}
      {/* =================================================================== */}
      <div className="w-full flex-1 flex flex-col items-center justify-center">
        
        {/* Container do Card com Proporção Dinâmica (9:16 ou 1:1) */}
        <div 
          className={`relative w-full transition-all duration-300 flex items-center justify-center p-3 sm:p-5 rounded-3xl shadow-2xl border-4 ${
            format === '9:16'
              ? 'max-w-[340px] sm:max-w-[380px] aspect-[9/16]'
              : 'max-w-[380px] sm:max-w-[420px] aspect-square'
          }`}
          style={{
            background: `linear-gradient(180deg, ${currentTheme.bgGradient[0]} 0%, ${currentTheme.bgGradient[1]} 50%, ${currentTheme.bgGradient[2]} 100%)`,
            borderColor: currentTheme.cardBorder,
          }}
        >
          {/* Confetes / Estrelinhas de Fundo */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
            <span className="absolute top-4 left-6 text-xl opacity-60">✦</span>
            <span className="absolute top-8 right-8 text-2xl opacity-70">🌸</span>
            <span className="absolute bottom-10 left-6 text-lg opacity-60">✨</span>
            <span className="absolute bottom-8 right-6 text-xl opacity-70">💖</span>
          </div>

          {/* O Cartão de Papel Scrapbook Central */}
          <div 
            className="relative w-full h-full rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col justify-between overflow-hidden"
            style={{
              backgroundColor: currentTheme.paperBg,
              border: `3px solid ${currentTheme.cardBorder}`,
            }}
          >
            {/* Linhas Pautadas de Caderno Escolar no Fundo do Cartão */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-40"
              style={{
                backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, rgba(203, 213, 225, 0.7) 32px)',
              }}
            />

            {/* Borda Costurada de Scrapbook (Stitch Dash) */}
            <div 
              className="absolute inset-2 sm:inset-3 rounded-xl sm:rounded-2xl pointer-events-none border-2 border-dashed"
              style={{
                borderColor: currentTheme.stitchColor,
              }}
            />

            {/* ======================================================== */}
            {/* TOPO: WASHI TAPE + BADGE DA CATEGORIA                     */}
            {/* ======================================================== */}
            <div className="relative z-10 flex flex-col items-center">
              
              {/* Fita Adesiva Decorativa com Picote */}
              <div 
                className="w-48 sm:w-56 py-1 -mt-2 rounded-xs shadow-xs text-center transform -rotate-1 transition-transform"
                style={{
                  backgroundColor: currentTheme.washiColor,
                  color: currentTheme.washiText,
                }}
              >
                <span className="text-[11px] sm:text-xs font-black font-heading tracking-widest uppercase">
                  ★ PÍLULA DE AFETO ★
                </span>
              </div>

              {/* Badge da Categoria */}
              <div 
                className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold font-heading shadow-xs"
                style={{
                  backgroundColor: currentTheme.badgeBg,
                  color: currentTheme.badgeText,
                  border: `1px solid ${currentTheme.cardBorder}`,
                }}
              >
                <Sparkles className="w-3 h-3" />
                <span>{advice.categoryLabel}</span>
              </div>
            </div>

            {/* ======================================================== */}
            {/* CORPO: ASPAS E O CONSELHO DA THALITA                     */}
            {/* ======================================================== */}
            <div className="relative z-10 my-auto text-center px-1 sm:px-2 space-y-2">
              <Quote 
                className="w-8 h-8 sm:w-10 sm:h-10 mx-auto opacity-35" 
                style={{ color: currentTheme.cardBorder }}
              />

              <p 
                className={`font-heading font-black text-slate-900 leading-snug drop-shadow-xs ${
                  format === '9:16'
                    ? advice.quote.length > 120 ? 'text-base sm:text-lg' : 'text-lg sm:text-xl'
                    : advice.quote.length > 120 ? 'text-sm sm:text-base' : 'text-base sm:text-lg'
                }`}
              >
                "{advice.quote}"
              </p>

              {/* Badge do Livro de Origem */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-[10px] sm:text-xs font-semibold">
                <BookOpen className="w-3 h-3 text-pop-pink" />
                <span>Do livro: <strong>{advice.bookOrigin}</strong></span>
              </div>
            </div>

            {/* ======================================================== */}
            {/* BASE: AUTÓGRAFO DIGITAL DE THALITA REBOUÇAS              */}
            {/* ======================================================== */}
            <div className="relative z-10 text-center space-y-0.5 pt-2 border-t border-slate-200/80">
              <p className="font-handwriting text-base sm:text-lg text-slate-500 italic">
                Com todo o meu amor,
              </p>

              <div className="flex items-center justify-center gap-2">
                <span 
                  className="font-handwriting font-bold text-2xl sm:text-3xl"
                  style={{ color: currentTheme.signatureColor }}
                >
                  Thalita Rebouças
                </span>

                {/* Coração Autoral Estilizado */}
                <svg 
                  className="w-5 h-5 sm:w-6 sm:h-6 fill-current animate-pulse" 
                  style={{ color: currentTheme.heartColor }}
                  viewBox="0 0 24 24"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>

              {/* Assinatura de Redes */}
              <p className="text-[10px] sm:text-[11px] font-heading font-medium text-slate-400">
                ✦ Universo Thalita Rebouças · @thalitareboucas ✦
              </p>
            </div>

          </div>
        </div>

        {/* Indicador de Resolução Nativa */}
        <p className="mt-3 text-xs text-slate-500 font-mono text-center">
          Exportação em alta definição: <strong>{format === '9:16' ? '1080 × 1920 px' : '1080 × 1080 px'}</strong> (PNG)
        </p>
      </div>

      {/* =================================================================== */}
      {/* COLUNA 2: PAINEL DE CONTROLES & AÇÕES DE EXPORTAÇÃO                  */}
      {/* =================================================================== */}
      <div className="w-full lg:w-96 flex flex-col gap-5 bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-5 sm:p-7 border-2 border-amber-200/80 shadow-xl">
        
        {/* Título do Painel */}
        <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-heading font-black text-lg text-slate-900">
              Personalizar & Exportar
            </h3>
            <p className="text-xs text-slate-500 font-body">
              Gere seu card pronto para Instagram Stories, Reels, Feed ou WhatsApp.
            </p>
          </div>

          {onClose && (
            <button
              ref={closeButtonRef}
              type="button"
              onClick={handleClose}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition-colors"
              aria-label="Fechar estúdio de card"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* 1. SELEÇÃO DE FORMATO (9:16 vs 1:1) */}
        <div className="space-y-2">
          <label className="text-xs font-heading font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5 text-pop-pink" />
            <span>Formato para Redes:</span>
          </label>

          <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            <button
              type="button"
              onClick={() => {
                playClick();
                setFormat('9:16');
              }}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl font-heading font-bold text-xs transition-all ${
                format === '9:16'
                  ? 'bg-pop-pink text-white shadow-sm scale-[1.02]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Stories (9:16)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playClick();
                setFormat('1:1');
              }}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl font-heading font-bold text-xs transition-all ${
                format === '1:1'
                  ? 'bg-pop-pink text-white shadow-sm scale-[1.02]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Square className="w-4 h-4" />
              <span>Feed / Zap (1:1)</span>
            </button>
          </div>
        </div>

        {/* 2. SELEÇÃO DE TEMA E CORES */}
        <div className="space-y-2">
          <label className="text-xs font-heading font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-sun-yellow-dark" />
            <span>Paleta de Cores Carioca:</span>
          </label>

          <div className="grid grid-cols-2 gap-2">
            {Object.values(CARD_THEMES).map((th) => {
              const isSelected = themeId === th.id;
              return (
                <button
                  key={th.id}
                  type="button"
                  onClick={() => {
                    playClick();
                    setThemeId(th.id);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-heading font-bold border transition-all text-left ${
                    isSelected
                      ? 'border-pop-pink bg-pink-50 text-pop-pink ring-2 ring-pop-pink/30 shadow-xs scale-[1.02]'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-base">{th.emoji}</span>
                  <div className="truncate">
                    <span className="block">{th.name}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. BOTÕES DE AÇÃO PRINCIPAIS */}
        <div className="pt-2 space-y-2.5">
          
          {/* Botão de Download PNG em Alta Definição */}
          <button
            type="button"
            disabled={isDownloading}
            onClick={handleDownloadCard}
            className={`w-full py-3 px-4 rounded-2xl font-heading font-extrabold text-sm uppercase tracking-wider text-white shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2.5 ${
              isDownloading
                ? 'bg-slate-400 cursor-wait'
                : 'bg-gradient-to-r from-pop-pink via-pop-pink-dark to-purple-600 hover:from-pop-pink-dark hover:to-purple-700 hover:shadow-pop-pink/30 hover:scale-[1.01]'
            }`}
          >
            {isDownloading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Gerando Imagem HD...</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                <span>Baixar Card (PNG HD)</span>
              </>
            )}
          </button>

          {/* Botões Secundários: Copiar Imagem & Copiar Frase */}
          <div className="grid grid-cols-2 gap-2">
            
            {/* Copiar Imagem */}
            <button
              type="button"
              disabled={isCopyingImage}
              onClick={handleCopyImage}
              className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-slate-950 text-xs font-heading font-bold border border-slate-200 transition-all active:scale-95 flex items-center justify-center gap-1.5"
              title="Copiar imagem para área de transferência"
            >
              {isCopyingImage ? (
                <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
              ) : (
                <ImageIcon className="w-4 h-4 text-pop-pink" />
              )}
              <span>Copiar Imagem</span>
            </button>

            {/* Copiar Frase */}
            <button
              type="button"
              disabled={isCopyingText}
              onClick={handleCopyPhrase}
              className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-slate-950 text-xs font-heading font-bold border border-slate-200 transition-all active:scale-95 flex items-center justify-center gap-1.5"
              title="Copiar texto da frase com citação"
            >
              {isCopyingText ? (
                <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
              ) : (
                <Copy className="w-4 h-4 text-emerald-600" />
              )}
              <span>Copiar Frase</span>
            </button>
          </div>

          {/* Compartilhar Nativo (se suportado pelo navegador) */}
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              type="button"
              onClick={handleShareCard}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-heading font-bold transition-all active:scale-95 flex items-center justify-center gap-2 shadow-sm"
            >
              <Share2 className="w-4 h-4" />
              <span>Compartilhar nas Redes</span>
            </button>
          )}

        </div>

      </div>

      {/* =================================================================== */}
      {/* TOAST DE FEEDBACK FLUTUANTE                                         */}
      {/* =================================================================== */}
      {toast && (
        <div 
          role="status"
          aria-live="polite"
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[70] max-w-md w-[92vw] px-4 py-3 rounded-2xl shadow-2xl border-2 flex items-center gap-3 backdrop-blur-md transition-all ${
            prefersReduced ? 'opacity-100' : 'animate-bounce'
          } ${
            toast.type === 'success'
              ? 'bg-slate-900/95 border-emerald-400 text-white'
              : 'bg-slate-900/95 border-amber-400 text-white'
          }`}
        >
          <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-400 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <p className="text-xs sm:text-sm font-heading font-medium leading-tight flex-1">
            {toast.message}
          </p>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="p-1 text-slate-400 hover:text-white transition-colors"
            aria-label="Fechar notificação"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );

  // Se for utilizado com controle de modal (com isOpen e onClose)
  if (onClose) {
    if (typeof document === 'undefined') return null;
    if (!isOpen && !isClosing) return null;

    return createPortal(
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Gerador de Card de Conselho para Redes Sociais"
        className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto transition-all duration-300 ${
          isClosing
            ? 'opacity-0 backdrop-blur-none bg-slate-950/0'
            : 'opacity-100 backdrop-blur-md bg-slate-950/80'
        }`}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            handleClose();
          }
        }}
      >
        <div 
          className={`relative max-w-5xl w-full my-auto transition-all duration-300 ${
            prefersReduced
              ? isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
              : isClosing ? 'scale-90 opacity-0' : 'scale-100 opacity-100'
          }`}
        >
          {cardContent}
        </div>
      </div>,
      document.body
    );
  }

  // Se renderizado inline na página
  return cardContent;
};
