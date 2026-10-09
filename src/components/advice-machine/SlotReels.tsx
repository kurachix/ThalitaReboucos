import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import gsap from 'gsap';
import confetti from 'canvas-confetti';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { useAudio } from '@/hooks/use-audio';
import { triggerHaptic } from '@/utils/haptics';
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

// Número de repetições para gerar a fita contínua infinita do cilindro
const REEL_REPETITIONS = 12;
const BASE_REST_REPEAT = 2; // Repetição base onde o cilindro descansa em repouso

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
  const { playSlotSpin, playReelStop, playSlotWin } = useAudio();

  // Referências DOM para os contêineres e as fitas móveis
  const reel0Ref = useRef<HTMLDivElement>(null);
  const reel1Ref = useRef<HTMLDivElement>(null);
  const reel2Ref = useRef<HTMLDivElement>(null);

  const strip0Ref = useRef<HTMLDivElement>(null);
  const strip1Ref = useRef<HTMLDivElement>(null);
  const strip2Ref = useRef<HTMLDivElement>(null);

  // Estados de parada e realce individual de cada cilindro
  const [reel0Stopped, setReel0Stopped] = useState(true);
  const [reel1Stopped, setReel1Stopped] = useState(true);
  const [reel2Stopped, setReel2Stopped] = useState(true);

  // Altura dinâmica de cada item (mensurada do DOM para responsividade total)
  const [itemHeight, setItemHeight] = useState<number>(112);

  // Guarda o último índice sorteado para calcular o salto correto
  const prevIndicesRef = useRef({
    theme: selectedThemeIndex,
    book: selectedBookIndex,
    charm: selectedCharmIndex,
  });

  // Fitas com repetições contínuas (60 itens cada)
  const stripItems0 = useMemo(() => Array(REEL_REPETITIONS).fill(THEME_REEL_ITEMS).flat(), []);
  const stripItems1 = useMemo(() => Array(REEL_REPETITIONS).fill(BOOK_REEL_ITEMS).flat(), []);
  const stripItems2 = useMemo(() => Array(REEL_REPETITIONS).fill(CHARM_REEL_ITEMS).flat(), []);

  // Helper para renderizar os ícones
  const renderIcon = (iconName: string, color: string) => {
    const props = { className: 'w-6 h-6 sm:w-7 sm:h-7 drop-shadow-sm', style: { color } };
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

  // Mede a altura exata do contêiner para posicionamento matematicamente exato
  const measureHeight = useCallback(() => {
    if (reel0Ref.current) {
      const h = reel0Ref.current.offsetHeight;
      if (h > 0) {
        setItemHeight(h);
        return h;
      }
    }
    return 112;
  }, []);

  // Posiciona as fitas na posição inicial de repouso
  const setInitialPositions = useCallback((h: number) => {
    const y0 = -(BASE_REST_REPEAT * THEME_REEL_ITEMS.length + selectedThemeIndex) * h;
    const y1 = -(BASE_REST_REPEAT * BOOK_REEL_ITEMS.length + selectedBookIndex) * h;
    const y2 = -(BASE_REST_REPEAT * CHARM_REEL_ITEMS.length + selectedCharmIndex) * h;

    if (strip0Ref.current) gsap.set(strip0Ref.current, { y: y0 });
    if (strip1Ref.current) gsap.set(strip1Ref.current, { y: y1 });
    if (strip2Ref.current) gsap.set(strip2Ref.current, { y: y2 });
  }, [selectedThemeIndex, selectedBookIndex, selectedCharmIndex]);

  // Efeito de inicialização e responsividade ao redimensionar tela
  useEffect(() => {
    const h = measureHeight();
    setInitialPositions(h);

    const handleResize = () => {
      const newH = measureHeight();
      setInitialPositions(newH);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [measureHeight, setInitialPositions]);

  // =========================================================================
  // MOTOR DE ANIMAÇÃO GSAP COM FÍSICA MECÂNICA, MOTION BLUR E PARADA EM CASCATA
  // =========================================================================
  useEffect(() => {
    if (!isSpinning) return;

    setReel0Stopped(false);
    setReel1Stopped(false);
    setReel2Stopped(false);

    const currentHeight = measureHeight();

    // 1. Silent Reset: garante que todas as fitas comecem do BASE_REST_REPEAT
    // Como os itens são idênticos em todas as repetições, não há salto visual
    const resetY0 = -(BASE_REST_REPEAT * THEME_REEL_ITEMS.length + prevIndicesRef.current.theme) * currentHeight;
    const resetY1 = -(BASE_REST_REPEAT * BOOK_REEL_ITEMS.length + prevIndicesRef.current.book) * currentHeight;
    const resetY2 = -(BASE_REST_REPEAT * CHARM_REEL_ITEMS.length + prevIndicesRef.current.charm) * currentHeight;

    if (strip0Ref.current) gsap.set(strip0Ref.current, { y: resetY0, filter: 'blur(0px)' });
    if (strip1Ref.current) gsap.set(strip1Ref.current, { y: resetY1, filter: 'blur(0px)' });
    if (strip2Ref.current) gsap.set(strip2Ref.current, { y: resetY2, filter: 'blur(0px)' });

    // Tique-taque sonoro mecânico contínuo dos dentes de engrenagem
    const tickInterval = setInterval(() => {
      playSlotSpin();
    }, 90);

    // Índices de parada nas repetições distantes (efeito de rolagem vertiginosa)
    const targetRepeat0 = 7; // Gira ~25 itens
    const targetRepeat1 = 8; // Gira ~30 itens
    const targetRepeat2 = 9; // Gira ~35 itens

    const finalY0 = -(targetRepeat0 * THEME_REEL_ITEMS.length + selectedThemeIndex) * currentHeight;
    const finalY1 = -(targetRepeat1 * BOOK_REEL_ITEMS.length + selectedBookIndex) * currentHeight;
    const finalY2 = -(targetRepeat2 * CHARM_REEL_ITEMS.length + selectedCharmIndex) * currentHeight;

    // Configurações de tempo e aceleração
    const duration0 = prefersReduced ? 0.6 : 1.35;
    const duration1 = prefersReduced ? 0.9 : 1.85;
    const duration2 = prefersReduced ? 1.2 : 2.35;

    // Timeline do Cilindro 1 (Tema)
    if (strip0Ref.current) {
      const tl0 = gsap.timeline();
      // Recuo de engrenagem inicial (anticipation)
      if (!prefersReduced) {
        tl0.to(strip0Ref.current, { y: '+=14', duration: 0.12, ease: 'power1.inOut' });
        tl0.to(strip0Ref.current, { filter: 'blur(4px)', duration: 0.2 }, 0.1);
        tl0.to(strip0Ref.current, { filter: 'blur(0px)', duration: 0.3 }, duration0 - 0.35);
      }
      tl0.to(
        strip0Ref.current,
        {
          y: finalY0,
          duration: duration0,
          ease: prefersReduced ? 'power2.out' : 'back.out(1.35)', // Salto mecânico com amortecimento elástico
          onComplete: () => {
            setReel0Stopped(true);
            playReelStop();
            triggerHaptic('medium');
          },
        },
        prefersReduced ? 0 : 0.12
      );
    }

    // Timeline do Cilindro 2 (Obra)
    if (strip1Ref.current) {
      const tl1 = gsap.timeline();
      if (!prefersReduced) {
        tl1.to(strip1Ref.current, { y: '+=14', duration: 0.12, ease: 'power1.inOut' });
        tl1.to(strip1Ref.current, { filter: 'blur(5px)', duration: 0.2 }, 0.1);
        tl1.to(strip1Ref.current, { filter: 'blur(0px)', duration: 0.3 }, duration1 - 0.35);
      }
      tl1.to(
        strip1Ref.current,
        {
          y: finalY1,
          duration: duration1,
          ease: prefersReduced ? 'power2.out' : 'back.out(1.35)',
          onComplete: () => {
            setReel1Stopped(true);
            playReelStop();
            triggerHaptic('medium');
          },
        },
        prefersReduced ? 0 : 0.12
      );
    }

    // Timeline do Cilindro 3 (Amuleto) — Clímax da Roleta
    if (strip2Ref.current) {
      const tl2 = gsap.timeline();
      if (!prefersReduced) {
        tl2.to(strip2Ref.current, { y: '+=14', duration: 0.12, ease: 'power1.inOut' });
        tl2.to(strip2Ref.current, { filter: 'blur(6px)', duration: 0.2 }, 0.1);
        tl2.to(strip2Ref.current, { filter: 'blur(0px)', duration: 0.35 }, duration2 - 0.35);
      }
      tl2.to(
        strip2Ref.current,
        {
          y: finalY2,
          duration: duration2,
          ease: prefersReduced ? 'power2.out' : 'back.out(1.4)',
          onComplete: () => {
            clearInterval(tickInterval);
            setReel2Stopped(true);
            playReelStop();
            playSlotWin();
            triggerHaptic('heavy');

            // Explosão de confetes festivos nos tons da Thalita Rebouças
            try {
              confetti({
                particleCount: 45,
                angle: 60,
                spread: 55,
                origin: { x: 0.2, y: 0.65 },
                colors: ['#FF2A85', '#FFD13B', '#00B4D8', '#9B51E0', '#FF7A00'],
              });
              confetti({
                particleCount: 45,
                angle: 120,
                spread: 55,
                origin: { x: 0.8, y: 0.65 },
                colors: ['#FF2A85', '#FFD13B', '#00B4D8', '#9B51E0', '#FF7A00'],
              });
            } catch {
              // Fallback gracioso caso canvas-confetti encontre limitação de contexto
            }

            // Atualiza a referência dos índices para o próximo sorteio
            prevIndicesRef.current = {
              theme: selectedThemeIndex,
              book: selectedBookIndex,
              charm: selectedCharmIndex,
            };

            // Dispara a revelação do conselho e abertura da cápsula
            onSpinComplete();
          },
        },
        prefersReduced ? 0 : 0.12
      );
    }

    return () => {
      clearInterval(tickInterval);
    };
  }, [
    isSpinning,
    selectedThemeIndex,
    selectedBookIndex,
    selectedCharmIndex,
    measureHeight,
    onSpinComplete,
    playSlotSpin,
    playReelStop,
    playSlotWin,
    prefersReduced,
  ]);

  // =========================================================================
  // RENDERIZADOR DE UM CILINDRO CILÍNDRICO INDIVIDUAL (TAMBOR 3D REALISTA)
  // =========================================================================
  const renderReelDrum = (
    reelRef: React.RefObject<HTMLDivElement>,
    stripRef: React.RefObject<HTMLDivElement>,
    items: ReelItem[],
    isStopped: boolean,
    titleNumber: string,
    titleLabel: string
  ) => {
    return (
      <div className="flex-1 flex flex-col items-center min-w-0">
        {/* Plaquinha superior de categoria do cilindro */}
        <div className="mb-2 px-2 py-0.5 rounded-full bg-slate-800/90 border border-slate-700/80 shadow-xs flex items-center gap-1 max-w-full">
          <span className="w-1.5 h-1.5 rounded-full bg-sun-yellow animate-pulse shrink-0" />
          <span className="text-[10px] font-heading font-black uppercase tracking-wider text-slate-300 truncate">
            {titleNumber} · {titleLabel}
          </span>
        </div>

        {/* Visor do Tambor Mecânico com Curvatura Cilíndrica 3D e Sombras Inset */}
        <div
          ref={reelRef}
          className={`relative w-full h-28 sm:h-32 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-2xl border-2 overflow-hidden shadow-2xl transition-all duration-300 ${
            isStopped 
              ? 'border-sun-yellow/80 shadow-[0_0_20px_rgba(255,209,59,0.25)]' 
              : 'border-amber-400/40 shadow-inner'
          }`}
          style={{
            perspective: '1000px',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Fita Móvel dos Símbolos que desliza verticalmente com GSAP */}
          <div
            ref={stripRef}
            className="w-full flex flex-col will-change-transform"
          >
            {items.map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                className="w-full flex flex-col items-center justify-center p-2 text-center select-none shrink-0"
                style={{ height: `${itemHeight}px` }}
              >
                {/* Badge do Ícone com Brilho Suave */}
                <div 
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center mb-1.5 shadow-md border border-white/20 transition-transform group-hover:scale-110"
                  style={{
                    backgroundColor: `${item.color}22`,
                    boxShadow: `0 0 12px ${item.color}44`,
                  }}
                >
                  {renderIcon(item.iconName, item.color)}
                </div>

                {/* Nome do Item Premiado */}
                <strong className="text-xs sm:text-sm font-heading font-black text-white leading-tight line-clamp-1 drop-shadow-sm px-1">
                  {item.label}
                </strong>

                {/* Subtítulo / Tag de Origem */}
                <span 
                  className="text-[10px] font-mono font-bold tracking-tight truncate max-w-[95%] mt-0.5"
                  style={{ color: item.color }}
                >
                  {item.subtitle}
                </span>
              </div>
            ))}
          </div>

          {/* =============================================================== */}
          {/* CAMADAS DE PROFUNDIDADE ÓPTICA & CURVATURA DO CILINDRO DE VIDRO   */}
          {/* =============================================================== */}

          {/* 1. Sombra Cilíndrica Superior (efeito de curvatura para trás) */}
          <div className="absolute inset-x-0 top-0 h-9 bg-gradient-to-b from-slate-950 via-slate-950/70 to-transparent pointer-events-none z-20" />

          {/* 2. Sombra Cilíndrica Inferior (efeito de curvatura para trás) */}
          <div className="absolute inset-x-0 bottom-0 h-9 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent pointer-events-none z-20" />

          {/* 3. Reflexo Especular de Vidro Temperado Retrô */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/8 to-transparent pointer-events-none z-20" />

          {/* 4. Linha de Pagamento Central (Payline) iluminada */}
          <div className={`absolute inset-x-0 top-1/2 -translate-y-1/2 h-full pointer-events-none z-10 border-y transition-colors duration-300 ${
            isStopped 
              ? 'border-sun-yellow/40 bg-sun-yellow/5' 
              : 'border-white/10 bg-transparent'
          }`}>
            {/* Marcadores de Mira nas extremidades da Payline */}
            <span className="absolute left-1 top-1/2 -translate-y-1/2 text-[10px] text-sun-yellow font-black opacity-80">
              ▶
            </span>
            <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[10px] text-sun-yellow font-black opacity-80">
              ◀
            </span>
          </div>

          {/* 5. Friso de Luz Inferior */}
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-sun-yellow/50 to-transparent pointer-events-none z-20" />
        </div>
      </div>
    );
  };

  return (
    <div className="w-full bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 rounded-3xl p-3.5 sm:p-5 border-4 border-amber-300/60 shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative overflow-hidden">
      
      {/* Moldura de Lâmpadas Estilo Cassino / Parque de Diversões */}
      <div className="flex justify-between items-center px-2 pb-3 mb-3 border-b border-slate-800 text-[10px] font-mono">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${
            isSpinning 
              ? 'bg-amber-400 animate-ping' 
              : reel0Stopped && reel1Stopped && reel2Stopped 
                ? 'bg-emerald-400 shadow-[0_0_8px_#34D399]' 
                : 'bg-pop-pink'
          }`} />
          <span className="text-white font-heading font-black uppercase tracking-wider text-[11px]">
            {isSpinning ? 'ROLETA EM GIRO RÁPIDO...' : 'ROLETA PRONTA · PUXE A ALAVANCA'}
          </span>
        </div>

        {/* Lâmpadas LED Decorativas Coloridas */}
        <div className="flex gap-1.5 items-center">
          <span className={`w-2 h-2 rounded-full bg-pop-pink ${isSpinning ? 'animate-pulse' : ''}`} />
          <span className={`w-2 h-2 rounded-full bg-sun-yellow ${isSpinning ? 'animate-bounce' : ''}`} />
          <span className={`w-2 h-2 rounded-full bg-sea-blue ${isSpinning ? 'animate-pulse' : ''}`} />
          <span className={`w-2 h-2 rounded-full bg-emerald-400 ${isSpinning ? 'animate-bounce' : ''}`} />
        </div>
      </div>

      {/* Grade dos 3 Cilindros de Alta Fidelidade */}
      <div className="flex gap-2 sm:gap-4 items-center justify-between">
        {renderReelDrum(reel0Ref, strip0Ref, stripItems0, reel0Stopped, '1', 'TEMA')}
        {renderReelDrum(reel1Ref, strip1Ref, stripItems1, reel1Stopped, '2', 'OBRA')}
        {renderReelDrum(reel2Ref, strip2Ref, stripItems2, reel2Stopped, '3', 'AMULETO')}
      </div>

      {/* Friso Cromado Inferior dos Cilindros com Resumo Dinâmico */}
      <div className="mt-3.5 pt-2.5 text-center text-[10px] font-mono font-bold tracking-wider text-slate-400 border-t border-slate-800/80 flex items-center justify-center gap-2">
        <Sparkles className="w-3 h-3 text-sun-yellow" />
        <span className="text-sun-yellow/90">COMBINAÇÃO AFETIVA 100% CARIOCA</span>
        <Sparkles className="w-3 h-3 text-sun-yellow" />
      </div>
    </div>
  );
};
