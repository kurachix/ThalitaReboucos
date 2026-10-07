import React, { useState, useRef } from 'react';
import { TimelineMilestone } from '@/types';
import { 
  Heart, 
  Send, 
  Sparkles, 
  Star, 
  BookOpen, 
  Film, 
  Tv, 
  GraduationCap,
  Baby
} from 'lucide-react';
import { useAudio } from '@/hooks/use-audio';

interface PolaroidCardProps {
  milestone: TimelineMilestone;
  index: number;
}

export const PolaroidCard: React.FC<PolaroidCardProps> = ({ milestone, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [airplaneFlying, setAirplaneFlying] = useState(false);
  const { playClick, playPageFlip } = useAudio();

  // Rotação orgânica natural de álbum de figurinhas (-2deg a +2deg)
  const baseRotation = (index % 2 === 0 ? -1.5 : 1.5) * (0.8 + (index % 3) * 0.2);

  // Efeito de Tilt 3D suave com física de perspectiva
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
  };

  const handleCardClick = () => {
    playPageFlip();
    if (milestone.id === 'milestone-2000') {
      setAirplaneFlying(true);
      setTimeout(() => setAirplaneFlying(false), 1200);
    }
  };

  // Ícone temático baseado no marco histórico
  const renderMilestoneIcon = () => {
    switch (milestone.type) {
      case 'childhood':
        return index === 0 ? <Baby className="w-8 h-8 text-amber-500" /> : <GraduationCap className="w-8 h-8 text-sky-500" />;
      case 'rejection':
        return <Send className="w-8 h-8 text-rose-500" />;
      case 'bestseller':
        return index === 3 ? <Star className="w-8 h-8 text-amber-500" /> : <Heart className="w-8 h-8 text-pop-pink fill-pop-pink" />;
      case 'bienal':
        return <BookOpen className="w-8 h-8 text-teal-500" />;
      case 'cinema':
        return <Film className="w-8 h-8 text-purple-500" />;
      case 'global-streaming':
        return <Tv className="w-8 h-8 text-red-500" />;
      default:
        return <Sparkles className="w-8 h-8 text-pop-pink" />;
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
      className="relative shrink-0 w-80 sm:w-88 select-none transition-transform duration-200 ease-out cursor-pointer group"
      style={{
        transform: isHovered
          ? `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(1.03, 1.03, 1.03)`
          : `rotate(${baseRotation}deg)`,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Washi Tape Decorativa no Topo */}
      <div 
        className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-5 bg-sun-yellow/70 backdrop-blur-xs rounded-xs shadow-xs z-30 pointer-events-none"
        style={{
          clipPath: 'polygon(0% 15%, 5% 0%, 95% 5%, 100% 20%, 97% 85%, 92% 100%, 3% 95%, 0% 80%)',
          transform: `translateX(-50%) rotate(${baseRotation * -1}deg)`,
        }}
      />

      {/* Cartão Polaroid */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-polaroid border border-slate-200/80 flex flex-col justify-between space-y-4">
        
        {/* Moldura da Foto */}
        <div className="relative aspect-[4/3] rounded-xl bg-gradient-to-tr from-amber-50 via-slate-100 to-pink-50 border border-slate-200/60 overflow-hidden flex flex-col items-center justify-center p-4">
          
          {/* Badge do Ano */}
          <div className="absolute top-2.5 left-2.5 bg-slate-900/85 backdrop-blur-xs text-white px-2.5 py-0.5 rounded-full text-xs font-black font-heading tracking-wider shadow-xs">
            {milestone.year}
          </div>

          {/* Badge de Destaque da Categoria */}
          <div className="absolute top-2.5 right-2.5 bg-white/90 text-slate-800 px-2 py-0.5 rounded-md text-[10px] font-bold font-heading border border-slate-200 shadow-2xs">
            {milestone.badge}
          </div>

          {/* Ícone e Animação do Aviãozinho se for o ano 2000 */}
          <div className="relative flex items-center justify-center">
            {renderMilestoneIcon()}
            {milestone.id === 'milestone-2000' && (
              <div 
                className={`absolute -top-2 -right-8 transition-all duration-700 pointer-events-none ${
                  airplaneFlying ? 'translate-x-12 -translate-y-8 rotate-45 opacity-0' : 'animate-bounce'
                }`}
              >
                <span className="text-xs bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded-full font-bold">
                  20 recusas! ✈️
                </span>
              </div>
            )}
          </div>

          <span className="font-heading font-extrabold text-slate-800 text-base text-center mt-2 px-2 line-clamp-1">
            {milestone.title}
          </span>
          <span className="text-xs text-slate-500 font-body text-center line-clamp-1">
            {milestone.subtitle}
          </span>
        </div>

        {/* Legenda Manuscrita Autêntica da Polaroid */}
        <div className="text-center px-1">
          <p className="font-handwriting text-xl sm:text-2xl text-slate-800 leading-snug">
            "{milestone.polaroidCaption}"
          </p>
        </div>

        {/* Descrição Histórica do Marco */}
        <div className="bg-amber-50/60 rounded-xl p-3 border border-amber-200/50 text-xs text-slate-600 font-body leading-relaxed">
          {milestone.description}
        </div>

        {/* Rodapé do Card */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-body pt-1 border-t border-slate-100">
          <span>Álbum Thalita #{index + 1}</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              playClick();
            }}
            className="text-pop-pink font-semibold hover:underline"
          >
            Memória Guardada 💛
          </button>
        </div>

      </div>
    </div>
  );
};
