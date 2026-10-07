import React, { useEffect, useState } from 'react';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { useAudio } from '@/hooks/use-audio';
import { 
  Heart, 
  Smile, 
  Users, 
  Sparkles, 
  Sun, 
  BookOpen, 
  Star, 
  Glasses, 
  Award,
  Flame,
  Candy,
  CheckCircle2
} from 'lucide-react';

export interface ReelItem {
  id: string;
  label: string;
  subtitle: string;
  iconName: string;
  color: string;
}

export const THEME_REEL_ITEMS: ReelItem[] = [
  { id: 't1', label: 'Amor & Afeto', subtitle: 'Pílula Afetiva', iconName: 'Heart', color: '#FF2A85' },
  { id: 't2', label: 'Humor & Riso', subtitle: 'Alívio Imediato', iconName: 'Smile', color: '#FFD13B' },
  { id: 't3', label: 'Amizade Real', subtitle: 'Pacto Inquebrável', iconName: 'Users', color: '#00B4D8' },
  { id: 't4', label: 'Drama Saudável', subtitle: 'Intensa & Plena', iconName: 'Sparkles', color: '#9B51E0' },
  { id: 't5', label: 'Amor-Próprio', subtitle: 'Autoestima Alta', iconName: 'Sun', color: '#FF7A00' },
];

export const BOOK_REEL_ITEMS: ReelItem[] = [
  { id: 'b1', label: 'Fala Sério, Mãe!', subtitle: 'Best-Seller 2004', iconName: 'BookOpen', color: '#FF2A85' },
  { id: 'b2', label: 'Tudo por um Popstar', subtitle: 'Turnê dos Sonhos', iconName: 'Star', color: '#00B4D8' },
  { id: 'b3', label: 'Garota Excluída', subtitle: 'Sucesso Netflix', iconName: 'Sparkles', color: '#9B51E0' },
  { id: 'b4', label: 'Fala Sério, Amor!', subtitle: 'Primeiras Paixões', iconName: 'Heart', color: '#FF7A00' },
  { id: 'b5', label: 'Felicidade Incurável', subtitle: 'Crônicas do Coração', iconName: 'Sun', color: '#2EC4B6' },
];

export const CHARM_REEL_ITEMS: ReelItem[] = [
  { id: 'c1', label: 'Chiclete Pop', subtitle: 'Doçura Carioca', iconName: 'Candy', color: '#FF2A85' },
  { id: 'c2', label: 'Óculos Rosa', subtitle: 'Olhar Otimista', iconName: 'Glasses', color: '#00B4D8' },
  { id: 'c3', label: 'Estrela Guia', subtitle: 'Brilhe Sempre', iconName: 'Award', color: '#FFD13B' },
  { id: 'c4', label: 'Chama Viva', subtitle: 'Coragem Total', iconName: 'Flame', color: '#FF7A00' },
  { id: 'c5', label: 'Sorte Dourada', subtitle: 'Tudo Vai Dar Certo', iconName: 'CheckCircle2', color: '#2EC4B6' },
];

interface SlotReelsProps {
  isSpinning: boolean;
  selectedThemeIndex: number;
  selectedBookIndex: number;
  selectedCharmIndex: number;
  onSpinComplete: () => void;
}

