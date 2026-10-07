import { Sparkles, Heart, Bookmark, Palette } from 'lucide-react';

export default function App() {
  return (
    <main className="min-h-screen bg-paper-ruled py-12 px-4 flex flex-col items-center justify-center">
      {/* Container Principal Scrapbook */}
      <div className="w-full max-w-2xl bg-white rounded-scrapbook shadow-scrapbook border-2 border-slate-100 p-8 sm:p-10 relative tape-effect">
        
        {/* Cabeçalho com Tipografia de Destaque (Outfit) */}
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pop-pink-light text-pop-pink text-xs font-semibold uppercase tracking-wider shadow-sticker">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Etapa 02: Design System Ativo</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-heading">
            Universo <span className="text-pop-pink">Thalita Rebouças</span>
          </h1>
          <p className="text-slate-600 font-body text-base max-w-lg mx-auto">
            Design tokens cariocas, fontes do Google e texturas de scrapbook configurados com precisão.
          </p>
        </div>

        {/* Amostra Manuscrita de Scrapbook (Caveat) */}
        <div className="relative mb-8 bg-sun-yellow-light/60 p-5 rounded-2xl border border-sun-yellow/40 shadow-sm rotate-[-1deg] transition-transform hover:rotate-0">
          <div className="flex items-start gap-3">
            <Heart className="w-6 h-6 text-pop-pink fill-pop-pink shrink-0 mt-1" />
            <div>
              <p className="font-handwriting text-2xl text-slate-800 leading-snug">
                "Escrevo para aproximar as pessoas através do afeto e da risada!"
              </p>
              <span className="font-handwriting text-xl text-slate-500 block text-right mt-1">
                — Com amor, Thalita 💛
              </span>
            </div>
          </div>
        </div>

        {/* Paleta de Cores Cariocas Solares */}
        <div className="space-y-3 mb-8">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 font-heading">
            <Palette className="w-4 h-4 text-sea-blue" />
            <span>Paleta de Cores Solares & Tokens CSS</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {/* Amarelo Sol */}
            <div className="p-3 rounded-xl bg-sun-yellow-light border border-sun-yellow/30 text-center">
              <div className="w-8 h-8 rounded-full bg-sun-yellow mx-auto mb-2 shadow-sm" />
              <span className="block font-heading text-xs font-bold text-slate-800">Sol de Ipanema</span>
              <code className="text-[10px] text-slate-500 font-mono">#FFD13B</code>
            </div>

            {/* Rosa Pop */}
            <div className="p-3 rounded-xl bg-pop-pink-light border border-pop-pink/30 text-center">
              <div className="w-8 h-8 rounded-full bg-pop-pink mx-auto mb-2 shadow-sm" />
              <span className="block font-heading text-xs font-bold text-slate-800">Rosa Pop</span>
              <code className="text-[10px] text-slate-500 font-mono">#FF2A85</code>
            </div>

            {/* Azul Mar */}
            <div className="p-3 rounded-xl bg-sea-blue-light border border-sea-blue/30 text-center">
              <div className="w-8 h-8 rounded-full bg-sea-blue mx-auto mb-2 shadow-sm" />
              <span className="block font-heading text-xs font-bold text-slate-800">Azul Mar</span>
              <code className="text-[10px] text-slate-500 font-mono">#00B4D8</code>
            </div>

            {/* Tangerina */}
            <div className="p-3 rounded-xl bg-tangerine-light border border-tangerine/30 text-center">
              <div className="w-8 h-8 rounded-full bg-tangerine mx-auto mb-2 shadow-sm" />
              <span className="block font-heading text-xs font-bold text-slate-800">Tangerina</span>
              <code className="text-[10px] text-slate-500 font-mono">#FF7A00</code>
            </div>

            {/* Menta */}
            <div className="p-3 rounded-xl bg-mint-light border border-mint/30 text-center col-span-2 sm:col-span-1">
              <div className="w-8 h-8 rounded-full bg-mint mx-auto mb-2 shadow-sm" />
              <span className="block font-heading text-xs font-bold text-slate-800">Menta Fresco</span>
              <code className="text-[10px] text-slate-500 font-mono">#2EC4B6</code>
            </div>
          </div>
        </div>

        {/* Rodapé da Etapa */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-body">
          <div className="flex items-center gap-1.5">
            <Bookmark className="w-4 h-4 text-pop-pink" />
            <span>Outfit · Plus Jakarta Sans · Caveat</span>
          </div>
          <span className="font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
            Próxima: Etapa 03 (Tipagem & Dados)
          </span>
        </div>

      </div>
    </main>
  );
}
