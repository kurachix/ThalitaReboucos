import React, { useState, useMemo } from 'react';
import { BookCategory } from '@/types';
import { BOOKS_CATALOG } from '@/data/books';
import { CategoryFilter } from './CategoryFilter';
import { BookSpine } from './BookSpine';
import { BookFlipbookModal } from './BookFlipbookModal';
import { SkeletonCard } from '@/components/common/SkeletonCard';
import { BookOpen, Search, X, Sparkles } from 'lucide-react';
import { useAudio } from '@/hooks/use-audio';

export const BookshelfSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<BookCategory>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { playClick } = useAudio();

  const handleSelectCategory = (cat: BookCategory) => {
    if (cat === selectedCategory) return;
    setIsTransitioning(true);
    setSelectedCategory(cat);
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 150);
    return () => clearTimeout(timer);
  };

  const filteredBooks = useMemo(() => {
    return BOOKS_CATALOG.filter((book) => {
      const matchesCategory =
        selectedCategory === 'todos' || book.category === selectedCategory;

      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        query === '' ||
        book.title.toLowerCase().includes(query) ||
        book.tags.some((t) => t.toLowerCase().includes(query)) ||
        book.synopsis.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <section 
      id="bookshelf" 
      className="scroll-mt-24 py-8 sm:py-12"
      aria-label="Ato 3: A Estante Pop Tridimensional"
    >
      {/* Cabeçalho da Seção */}
      <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-100 border border-pink-300 text-pop-pink text-xs font-bold uppercase tracking-wider shadow-sticker">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Ato 3 · Catálogo Literário Completo</span>
        </div>

        <h2 className="text-3xl sm:text-4xl xl:text-5xl font-black text-slate-900 font-heading tracking-tight">
          A Estante Pop Tridimensional
        </h2>

        <p className="text-slate-600 font-body text-base sm:text-lg">
          Explore o catálogo oficial de mais de 25 livros publicados. Escolha uma coleção ou pesquise pelo seu título preferido para folhear os detalhes de cada obra.
        </p>
      </div>

      {/* Barra de Pesquisa e Filtros */}
      <div className="space-y-6 mb-12 max-w-4xl mx-auto">
        
        {/* Campo de Busca Rápida */}
        <div className="relative max-w-md mx-auto">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Buscar livros por título, personagem ou tema"
            placeholder="Buscar por título, personagem ou tema..."
            className="w-full pl-11 pr-10 py-2.5 rounded-full bg-white/95 border border-slate-200 text-slate-800 text-sm font-body shadow-xs focus:outline-none focus:ring-2 focus:ring-pop-pink/50 focus:border-pop-pink transition-all placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                playClick();
                setSearchQuery('');
              }}
              aria-label="Limpar busca"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filtros em Pílulas */}
        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
        />
      </div>

      {/* Cenário da Estante de Livros com Prateleira Tridimensional */}
      <div className="bg-gradient-to-b from-amber-50/70 via-white to-amber-50/50 rounded-scrapbook shadow-scrapbook border-2 border-amber-200/60 p-6 sm:p-10 relative">
        
        {/* Aviso de Quantidade de Livros Encontrados */}
        <div className="flex items-center justify-between pb-6 text-xs text-slate-500 font-heading border-b border-amber-200/40">
          <div className="flex items-center gap-1.5 font-bold">
            <Sparkles className="w-3.5 h-3.5 text-sun-yellow-dark" />
            <span>
              Exibindo {filteredBooks.length} de {BOOKS_CATALOG.length} títulos
            </span>
          </div>
          <span className="font-handwriting text-base text-pop-pink hidden sm:inline">
            Clique no livro para abrir! 📖
          </span>
        </div>

        {/* Prateleira com Livros */}
        {isTransitioning ? (
          <div className="pt-8">
            <div className="flex flex-wrap items-end justify-center gap-4 sm:gap-6 pb-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <SkeletonCard key={n} variant="book" />
              ))}
            </div>
          </div>
        ) : filteredBooks.length > 0 ? (
          <div className="pt-8">
            
            {/* Grid dos Livros Alinhados */}
            <div className="flex flex-wrap items-end justify-center gap-4 sm:gap-6 pb-2">
              {filteredBooks.map((book, index) => (
                <div key={book.id} className="transition-all duration-300">
                  <BookSpine book={book} index={index} />
                </div>
              ))}
            </div>

            {/* Base da Prateleira de Madeira Tridimensional */}
            <div className="relative mt-2">
              {/* Superfície da Prateleira */}
              <div className="h-4 sm:h-5 bg-gradient-to-r from-amber-200 via-amber-300 to-amber-200 rounded-sm shadow-md border-t border-amber-100" />
              {/* Borda Frontal da Madeira com Profundidade */}
              <div className="h-3 bg-gradient-to-r from-amber-800 via-amber-700 to-amber-800 rounded-b-md shadow-lg" />
              {/* Sombra da Prateleira na Parede */}
              <div className="h-4 bg-gradient-to-b from-slate-400/20 to-transparent blur-xs -mt-1" />
            </div>

          </div>
        ) : (
          /* Estado Vazio de Busca */
          <div className="py-16 text-center space-y-3">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-700 font-heading">
              Nenhum livro encontrado para "{searchQuery}"
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto font-body">
              Tente buscar por outro termo ou selecione a categoria "Todos os Livros" para ver o catálogo completo.
            </p>
            <button
              type="button"
              onClick={() => {
                playClick();
                setSearchQuery('');
                setSelectedCategory('todos');
              }}
              className="mt-2 px-4 py-1.5 rounded-full bg-pop-pink text-white text-xs font-bold font-heading hover:bg-pop-pink-dark transition-colors shadow-xs"
            >
              Limpar Filtros
            </button>
          </div>
        )}

      </div>

      {/* Modal Interativo de Abertura do Livro (Flipbook 3D) */}
      <BookFlipbookModal />
    </section>
  );
};
