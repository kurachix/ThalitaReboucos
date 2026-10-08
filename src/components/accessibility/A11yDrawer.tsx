import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  useA11yPreferences, 
  FontSizeOption 
} from '@/hooks/use-a11y-preferences';
import { useAudio } from '@/hooks/use-audio';
import { triggerHaptic } from '@/utils/haptics';
import { 
  Eye, 
  Type, 
  Sparkles, 
  X, 
  RotateCcw, 
  MessageSquare, 
  Sliders, 
  Bookmark 
} from 'lucide-react';

export const A11yDrawer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mouseY, setMouseY] = useState<number>(300);
  const drawerRef = useRef<HTMLDivElement>(null);
  const triggerBtnRef = useRef<HTMLButtonElement>(null);

  const {
    preferences,
    setFontSize,
    toggleDyslexicFont,
    toggleHighContrast,
    toggleReducedMotion,
    toggleReadingRuler,
    toggleVLibras,
    openVLibrasWidget,
    resetPreferences,
  } = useA11yPreferences();

  const { playClick, playPageFlip } = useAudio();

  // Contagem de recursos ativos para o badge do botão flutuante
  const activeFeaturesCount = [
    preferences.fontSize !== 'normal',
    preferences.dyslexicFont,
    preferences.highContrast,
    preferences.reducedMotion,
    preferences.readingRuler,
    preferences.vlibrasEnabled,
  ].filter(Boolean).length;

  // Atualiza a posição da régua de leitura
  useEffect(() => {
    if (!preferences.readingRuler) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMouseY(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [preferences.readingRuler]);

  // Listener para atalho de teclado global [A]
  useEffect(() => {
    const handleToggleEvent = () => {
      setIsOpen((prev) => !prev);
    };

    window.addEventListener('toggle-a11y-drawer', handleToggleEvent);
    return () => window.removeEventListener('toggle-a11y-drawer', handleToggleEvent);
  }, []);

  // Fechamento ao pressionar ESC
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsOpen(false);
        triggerBtnRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleToggleOpen = () => {
    playClick();
    triggerHaptic('medium');
    setIsOpen((prev) => !prev);
  };

  const handleClose = () => {
    playClick();
    triggerHaptic('light');
    setIsOpen(false);
  };

  return (
    <>
      {/* ================================================================= */}
      {/* RÉGUA DE LEITURA INTERATIVA (READING RULER OVERLAY)               */}
      {/* ================================================================= */}
      {preferences.readingRuler && (
        <div 
          aria-hidden="true"
          className="fixed inset-0 pointer-events-none z-30 transition-opacity duration-200"
        >
          {/* Sombra Superior */}
          <div 
            className="absolute top-0 left-0 right-0 bg-slate-950/30 backdrop-blur-[0.5px]"
            style={{ height: `${Math.max(0, mouseY - 35)}px` }}
          />

          {/* Faixa Focal de Destaque */}
          <div 
            className="absolute left-0 right-0 h-[70px] border-y-2 border-sun-yellow/80 bg-sun-yellow/10 pointer-events-none shadow-[0_0_20px_rgba(255,209,59,0.3)] transition-all duration-75"
            style={{ top: `${Math.max(0, mouseY - 35)}px` }}
          />

          {/* Sombra Inferior */}
          <div 
            className="absolute bottom-0 left-0 right-0 bg-slate-950/30 backdrop-blur-[0.5px]"
            style={{ top: `${Math.max(0, mouseY + 35)}px` }}
          />
        </div>
      )}

      {/* ================================================================= */}
      {/* BOTÃO FLUTUANTE DE ACESSIBILIDADE & LIBRAS (BOTTOM-LEFT)          */}
      {/* ================================================================= */}
      <aside 
        aria-label="Painel de Acessibilidade e LIBRAS"
        className="fixed bottom-5 left-5 z-40 flex flex-col items-start gap-2 select-none"
      >
        <button
          ref={triggerBtnRef}
          type="button"
          onClick={handleToggleOpen}
          aria-expanded={isOpen}
          aria-controls="a11y-drawer-panel"
          aria-label={`Menu de Acessibilidade e LIBRAS. ${activeFeaturesCount} preferências ativas.`}
          className="group relative flex items-center gap-2.5 px-3.5 py-2.5 rounded-full bg-white/95 hover:bg-amber-50/95 text-slate-800 border-2 border-amber-300 shadow-xl backdrop-blur-md transition-all transform active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-pop-pink"
        >
          {/* Ícone de Acessibilidade */}
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-sun-yellow to-pop-pink text-white flex items-center justify-center shadow-xs">
            <Sliders className="w-3.5 h-3.5 text-slate-950" />
          </div>

          <div className="flex flex-col text-left">
            <span className="text-xs font-heading font-black tracking-tight text-slate-900 leading-tight">
              Acessibilidade
            </span>
            <span className="text-[10px] font-mono text-pop-pink font-bold flex items-center gap-1">
              <span>LIBRAS</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </span>
          </div>

          {/* Badge de quantidade de filtros ativos */}
          {activeFeaturesCount > 0 && (
            <span 
              aria-label={`${activeFeaturesCount} preferências ativas`}
              className="ml-1 w-5 h-5 rounded-full bg-pop-pink text-white font-mono text-[10px] font-black flex items-center justify-center shadow-xs animate-bounce"
            >
              {activeFeaturesCount}
            </span>
          )}
        </button>
      </aside>

      {/* ================================================================= */}
      {/* PAINEL MODAL / GAVETA FLUTUANTE DE CONTROLES                      */}
      {/* ================================================================= */}
      {isOpen && typeof document !== 'undefined' && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="a11y-drawer-title"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-start sm:justify-start p-3 sm:p-6 md:p-8 bg-slate-950/50 backdrop-blur-xs transition-opacity duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose();
          }}
        >
          <div
            ref={drawerRef}
            id="a11y-drawer-panel"
            className="w-full sm:w-[440px] max-h-[85vh] overflow-y-auto rounded-3xl bg-white border-2 border-amber-300 shadow-2xl p-5 sm:p-6 space-y-6 text-slate-800 animate-in fade-in zoom-in-95 duration-200"
          >
            {/* Topo do Painel */}
            <div className="flex items-center justify-between pb-3 border-b border-amber-200">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-sun-yellow text-slate-950 flex items-center justify-center shadow-xs">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h3 id="a11y-drawer-title" className="font-heading font-black text-lg text-slate-900 leading-tight">
                    Central de Acessibilidade
                  </h3>
                  <p className="text-xs font-mono text-slate-500">
                    Ajustes de leitura, visão e LIBRAS
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleClose}
                aria-label="Fechar painel de acessibilidade"
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* ======================================================= */}
            {/* DESTAQUE: INTEGRAÇÃO COM LIBRAS (SUÍTE OFICIAL VLIBRAS) */}
            {/* ======================================================= */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50 to-amber-50 border-2 border-emerald-300 space-y-3 shadow-xs">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl" role="img" aria-label="Bandeira do Brasil e Mãos">
                    🤟
                  </span>
                  <div>
                    <h4 className="font-heading font-black text-sm text-emerald-950 flex items-center gap-1.5">
                      <span>Intérprete em LIBRAS</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-600 text-white">
                        OFICIAL
                      </span>
                    </h4>
                    <p className="text-[11px] text-emerald-800 font-body leading-tight">
                      Suíte VLibras do Governo Federal para tradução em Língua Brasileira de Sinais
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    playClick();
                    triggerHaptic('medium');
                    toggleVLibras();
                  }}
                  role="switch"
                  aria-checked={preferences.vlibrasEnabled}
                  aria-label="Ativar intérprete de LIBRAS"
                  className={`w-12 h-6 rounded-full transition-colors p-0.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    preferences.vlibrasEnabled ? 'bg-emerald-600' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform shadow-xs ${
                      preferences.vlibrasEnabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Botão de Ação Direta para o Avatar 3D de LIBRAS */}
              <div className="pt-1 flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={() => {
                    playClick();
                    triggerHaptic('success');
                    openVLibrasWidget();
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all transform active:scale-95"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Abrir Intérprete 3D Agora</span>
                </button>
              </div>

              <p className="text-[10px] text-emerald-700 font-body italic leading-tight">
                💡 Dica: Após ativar, passe o cursor ou clique em qualquer trecho da biografia para o avatar sinalizar a tradução em LIBRAS.
              </p>
            </div>

            {/* ======================================================= */}
            {/* TAMANHO DA FONTE (A- / A / A+)                          */}
            {/* ======================================================= */}
            <div className="space-y-2">
              <label className="block text-xs font-heading font-extrabold text-slate-700 uppercase tracking-wider">
                Tamanho da Letra
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { id: 'normal', label: 'Padrão (100%)', scale: 'text-xs' },
                    { id: 'large', label: 'Grande (115%)', scale: 'text-sm' },
                    { id: 'xlarge', label: 'Máximo (130%)', scale: 'text-base' },
                  ] as { id: FontSizeOption; label: string; scale: string }[]
                ).map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      playClick();
                      triggerHaptic('light');
                      setFontSize(opt.id);
                    }}
                    className={`py-2 px-2 rounded-xl text-center font-heading font-bold transition-all border ${
                      preferences.fontSize === opt.id
                        ? 'bg-pop-pink text-white border-pop-pink shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <span className={`block font-black ${opt.scale}`}>A</span>
                    <span className="text-[10px] block opacity-90">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* ======================================================= */}
            {/* ALTERNADORES: DISLEXIA, ALTO CONTRASTE, MOVIMENTO & RÉGUA*/}
            {/* ======================================================= */}
            <div className="space-y-2.5">
              <label className="block text-xs font-heading font-extrabold text-slate-700 uppercase tracking-wider">
                Conforto Visual e Cognitivo
              </label>

              {/* Fonte Amigável para Dislexia */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2.5">
                  <Type className="w-4 h-4 text-pop-pink" />
                  <div>
                    <strong className="block text-xs text-slate-800 font-heading">
                      Fonte para Dislexia
                    </strong>
                    <span className="text-[11px] text-slate-500 block leading-tight">
                      Espaçamento amplo e caracteres distintos
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    playClick();
                    triggerHaptic('light');
                    toggleDyslexicFont();
                  }}
                  role="switch"
                  aria-checked={preferences.dyslexicFont}
                  aria-label="Ativar fonte para dislexia"
                  className={`w-11 h-6 rounded-full transition-colors p-0.5 focus:outline-none focus:ring-2 focus:ring-pop-pink ${
                    preferences.dyslexicFont ? 'bg-pop-pink' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform shadow-xs ${
                      preferences.dyslexicFont ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Alto Contraste */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2.5">
                  <Eye className="w-4 h-4 text-sun-yellow-dark" />
                  <div>
                    <strong className="block text-xs text-slate-800 font-heading">
                      Modo Alto Contraste
                    </strong>
                    <span className="text-[11px] text-slate-500 block leading-tight">
                      Fundo escuro e bordas nítidas padrão WCAG AAA
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    playClick();
                    triggerHaptic('light');
                    toggleHighContrast();
                  }}
                  role="switch"
                  aria-checked={preferences.highContrast}
                  aria-label="Ativar alto contraste"
                  className={`w-11 h-6 rounded-full transition-colors p-0.5 focus:outline-none focus:ring-2 focus:ring-sun-yellow ${
                    preferences.highContrast ? 'bg-slate-900' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform shadow-xs ${
                      preferences.highContrast ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Reduzir Animações / Movimento */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  <div>
                    <strong className="block text-xs text-slate-800 font-heading">
                      Pausar Animações
                    </strong>
                    <span className="text-[11px] text-slate-500 block leading-tight">
                      Desativa oscilações e efeitos flutuantes contínuos
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    playClick();
                    triggerHaptic('light');
                    toggleReducedMotion();
                  }}
                  role="switch"
                  aria-checked={preferences.reducedMotion}
                  aria-label="Pausar animações"
                  className={`w-11 h-6 rounded-full transition-colors p-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    preferences.reducedMotion ? 'bg-indigo-600' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform shadow-xs ${
                      preferences.reducedMotion ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Régua de Foco de Leitura */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2.5">
                  <Bookmark className="w-4 h-4 text-amber-600" />
                  <div>
                    <strong className="block text-xs text-slate-800 font-heading">
                      Régua de Foco de Leitura
                    </strong>
                    <span className="text-[11px] text-slate-500 block leading-tight">
                      Faixa iluminada que acompanha o cursor na tela
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    playClick();
                    triggerHaptic('light');
                    toggleReadingRuler();
                  }}
                  role="switch"
                  aria-checked={preferences.readingRuler}
                  aria-label="Ativar régua de leitura"
                  className={`w-11 h-6 rounded-full transition-colors p-0.5 focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                    preferences.readingRuler ? 'bg-amber-500' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform shadow-xs ${
                      preferences.readingRuler ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Rodapé: Resetar Preferências */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  playPageFlip();
                  triggerHaptic('medium');
                  resetPreferences();
                }}
                className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-500 hover:text-slate-800 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restaurar Padrões</span>
              </button>

              <button
                type="button"
                onClick={handleClose}
                className="py-1.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-heading font-bold transition-colors"
              >
                Concluir
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}
    </>
  );
};
