import React, { useState } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  ArrowDown, 
  Heart, 
  Coffee, 
  MapPin, 
  Award,
  Users
} from 'lucide-react';
import { GlassesColorPicker, GLASSES_COLORS, GlassesColor } from './GlassesColorPicker';
import { THALITA_PROFILE } from '@/data/biography';
import { useAudio } from '@/hooks/use-audio';

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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
        
        {/* COLUNA ESQUERDA: Bio, Manifesto e Estatísticas (7 Colunas) */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          
          {/* Badge de Entrada */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sun-yellow-light border border-sun-yellow/40 text-amber-950 text-xs font-bold uppercase tracking-wider shadow-sticker">
            <Sparkles className="w-3.5 h-3.5 text-pop-pink" />
            <span>Ato 1 · O Ateliê da Escritora Carioca</span>
          </div>

          {/* Título Principal de Impacto */}
          <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black text-slate-900 tracking-tight font-heading leading-[1.1]">
            O Ateliê Pop & Diário Mágico de{' '}
            <span 
              className="transition-colors duration-300"
              style={{ color: activeGlasses.hex }}
            >
              Thalita Rebouças
            </span>
          </h1>

          {/* Texto de Apresentação Afetiva */}
          <p className="text-slate-600 font-body text-base sm:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0">
            Mais de duas décadas traduzindo com humor e delicadeza as maiores montanhas-russas da adolescência, amizade e família. Das cartas recusadas no início aos recordes históricos da Bienal e do streaming global.
          </p>

          {/* Mini-Estatísticas em Pílulas Scrapbook */}
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

          {/* Botões de Ação Rápida */}
          <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
            <button
              type="button"
              onClick={() => handleScrollTo('#timeline')}
              className="px-6 py-3 rounded-full text-white font-heading font-bold text-sm shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 hover:scale-105 active:scale-95"
              style={{ backgroundColor: activeGlasses.hex }}
            >
              <span>Ver Linha do Tempo</span>
              <ArrowDown className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => handleScrollTo('#bookshelf')}
              className="px-6 py-3 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-heading font-bold text-sm shadow-xs hover:border-slate-300 transition-all duration-200 flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-pop-pink" />
              <span>Explorar Estante Pop</span>
            </button>
          </div>

        </div>

        {/* COLUNA DIREITA: Mesa Interativa do Ateliê (5 Colunas) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          
          <div className="w-full max-w-md bg-white rounded-scrapbook shadow-scrapbook border-2 border-amber-200/60 p-6 sm:p-8 relative tape-effect space-y-6">
            
            {/* Componente dos Óculos com Alternância de Cores */}
            <div className="pt-2">
              <GlassesColorPicker onColorChange={(c) => setActiveGlasses(c)} />
            </div>

            {/* Polaroid da Autora */}
            <div className="bg-slate-50 p-3 pb-4 rounded-xl border border-slate-200 shadow-polaroid rotate-[-1.5deg] hover:rotate-0 transition-transform duration-300">
              <div className="relative aspect-[4/3] rounded-lg bg-gradient-to-tr from-amber-100 via-pink-100 to-sky-100 flex items-center justify-center overflow-hidden border border-slate-200/60">
                <div className="text-center p-4">
                  <div className="w-12 h-12 rounded-full bg-white/90 shadow-sm flex items-center justify-center mx-auto mb-2 text-pop-pink">
                    <Heart className="w-6 h-6 fill-pop-pink" />
                  </div>
                  <span className="font-heading font-bold text-slate-800 text-sm block">
                    Thalita Rebouças
                  </span>
                  <span className="text-xs text-slate-500 font-body flex items-center justify-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-sea-blue" />
                    Rio de Janeiro, RJ
                  </span>
                </div>
              </div>
              <p className="font-handwriting text-xl text-slate-700 text-center mt-3">
                "{THALITA_PROFILE.manifesto}"
              </p>
            </div>

            {/* Elementos Decorativos da Mesa (Caneca & Post-it) */}
            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 font-body">
              <div className="flex items-center gap-1.5 text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/60">
                <Coffee className="w-3.5 h-3.5 text-amber-700" />
                <span>Café Carioca Quentinho</span>
              </div>
              <span className="font-handwriting text-base text-pop-pink font-semibold">
                Estilo Diário Pop ✨
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
