import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import confetti from 'canvas-confetti';
import { useAppStore } from '@/store/use-app-store';
import { PASSPORT_ACHIEVEMENTS } from '@/data/achievements';
import { useAudio } from '@/hooks/use-audio';
import { triggerHaptic } from '@/utils/haptics';
import { 
  Award, 
  X, 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  ArrowRight, 
  PartyPopper 
} from 'lucide-react';

export const ReaderPassport: React.FC = () => {
  const isPassportOpen = useAppStore((state) => state.isPassportOpen);
  const openPassport = useAppStore((state) => state.openPassport);
  const closePassport = useAppStore((state) => state.closePassport);
  const unlockedAchievements = useAppStore((state) => state.unlockedAchievements);
  const recentlyUnlocked = useAppStore((state) => state.recentlyUnlockedAchievement);
  const clearRecent = useAppStore((state) => state.clearRecentAchievement);

  const { playClick, playConfettiPop, playPageFlip } = useAudio();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const totalStamps = PASSPORT_ACHIEVEMENTS.length;
  const unlockedCount = unlockedAchievements.length;
  const progressPercent = Math.round((unlockedCount / totalStamps) * 100);
  const isAllCompleted = unlockedCount === totalStamps;

  // Dispara confetes comemorativos
  const fireCelebrationConfetti = () => {
    playConfettiPop();
    triggerHaptic('success');
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF2A85', '#FFD13B', '#00B4D8', '#FF7A00', '#2EC4B6'],
    });
  };

  // Efeito ao desbloquear um novo selo em tempo real
  useEffect(() => {
    if (!recentlyUnlocked) return;

    const stamp = PASSPORT_ACHIEVEMENTS.find((s) => s.id === recentlyUnlocked);
    if (stamp) {
      playConfettiPop();
      triggerHaptic('success');
      setToastMessage(`🎟️ Novo Selo Desbloqueado: ${stamp.title}!`);

      const timer = setTimeout(() => {
        setToastMessage(null);
        clearRecent();
      }, 4500);

      return () => clearTimeout(timer);
    }
  }, [recentlyUnlocked, playConfettiPop, clearRecent]);

  // Se atingir 100% ao abrir o passaporte, dispara chuva de confetes
  useEffect(() => {
    if (isPassportOpen && isAllCompleted) {
      fireCelebrationConfetti();
    }
  }, [isPassportOpen, isAllCompleted]);

  const handleOpen = () => {
    playPageFlip();
    triggerHaptic('medium');
    openPassport();
  };

  const handleClose = () => {
    playClick();
    triggerHaptic('light');
    closePassport();
  };

  const handleJumpToSection = (sectionId: string) => {
    playClick();
    triggerHaptic('light');
    closePassport();
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* ======================================================== */}
      {/* PÍLULA FLUTUANTE RETRÁTIL DO PASSAPORTE (BOTTOM-RIGHT)   */}
      {/* ======================================================== */}
      <aside 
        aria-label="Passaporte da Leitora"
        className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2"
      >
        {/* Notificação Toast Flutuante ao Desbloquear Selo */}
        {toastMessage && (
          <div
            onClick={handleOpen}
            role="status"
            className="cursor-pointer bg-gradient-to-r from-pop-pink to-rose-600 text-white text-xs font-heading font-extrabold px-4 py-2.5 rounded-2xl shadow-xl border-2 border-white animate-bounce flex items-center gap-2 select-none"
          >
            <Sparkles className="w-4 h-4 text-sun-yellow animate-spin" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Botão Pílula / Crachá */}
        <button
          type="button"
          onClick={handleOpen}
          aria-label={`Abrir Passaporte da Leitora. ${unlockedCount} de ${totalStamps} selos desbloqueados.`}
          className={`group flex items-center gap-2.5 px-3.5 py-2.5 rounded-full backdrop-blur-md shadow-xl border-2 transition-all transform active:scale-95 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-pop-pink ${
            isAllCompleted
              ? 'bg-gradient-to-r from-amber-300 via-sun-yellow to-amber-400 border-amber-400 text-amber-950 font-black'
              : 'bg-white/95 hover:bg-pink-50/90 border-pink-300/80 text-slate-800'
          }`}
        >
          {/* Ícone com mini progresso circular */}
          <div className="relative w-7 h-7 rounded-full bg-pink-100 flex items-center justify-center text-pop-pink shrink-0 shadow-xs">
            <Award className="w-4 h-4 text-pop-pink" />
            {isAllCompleted && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-sun-yellow rounded-full border border-amber-600 animate-ping" />
            )}
          </div>

          <div className="flex flex-col text-left">
            <span className="text-[11px] font-heading font-extrabold uppercase tracking-tight text-pop-pink leading-tight">
              Passaporte
            </span>
            <span className="text-xs font-heading font-bold text-slate-700 leading-none">
              {unlockedCount} / {totalStamps} Selos ({progressPercent}%)
            </span>
          </div>
        </button>
      </aside>

      {/* ======================================================== */}
      {/* MODAL DETALHADO DO PASSAPORTE DA LEITORA (PORTAL)        */}
      {/* ======================================================== */}
      {isPassportOpen && typeof document !== 'undefined' &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="passport-modal-title"
            onClick={handleClose}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl bg-gradient-to-b from-[#FFFDF8] via-white to-[#FFF9F2] rounded-3xl shadow-2xl border-4 border-amber-300 p-6 sm:p-8 space-y-6 overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              {/* Carimbo Dourado de Fita no Topo */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-36 h-6 bg-amber-200/60 backdrop-blur-xs rotate-[1deg] border border-amber-300/80 pointer-events-none rounded-xs" />

              {/* Cabeçalho Oficial do Passaporte */}
              <div className="flex items-start justify-between gap-4 border-b border-amber-200/60 pb-5">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-heading font-extrabold text-[11px] uppercase tracking-wider">
                    <Award className="w-3.5 h-3.5 text-amber-700" />
                    <span>República Afetiva de Thalita Rebouças</span>
                  </div>
                  <h2
                    id="passport-modal-title"
                    className="text-2xl sm:text-3xl font-black text-slate-900 font-heading tracking-tight"
                  >
                    Passaporte da Leitora 🎟️
                  </h2>
                  <p className="text-sm text-slate-600 font-body">
                    Rastreie suas pegadas interativas e colecione todos os carimbos oficiais da autora!
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleClose}
                  aria-label="Fechar Passaporte"
                  className="w-10 h-10 rounded-full bg-slate-100 hover:bg-pink-100 text-slate-500 hover:text-pop-pink flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-pop-pink"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Barra de Progresso Geral */}
              <div className="bg-amber-50/80 rounded-2xl p-4 border border-amber-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs font-heading font-bold text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-sun-yellow-dark" />
                    <span>Progresso de Exploração do Universo</span>
                  </span>
                  <span className="text-pop-pink font-black text-sm">
                    {unlockedCount} de {totalStamps} selos ({progressPercent}%)
                  </span>
                </div>
                <div className="w-full h-3 bg-amber-100 rounded-full overflow-hidden p-0.5 border border-amber-200">
                  <div
                    className="h-full bg-gradient-to-r from-sun-yellow via-tangerine to-pop-pink rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Certificado de 100% de Exploração */}
              {isAllCompleted && (
                <div className="bg-gradient-to-r from-amber-100 via-pink-100 to-amber-100 rounded-2xl p-5 border-2 border-sun-yellow shadow-sm text-center space-y-3 animate-pulse">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-sun-yellow to-pop-pink text-white shadow-md mx-auto">
                    <PartyPopper className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-heading font-black text-lg text-slate-900">
                      🏆 Parabéns! Você é Super Fã Oficial da Thalita!
                    </h3>
                    <p className="font-handwriting text-lg text-slate-700 max-w-md mx-auto pt-1">
                      "Você explorou cada cantinho, riu, folheou, opinou e viveu tudo com amor. Tem meu coração pra sempre!" — Thalita 💛
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={fireCelebrationConfetti}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-pop-pink hover:bg-pink-600 text-white font-heading font-bold text-xs shadow-md transition-transform active:scale-95"
                  >
                    <Sparkles className="w-4 h-4 text-sun-yellow" />
                    <span>Soltar Mais Confetes!</span>
                  </button>
                </div>
              )}

              {/* Grade dos 6 Selos do Passaporte */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {PASSPORT_ACHIEVEMENTS.map((stamp) => {
                  const isUnlocked = unlockedAchievements.includes(stamp.id);

                  return (
                    <div
                      key={stamp.id}
                      className={`relative rounded-2xl p-4 border transition-all ${
                        isUnlocked
                          ? 'bg-white border-amber-300 shadow-sm'
                          : 'bg-slate-50/70 border-slate-200/80 border-dashed opacity-85'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Efeito Visual de Carimbo de Tinta ou Cadeado */}
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0 select-none ${
                            isUnlocked
                              ? 'shadow-xs border-2 rotate-[-3deg]'
                              : 'bg-slate-200/60 border border-slate-300 text-slate-400 grayscale'
                          }`}
                          style={{
                            borderColor: isUnlocked ? stamp.stampColor : undefined,
                            backgroundColor: isUnlocked ? `${stamp.stampColor}15` : undefined,
                          }}
                        >
                          {isUnlocked ? stamp.emoji : <Lock className="w-5 h-5 text-slate-400" />}
                        </div>

                        {/* Conteúdo do Selo */}
                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <h4 className="font-heading font-bold text-sm text-slate-900 truncate">
                              {stamp.title}
                            </h4>
                            {isUnlocked ? (
                              <span className="inline-flex items-center gap-0.5 text-[10px] font-black uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Conquistado</span>
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full shrink-0">
                                Bloqueado
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-slate-600 font-body leading-relaxed">
                            {isUnlocked ? stamp.description : stamp.hint}
                          </p>

                          {/* Botão de Atalho para Ir até o Ato se não estiver desbloqueado */}
                          {!isUnlocked && (
                            <button
                              type="button"
                              onClick={() => handleJumpToSection(stamp.actSectionId)}
                              className="inline-flex items-center gap-1 text-[11px] font-heading font-bold text-pop-pink hover:text-pink-700 pt-1 transition-colors"
                            >
                              <span>Ir para o Ato</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Rodapé do Passaporte com Assinatura da Autora */}
              <div className="border-t border-amber-200/60 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-body">
                <span className="font-handwriting text-base text-amber-900">
                  Autenticado com amor carioca & carinho de fã ✨
                </span>
                <span className="font-mono text-[11px] text-slate-400">
                  Doc. Oficial Nº TR-2026-POP
                </span>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};
