import React, { useState } from 'react';
import { useAudio } from '@/hooks/use-audio';
import { Sparkles } from 'lucide-react';

export interface GlassesColor {
  id: string;
  name: string;
  hex: string;
  glow: string;
  vibe: string;
}

export const GLASSES_COLORS: GlassesColor[] = [
  {
    id: 'pink',
    name: 'Rosa Choque',
    hex: '#FF2A85',
    glow: 'rgba(255, 42, 133, 0.4)',
    vibe: 'Vibe Malu & Fala Sério!',
  },
  {
    id: 'yellow',
    name: 'Amarelo Neon',
    hex: '#FFD13B',
    glow: 'rgba(255, 209, 59, 0.5)',
    vibe: 'Sol de Ipanema ☀️',
  },
  {
    id: 'purple',
    name: 'Roxo Elétrico',
    hex: '#9B51E0',
    glow: 'rgba(155, 81, 224, 0.4)',
    vibe: 'Série Confissões 💜',
  },
  {
    id: 'cyan',
    name: 'Turquesa Mar',
    hex: '#00B4D8',
    glow: 'rgba(0, 180, 216, 0.4)',
    vibe: 'Brisa de Copacabana 🌊',
  },
];

interface GlassesColorPickerProps {
  onColorChange?: (color: GlassesColor) => void;
}

export const GlassesColorPicker: React.FC<GlassesColorPickerProps> = ({ onColorChange }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isBouncing, setIsBouncing] = useState(false);
  const { playClick } = useAudio();

  const currentColor = GLASSES_COLORS[selectedIndex];

  const handleNextColor = () => {
    playClick();
    const nextIndex = (selectedIndex + 1) % GLASSES_COLORS.length;
    setSelectedIndex(nextIndex);
    setIsBouncing(true);
    setTimeout(() => setIsBouncing(false), 300);

    if (onColorChange) {
      onColorChange(GLASSES_COLORS[nextIndex]);
    }
  };

  const handleSelectColor = (index: number) => {
    if (index === selectedIndex) return;
    playClick();
    setSelectedIndex(index);
    setIsBouncing(true);
    setTimeout(() => setIsBouncing(false), 300);

    if (onColorChange) {
      onColorChange(GLASSES_COLORS[index]);
    }
  };

  return (
    <div className="flex flex-col items-center select-none group">
      
      {/* Balãozinho Afetivo Estilo Scrapbook */}
      <div className="mb-2 transition-transform duration-200 group-hover:-translate-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-amber-200 text-slate-700 shadow-sm text-xs font-handwriting text-base">
          <Sparkles className="w-3.5 h-3.5 text-pop-pink" />
          <span>Toque ou passe o mouse nos óculos!</span>
        </div>
      </div>

      {/* Armação dos Óculos Interativa (SVG de Alta Precisão) */}
      <button
        type="button"
        onClick={handleNextColor}
        aria-label={`Armação de óculos na cor ${currentColor.name}. Clique para mudar para a próxima cor.`}
        className={`relative p-3 rounded-3xl transition-all duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-pop-pink/50 cursor-pointer ${
          isBouncing ? 'scale-110 rotate-2' : 'hover:scale-105 hover:-rotate-1'
        }`}
        style={{
          filter: `drop-shadow(0 12px 20px ${currentColor.glow})`,
        }}
      >
        <svg
          viewBox="0 0 240 90"
          className="w-48 sm:w-60 h-auto transition-colors duration-300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Ponte Central dos Óculos */}
          <path
            d="M 105 45 C 112 35, 128 35, 135 45"
            stroke={currentColor.hex}
            strokeWidth="9"
            strokeLinecap="round"
          />

          {/* Haste Esquerda Lateral */}
          <path
            d="M 28 35 C 18 35, 8 28, 4 20"
            stroke={currentColor.hex}
            strokeWidth="6"
            strokeLinecap="round"
          />

          {/* Haste Direita Lateral */}
          <path
            d="M 212 35 C 222 35, 232 28, 236 20"
            stroke={currentColor.hex}
            strokeWidth="6"
            strokeLinecap="round"
          />

          {/* Aro Esquerdo Retrô Oval */}
          <rect
            x="24"
            y="18"
            width="82"
            height="56"
            rx="24"
            fill="white"
            fillOpacity="0.85"
            stroke={currentColor.hex}
            strokeWidth="10"
          />

          {/* Brilho da Lente Esquerda */}
          <path
            d="M 38 32 L 56 32 C 48 48, 44 54, 40 60"
            stroke="rgba(255, 255, 255, 0.9)"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Aro Direito Retrô Oval */}
          <rect
            x="134"
            y="18"
            width="82"
            height="56"
            rx="24"
            fill="white"
            fillOpacity="0.85"
            stroke={currentColor.hex}
            strokeWidth="10"
          />

          {/* Brilho da Lente Direita */}
          <path
            d="M 148 32 L 166 32 C 158 48, 154 54, 150 60"
            stroke="rgba(255, 255, 255, 0.9)"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {/* Legenda da Vibe Ativa */}
      <span className="font-heading font-bold text-xs text-slate-700 mt-1 transition-colors">
        {currentColor.name} · <span className="font-handwriting text-sm text-slate-500">{currentColor.vibe}</span>
      </span>

      {/* Pílulas de Seleção Direta de Cor */}
      <div className="flex items-center gap-2 mt-3 p-1.5 rounded-full bg-white/90 border border-slate-200/80 shadow-xs">
        {GLASSES_COLORS.map((color, idx) => (
          <button
            key={color.id}
            type="button"
            onClick={() => handleSelectColor(idx)}
            aria-pressed={idx === selectedIndex}
            aria-label={`Selecionar óculos na cor ${color.name}`}
            className={`w-5 h-5 rounded-full transition-transform duration-200 focus:outline-none ${
              idx === selectedIndex ? 'scale-125 ring-2 ring-offset-1 ring-slate-700' : 'hover:scale-110 opacity-70 hover:opacity-100'
            }`}
            style={{ backgroundColor: color.hex }}
          />
        ))}
      </div>

    </div>
  );
};
