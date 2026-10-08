import React, { useState } from 'react';
import { FanNote, NoteColor } from '@/types';
import { useAudio } from '@/hooks/use-audio';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { Heart, MapPin, BookOpen } from 'lucide-react';

export interface PostItNoteProps {
  note: FanNote;
  onLike?: (id: string) => void;
  isRecentlyAdded?: boolean;
}

interface ColorTheme {
  bgGradient: string;
  borderColor: string;
  textColor: string;
  authorColor: string;
  pinColor: string;
  pinHighlight: string;
  badgeBg: string;
  tapeColor: string;
}

const COLOR_THEMES: Record<NoteColor, ColorTheme> = {
  yellow: {
    bgGradient: 'from-amber-50 via-yellow-100 to-amber-100',
    borderColor: 'border-amber-200/90',
    textColor: 'text-amber-950',
    authorColor: 'text-amber-900',
    pinColor: '#E11D48', // Alfinete vermelho cereja
    pinHighlight: '#FDA4AF',
    badgeBg: 'bg-amber-200/60 text-amber-900',
    tapeColor: 'rgba(251, 191, 36, 0.4)',
  },
  pink: {
    bgGradient: 'from-pink-50 via-pink-100 to-rose-100',
    borderColor: 'border-pink-200/90',
    textColor: 'text-rose-950',
    authorColor: 'text-pop-pink-dark',
    pinColor: '#9333EA', // Alfinete roxo uva
    pinHighlight: '#E9D5FF',
    badgeBg: 'bg-pink-200/60 text-pop-pink-dark',
    tapeColor: 'rgba(244, 63, 94, 0.4)',
  },
  blue: {
    bgGradient: 'from-sky-50 via-sky-100 to-cyan-100',
    borderColor: 'border-sky-200/90',
    textColor: 'text-sky-950',
    authorColor: 'text-sky-900',
    pinColor: '#F59E0B', // Alfinete amarelo ouro
    pinHighlight: '#FEF08A',
    badgeBg: 'bg-sky-200/60 text-sky-900',
    tapeColor: 'rgba(14, 165, 233, 0.4)',
  },
  mint: {
    bgGradient: 'from-emerald-50 via-emerald-100 to-teal-100',
    borderColor: 'border-emerald-200/90',
    textColor: 'text-emerald-950',
    authorColor: 'text-emerald-900',
    pinColor: '#FF2A85', // Alfinete rosa choque
    pinHighlight: '#FBCFE8',
    badgeBg: 'bg-emerald-200/60 text-emerald-900',
    tapeColor: 'rgba(16, 185, 129, 0.4)',
  },
  purple: {
    bgGradient: 'from-purple-50 via-purple-100 to-fuchsia-100',
    borderColor: 'border-purple-200/90',
    textColor: 'text-purple-950',
    authorColor: 'text-purple-900',
    pinColor: '#0284C7', // Alfinete azul safira
    pinHighlight: '#BAE6FD',
    badgeBg: 'bg-purple-200/60 text-purple-900',
    tapeColor: 'rgba(168, 85, 247, 0.4)',
  },
};

