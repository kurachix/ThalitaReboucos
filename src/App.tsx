import { AppShell } from '@/components/layout/AppShell';
import { 
  Sparkles, 
  Clock, 
  BookOpen, 
  Film, 
  HelpCircle, 
  MessageSquare, 
  Heart,
  Feather
} from 'lucide-react';

export default function App() {
  return (
    <AppShell>
      {/* SEÇÃO 1: HERO — O ATELIÊ DA AUTORA */}
      <section 
        id="hero" 
        className="scroll-mt-24 min-h-[75vh] flex flex-col justify-center items-center text-center relative py-12"
      >
        <div className="w-full max-w-4xl bg-white/95 rounded-scrapbook shadow-scrapbook border-2 border-amber-200/60 p-8 sm:p-14 relative tape-effect">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sun-yellow-light text-amber-900 text-xs font-bold uppercase tracking-wider shadow-sticker mb-6">
            <Feather className="w-3.5 h-3.5 text-pop-pink" />
            <span>Ato 1 · O Ateliê da Autora</span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight font-heading leading-tight mb-4">
            O Ateliê Pop & Diário Mágico de <span className="text-pop-pink">Thalita Rebouças</span>
          </h1>
          
          <p className="text-slate-600 font-body text-lg sm:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
            Mergulhe no universo sensorial da escritora que conquistou mais de 2,3 milhões de leitores com histórias de amizade, família e gargalhadas sinceras.
          </p>

          <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-6 max-w-xl mx-auto shadow-sm rotate-[-0.5deg]">
            <p className="font-handwriting text-2xl sm:text-3xl text-slate-800 leading-snug">
              "Escrevo para aproximar as pessoas através do afeto e da risada!"
            </p>
            <span className="font-handwriting text-xl text-slate-500 block text-right mt-2">
              — Com todo carinho, Thalita 💛
            </span>
          </div>
        </div>
      </section>

      {/* SEÇÃO 2: TIMELINE — ÁLBUM DE MEMÓRIAS */}
      <section 
        id="timeline" 
        className="scroll-mt-24 py-12"
      >
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sea-blue text-xs font-bold uppercase tracking-wider shadow-sticker">
            <Clock className="w-3.5 h-3.5" />
            <span>Ato 2 · Álbum de Figurinhas</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading">
            Linha do Tempo em Memórias
          </h2>
          <p className="text-slate-600 font-body text-base">
            De 1974 aos dias de hoje: as recusas de editoras, os primeiros sucessos e as filas históricas da Bienal.
          </p>
        </div>

        <div className="bg-white/80 rounded-scrapbook shadow-scrapbook border border-slate-200/70 p-8 text-center text-slate-500 font-body">
          <div className="max-w-md mx-auto space-y-3 py-6">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sea-blue mx-auto flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 font-heading">
              Estrutura Pronta para a Linha do Tempo
            </h3>
            <p className="text-sm text-slate-500">
              O layout base está ancorado e preparado para receber o carrossel horizontal de polaroids 3D na Fase 3.
            </p>
          </div>
        </div>
      </section>

      {/* SEÇÃO 3: BOOKSHELF — A ESTANTE POP */}
      <section 
        id="bookshelf" 
        className="scroll-mt-24 py-12"
      >
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 text-pop-pink text-xs font-bold uppercase tracking-wider shadow-sticker">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Ato 3 · Catálogo Literário</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading">
            A Estante Pop Tridimensional
          </h2>
          <p className="text-slate-600 font-body text-base">
            Mais de 25 títulos organizados por séries: Fala Sério!, Popstar, Confissões e Romances.
          </p>
        </div>

        <div className="bg-white/80 rounded-scrapbook shadow-scrapbook border border-slate-200/70 p-8 text-center text-slate-500 font-body">
          <div className="max-w-md mx-auto space-y-3 py-6">
            <div className="w-12 h-12 rounded-2xl bg-pink-100 text-pop-pink mx-auto flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 font-heading">
              Estrutura Pronta para a Estante 3D
            </h3>
            <p className="text-sm text-slate-500">
              Pronto para os filtros interativos por coleção e o flipbook modal de leitura na Fase 4.
            </p>
          </div>
        </div>
      </section>

      {/* SEÇÃO 4: CINEMA — CINE-THALITA */}
      <section 
        id="cinema" 
        className="scroll-mt-24 py-12"
      >
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider shadow-sticker">
            <Film className="w-3.5 h-3.5" />
            <span>Ato 4 · Do Papel Para as Telas</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading">
            Cine-Thalita & Streaming
          </h2>
          <p className="text-slate-600 font-body text-base">
            As adaptações consagradas nas telas dos cinemas, Netflix e Prime Video.
          </p>
        </div>

        <div className="bg-white/80 rounded-scrapbook shadow-scrapbook border border-slate-200/70 p-8 text-center text-slate-500 font-body">
          <div className="max-w-md mx-auto space-y-3 py-6">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 mx-auto flex items-center justify-center">
              <Film className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 font-heading">
              Estrutura Pronta para a Claquete Interativa
            </h3>
            <p className="text-sm text-slate-500">
              Preparado para a claquete com som tátil de CLACK! e exibição dos 5 filmes na Fase 4.
            </p>
          </div>
        </div>
      </section>

      {/* SEÇÃO 5: ADVICES — MÁQUINA DE CONSELHOS */}
      <section 
        id="advices" 
        className="scroll-mt-24 py-12"
      >
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider shadow-sticker">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Ato 5 · Caça-Níquel Pop</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading">
            Máquina de Conselhos da Thalita
          </h2>
          <p className="text-slate-600 font-body text-base">
            Puxe a alavanca e receba pílulas diárias de afeto, humor e autoestima direto dos livros.
          </p>
        </div>

        <div className="bg-white/80 rounded-scrapbook shadow-scrapbook border border-slate-200/70 p-8 text-center text-slate-500 font-body">
          <div className="max-w-md mx-auto space-y-3 py-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 font-heading">
              Estrutura Pronta para a Roleta de Conselhos
            </h3>
            <p className="text-sm text-slate-500">
              Pronto para os tambores giratórios e o gerador de cards para Instagram Stories na Fase 5.
            </p>
          </div>
        </div>
      </section>

      {/* SEÇÃO 6: QUIZ — QUAL PERSONAGEM É VOCÊ? */}
      <section 
        id="quiz" 
        className="scroll-mt-24 py-12"
      >
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold uppercase tracking-wider shadow-sticker">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ato 6 · Mini-Jogo Interativo</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading">
            Quiz: Qual Personagem Você É?
          </h2>
          <p className="text-slate-600 font-body text-base">
            Malu, Tetê, Gabi ou Rosa? Descubra quem tem mais a ver com o seu jeito de viver a vida.
          </p>
        </div>

        <div className="bg-white/80 rounded-scrapbook shadow-scrapbook border border-slate-200/70 p-8 text-center text-slate-500 font-body">
          <div className="max-w-md mx-auto space-y-3 py-6">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-800 mx-auto flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 font-heading">
              Estrutura Pronta para o Quiz Interativo
            </h3>
            <p className="text-sm text-slate-500">
              Preparado para os cartões dinâmicos e a explosão de confetes festivos na Fase 5.
            </p>
          </div>
        </div>
      </section>

      {/* SEÇÃO 7: FAN-WALL — MURAL DOS FÃS */}
      <section 
        id="fan-wall" 
        className="scroll-mt-24 py-12"
      >
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 text-pop-pink text-xs font-bold uppercase tracking-wider shadow-sticker">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Ato 7 · Parede de Cortiça</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading">
            Mural dos Fãs & Bienal Nostalgia
          </h2>
          <p className="text-slate-600 font-body text-base">
            Deixe seu recadinho afetuoso pregado no mural e celebre a conexão de leitores de todo o Brasil.
          </p>
        </div>

        <div className="bg-white/80 rounded-scrapbook shadow-scrapbook border border-slate-200/70 p-8 text-center text-slate-500 font-body">
          <div className="max-w-md mx-auto space-y-3 py-6">
            <div className="w-12 h-12 rounded-2xl bg-pink-100 text-pop-pink mx-auto flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 font-heading">
              Estrutura Pronta para o Mural de Post-its
            </h3>
            <p className="text-sm text-slate-500">
              Preparado para a parede de cortiça, recados balançantes e persistência local na Fase 6.
            </p>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
