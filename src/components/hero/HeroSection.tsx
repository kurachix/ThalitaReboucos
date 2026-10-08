import React, { useState } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  ArrowDown, 
  Heart, 
  Award,
  Users
} from 'lucide-react';
import { GlassesColorPicker, GLASSES_COLORS, GlassesColor } from './GlassesColorPicker';
import { Typewriter } from './Typewriter';
import { useAudio } from '@/hooks/use-audio';
import { MagneticButton } from '@/components/common/MagneticButton';

export const HeroSection: React.FC = () => {
  const [activeGlasses, setActiveGlasses] = useState<GlassesColor>(GLASSES_COLORS[0]);
  const { playClick } = useAudio();

  const handleScrollTo = (id: string) => {
    playClick();
    const el = document.querySelector(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      className="scroll-mt-24 min-h-[85vh] flex flex-col justify-center py-6 sm:py-10"
      aria-label="Ato 1: O Ateliê da Autora"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-start">
        
        {/* COLUNA ESQUERDA: Bio, Manifesto e Estatísticas (6 Colunas) */}
        <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
          
          {/* Badge de Entrada */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sun-yellow-light border border-sun-yellow/40 text-amber-950 text-xs font-bold uppercase tracking-wider shadow-sticker">
            <Sparkles className="w-3.5 h-3.5 text-pop-pink" />
            <span>Ato 1 · O Ateliê da Escritora Carioca</span>
          </div>

          {/* Título Principal com Cor Dinâmica */}
          <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black text-slate-900 tracking-tight font-heading leading-[1.1]">
            O Ateliê Pop & Diário Mágico de{' '}
            <span 
              className="transition-colors duration-300"
              style={{ color: activeGlasses.hex }}
            >
              Thalita Rebouças
            </span>
          </h1>

          {/* Apresentação Carismática */}
          <p className="text-slate-600 font-body text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
            Mais de duas décadas traduzindo com humor e afeto as maiores aventuras da juventude. Das cartas recusadas no início aos recordes históricos da Bienal e aos sucessos mundiais no streaming.
          </p>

          {/* Mini-Estatísticas em Pílulas */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-xl mx-auto lg:mx-0 pt-1">
            <div className="p-3 rounded-2xl bg-white/90 border border-slate-200/80 shadow-xs text-center">
              <Users className="w-4 h-4 text-pop-pink mx-auto mb-1" />
              <span className="block font-heading font-black text-lg text-slate-900">2,3M+</span>
              <span className="text-[11px] font-semibold text-slate-500 font-body">Leitores</span>
            </div>

            <div className="p-3 rounded-2xl bg-white/90 border border-slate-200/80 shadow-xs text-center">
              <BookOpen className="w-4 h-4 text-sun-yellow-dark mx-auto mb-1" />
              <span className="block font-heading font-black text-lg text-slate-900">+25</span>
              <span className="text-[11px] font-semibold text-slate-500 font-body">Livros</span>
            </div>

            <div className="p-3 rounded-2xl bg-white/90 border border-slate-200/80 shadow-xs text-center">
              <Award className="w-4 h-4 text-sea-blue mx-auto mb-1" />
              <span className="block font-heading font-black text-lg text-slate-900">5</span>
              <span className="text-[11px] font-semibold text-slate-500 font-body">Filmes</span>
            </div>

            <div className="p-3 rounded-2xl bg-white/90 border border-slate-200/80 shadow-xs text-center">
              <Heart className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
              <span className="block font-heading font-black text-lg text-slate-900">12h+</span>
              <span className="text-[11px] font-semibold text-slate-500 font-body">Na Bienal</span>
            </div>
          </div>

          {/* Botões de Ação com Efeito Magnético Suave */}
          <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
            <MagneticButton
              type="button"
              onClick={() => handleScrollTo('#timeline')}
              className="px-6 py-3 rounded-full text-white font-heading font-bold text-sm shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 hover:scale-105 active:scale-95"
              style={{ backgroundColor: activeGlasses.hex }}
            >
              <span>Ver Linha do Tempo</span>
              <ArrowDown className="w-4 h-4" />
            </MagneticButton>

            <MagneticButton
              type="button"
              onClick={() => handleScrollTo('#bookshelf')}
              className="px-6 py-3 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-heading font-bold text-sm shadow-xs hover:border-slate-300 transition-all duration-200 flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-pop-pink" />
              <span>Explorar Estante Pop</span>
            </MagneticButton>
          </div>

          {/* Óculos Interativos em Destaque na Lateral */}
          <div className="pt-4 border-t border-slate-200/60 max-w-md mx-auto lg:mx-0">
            <GlassesColorPicker onColorChange={(c) => setActiveGlasses(c)} />
          </div>

        </div>

        {/* COLUNA DIREITA: Máquina de Escrever Interativa na Mesa de Criação (6 Colunas) */}
        <div className="lg:col-span-6 flex flex-col items-center w-full">
          <div className="w-full bg-white/90 rounded-scrapbook shadow-scrapbook border-2 border-amber-200/60 p-5 sm:p-7 relative tape-effect space-y-4">
            
            <div className="text-center space-y-1">
              <span className="font-handwriting text-2xl text-slate-800 block">
                Mesa de Datilografia da Autora
              </span>
              <p className="text-xs text-slate-500 font-body">
                Experimente datilografar a frase que guia a carreira da escritora:
              </p>
            </div>

            {/* Máquina de Escrever */}
            <Typewriter />

          </div>
        </div>

      </div>
    </section>
  );
};
