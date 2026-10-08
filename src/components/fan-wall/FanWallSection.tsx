import React, { useState, useMemo } from 'react';
import { BIENAL_MEMORIES } from '@/data/fan-wall';
import { NoteColor } from '@/types';
import { PostItNote } from './PostItNote';
import { BienalPolaroid } from './BienalPolaroid';
import { AddNoteModal } from './AddNoteModal';
import { MagneticButton } from '@/components/common/MagneticButton';
import { useLocalNotes, NewNoteInput } from '@/hooks/use-local-notes';
import { useAudio } from '@/hooks/use-audio';
import { 
  MessageSquare, 
  Heart, 
  Camera, 
  Filter, 
  Search, 
  PlusCircle, 
  CheckCircle2 
} from 'lucide-react';

export const FanWallSection: React.FC = () => {
  const { playClick } = useAudio();
  const { notes, addNote, likeNote, recentlyAddedId } = useLocalNotes();

  // Estados de Filtros e Busca
  const [selectedColor, setSelectedColor] = useState<NoteColor | 'all'>('all');
  const [activeTab, setActiveTab] = useState<'all' | 'notes' | 'bienal'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Manipulador de novo recado
  const handleAddNoteSubmit = (noteData: NewNoteInput) => {
    addNote(noteData);
    setToastMessage('📌 Seu recadinho foi pregado com sucesso no mural!');
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filtragem combinada por busca e cor
  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      const matchesColor = selectedColor === 'all' || note.color === selectedColor;
      const matchesSearch =
        searchQuery.trim() === '' ||
        note.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (note.pinnedBook && note.pinnedBook.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesColor && matchesSearch;
    });
  }, [notes, selectedColor, searchQuery]);

  // Totalizador de curtidas
  const totalLikes = useMemo(() => {
    return notes.reduce((acc, curr) => acc + (curr.likes || 0), 0);
  }, [notes]);

  const colorFilterOptions: { color: NoteColor | 'all'; label: string; dotClass: string }[] = [
    { color: 'all', label: 'Todas as Cores', dotClass: 'bg-slate-400' },
    { color: 'yellow', label: 'Amarelo', dotClass: 'bg-amber-300' },
    { color: 'pink', label: 'Rosa', dotClass: 'bg-pink-400' },
    { color: 'blue', label: 'Azul', dotClass: 'bg-sky-400' },
    { color: 'mint', label: 'Menta', dotClass: 'bg-emerald-400' },
    { color: 'purple', label: 'Lilás', dotClass: 'bg-purple-400' },
  ];

  return (
    <section 
      id="fan-wall" 
      className="scroll-mt-24 py-8 sm:py-12"
      aria-label="Ato 7: Mural dos Fãs e Bienal Nostalgia"
    >
      {/* =================================================================== */}
      {/* CABEÇALHO DA SEÇÃO                                                  */}
      {/* =================================================================== */}
      <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-100 border border-pink-300 text-pop-pink text-xs font-bold uppercase tracking-wider shadow-sticker">
          <MessageSquare className="w-3.5 h-3.5 text-pop-pink" />
          <span>Ato 7 · Parede de Cortiça & Bienal Nostalgia</span>
        </div>

        <h2 className="text-3xl sm:text-4xl xl:text-5xl font-black text-slate-900 font-heading tracking-tight">
          Mural dos Fãs & Bienal Nostalgia
        </h2>

        <p className="text-slate-600 font-body text-base sm:text-lg">
          Recados carinhosos de leitores de todo o Brasil, memórias históricas das maratonas de 12 horas ininterruptas de autógrafos e a conexão afetiva que transformou gerações.
        </p>

        {/* Estatísticas Rápidas do Mural */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs font-mono font-bold text-slate-600">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
            📌 {notes.length} Recados Afetuosos
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-pop-pink border border-pink-200">
            <Heart className="w-3.5 h-3.5 fill-current" />
            {totalLikes} Demonstrações de Carinho
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-900 border border-sky-200">
            <Camera className="w-3.5 h-3.5" />
            3 Memórias da Bienal
          </span>
        </div>
      </div>

      {/* =================================================================== */}
      {/* PAREDE DE CORTIÇA COM MOLDURA RÚSTICA DE MADEIRA                   */}
      {/* =================================================================== */}
      <div className="relative max-w-6xl mx-auto rounded-3xl cork-wood-frame bg-cork-board p-5 sm:p-8 md:p-12 overflow-hidden shadow-2xl">
        
        {/* Cantoneiras Metálicas Douradas Decorativas da Moldura */}
        <div className="absolute top-2 left-2 w-8 h-8 border-t-4 border-l-4 border-amber-300/80 rounded-tl-lg pointer-events-none" />
        <div className="absolute top-2 right-2 w-8 h-8 border-t-4 border-r-4 border-amber-300/80 rounded-tr-lg pointer-events-none" />
        <div className="absolute bottom-2 left-2 w-8 h-8 border-b-4 border-l-4 border-amber-300/80 rounded-bl-lg pointer-events-none" />
        <div className="absolute bottom-2 right-2 w-8 h-8 border-b-4 border-r-4 border-amber-300/80 rounded-br-lg pointer-events-none" />

        {/* ======================================================== */}
        {/* BARRA SUPERIOR DE FERRAMENTAS & FILTROS NO MURAL        */}
        {/* ======================================================== */}
        <div className="relative z-20 mb-10 p-4 sm:p-5 rounded-2xl bg-white/90 backdrop-blur-md border-2 border-amber-900/30 shadow-lg flex flex-col lg:flex-row items-center justify-between gap-4">
          
          {/* Abas: Todos / Post-its / Bienal */}
          <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200 w-full lg:w-auto">
            <button
              type="button"
              onClick={() => {
                playClick();
                setActiveTab('all');
              }}
              className={`flex-1 lg:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-heading font-bold transition-all ${
                activeTab === 'all'
                  ? 'bg-pop-pink text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tudo no Mural
            </button>
            <button
              type="button"
              onClick={() => {
                playClick();
                setActiveTab('notes');
              }}
              className={`flex-1 lg:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-heading font-bold transition-all ${
                activeTab === 'notes'
                  ? 'bg-pop-pink text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Post-its de Leitores
            </button>
            <button
              type="button"
              onClick={() => {
                playClick();
                setActiveTab('bienal');
              }}
              className={`flex-1 lg:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-heading font-bold transition-all ${
                activeTab === 'bienal'
                  ? 'bg-pop-pink text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Polaroids da Bienal
            </button>
          </div>

          {/* Campo de Busca Rápida por Cidade / Leitor */}
          <div className="relative w-full lg:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por leitor, cidade ou livro..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-300 bg-white text-xs font-body text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pop-pink focus:border-transparent transition-all"
            />
          </div>

          {/* Botão Magnético de Pregar Novo Recado */}
          <MagneticButton
            type="button"
            onClick={() => {
              playClick();
              setIsAddModalOpen(true);
            }}
            className="w-full lg:w-auto inline-flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-pop-pink to-purple-600 hover:from-amber-600 hover:to-purple-700 text-white font-heading font-extrabold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Pregar Meu Recado 📌</span>
          </MagneticButton>
        </div>

        {/* ======================================================== */}
        {/* FILTROS POR COR DO POST-IT                               */}
        {/* ======================================================== */}
        {(activeTab === 'all' || activeTab === 'notes') && (
          <div className="relative z-20 mb-8 flex flex-wrap items-center gap-2">
            <span className="text-xs font-heading font-bold text-amber-950 flex items-center gap-1.5 bg-amber-100/90 px-3 py-1 rounded-full shadow-xs">
              <Filter className="w-3.5 h-3.5 text-amber-900" />
              <span>Cores dos Post-its:</span>
            </span>

            {colorFilterOptions.map((opt) => (
              <button
                key={opt.color}
                type="button"
                onClick={() => {
                  playClick();
                  setSelectedColor(opt.color);
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-heading font-bold border transition-all ${
                  selectedColor === opt.color
                    ? 'bg-white text-slate-950 border-amber-900 shadow-sm scale-105'
                    : 'bg-white/70 hover:bg-white text-slate-700 border-white/50'
                }`}
              >
                <span className={`w-2.5 h-2.5 rounded-full ${opt.dotClass}`} />
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* ======================================================== */}
        {/* SEÇÃO 1: FOTOS POLAROID DA BIENAL (12H DE AUTÓGRAFOS)    */}
        {/* ======================================================== */}
        {(activeTab === 'all' || activeTab === 'bienal') && (
          <div className="relative z-10 mb-12">
            <div className="mb-6 flex items-center justify-between pb-3 border-b border-black/10">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-amber-900 text-amber-100 text-xs font-bold font-heading shadow-xs">
                  📸 Bienal Nostalgia
                </span>
                <h3 className="font-heading font-black text-xl sm:text-2xl text-amber-950">
                  As Históricas Maratonas de 12 Horas
                </h3>
              </div>
              <span className="text-xs font-mono text-amber-900 font-bold hidden sm:inline">
                Recorde absoluto de afeto e filas quilométricas
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {BIENAL_MEMORIES.map((memory) => (
                <BienalPolaroid key={memory.id} memory={memory} />
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SEÇÃO 2: GRID DE POST-ITS DE LEITORES                    */}
        {/* ======================================================== */}
        {(activeTab === 'all' || activeTab === 'notes') && (
          <div className="relative z-10">
            <div className="mb-6 flex items-center justify-between pb-3 border-b border-black/10">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-pop-pink text-white text-xs font-bold font-heading shadow-xs">
                  💌 Recados de Leitores
                </span>
                <h3 className="font-heading font-black text-xl sm:text-2xl text-amber-950">
                  Palavras do Coração ({filteredNotes.length})
                </h3>
              </div>
              <span className="text-xs font-mono text-amber-900 font-bold hidden sm:inline">
                Passe o mouse para sentir o balanço do papel 🍃
              </span>
            </div>

            {filteredNotes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredNotes.map((note) => (
                  <PostItNote
                    key={note.id}
                    note={note}
                    onLike={likeNote}
                    isRecentlyAdded={note.id === recentlyAddedId}
                  />
                ))}
              </div>
            ) : (
              <div className="py-12 text-center bg-white/80 rounded-2xl p-6 border-2 border-dashed border-amber-900/30 text-slate-600">
                <p className="font-heading font-bold text-base">
                  Nenhum recado encontrado para essa busca.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedColor('all');
                  }}
                  className="mt-3 px-4 py-1.5 rounded-full bg-pop-pink text-white text-xs font-bold"
                >
                  Limpar Filtros
                </button>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Modal Formulário de Novo Recado */}
      <AddNoteModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddNoteSubmit}
      />

      {/* Toast Flutuante de Confirmação */}
      {toastMessage && (
        <div 
          role="status"
          aria-live="polite"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-md px-4 py-2.5 rounded-full shadow-2xl bg-slate-900/95 border border-amber-400 text-white flex items-center gap-2.5 text-xs font-heading font-medium backdrop-blur-md animate-bounce"
        >
          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

    </section>
  );
};
