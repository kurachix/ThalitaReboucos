import React, { useState } from 'react';
import { Book } from '@/types';
import { useAppStore } from '@/store/use-app-store';
import { useAudio } from '@/hooks/use-audio';
import { useHoverPrefetch, prefetchBookDetails } from '@/hooks/use-prefetch';
import { BookOpen, Sparkles } from 'lucide-react';

interface BookSpineProps {
  book: Book;
  index: number;
}

export const BookSpine: React.FC<BookSpineProps> = ({ book, index }) => {
  const openBookModal = useAppStore((state) => state.openBookModal);
  const { playPageFlip } = useAudio();
  const [imageError, setImageError] = useState(false);

  // Pré-aquecimento de síntese de voz e recursos ao passar cursor sobre o livro (> 100ms)
  const prefetchHandlers = useHoverPrefetch(() => {
    prefetchBookDetails(book.id);
  }, 100);

  const handleBookClick = () => {
    playPageFlip();
    openBookModal(book.id);
  };

  // Variação orgânica sutil de altura de prateleira (210px a 240px)
  const heightClass = index % 3 === 0 ? 'h-64' : index % 3 === 1 ? 'h-60' : 'h-62';
  const hasCover = Boolean(book.coverUrl) && !imageError;

  return (
    <div
      onClick={handleBookClick}
      {...prefetchHandlers}
      className={`group relative flex flex-col justify-between w-40 sm:w-44 ${heightClass} rounded-r-xl rounded-l-xs p-3 cursor-pointer select-none transition-all duration-300 ease-out hover:-translate-y-3 hover:scale-105 hover:rotate-[-1.5deg] overflow-hidden`}
      style={{
        backgroundColor: book.coverAccent,
        boxShadow: `
          -4px 0 6px -1px rgba(0, 0, 0, 0.35),
          4px 8px 18px -2px rgba(0, 0, 0, 0.25),
          inset -2px 0 4px rgba(255, 255, 255, 0.25),
          inset 4px 0 8px rgba(0, 0, 0, 0.2)
        `,
      }}
      title={`Clique para folhear "${book.title}"`}
    >
      {/* Imagem Oficial da Capa (Linkada da web) */}
      {hasCover && (
        <img
          src={book.coverUrl}
          alt={`Capa do livro ${book.title}`}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110 pointer-events-none select-none"
          loading="lazy"
          onError={() => setImageError(true)}
        />
      )}

      {/* Gradientes de Contraste e Leitura quando há Capa */}
      {hasCover && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/50 pointer-events-none group-hover:from-black/90 transition-colors" />
      )}

      {/* Detalhe de Relevo da Lombada e Costura Física */}
      <div className="absolute top-0 left-0 bottom-0 w-3 bg-gradient-to-r from-black/60 to-transparent border-r border-white/20 rounded-l-xs flex flex-col justify-between py-2 items-center pointer-events-none z-10">
        <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
        <div className="w-1 h-8 bg-white/20 rounded-full" />
        <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
      </div>

      {/* Topo do Livro: Ano e Badge */}
      <div className="pl-2 flex items-center justify-between text-white/90 relative z-10">
        <span className="text-[11px] font-mono font-bold bg-black/60 px-1.5 py-0.5 rounded-xs backdrop-blur-xs border border-white/10 shadow-xs">
          {book.year}
        </span>
        {book.tags.includes('Cinema') && (
          <span className="text-[9px] font-heading font-extrabold uppercase bg-sun-yellow text-amber-950 px-1.5 py-0.5 rounded-full shadow-2xs">
            Cinema 🎬
          </span>
        )}
      </div>

      {/* Centro: Título do Livro (Exibido se não houver capa ou no hover sutil) */}
      <div className="pl-2 my-auto relative z-10">
        {!hasCover ? (
          <>
            <h3 className="font-heading font-black text-sm sm:text-base text-white leading-tight drop-shadow-xs line-clamp-3">
              {book.title}
            </h3>
            <p className="font-handwriting text-base text-white/90 mt-1 line-clamp-1">
              {book.tags[0]}
            </p>
          </>
        ) : (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <h3 className="font-heading font-black text-xs text-white leading-tight drop-shadow-md line-clamp-2 bg-black/60 px-2 py-1 rounded-sm backdrop-blur-xs border border-white/10">
              {book.title}
            </h3>
          </div>
        )}
      </div>

      {/* Base do Livro: Páginas e Chamada de Ação no Hover */}
      <div className="pl-2 pt-2 border-t border-white/20 flex items-center justify-between text-white/90 text-[11px] font-body relative z-10 bg-black/40 sm:bg-transparent -mx-3 -mb-3 p-2 rounded-b-xl backdrop-blur-2xs">
        <span className="font-mono text-[10px] drop-shadow-xs">{book.pages} págs</span>
        
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 font-heading font-bold text-white text-[10px] bg-pop-pink px-2.5 py-0.5 rounded-full shadow-md animate-in fade-in duration-200">
          <BookOpen className="w-3 h-3 text-white" />
          <span>Folhear</span>
        </div>
      </div>

      {/* Washi Tape Sutil no Topo ao Hover */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 h-3 bg-white/60 backdrop-blur-xs rounded-2xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rotate-2 shadow-2xs z-20" />

      {/* Efeito Brilhante Flutuante */}
      <div className="absolute top-2 right-2 text-white/0 group-hover:text-sun-yellow transition-colors pointer-events-none z-10">
        <Sparkles className="w-3.5 h-3.5" />
      </div>
    </div>
  );
};
