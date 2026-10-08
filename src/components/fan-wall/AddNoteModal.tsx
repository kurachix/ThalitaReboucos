import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { NoteColor } from '@/types';
import { NewNoteInput } from '@/hooks/use-local-notes';
import { useAudio } from '@/hooks/use-audio';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { 
  X, 
  MapPin, 
  BookOpen, 
  Sparkles, 
  Heart,
  AlertCircle
} from 'lucide-react';

export interface AddNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (noteData: NewNoteInput) => void;
}

const COLOR_OPTIONS: { id: NoteColor; label: string; bgClass: string; borderClass: string; textClass: string }[] = [
  { id: 'yellow', label: 'Amarelo', bgClass: 'bg-amber-100', borderClass: 'border-amber-400', textClass: 'text-amber-950' },
  { id: 'pink', label: 'Rosa', bgClass: 'bg-pink-100', borderClass: 'border-pink-400', textClass: 'text-rose-950' },
  { id: 'blue', label: 'Azul', bgClass: 'bg-sky-100', borderClass: 'border-sky-400', textClass: 'text-sky-950' },
  { id: 'mint', label: 'Menta', bgClass: 'bg-emerald-100', borderClass: 'border-emerald-400', textClass: 'text-emerald-950' },
  { id: 'purple', label: 'Lilás', bgClass: 'bg-purple-100', borderClass: 'border-purple-400', textClass: 'text-purple-950' },
];

const POPULAR_BOOKS = [
  'Fala Sério, Mãe!',
  'Tudo por um Popstar',
  'Confissões de uma Garota Excluída',
  'Ela Disse, Ele Disse',
  'Fala Sério, Amor!',
  'Fala Sério, Amiga!',
];

