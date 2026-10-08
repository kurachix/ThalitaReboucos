import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useAppStore } from '@/store/use-app-store';
import { useAudio } from '@/hooks/use-audio';
import { triggerHaptic } from '@/utils/haptics';
import { 
  Keyboard, 
  X, 
  Volume2, 
  VolumeX, 
  Sparkles 
} from 'lucide-react';

interface ShortcutItem {
  keys: string[];
  label: string;
  description: string;
  category: 'Navegação' | 'Áudio' | 'Interações' | 'Geral';
}

const SHORTCUTS: ShortcutItem[] = [
  {
    keys: ['?'],
    label: 'Guia de Atalhos',
    description: 'Abre ou fecha este painel com todos os comandos rápidos.',
    category: 'Geral',
  },
  {
    keys: ['M'],
    label: 'Alternar Som',
    description: 'Ativa ou silencia instantaneamente a trilha e efeitos sonoros.',
    category: 'Áudio',
  },
  {
    keys: ['J', '↓'],
    label: 'Próximo Ato',
    description: 'Desce suavemente para a próxima seção biográfica.',
    category: 'Navegação',
  },
  {
    keys: ['K', '↑'],
    label: 'Ato Anterior',
    description: 'Sobe suavemente para a seção biográfica anterior.',
    category: 'Navegação',
  },
  {
    keys: ['Espaço'],
    label: 'Ação Focal',
    description: 'Bate a claquete (no Cinema) ou puxa a alavanca (nos Conselhos).',
    category: 'Interações',
  },
  {
    keys: ['ESC'],
    label: 'Fechar Janelas',
    description: 'Fecha o leitor de livros, trailer de filme ou modais abertos.',
    category: 'Geral',
  },
  {
    keys: ['Tab'],
    label: 'Foco Visual Neon',
    description: 'Percorre botões e links com destaque em contorno pop neon.',
    category: 'Geral',
  },
];

export const KeyboardShortcutsModal: React.FC = () => {
  const isOpen = useAppStore((state) => state.isKeyboardModalOpen);
  const closeKeyboardModal = useAppStore((state) => state.closeKeyboardModal);
  const isMuted = useAppStore((state) => state.isMuted);
  const toggleAudio = useAppStore((state) => state.toggleAudio);
  const { playClick, playPageFlip } = useAudio();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Fecha modal com som e resposta háptica
  const handleClose = () => {
    playClick();
    triggerHaptic('light');
    closeKeyboardModal();
  };

  // Trava de foco e ESC
  useEffect(() => {
    if (!isOpen) return;

    playPageFlip();
    triggerHaptic('medium');

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Foca automaticamente no botão de fechar para usabilidade rápida
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, playPageFlip]);

  if (!isOpen || typeof document === 'undefined') return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="keyboard-shortcuts-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-4 border-amber-300 p-6 sm:p-8 space-y-6 overflow-hidden max-h-[90vh] overflow-y-auto"
        style={{
          backgroundImage: `
            radial-gradient(circle at 10% 20%, rgba(255, 209, 59, 0.15) 0%, transparent 40%),
            radial-gradient(circle at 90% 80%, rgba(255, 42, 133, 0.12) 0%, transparent 40%)
          `,
        }}
      >
        {/* Fita Adesiva Decorativa no Topo */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-32 h-6 bg-sun-yellow/40 backdrop-blur-xs rotate-[-1deg] border border-sun-yellow/50 pointer-events-none rounded-xs" />

        {/* Cabeçalho do Modal */}
        <div className="flex items-start justify-between gap-4 pt-1 border-b border-amber-100 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 text-pop-pink font-heading font-extrabold text-xs uppercase tracking-wider">
              <Keyboard className="w-3.5 h-3.5" />
              <span>Modo Power-User & Acessibilidade</span>
            </div>
            <h2
              id="keyboard-shortcuts-title"
              className="text-2xl sm:text-3xl font-black text-slate-900 font-heading tracking-tight"
            >
              Atalhos de Teclado
            </h2>
            <p className="text-sm text-slate-600 font-body">
              Explore todo o universo da Thalita voando pelas teclas sem precisar do mouse!
            </p>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={handleClose}
            aria-label="Fechar modal de atalhos de teclado (ou pressione ESC)"
            className="w-10 h-10 rounded-full bg-slate-100 hover:bg-pink-100 text-slate-500 hover:text-pop-pink flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-pop-pink"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Grade de Atalhos com <kbd> estilizados */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {SHORTCUTS.map((item) => (
            <div
              key={item.label}
              className="bg-amber-50/50 hover:bg-amber-100/50 rounded-2xl p-3.5 border border-amber-200/60 transition-colors flex items-start gap-3.5"
            >
              {/* Tecla estilizada 3D */}
              <div className="flex items-center gap-1 shrink-0 pt-0.5">
                {item.keys.map((key) => (
                  <kbd
                    key={key}
                    className="inline-flex items-center justify-center min-w-[2rem] px-2 h-8 rounded-lg bg-white border-b-2 border-slate-300 text-slate-800 font-mono text-xs font-bold shadow-xs select-none"
                  >
                    {key}
                  </kbd>
                ))}
              </div>

              {/* Informação do atalho */}
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-heading font-bold text-slate-900 text-sm">
                    {item.label}
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-white/80 text-slate-500 border border-slate-200/60">
                    {item.category}
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-body leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Status em Tempo Real & Teste do Atalho [M] */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <span className="font-bold font-heading">Estado atual do som:</span>
            <span
              className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-full ${
                isMuted
                  ? 'bg-slate-200 text-slate-700'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {isMuted ? (
                <>
                  <VolumeX className="w-3 h-3" />
                  Mudo
                </>
              ) : (
                <>
                  <Volume2 className="w-3 h-3" />
                  Ativo (Com Música)
                </>
              )}
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              playClick();
              triggerHaptic('light');
              toggleAudio();
            }}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 font-heading font-semibold text-slate-700 flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <span>Pressione</span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-300 font-mono font-bold text-[11px]">
              M
            </kbd>
            <span>para alternar agora</span>
          </button>
        </div>

        {/* Dica de Rodapé */}
        <div className="flex items-center justify-between text-xs text-slate-400 font-body pt-1">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-sun-yellow" />
            <span>Pressione <b>ESC</b> para sair ou clique fora do quadro</span>
          </span>
          <span className="hidden sm:inline font-mono">Thalita Rebouças · Quick-Nav v1.0</span>
        </div>
      </div>
    </div>,
    document.body
  );
};