export const PostItNote: React.FC<PostItNoteProps> = ({ 
  note, 
  onLike,
  isRecentlyAdded = false,
}) => {
  const { playPinPop, playClick } = useAudio();
  const prefersReduced = useReducedMotion();

  const [likes, setLikes] = useState(note.likes || 12);
  const [hasLiked, setHasLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const theme = COLOR_THEMES[note.color] || COLOR_THEMES.yellow;

  // Efeito de curtida no recado do leitor
  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    playClick();

    if (!hasLiked) {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
      onLike?.(note.id);
    } else {
      setLikes((prev) => prev - 1);
      setHasLiked(false);
    }
  };

  // Som sutil de alfinete ao passar o mouse pela primeira vez
  const handleMouseEnter = () => {
    setIsHovered(true);
    playPinPop();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`group relative p-5 sm:p-6 rounded-2xl border bg-gradient-to-br ${theme.bgGradient} ${theme.borderColor} ${
        isRecentlyAdded
          ? 'ring-4 ring-sun-yellow shadow-2xl z-30 scale-105'
          : isHovered
          ? 'post-it-shadow-lifted z-20'
          : 'post-it-shadow z-10'
      } ${prefersReduced ? '' : isRecentlyAdded ? 'animate-bounce' : 'post-it-pendulum'} select-none transition-all duration-300 flex flex-col justify-between`}
      style={{
        // Define a rotação orgânica em CSS para a animação pendular
        // @ts-expect-error CSS variable customizada
        '--rot': `${note.rotationDeg}deg`,
        transform: prefersReduced
          ? `rotate(${note.rotationDeg}deg)`
          : isHovered
          ? undefined // deixa a animação CSS pendulumSwing agir
          : `rotate(${note.rotationDeg}deg)`,
      }}
    >
      {/* Badge de Impacto para Recado Recém-Pregado */}
      {isRecentlyAdded && (
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-sun-yellow text-amber-950 font-heading font-black text-[10px] uppercase tracking-wider shadow-md z-40 animate-pulse pointer-events-none">
          ✨ Pregado Agora! ✨
        </div>
      )}
      {/* ======================================================== */}
      {/* ALFINETE FIXADOR REALISTA (PUSHPIN COM BRILHO METÁLICO)   */}
      {/* ======================================================== */}
      <div 
        className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex flex-col items-center"
        aria-hidden="true"
      >
        {/* Cabeça Esférica do Alfinete com Gradiente Radial 3D */}
        <div 
          className="w-5 h-5 rounded-full shadow-md border border-white/50 relative transform transition-transform group-hover:scale-110"
          style={{
            background: `radial-gradient(circle at 35% 35%, ${theme.pinHighlight} 0%, ${theme.pinColor} 65%, #1e1b4b 100%)`,
          }}
        >
          {/* Brilho Especular Superior */}
          <div className="absolute top-1 left-1.5 w-1.5 h-1.5 rounded-full bg-white/80 filter blur-[0.5px]" />
        </div>

        {/* Sombra da Agulha entrando na Cortiça */}
        <div className="w-1.5 h-2 bg-slate-900/30 rounded-full transform -rotate-12 filter blur-[0.6px] -mt-0.5" />
      </div>

      {/* ======================================================== */}
      {/* CABEÇALHO DO POST-IT: CIDADE E LIVRO MENCIONADO          */}
      {/* ======================================================== */}
      <div className="pt-1 pb-3 flex items-center justify-between text-[11px] font-mono border-b border-black/5">
        <div className="flex items-center gap-1 opacity-80">
          <MapPin className="w-3 h-3 text-pop-pink" />
          <span className="font-semibold">{note.city}</span>
        </div>

        {note.pinnedBook && (
          <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-heading truncate max-w-[130px] ${theme.badgeBg}`}>
            <BookOpen className="w-2.5 h-2.5 inline mr-1" />
            <span>{note.pinnedBook}</span>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* MENSAGEM DO LEITOR                                       */}
      {/* ======================================================== */}
      <div className="my-4">
        <p className={`font-body text-sm sm:text-base leading-relaxed ${theme.textColor}`}>
          "{note.message}"
        </p>
      </div>

      {/* ======================================================== */}
      {/* RODAPÉ DO POST-IT: NOME DO LEITOR E BOTÃO DE CURTIDA     */}
      {/* ======================================================== */}
      <div className="pt-3 border-t border-black/5 flex items-center justify-between">
        {/* Assinatura do Leitor com Caligrafia Confortável */}
        <div className="flex flex-col">
          <span className={`font-handwriting font-bold text-lg sm:text-xl ${theme.authorColor}`}>
            — {note.name}
          </span>
          <span className="text-[10px] text-slate-500 font-mono">
            {new Date(note.createdAt).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}
          </span>
        </div>

        {/* Botão de Curtir / Coração */}
        <button
          type="button"
          onClick={handleLike}
          aria-label={`Curtir recado de ${note.name}, atualmente ${likes} curtidas`}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all active:scale-90 ${
            hasLiked
              ? 'bg-pop-pink text-white shadow-xs'
              : 'bg-white/70 hover:bg-white text-slate-700 hover:text-pop-pink shadow-xs'
          }`}
        >
          <Heart 
            className={`w-3.5 h-3.5 transition-transform ${
              hasLiked ? 'fill-current text-white scale-110' : 'text-slate-400 group-hover:text-pop-pink'
            }`} 
          />
          <span className="font-mono text-[11px]">{likes}</span>
        </button>
      </div>

      {/* Detalhe de papel descolado no canto inferior direito */}
      <div 
        className="absolute bottom-0 right-0 w-4 h-4 pointer-events-none rounded-br-2xl"
        style={{
          background: 'linear-gradient(135deg, transparent 50%, rgba(0, 0, 0, 0.08) 100%)',
        }}
      />
    </div>
  );
};