export const AddNoteModal: React.FC<AddNoteModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const { playPinPop, playClick } = useAudio();
  const prefersReduced = useReducedMotion();

  // Estados do Formulário
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [message, setMessage] = useState('');
  const [color, setColor] = useState<NoteColor>('pink');
  const [pinnedBook, setPinnedBook] = useState('');

  // Erros de Validação
  const [errors, setErrors] = useState<{ name?: string; city?: string; message?: string }>({});
  const [isClosing, setIsClosing] = useState(false);

  const nameInputRef = useRef<HTMLInputElement>(null);

  // Trava de Scroll e Atalho ESC
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const focusTimer = setTimeout(() => nameInputRef.current?.focus(), 60);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(focusTimer);
    };
  }, [isOpen]);

  const handleClose = () => {
    if (isClosing) return;
    setIsClosing(true);
    playClick();

    setTimeout(() => {
      onClose();
      setIsClosing(false);
      setErrors({});
    }, 200);
  };

  const validateForm = () => {
    const newErrors: { name?: string; city?: string; message?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Por favor, digite seu nome ou apelido.';
    }
    if (!city.trim()) {
      newErrors.city = 'Digite sua cidade e estado (ex: Rio de Janeiro, RJ).';
    }
    if (!message.trim()) {
      newErrors.message = 'Escreva sua mensagem carinhosa para a Thalita.';
    } else if (message.length > 140) {
      newErrors.message = 'Sua mensagem deve ter no máximo 140 caracteres.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Dispara som tátil de alfinete espetando o mural
    playPinPop();

    onSubmit({
      name: name.trim(),
      city: city.trim(),
      message: message.trim(),
      color,
      pinnedBook: pinnedBook.trim() || undefined,
    });

    // Limpa o formulário e fecha
    setName('');
    setCity('');
    setMessage('');
    setPinnedBook('');
    onClose();
  };

  if (typeof document === 'undefined') return null;
  if (!isOpen && !isClosing) return null;

  const currentTheme = COLOR_OPTIONS.find((c) => c.id === color) || COLOR_OPTIONS[1];
  const charCount = message.length;
  const isNearLimit = charCount >= 120;
  const isOverLimit = charCount > 140;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-note-modal-title"
      className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto transition-all duration-300 ${
        isClosing
          ? 'opacity-0 backdrop-blur-none bg-slate-950/0'
          : 'opacity-100 backdrop-blur-md bg-slate-950/80'
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div 
        className={`relative w-full max-w-4xl bg-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl border-4 border-amber-300 transition-all my-auto max-h-[92vh] overflow-y-auto ${
          prefersReduced
            ? isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
            : isClosing ? 'scale-90 opacity-0' : 'scale-100 opacity-100'
        }`}
      >
        {/* Fita Adesiva Decorativa no Topo */}
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-5 py-1 bg-sun-yellow/90 backdrop-blur-xs text-amber-950 text-xs font-heading font-extrabold uppercase tracking-widest rounded-xs shadow-xs rotate-[-1deg]">
          ★ PREGAR RECADO NO MURAL ★
        </div>

        {/* Botão Fechar */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition-colors"
          aria-label="Fechar formulário de novo recado"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cabeçalho do Modal */}
        <div className="text-center max-w-xl mx-auto space-y-2 mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-pop-pink text-xs font-bold font-heading">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sua Voz no Ateliê da Autora</span>
          </div>
          <h3 
            id="add-note-modal-title"
            className="text-2xl sm:text-3xl font-heading font-black text-slate-900"
          >
            Deixe Seu Recadinho Afetuoso
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 font-body">
            Escreva sua memória com os livros de Thalita, escolha a cor do seu post-it e pregue na parede de cortiça com som de alfinete!
          </p>
        </div>

        {/* Layout em 2 Colunas: Formulário + Live Preview do Post-It */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ======================================================== */}
          {/* COLUNA 1: FORMULÁRIO DE PREENCHIMENTO                    */}
          {/* ======================================================== */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-4">
            
            {/* Campo 1: Nome ou Apelido */}
            <div className="space-y-1">
              <label 
                htmlFor="note-author-name"
                className="text-xs font-heading font-bold text-slate-700 uppercase tracking-wider block"
              >
                Seu Nome ou Apelido *
              </label>
              <input
                ref={nameInputRef}
                id="note-author-name"
                type="text"
                maxLength={40}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                }}
                placeholder="Ex: Bia Alencar ou Gabi da 8ª Série"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm font-body text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pop-pink transition-all ${
                  errors.name ? 'border-red-400 bg-red-50/40' : 'border-slate-300 bg-slate-50/50'
                }`}
              />
              {errors.name && (
                <p className="text-xs text-red-500 font-medium flex items-center gap-1 pt-0.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.name}</span>
                </p>
              )}
            </div>

            {/* Campo 2: Cidade / Estado */}
            <div className="space-y-1">
              <label 
                htmlFor="note-author-city"
                className="text-xs font-heading font-bold text-slate-700 uppercase tracking-wider block"
              >
                Sua Cidade e Estado *
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="note-author-city"
                  type="text"
                  maxLength={40}
                  value={city}
                  onChange={(e) => {
                    setCity(e.target.value);
                    if (errors.city) setErrors((prev) => ({ ...prev, city: undefined }));
                  }}
                  placeholder="Ex: Niterói, RJ ou Salvador, BA"
                  className={`w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm font-body text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pop-pink transition-all ${
                    errors.city ? 'border-red-400 bg-red-50/40' : 'border-slate-300 bg-slate-50/50'
                  }`}
                />
              </div>
              {errors.city && (
                <p className="text-xs text-red-500 font-medium flex items-center gap-1 pt-0.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.city}</span>
                </p>
              )}
            </div>

            {/* Campo 3: Mensagem (Máximo 140 chars) */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label 
                  htmlFor="note-message-text"
                  className="text-xs font-heading font-bold text-slate-700 uppercase tracking-wider block"
                >
                  Sua Mensagem de Carinho *
                </label>
                <span className={`text-[11px] font-mono font-bold ${
                  isOverLimit ? 'text-red-500' : isNearLimit ? 'text-amber-600' : 'text-slate-400'
                }`}>
                  {charCount}/140 chars
                </span>
              </div>
              <textarea
                id="note-message-text"
                rows={3}
                maxLength={140}
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  if (errors.message) setErrors((prev) => ({ ...prev, message: undefined }));
                }}
                placeholder="Conte qual livro marcou sua infância, sua memória na Bienal ou deixe um abraço para a Thalita..."
                className={`w-full p-3.5 rounded-xl border text-sm font-body text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pop-pink resize-none transition-all ${
                  errors.message ? 'border-red-400 bg-red-50/40' : 'border-slate-300 bg-slate-50/50'
                }`}
              />
              {errors.message && (
                <p className="text-xs text-red-500 font-medium flex items-center gap-1 pt-0.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.message}</span>
                </p>
              )}
            </div>

            {/* Campo 4: Seleção de Cor do Post-it */}
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-heading font-bold text-slate-700 uppercase tracking-wider block">
                Escolha a Cor do Seu Post-it:
              </label>
              <div className="flex flex-wrap gap-2">
                {COLOR_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      playClick();
                      setColor(opt.id);
                    }}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-heading font-bold border transition-all ${opt.bgClass} ${opt.textClass} ${
                      color === opt.id
                        ? `${opt.borderClass} ring-2 ring-pop-pink shadow-xs scale-105`
                        : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <span className="w-3 h-3 rounded-full border border-black/20" />
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Campo 5: Livro Marcante (Opcional com Atalhos Rápidos) */}
            <div className="space-y-1.5 pt-1">
              <label 
                htmlFor="note-pinned-book"
                className="text-xs font-heading font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1"
              >
                <BookOpen className="w-3.5 h-3.5 text-pop-pink" />
                <span>Livro da Thalita que mais te marcou (opcional):</span>
              </label>
              <input
                id="note-pinned-book"
                type="text"
                maxLength={50}
                value={pinnedBook}
                onChange={(e) => setPinnedBook(e.target.value)}
                placeholder="Ex: Fala Sério, Mãe! ou Tudo por um Popstar"
                className="w-full px-4 py-2 rounded-xl border border-slate-300 bg-slate-50/50 text-xs font-body text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pop-pink transition-all"
              />
              <div className="flex flex-wrap gap-1.5 pt-1">
                {POPULAR_BOOKS.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => {
                      playClick();
                      setPinnedBook(b);
                    }}
                    className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors ${
                      pinnedBook === b
                        ? 'bg-pink-100 text-pop-pink font-bold border-pop-pink'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200'
                    }`}
                  >
                    + {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Botão de Envio Principal */}
            <div className="pt-3">
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-pop-pink via-pop-pink-dark to-purple-600 hover:from-pop-pink-dark hover:to-purple-700 text-white font-heading font-extrabold text-sm uppercase tracking-wider shadow-lg hover:shadow-pop-pink/30 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Pregar Meu Recado no Mural! 📌</span>
              </button>
            </div>

          </form>

          {/* ======================================================== */}
          {/* COLUNA 2: LIVE PREVIEW DO POST-IT EM TEMPO REAL          */}
          {/* ======================================================== */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-3 pt-4 lg:pt-0">
            <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400 font-bold">
              Pré-Visualização ao Vivo 🍃
            </span>

            {/* O Cartão de Post-it com Alfinete em Tempo Real */}
            <div 
              className={`relative w-full max-w-xs p-6 rounded-2xl border ${currentTheme.borderClass} ${currentTheme.bgClass} shadow-xl transform rotate-1 transition-all duration-300`}
            >
              {/* Alfinete 3D no topo */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center">
                <div className="w-5 h-5 rounded-full shadow-md bg-gradient-to-tr from-rose-600 via-pop-pink to-amber-200 border border-white" />
                <div className="w-1.5 h-2 bg-slate-900/30 rounded-full transform -rotate-12 -mt-0.5" />
              </div>

              {/* Cabeçalho */}
              <div className="pt-1 pb-3 flex items-center justify-between text-[11px] font-mono border-b border-black/5">
                <div className="flex items-center gap-1 opacity-80">
                  <MapPin className="w-3 h-3 text-pop-pink" />
                  <span className="font-semibold">{city || 'Sua Cidade, UF'}</span>
                </div>
                {pinnedBook && (
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-white/70 truncate max-w-[110px]">
                    {pinnedBook}
                  </span>
                )}
              </div>

              {/* Mensagem */}
              <div className="my-4 min-h-[64px]">
                <p className={`font-body text-sm leading-relaxed ${currentTheme.textClass}`}>
                  "{message || 'Sua mensagem carinhosa aparecerá aqui com caligrafia aconchegante...'}"
                </p>
              </div>

              {/* Rodapé com Assinatura */}
              <div className="pt-3 border-t border-black/5 flex items-center justify-between">
                <span className="font-handwriting font-bold text-xl text-slate-900">
                  — {name || 'Seu Nome'}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] text-pop-pink font-bold">
                  <Heart className="w-3 h-3 fill-current" />
                  <span>1</span>
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 font-mono text-center">
              💾 Salvo no seu navegador (localStorage) para você rever sempre que voltar.
            </p>
          </div>

        </div>

      </div>
    </div>,
    document.body
  );
};
