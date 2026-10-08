import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { QuizCharacterResult } from '@/types';
import { useAudio } from '@/hooks/use-audio';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { 
  Sparkles, 
  RotateCcw, 
  Copy, 
  Share2, 
  Check, 
  BookOpen, 
  Heart, 
  Award,
  CheckCircle2
} from 'lucide-react';

export interface QuizResultCardProps {
  result: QuizCharacterResult;
  onRestart: () => void;
}

export const QuizResultCard: React.FC<QuizResultCardProps> = ({
  result,
  onRestart,
}) => {
  const { playConfettiPop, playClick } = useAudio();
  const prefersReduced = useReducedMotion();
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Explosão festiva de confetes ao montar o resultado
  useEffect(() => {
    playConfettiPop();

    if (!prefersReduced) {
      // Explosão central imediata
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
        colors: [result.badgeColor, '#FF2A85', '#FFD13B', '#00B4D8', '#9B51E0', '#2EC4B6'],
      });

      // Canhões laterais sincronizados para impacto visual de celebração
      const timer = setTimeout(() => {
        confetti({
          particleCount: 45,
          angle: 60,
          spread: 55,
          origin: { x: 0.05, y: 0.7 },
          colors: [result.badgeColor, '#FF2A85', '#FFD13B'],
        });
        confetti({
          particleCount: 45,
          angle: 120,
          spread: 55,
          origin: { x: 0.95, y: 0.7 },
          colors: [result.badgeColor, '#00B4D8', '#9B51E0'],
        });
      }, 280);

      return () => clearTimeout(timer);
    }
  }, [playConfettiPop, prefersReduced, result.badgeColor]);

  // Cópia do resultado formatado com citação
  const handleCopyResult = async () => {
    playClick();
    const shareText = `✨ Fiz o Quiz de Thalita Rebouças e descobri que sou a ${result.name}!\n📖 Livro: ${result.bookSource}\n💬 "${result.catchphrase}"\nDescubra seu personagem em: https://thalitareboucas.com.br/#quiz`;

    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setToastMessage('✨ Resultado copiado! Pronto para postar nas redes.');
      setTimeout(() => {
        setCopied(false);
        setToastMessage(null);
      }, 3000);
    }
  };

  // Compartilhamento no WhatsApp ou nativo
  const handleShareWhatsApp = () => {
    playClick();
    const shareText = `✨ Fiz o Quiz de Thalita Rebouças e descobri que sou a *${result.name}*! (${result.bookSource})\n\n"${result.catchphrase}"\n\nDescubra quem você é também em: https://thalitareboucas.com.br/#quiz`;
    
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: `Meu resultado no Quiz da Thalita: ${result.name}`,
        text: shareText,
      }).catch(() => {});
    } else {
      const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleRestartClick = () => {
    playClick();
    onRestart();
  };

  return (
    <div 
      className={`relative w-full max-w-2xl mx-auto transition-all duration-500 ${
        prefersReduced ? 'opacity-100' : 'animate-fade-in'
      }`}
    >
      {/* =================================================================== */}
      {/* CARTEIRINHA OFICIAL DE HEROÍNA (SCRAPBOOK CARD)                    */}
      {/* =================================================================== */}
      <div 
        className="relative bg-white rounded-3xl p-6 sm:p-9 md:p-10 shadow-2xl border-4 overflow-hidden"
        style={{ borderColor: result.badgeColor }}
      >
        {/* Fita Adesiva Decorativa no Topo */}
        <div 
          className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-6 py-1 text-white text-xs font-heading font-extrabold uppercase tracking-widest rounded-xs shadow-md rotate-[-1deg] z-20"
          style={{ backgroundColor: result.badgeColor }}
        >
          ★ CARTEIRINHA OFICIAL DA HEROÍNA ★
        </div>

        {/* Fundo com Linhas de Caderno e Brilhos Sutis */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-25"
          style={{
            backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, rgba(203, 213, 225, 0.7) 32px)',
          }}
        />

        {/* ======================================================== */}
        {/* CABEÇALHO DO RESULTADO                                   */}
        {/* ======================================================== */}
        <div className="relative z-10 text-center space-y-3 pb-6 border-b border-slate-100">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-800 text-xs font-bold font-heading shadow-xs">
            <Award className="w-4 h-4 text-sun-yellow-dark" />
            <span>Resultado Oficial do Quiz</span>
          </div>

          <h3 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black text-slate-900 tracking-tight">
            Você é a <span style={{ color: result.badgeColor }}>{result.name}</span>!
          </h3>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm font-semibold">
            <BookOpen className="w-4 h-4 text-pop-pink" />
            <span>Diretamente do livro: <strong>{result.bookSource}</strong></span>
          </div>
        </div>

        {/* ======================================================== */}
        {/* BORDÃO / CATCHPHRASE EM DESTAQUE                        */}
        {/* ======================================================== */}
        <div className="relative z-10 my-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-pink-50/70 via-amber-50/70 to-pink-50/70 border-2 border-dashed border-amber-200/90 text-center">
          <p className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-1">
            Bordão Clássico da Personagem
          </p>
          <p className="font-handwriting text-2xl sm:text-3xl text-slate-900 font-bold leading-snug">
            "{result.catchphrase}"
          </p>
        </div>

        {/* ======================================================== */}
        {/* DESCRIÇÃO DA PERSONAGEM                                  */}
        {/* ======================================================== */}
        <div className="relative z-10 mb-6 space-y-3">
          <h4 className="text-xs font-heading font-extrabold uppercase tracking-wider text-slate-500">
            Quem é você no mundo da Thalita:
          </h4>
          <p className="font-body text-slate-700 text-base sm:text-lg leading-relaxed">
            {result.description}
          </p>
        </div>

        {/* ======================================================== */}
        {/* TRAÇOS DE PERSONALIDADE (BADGES)                         */}
        {/* ======================================================== */}
        <div className="relative z-10 mb-8 space-y-2.5">
          <h4 className="text-xs font-heading font-extrabold uppercase tracking-wider text-slate-500">
            Seus Superpoderes Afetivos:
          </h4>
          <div className="flex flex-wrap gap-2">
            {result.traits.map((trait, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-heading font-bold shadow-xs border"
                style={{
                  backgroundColor: `${result.badgeColor}15`,
                  borderColor: `${result.badgeColor}40`,
                  color: result.badgeColor,
                }}
              >
                <Sparkles className="w-3 h-3" />
                <span>{trait}</span>
              </span>
            ))}
          </div>
        </div>

        {/* ======================================================== */}
        {/* DEDICATÓRIA DE THALITA                                   */}
        {/* ======================================================== */}
        <div className="relative z-10 pb-6 mb-6 border-b border-slate-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-pop-pink fill-current" />
            <span className="font-handwriting text-xl sm:text-2xl text-pop-pink">
              Amo muito você, heroína! — Thalita Rebouças 💖
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
            100% de afinidade
          </span>
        </div>

        {/* ======================================================== */}
        {/* AÇÕES: REFAZER, COPIAR & COMPARTILHAR                    */}
        {/* ======================================================== */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Botão Refazer Quiz */}
          <button
            type="button"
            onClick={handleRestartClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 text-xs font-heading font-bold transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Refazer Quiz</span>
          </button>

          {/* Botões Copiar & WhatsApp */}
          <div className="w-full sm:w-auto flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyResult}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-slate-100 hover:bg-amber-100 text-slate-700 text-xs font-heading font-bold border border-slate-200 transition-all active:scale-95"
              title="Copiar texto do resultado"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-500" />
                  <span>Copiar Resultado</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-heading font-extrabold uppercase tracking-wider shadow-md hover:shadow-lg transition-all active:scale-95"
              title="Compartilhar no WhatsApp ou redes sociais"
            >
              <Share2 className="w-4 h-4" />
              <span>Compartilhar</span>
            </button>
          </div>
        </div>

      </div>

      {/* Toast Flutuante de Confirmação */}
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
    </div>
  );
};
