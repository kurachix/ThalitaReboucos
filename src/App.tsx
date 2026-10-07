import { Sparkles, BookOpen } from 'lucide-react';

export default function App() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border-4 border-yellow-300 text-center space-y-4">
        <div className="inline-flex p-3 bg-pink-100 text-pink-600 rounded-full">
          <Sparkles className="w-8 h-8 animate-pulse" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">
          Universo Thalita Rebouças
        </h1>
        <p className="text-gray-600 text-sm">
          Etapa 01 concluída com sucesso: Workspace inicializado com TypeScript Strict Mode, Vite, Tailwind CSS e Lucide Icons.
        </p>
        <div className="pt-2 flex items-center justify-center gap-2 text-xs font-semibold text-amber-700 bg-amber-100 py-2 px-4 rounded-lg">
          <BookOpen className="w-4 h-4" />
          <span>Pronto para a Etapa 02: Design Tokens & Cores</span>
        </div>
      </div>
    </main>
  );
}