export const SlotReels: React.FC<SlotReelsProps> = ({
  isSpinning,
  selectedThemeIndex,
  selectedBookIndex,
  selectedCharmIndex,
  onSpinComplete,
}) => {
  const prefersReduced = useReducedMotion();
  const { playSlotSpin } = useAudio();

  // Estados de parada sequencial dos 3 cilindros
  const [reel1Stopped, setReel1Stopped] = useState(true);
  const [reel2Stopped, setReel2Stopped] = useState(true);
  const [reel3Stopped, setReel3Stopped] = useState(true);

  // Offset dinâmico de rotação
  const [spinOffset1, setSpinOffset1] = useState(0);
  const [spinOffset2, setSpinOffset2] = useState(0);
  const [spinOffset3, setSpinOffset3] = useState(0);

  useEffect(() => {
    if (!isSpinning) return;

    setReel1Stopped(false);
    setReel2Stopped(false);
    setReel3Stopped(false);

    // Duração do giro
    const spinDuration1 = prefersReduced ? 500 : 1100;
    const spinDuration2 = prefersReduced ? 750 : 1550;
    const spinDuration3 = prefersReduced ? 1000 : 2000;

    // Acréscimo de voltas completas (múltiplo do tamanho da lista para efeito de giro contínuo)
    setSpinOffset1((prev) => prev + 25 + selectedThemeIndex);
    setSpinOffset2((prev) => prev + 35 + selectedBookIndex);
    setSpinOffset3((prev) => prev + 45 + selectedCharmIndex);

    // Tique-taque sonoro durante a rotação
    const soundInterval = setInterval(() => {
      playSlotSpin();
    }, 120);

    const timer1 = setTimeout(() => {
      setReel1Stopped(true);
      playSlotSpin();
    }, spinDuration1);

    const timer2 = setTimeout(() => {
      setReel2Stopped(true);
      playSlotSpin();
    }, spinDuration2);

    const timer3 = setTimeout(() => {
      setReel3Stopped(true);
      clearInterval(soundInterval);
      onSpinComplete();
    }, spinDuration3);

    return () => {
      clearInterval(soundInterval);
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [
    isSpinning,
    prefersReduced,
    selectedThemeIndex,
    selectedBookIndex,
    selectedCharmIndex,
    onSpinComplete,
    playSlotSpin,
  ]);

  // Função auxiliar para renderizar ícone pelo nome
  const renderIcon = (iconName: string, color: string) => {
    const props = { className: 'w-7 h-7 sm:w-8 sm:h-8', style: { color } };
    switch (iconName) {
      case 'Heart': return <Heart {...props} fill={color} />;
      case 'Smile': return <Smile {...props} />;
      case 'Users': return <Users {...props} />;
      case 'Sparkles': return <Sparkles {...props} fill={color} />;
      case 'Sun': return <Sun {...props} />;
      case 'BookOpen': return <BookOpen {...props} />;
      case 'Star': return <Star {...props} fill={color} />;
      case 'Glasses': return <Glasses {...props} />;
      case 'Award': return <Award {...props} />;
      case 'Flame': return <Flame {...props} fill={color} />;
      case 'Candy': return <Candy {...props} />;
      case 'CheckCircle2': return <CheckCircle2 {...props} />;
      default: return <Sparkles {...props} />;
    }
  };

  // Renderizador de um cilindro individual
  const renderReel = (
    items: ReelItem[],
    selectedIndex: number,
    isStopped: boolean,
    spinOffset: number,
    reelTitle: string
  ) => {
    const activeItem = items[selectedIndex % items.length];
    const isBlurring = isSpinning && !isStopped && !prefersReduced;

    return (
      <div className="flex-1 flex flex-col items-center">
        {/* Etiqueta superior do cilindro */}
        <span className="text-[10px] font-heading font-black uppercase tracking-wider text-slate-400 mb-1.5 truncate max-w-[90px] sm:max-w-none">
          {reelTitle}
        </span>

        {/* Visor cilíndrico com vidro e sombras de curvatura */}
        <div className="relative w-full h-28 sm:h-32 bg-slate-950 rounded-xl border-2 border-amber-400/40 overflow-hidden slot-reel-shadow">
          
          {/* Efeito de Reflexo do Vidro Superior */}
          <div className="absolute inset-0 slot-glass pointer-events-none z-20" />

          {/* Marcador Central de Linha de Vitória */}
          <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-14 sm:h-16 border-y-2 border-sun-yellow/50 bg-sun-yellow/10 pointer-events-none z-10" />

          {/* Conteúdo do Tambor Giratório */}
          <div
            className={`w-full h-full flex flex-col items-center justify-center p-2 text-center transition-all ${
              isBlurring ? 'filter blur-[3px] scale-95 opacity-80' : 'filter blur-0 scale-100 opacity-100'
            }`}
            style={{
              transition: isStopped 
                ? 'transform 0.45s cubic-bezier(0.12, 0.8, 0.32, 1), filter 0.3s ease-out' 
                : 'none',
              transform: isStopped ? 'translateY(0)' : `translateY(${(spinOffset % 2 === 0 ? -1 : 1) * 6}px)`,
            }}
          >
            {/* Ícone Vibrante */}
            <div className="mb-1 transform transition-transform group-hover:scale-110">
              {renderIcon(activeItem.iconName, activeItem.color)}
            </div>

            {/* Nome do Item */}
            <strong className="text-xs sm:text-sm font-heading font-black text-white leading-tight line-clamp-1">
              {activeItem.label}
            </strong>

            {/* Subtítulo / Categoria */}
            <span className="text-[10px] font-mono text-slate-400 truncate max-w-[95%]">
              {activeItem.subtitle}
            </span>
          </div>

          {/* Luz de Borda do Cilindro */}
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-sun-yellow/40 to-transparent" />
        </div>
      </div>
    );
  };

  return (
    <div className="w-full bg-slate-900/90 rounded-2xl p-3 sm:p-5 border-2 border-amber-300/30 shadow-2xl relative">
      
      {/* Moldura de Lâmpadas Estilo Cassino / Parque de Diversões */}
      <div className="flex justify-between items-center px-2 pb-3 mb-2 border-b border-slate-800 text-[10px] font-mono">
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${isSpinning ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
          <span className="text-slate-300 font-bold uppercase tracking-wider">
            {isSpinning ? 'GIRANDO TAMBORES...' : 'ROLETA PRONTA'}
          </span>
        </div>

        <div className="flex gap-1.5">
          <span className="w-2 h-2 rounded-full bg-pop-pink" />
          <span className="w-2 h-2 rounded-full bg-sun-yellow" />
          <span className="w-2 h-2 rounded-full bg-sea-blue" />
        </div>
      </div>

      {/* Grade dos 3 Cilindros */}
      <div className="flex gap-2 sm:gap-4 items-center">
        {renderReel(THEME_REEL_ITEMS, selectedThemeIndex, reel1Stopped, spinOffset1, '1. TEMA')}
        {renderReel(BOOK_REEL_ITEMS, selectedBookIndex, reel2Stopped, spinOffset2, '2. OBRA')}
        {renderReel(CHARM_REEL_ITEMS, selectedCharmIndex, reel3Stopped, spinOffset3, '3. AMULETO')}
      </div>

      {/* Friso Cromado Inferior dos Cilindros */}
      <div className="mt-3 pt-2 text-center text-[10px] font-mono text-slate-500 border-t border-slate-800">
        3 COMBINAÇÕES AFETIVAS DE PURA ENERGIA CARIOCA
      </div>
    </div>
  );
};
