import React from 'react';
import { BookCategory } from '@/types';
import { BOOK_CATEGORIES, BOOKS_CATALOG } from '@/data/books';
import { useAudio } from '@/hooks/use-audio';
import { Sparkles } from 'lucide-react';

interface CategoryFilterProps {
  selectedCategory: BookCategory;
  onSelectCategory: (category: BookCategory) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const { playClick } = useAudio();

  const getCategoryCount = (category: BookCategory) => {
    if (category === 'todos') return BOOKS_CATALOG.length;
    return BOOKS_CATALOG.filter((book) => book.category === category).length;
  };

  const handleSelect = (category: BookCategory) => {
    playClick();
    onSelectCategory(category);
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 select-none">
      {BOOK_CATEGORIES.map((cat) => {
        const isSelected = selectedCategory === cat.id;
        const count = getCategoryCount(cat.id);

        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => handleSelect(cat.id)}
            aria-pressed={isSelected}
            className={`group relative flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-heading font-bold transition-all duration-200 active:scale-95 ${
              isSelected
                ? 'bg-pop-pink text-white shadow-md shadow-pink-200 ring-2 ring-pop-pink ring-offset-2'
                : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200/90 shadow-2xs hover:border-slate-300'
            }`}
          >
            {isSelected && <Sparkles className="w-3.5 h-3.5 text-sun-yellow animate-pulse" />}
            <span>{cat.label}</span>
            <span
              className={`text-[11px] px-1.5 py-0.2 rounded-full font-mono transition-colors ${
                isSelected
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
