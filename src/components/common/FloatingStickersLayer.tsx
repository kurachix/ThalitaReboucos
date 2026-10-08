import React, { useState } from 'react';
import { FloatingSticker, StickerData } from './FloatingSticker';
import { useDeviceCapability } from '@/hooks/use-device-capability';
import { Sparkles, EyeOff } from 'lucide-react';
import { useAudio } from '@/hooks/use-audio';

export const POP_STICKERS: StickerData[] = [
  {
    id: 'sticker-fala-serio',
    label: 'Fala Sério!',
    subtitle: '100% amor & risada',
    icon: '💖',
    bgGradient: 'from-pink-100 via-rose-200 to-pink-300',
    borderColor: 'border-pink-400',
    textColor: 'text-rose-950',
    defaultPosition: { top: '15vh', right: '1.5rem' },
    defaultRotation: -4,
  },
  {
    id: 'sticker-popstar',
    label: 'Tudo por um Popstar',
    subtitle: 'Manias & Amizade',
    icon: '⭐',
    bgGradient: 'from-amber-100 via-yellow-200 to-amber-300',
    borderColor: 'border-amber-400',
    textColor: 'text-amber-950',
    defaultPosition: { top: '38vh', left: '1.5rem' },
    defaultRotation: 5,
  },
  {
    id: 'sticker-bienal',
    label: 'Recorde 12h Bienal',
    subtitle: 'Fila histórica de autógrafos',
    icon: '🏆',
    bgGradient: 'from-sky-100 via-cyan-200 to-blue-200',
    borderColor: 'border-sky-400',
    textColor: 'text-sky-950',
    defaultPosition: { top: '62vh', right: '2rem' },
    defaultRotation: -6,
  },
  {
    id: 'sticker-carioca',
    label: 'Carioca da Gema',
    subtitle: 'Sol de Ipanema & Leblon',
    icon: '☀️',
    bgGradient: 'from-emerald-100 via-teal-200 to-emerald-300',
    borderColor: 'border-emerald-400',
    textColor: 'text-emerald-950',
    defaultPosition: { top: '82vh', left: '2rem' },
    defaultRotation: 3,
  },
];

export const FloatingStickersLayer: React.FC = () => {
  const { isMobile } = useDeviceCapability();
  const { playClick } = useAudio();
  const [isVisible, setIsVisible] = useState(true);

  // No mobile, permite recolher para não sobrepor leitura se o usuário preferir
  return (
    <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
      {/* Botão sutil de alternar adesivos no canto inferior direito para controle total do usuário */}
      <div className="pointer-events-auto fixed bottom-3 right-3 z-40 hidden sm:block">
        <button
          type="button"
          onClick={() => {
            playClick();
            setIsVisible(!isVisible);
          }}
          aria-label={isVisible ? 'Ocultar adesivos decorativos' : 'Exibir adesivos decorativos'}
          className="p-2 rounded-full bg-white/80 hover:bg-white text-slate-600 hover:text-pop-pink border border-slate-200 shadow-sm backdrop-blur-xs text-xs font-heading font-bold flex items-center gap-1.5 transition-all hover:scale-105"
          title={isVisible ? 'Ocultar adesivos arrastáveis' : 'Exibir adesivos arrastáveis'}
        >
          {isVisible ? (
            <>
              <EyeOff className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[10px] hidden md:inline">Ocultar Adesivos</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-pop-pink" />
              <span className="text-[10px] hidden md:inline">Adesivos Scrapbook</span>
            </>
          )}
        </button>
      </div>

      {isVisible &&
        POP_STICKERS.map((sticker) => {
          // No mobile pequeno (< 640px), exibe apenas 2 adesivos estrategicamente posicionados para manter a tela limpa
          if (isMobile && (sticker.id === 'sticker-popstar' || sticker.id === 'sticker-bienal')) {
            return null;
          }

          return (
            <div key={sticker.id} className="pointer-events-auto">
              <FloatingSticker sticker={sticker} />
            </div>
          );
        })}
    </div>
  );
};
