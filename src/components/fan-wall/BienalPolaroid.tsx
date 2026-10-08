import React, { useState } from 'react';
import { BienalMemory } from '@/types';
import { useAudio } from '@/hooks/use-audio';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { Clock, Sparkles, Heart, Users, X } from 'lucide-react';

export interface BienalPolaroidProps {
  memory: BienalMemory;
}

export const BienalPolaroid: React.FC<BienalPolaroidProps> = ({ memory }) => {
  const { playPageFlip, playClick } = useAudio();
  const prefersReduced = useReducedMotion();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpen = () => {
    playPageFlip();
    setIsModalOpen(true);
  };

  const handleClose = () => {
    playClick();
    setIsModalOpen(false);
  };

  return (
    <>
      {/* ======================================================== */}
      {/* CARTÃO POLAROID FIXADO NA CORTIÇA                        */}
      {/* ======================================================== */}
      <div
        role="button"
        tabIndex={0}
        onClick={handleOpen}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleOpen();
          }
        }}
        aria-label={`Ver fotos e memórias de ${memory.title}`}
        className={`group cursor-pointer relative bg-white p-4 sm:p-5 pb-6 rounded-xl shadow-xl border border-slate-200/80 transition-all select-none hover:shadow-2xl ${
          prefersReduced ? '' : 'hover:-translate-y-1 hover:scale-[1.02]'
        }`}
        style={{
          transform: prefersReduced ? undefined : `rotate(${memory.rotationDeg}deg)`,
        }}
      >
        {/* Fita Adesiva Translúcida no Canto Superior Esquerdo */}
        <div 
          className="absolute -top-3 left-4 w-20 h-6 -rotate-6 z-20 shadow-xs pointer-events-none"
          style={{
            backgroundColor: 'rgba(255, 209, 59, 0.65)',
            clipPath: 'polygon(0% 4%, 4% 0%, 96% 2%, 100% 6%, 98% 94%, 94% 100%, 2% 98%, 0% 92%)',
          }}
        />

        {/* Tachinha / Alfinete no Canto Superior Direito */}
        <div 
          className="absolute -top-2.5 right-4 w-4 h-4 rounded-full shadow-md z-20 pointer-events-none border border-white/60"
          style={{
            background: `radial-gradient(circle at 35% 35%, #fff 0%, ${memory.accentColor} 65%, #1e1b4b 100%)`,
          }}
        />

        {/* ======================================================== */}
        {/* FOTO POLAROID ESTILIZADA (ILUSTRAÇÃO / MOLDURA FESTIVA)   */}
        {/* ======================================================== */}
        <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gradient-to-tr from-slate-900 via-purple-950 to-pink-950 p-4 flex flex-col justify-between text-white shadow-inner border border-slate-800">
          
          {/* Badge de Horas e Bienal */}
          <div className="flex items-center justify-between z-10">
            <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] sm:text-xs font-mono font-bold tracking-wider uppercase border border-white/30 flex items-center gap-1">
              <Clock className="w-3 h-3 text-sun-yellow" />
              <span>{memory.durationHours}H de Maratona</span>
            </span>

            <span className="px-2 py-0.5 rounded-full bg-pop-pink/80 text-[10px] font-heading font-bold text-white shadow-xs">
              {memory.tag}
            </span>
          </div>

          {/* Arte Central da Foto */}
          <div className="text-center my-auto space-y-1 z-10 py-3">
            <div className="w-10 h-10 mx-auto rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-sun-yellow">
              <Users className="w-5 h-5" />
            </div>
            <h5 className="font-heading font-black text-sm sm:text-base leading-tight text-white drop-shadow-md">
              {memory.title}
            </h5>
            <p className="text-[11px] text-pink-200 font-body">
              {memory.year}
            </p>
          </div>

          {/* Selo na Base da Foto */}
          <div className="flex items-center justify-between text-[10px] font-mono text-white/70 z-10">
            <span>Sessão Histórica</span>
            <span className="flex items-center gap-1 text-sun-yellow">
              <Sparkles className="w-3 h-3" />
              <span>Bienal Record</span>
            </span>
          </div>

          {/* Efeito de Brilho / Lens Flare Polaroid */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-white/10 pointer-events-none" />
        </div>

        {/* ======================================================== */}
        {/* LEGENDA MANUSCRITA NA BORDA BRANCA DA POLAROID           */}
        {/* ======================================================== */}
        <div className="mt-3.5 px-1 text-center space-y-1">
          <p className="font-handwriting text-base sm:text-lg text-slate-800 font-bold leading-snug">
            "{memory.caption}"
          </p>
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
            Clique para ler a memória completa 🔍
          </span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL DE DETALHES DA MEMÓRIA HISTÓRICA                   */}
      {/* ======================================================== */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={`bienal-title-${memory.id}`}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose();
          }}
        >
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-amber-300 space-y-5 animate-fade-in">
            {/* Botão Fechar */}
            <button
              type="button"
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              aria-label="Fechar detalhes da memória"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Cabeçalho */}
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold font-heading">
                {memory.year}
              </span>
              <span className="text-xs font-mono text-slate-500 font-bold">
                ⏱️ {memory.durationHours} Horas de Autógrafos Ininterruptos
              </span>
            </div>

            <h3 
              id={`bienal-title-${memory.id}`}
              className="text-2xl sm:text-3xl font-heading font-black text-slate-900"
            >
              {memory.title}
            </h3>

            {/* Descrição Detalhada */}
            <p className="font-body text-slate-700 text-base leading-relaxed">
              {memory.description}
            </p>

            {/* Frase / Citação de Thalita */}
            <div className="p-4 rounded-2xl bg-pink-50 border border-pink-200 text-center space-y-1">
              <Heart className="w-5 h-5 text-pop-pink mx-auto fill-current" />
              <p className="font-handwriting text-xl text-pop-pink font-bold">
                "Não existe cansaço que supere o olhar de uma leitora me abraçando com seu livro favorito!"
              </p>
              <span className="text-[11px] font-mono text-slate-500 block">
                — Thalita Rebouças, ao final de 12h de sessão na Bienal
              </span>
            </div>

            {/* Botão Fechar */}
            <button
              type="button"
              onClick={handleClose}
              className="w-full py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-heading font-bold text-xs uppercase tracking-wider transition-all"
            >
              Voltar ao Mural
            </button>
          </div>
        </div>
      )}
    </>
  );
};
