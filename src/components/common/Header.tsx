import React, { useState } from 'react';
import { Heart, Menu, X, BookOpen, Film, HelpCircle, MessageSquare, Sparkles, Clock, Zap, ZapOff, Keyboard } from 'lucide-react';
import { SoundPill } from '@/components/audio/SoundPill';
import { useAudio } from '@/hooks/use-audio';
import { useReducedMotionControls } from '@/hooks/use-reduced-motion';
import { useAppStore } from '@/store/use-app-store';
import { triggerHaptic } from '@/utils/haptics';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Ateliê', href: '#hero', icon: Sparkles },
  { label: 'Memórias', href: '#timeline', icon: Clock },
  { label: 'Livros', href: '#bookshelf', icon: BookOpen },
  { label: 'Cinema', href: '#cinema', icon: Film },
  { label: 'Conselhos', href: '#advices', icon: HelpCircle },
  { label: 'Quiz', href: '#quiz', icon: Sparkles },
  { label: 'Mural', href: '#fan-wall', icon: MessageSquare },
];

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { playClick } = useAudio();
  const { isReducedMotion, toggleReducedMotion } = useReducedMotionControls();
  const toggleKeyboardModal = useAppStore((state) => state.toggleKeyboardModal);

  const handleNavClick = (href: string) => {
    playClick();
    setIsMobileMenuOpen(false);

    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/85 backdrop-blur-md border-b border-amber-200/60 shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-all">
      {/* Link de Pular para o Conteúdo Principal (WCAG 2.1 A) */}
      <a href="#hero" className="skip-to-content">
        Pular para o conteúdo principal
      </a>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Logotipo da Autora */}
        <a
          href="#hero"
          onClick={() => playClick()}
          aria-label="Thalita Rebouças - Início do Universo Interativo"
          className="group flex items-center gap-2.5 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-pop-pink rounded-xl"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sun-yellow to-pop-pink flex items-center justify-center shadow-sm transition-transform group-hover:scale-105 group-hover:rotate-[-3deg]">
            <Heart className="w-5 h-5 text-white fill-white" />
          </div>
          <div>
            <span className="font-heading font-black text-lg sm:text-xl text-slate-900 tracking-tight leading-none block">
              Thalita Rebouças
            </span>
            <span className="font-handwriting text-sm text-pop-pink block -mt-0.5 leading-none">
              Universo Interativo
            </span>
          </div>
        </a>

        {/* Links de Navegação Desktop */}
        <nav 
          aria-label="Navegação Principal"
          className="hidden lg:flex items-center gap-1 bg-amber-50/70 p-1 rounded-full border border-amber-200/50"
        >
          {NAV_ITEMS.map((item) => (
            <button
              key={item.href}
              onClick={() => handleNavClick(item.href)}
              className="px-3.5 py-1.5 text-xs font-semibold font-heading text-slate-600 hover:text-pop-pink hover:bg-white rounded-full transition-all duration-200"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Controles do Lado Direito */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Botão de Alternância de Movimento Reduzido (a11y) */}
          <button
            type="button"
            onClick={() => {
              playClick();
              toggleReducedMotion();
            }}
            aria-label={
              isReducedMotion
                ? 'Desativar modo de movimento reduzido (ativar animações completas)'
                : 'Ativar modo de movimento reduzido (reduzir animações para sensibilidade a movimento)'
            }
            aria-pressed={isReducedMotion}
            className={`p-2 rounded-full border transition-all text-xs font-heading font-bold flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-pop-pink ${
              isReducedMotion
                ? 'bg-purple-100 text-purple-900 border-purple-300 shadow-xs'
                : 'bg-white/80 hover:bg-slate-100 text-slate-600 border-slate-200'
            }`}
            title={isReducedMotion ? 'Movimento reduzido ativo' : 'Alternar movimento reduzido'}
          >
            {isReducedMotion ? (
              <>
                <ZapOff className="w-4 h-4 text-purple-700" />
                <span className="hidden xl:inline text-[11px]">Movimento Reduzido</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-slate-500" />
                <span className="hidden xl:inline text-[11px]">Animações</span>
              </>
            )}
          </button>

          {/* Botão de Atalhos de Teclado [?] */}
          <button
            type="button"
            onClick={() => {
              playClick();
              triggerHaptic('light');
              toggleKeyboardModal();
            }}
            aria-label="Abrir guia de atalhos de teclado (ou pressione ? no teclado)"
            className="p-2 rounded-full border border-slate-200 bg-white/80 hover:bg-pink-50 hover:text-pop-pink hover:border-pink-300 text-slate-600 transition-all text-xs font-heading font-bold flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-pop-pink shadow-xs"
            title="Atalhos de Teclado [?]"
          >
            <Keyboard className="w-4 h-4 text-slate-600 hover:text-pop-pink" />
            <span className="hidden xl:inline text-[11px]">Atalhos [?]</span>
          </button>

          {/* Sound Pill Flutuante */}
          <SoundPill />

          {/* Botão Hambúrguer Mobile */}
          <button
            type="button"
            onClick={() => {
              playClick();
              setIsMobileMenuOpen(!isMobileMenuOpen);
            }}
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-amber-100/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-pop-pink"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Menu Mobile Retrátil */}
      {isMobileMenuOpen && (
        <div 
          role="region"
          aria-label="Menu móvel de navegação"
          className="lg:hidden border-t border-amber-200/50 bg-white/95 backdrop-blur-lg px-4 py-4 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-200"
        >
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.href}
                onClick={() => handleNavClick(item.href)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold font-heading text-slate-700 hover:text-pop-pink hover:bg-amber-50 transition-colors text-left"
              >
                <Icon className="w-4 h-4 text-pop-pink shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* Controle de Movimento Reduzido no Menu Mobile */}
          <div className="pt-2 border-t border-amber-200/50">
            <button
              type="button"
              onClick={() => {
                playClick();
                toggleReducedMotion();
              }}
              aria-pressed={isReducedMotion}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold font-heading transition-colors ${
                isReducedMotion
                  ? 'bg-purple-100 text-purple-900 border border-purple-200'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-2">
                {isReducedMotion ? (
                  <ZapOff className="w-4 h-4 text-purple-700 shrink-0" />
                ) : (
                  <Zap className="w-4 h-4 text-slate-500 shrink-0" />
                )}
                <span>Modo de Movimento Reduzido</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                isReducedMotion ? 'bg-purple-200 text-purple-900' : 'bg-slate-200 text-slate-600'
              }`}>
                {isReducedMotion ? 'Ativado' : 'Desativado'}
              </span>
            </button>

            {/* Atalhos de Teclado no Menu Mobile */}
            <button
              type="button"
              onClick={() => {
                playClick();
                triggerHaptic('light');
                setIsMobileMenuOpen(false);
                toggleKeyboardModal();
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 mt-2 rounded-xl text-xs font-semibold font-heading bg-amber-50 hover:bg-pink-50 text-slate-700 hover:text-pop-pink transition-colors border border-amber-200/60"
            >
              <div className="flex items-center gap-2">
                <Keyboard className="w-4 h-4 text-pop-pink shrink-0" />
                <span>Atalhos de Teclado (Power-User)</span>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-white text-slate-600 border border-slate-200 text-[10px] font-mono font-bold">
                [?]
              </span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
