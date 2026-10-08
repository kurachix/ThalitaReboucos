import React, { useState, useCallback, useRef } from 'react';
import { ADVICE_QUOTES } from '@/data/advices';
import { AdviceQuote } from '@/types';
import { SlotReels, THEME_REEL_ITEMS, BOOK_REEL_ITEMS, CHARM_REEL_ITEMS } from './SlotReels';
import { ShareableCard } from './ShareableCard';
import { MagneticButton } from '@/components/common/MagneticButton';
import { useAudio } from '@/hooks/use-audio';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { useAppStore } from '@/store/use-app-store';
import { triggerHaptic } from '@/utils/haptics';
import { 
  Sparkles, 
  HelpCircle, 
  RotateCcw, 
  Copy, 
  Check, 
  Heart, 
  BookOpen, 
  Quote,
  Camera,
  CheckCircle2,
} from 'lucide-react';

export const AdviceMachineSection: React.FC = () => {
  const { playSlotLever, playSlotWin, playClick } = useAudio();
  const prefersReduced = useReducedMotion();
  const unlockAchievement = useAppStore((state) => state.unlockAchievement);

  // Estados da Máquina Caça-Níquel
  const [isSpinning, setIsSpinning] = useState(false);
  const [leverPulled, setLeverPulled] = useState(false);
  const [isCapsuleOpen, setIsCapsuleOpen] = useState(true); // Inicialmente aberta com um conselho inicial
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Estado do Gerador de Card de Redes Sociais
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);

  // Índices sorteados
  const [themeIndex, setThemeIndex] = useState(0);
  const [bookIndex, setBookIndex] = useState(0);
  const [charmIndex, setCharmIndex] = useState(0);

  // Conselho ativo selecionado
  const [currentAdvice, setCurrentAdvice] = useState<AdviceQuote>(ADVICE_QUOTES[0]);
  const [spinCount, setSpinCount] = useState(1);

  const leverRef = useRef<HTMLDivElement>(null);

  // Disparo da alavanca e sorteio da máquina com resposta tátil física
  const handlePullLever = useCallback(() => {
    if (isSpinning) return;

    // Física, som da alavanca mecânica e vibração no smartphone
    setLeverPulled(true);
    playSlotLever();
    triggerHaptic('heavy');
    unlockAchievement('spun_slot');
    setIsCapsuleOpen(false);

    // Efeito de mola de retorno da alavanca após 220ms
    setTimeout(() => {
      setLeverPulled(false);
      setIsSpinning(true);
    }, 220);

    // Sorteio de novos índices para os 3 cilindros e o conselho
    const nextAdviceIndex = Math.floor(Math.random() * ADVICE_QUOTES.length);
    const nextTheme = Math.floor(Math.random() * THEME_REEL_ITEMS.length);
    const nextBook = Math.floor(Math.random() * BOOK_REEL_ITEMS.length);
    const nextCharm = Math.floor(Math.random() * CHARM_REEL_ITEMS.length);

    setThemeIndex(nextTheme);
    setBookIndex(nextBook);
    setCharmIndex(nextCharm);
    setCurrentAdvice(ADVICE_QUOTES[nextAdviceIndex]);
    setSpinCount((prev) => prev + 1);
  }, [isSpinning, playSlotLever]);

  // Conclusão da rotação dos cilindros
  const handleSpinComplete = useCallback(() => {
    setIsSpinning(false);
    playSlotWin();
    triggerHaptic('success');

    // Abertura da cápsula revelando o conselho após pequeno suspense
    setTimeout(() => {
      setIsCapsuleOpen(true);
    }, 200);
  }, [playSlotWin]);

  // Cópia da frase sorteada para a área de transferência
  const handleCopyQuote = () => {
    playClick();
    triggerHaptic('double');
    const textToCopy = `"${currentAdvice.quote}" — Thalita Rebouças (${currentAdvice.bookOrigin}) ✨`;
    navigator.clipboard?.writeText(textToCopy);
    setCopied(true);
    setToastMessage('✨ Frase copiada com sucesso! Pronta para colar no WhatsApp ou redes.');
    setTimeout(() => {
      setCopied(false);
      setToastMessage(null);
    }, 2800);
  };

  return (
    <section 
      id="advices" 
      className="scroll-mt-24 py-8 sm:py-12"
      aria-label="Ato 5: Máquina de Conselhos Pop"
    >
      {/* Cabeçalho da Seção */}
      <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold uppercase tracking-wider shadow-sticker">
          <HelpCircle className="w-3.5 h-3.5 text-emerald-700" />
          <span>Ato 5 · Caça-Níquel Pop de Humor & Afeto</span>
        </div>

        <h2 className="text-3xl sm:text-4xl xl:text-5xl font-black text-slate-900 font-heading tracking-tight">
          Máquina de Conselhos da Thalita
        </h2>

        <p className="text-slate-600 font-body text-base sm:text-lg">
          Puxe a alavanca vintage para girar os tambores da sorte e retirar sua pílula diária de humor, sobrevivência e abraço apertado direto dos livros.
        </p>
      </div>

      {/* Cenário da Máquina Vintage de Chicletes / Caça-Níquel */}
      <div className="max-w-4xl mx-auto bg-gradient-to-b from-rose-50 via-amber-50/60 to-rose-50 rounded-scrapbook shadow-scrapbook border-4 border-amber-300/80 p-5 sm:p-8 md:p-10 relative overflow-hidden">
        
        {/* Luzes Festivas no Topo da Máquina */}
        <div className="flex items-center justify-between pb-6 border-b border-amber-200 text-xs font-heading font-bold text-slate-700">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-pop-pink animate-ping" />
            <span className="uppercase tracking-wider text-pop-pink">
              Edição Oficial Bienal Nostalgia · Sorteio #{spinCount}
            </span>
          </div>

          <span className="font-handwriting text-base text-amber-800 hidden sm:inline">
            100% de carinho garantido ✨
          </span>
        </div>

        {/* Corpo Principal da Máquina com Alavanca Lateral */}
        <div className="relative pt-6 pb-4 flex flex-col md:flex-row items-center justify-center gap-6 lg:gap-10">
          
          {/* Gabinete Central da Máquina */}
          <div className="w-full max-w-lg bg-gradient-to-b from-pop-pink via-pop-pink-dark to-purple-900 rounded-3xl p-5 sm:p-7 shadow-2xl border-4 border-white relative text-white">
            
            {/* Domo Superior Estilo Máquina de Chicletes / Globo de Cápsulas */}
            <div className="relative h-16 sm:h-20 bg-white/20 backdrop-blur-md rounded-2xl border-2 border-white/40 mb-4 overflow-hidden flex items-center justify-center shadow-inner">
              <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />
              
              {/* Bolinhas / Cápsulas Coloridas Flutuantes */}
              <div className="flex items-center justify-center gap-3">
                <span className="w-6 h-6 rounded-full bg-sun-yellow shadow-md transform -rotate-12 animate-pulse" />
                <span className="w-7 h-7 rounded-full bg-white shadow-md transform rotate-6 border border-pop-pink" />
                <span className="w-6 h-6 rounded-full bg-sea-blue shadow-md transform rotate-45" />
                <span className="w-5 h-5 rounded-full bg-emerald-400 shadow-md transform -rotate-6" />
                <span className="w-6 h-6 rounded-full bg-amber-400 shadow-md transform rotate-12" />
              </div>

              <div className="absolute bottom-1 text-[10px] font-mono tracking-widest text-white/90 font-bold uppercase">
                DISPENSADOR DE PÍLULAS AFETIVAS
              </div>
            </div>

            {/* Os Cilindros Giratórios (SlotReels) */}
            <SlotReels
              isSpinning={isSpinning}
              selectedThemeIndex={themeIndex}
              selectedBookIndex={bookIndex}
              selectedCharmIndex={charmIndex}
              onSpinComplete={handleSpinComplete}
            />

            {/* Bandeja de Entrega da Cápsula no Fundo do Gabinete */}
            <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-xs font-mono">
              <span className="text-white/80">SAÍDA DE CÁPSULAS</span>
              <span className="font-bold text-sun-yellow">
                {isSpinning ? 'ROLANDO...' : 'PRONTO PARA RETIRAR'}
              </span>
            </div>
          </div>

          {/* ======================================================== */}
          {/* ALAVANCA MECÂNICA DA MÁQUINA (CLIQUE OU ARRASTE)          */}
          {/* ======================================================== */}
          <div className="flex flex-col items-center justify-center">
            <div
              ref={leverRef}
              onClick={handlePullLever}
              role="button"
              tabIndex={0}
              data-focal-action="advice-lever"
              aria-label="Puxar alavanca da máquina de conselhos"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handlePullLever();
                }
              }}
              className="group cursor-pointer flex flex-col items-center focus:outline-none focus:ring-4 focus:ring-sun-yellow rounded-2xl p-2 select-none"
              title="Puxe a alavanca para girar a roleta de conselhos!"
            >
              {/* Esfera Vermelha Superior da Alavanca */}
              <div 
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-red-600 via-pop-pink to-amber-200 border-4 border-white shadow-xl flex items-center justify-center transition-transform ${
                  prefersReduced
                    ? leverPulled ? 'scale-90' : 'scale-100'
                    : leverPulled 
                      ? 'translate-y-16 scale-95' 
                      : 'translate-y-0 group-hover:scale-110 group-hover:-translate-y-1'
                }`}
              >
                <Sparkles className="w-6 h-6 text-white drop-shadow-sm" />
              </div>

              {/* Haste de Aço Inox Cromada */}
              <div 
                className={`w-4 bg-gradient-to-r from-slate-300 via-white to-slate-400 border-x border-slate-500 rounded-sm shadow-md transition-all ${
                  leverPulled ? 'h-10 opacity-70' : 'h-24 sm:h-28'
                }`}
              />

              {/* Base Mecânica / Caixa de Engrenagem */}
              <div className="w-16 h-10 bg-gradient-to-b from-slate-700 to-slate-900 rounded-xl border-2 border-slate-600 shadow-lg flex items-center justify-center text-[10px] font-mono text-sun-yellow font-bold">
                PUXE ⇊
              </div>
            </div>

            {/* Botão de Disparo Textual com Efeito Magnético */}
            <MagneticButton
              type="button"
              disabled={isSpinning}
              onClick={handlePullLever}
              className={`mt-4 px-5 py-2.5 rounded-full font-heading font-black text-xs uppercase tracking-wider shadow-md transition-all active:scale-95 flex items-center gap-2 ${
                isSpinning
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-pop-pink hover:bg-pop-pink-dark text-white shadow-pop-pink/30 hover:scale-105'
              }`}
            >
              <RotateCcw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
              <span>{isSpinning ? 'Girando Roleta...' : 'Puxar Alavanca! 🎰'}</span>
            </MagneticButton>
          </div>

        </div>

        {/* =================================================================== */}
        {/* CÁPSULA ABERTA COM O CONSELHO AFETIVO SORTEADO (RELAX & HUMOR)       */}
        {/* =================================================================== */}
        <div 
          aria-live="polite"
          className="mt-8 transition-all duration-500 ease-out"
        >
          {isCapsuleOpen ? (
            <div className="relative bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border-3 border-sun-yellow shadow-xl text-slate-800 space-y-4 max-w-2xl mx-auto transform transition-transform hover:scale-[1.01]">
              
              {/* Efeito de Fita Adesiva / Washi Tape no Topo */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-sun-yellow/80 backdrop-blur-xs text-amber-950 text-[11px] font-heading font-extrabold uppercase tracking-wider rounded-xs shadow-xs rotate-[-1deg]">
                ✨ Pílula de Afeto Aberta ✨
              </div>

              {/* Cabeçalho do Cartão: Categoria e Livro de Origem */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 pb-3 border-b border-amber-100 text-xs font-mono">
                <span className="px-3 py-1 rounded-full bg-pink-100 text-pop-pink font-bold font-heading">
                  {currentAdvice.categoryLabel}
                </span>

                <div className="flex items-center gap-1.5 text-slate-500 font-bold">
                  <BookOpen className="w-3.5 h-3.5 text-pop-pink" />
                  <span>Livro: {currentAdvice.bookOrigin}</span>
                </div>
              </div>

              {/* A Frase do Conselho em Destaque */}
              <div className="relative py-2 pl-2 sm:pl-4">
                <Quote className="w-8 h-8 text-sun-yellow/40 absolute -top-2 -left-2 sm:-left-3 pointer-events-none" />
                <p className="font-heading font-black text-xl sm:text-2xl text-slate-900 leading-snug">
                  "{currentAdvice.quote}"
                </p>
              </div>

              {/* Assinatura Autoral da Thalita e Ações do Conselho */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-amber-100 text-xs">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-pop-pink fill-current" />
                  <span className="font-handwriting text-xl sm:text-2xl text-pop-pink">
                    Com todo o meu amor, Thalita Rebouças 💖
                  </span>
                </div>

                {/* Botões de Ação do Conselho */}
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  {/* Botão de Cópia com Feedback */}
                  <button
                    type="button"
                    onClick={handleCopyQuote}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-slate-950 text-xs font-bold font-heading transition-colors shadow-xs active:scale-95"
                    title="Copiar frase do conselho para área de transferência"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Frase Copiada!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                        <span>Copiar Frase</span>
                      </>
                    )}
                  </button>

                  {/* Botão para Gerar Card Estilizado para Redes Sociais */}
                  <button
                    type="button"
                    onClick={() => {
                      playClick();
                      setIsCardModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-pop-pink to-purple-600 hover:from-pop-pink-dark hover:to-purple-700 text-white text-xs font-bold font-heading shadow-md hover:shadow-lg transition-all active:scale-95"
                    title="Abrir gerador de cards de conselho (Stories 9:16 e Feed 1:1)"
                  >
                    <Camera className="w-3.5 h-3.5 text-sun-yellow" />
                    <span>Gerar Card para Redes 📸</span>
                  </button>
                </div>
              </div>

              {/* Banner Teaser de Scrapbook para Redes Sociais */}
              <div className="mt-4 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-pink-50 via-amber-50 to-pink-50 border border-pink-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 text-slate-700">
                  <span className="text-xl">📸</span>
                  <p className="font-body">
                    <strong>Gostou desse conselho?</strong> Exporte em formato de card estilizado com borda scrapbook, autógrafo digital e proporções perfeitas para <strong>Instagram Stories (9:16)</strong> ou <strong>Feed/WhatsApp (1:1)</strong>.
                  </p>
                </div>
                <MagneticButton
                  type="button"
                  onClick={() => {
                    playClick();
                    setIsCardModalOpen(true);
                  }}
                  className="shrink-0 px-4 py-2 rounded-full bg-pop-pink text-white font-heading font-extrabold uppercase tracking-wider text-[11px] shadow-sm hover:bg-pop-pink-dark transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-sun-yellow" />
                  <span>Personalizar Card 🎨</span>
                </MagneticButton>
              </div>

            </div>
          ) : (
            /* Estado de Espera Enquanto os Tambores Estão Girando */
            <div className="py-8 text-center space-y-2 text-slate-500 font-body">
              <Sparkles className="w-8 h-8 text-sun-yellow animate-spin mx-auto" />
              <p className="text-sm font-heading font-bold text-slate-700">
                A cápsula da sorte está sendo preparada no dispensador...
              </p>
            </div>
          )}
        </div>

      </div>

      {/* =================================================================== */}
      {/* MODAL ESTÚDIO DO CARD DE CONSELHO (STORIES 9:16 & FEED 1:1)         */}
      {/* =================================================================== */}
      <ShareableCard
        advice={currentAdvice}
        isOpen={isCardModalOpen}
        onClose={() => setIsCardModalOpen(false)}
      />

      {/* =================================================================== */}
      {/* TOAST DE FEEDBACK RÁPIDO DO CONSELHO                                */}
      {/* =================================================================== */}
      {toastMessage && (
        <div 
          role="status"
          aria-live="polite"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-md px-4 py-2.5 rounded-full shadow-2xl bg-slate-900/95 border border-emerald-400 text-white flex items-center gap-2.5 text-xs font-heading font-medium backdrop-blur-md animate-bounce"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

    </section>
  );
};
