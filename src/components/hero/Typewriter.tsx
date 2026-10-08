import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAudio } from '@/hooks/use-audio';
import { triggerHaptic } from '@/utils/haptics';
import { RotateCcw, Play, CheckCircle2, Sparkles, Keyboard } from 'lucide-react';

const FULL_TEXT = 'Escrevo para aproximar as pessoas através do afeto e da risada.';
const AUTHOR_SIGNATURE = '— Thalita Rebouças 💛';

export const Typewriter: React.FC = () => {
  const [typedLength, setTypedLength] = useState(0);
  const [isAutoTyping, setIsAutoTyping] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const autoTypeTimerRef = useRef<number | null>(null);

  const { playTypewriterKey, playPageFlip, playClick } = useAudio();

  // Avança uma letra e toca som de datilografia + vibração háptica tátil
  const typeNextLetter = useCallback(() => {
    setTypedLength((prev) => {
      if (prev < FULL_TEXT.length) {
        playTypewriterKey();
        triggerHaptic('light');
        const next = prev + 1;
        if (next === FULL_TEXT.length) {
          setIsFinished(true);
          setIsAutoTyping(false);
          triggerHaptic('success');
        }
        return next;
      } else {
        setIsFinished(true);
        setIsAutoTyping(false);
        return prev;
      }
    });
  }, [playTypewriterKey]);

  // Listener para teclas físicas do teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignora teclas de controle e atalhos de navegador
      if (e.ctrlKey || e.metaKey || e.altKey || e.key === 'Tab') return;
      
      // Evita disparar se o usuário estiver digitando em outro input no futuro
      const targetTag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (targetTag === 'input' || targetTag === 'textarea') return;

      if (typedLength < FULL_TEXT.length) {
        e.preventDefault();
        typeNextLetter();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [typedLength, typeNextLetter]);

  // Automação suave de digitação
  useEffect(() => {
    if (isAutoTyping && typedLength < FULL_TEXT.length) {
      autoTypeTimerRef.current = window.setTimeout(() => {
        typeNextLetter();
      }, 75 + Math.random() * 40); // Intervalo orgânico de digitação humana
    } else if (typedLength >= FULL_TEXT.length) {
      setIsAutoTyping(false);
      setIsFinished(true);
    }

    return () => {
      if (autoTypeTimerRef.current !== null) {
        window.clearTimeout(autoTypeTimerRef.current);
      }
    };
  }, [isAutoTyping, typedLength, typeNextLetter]);

  // Iniciar digitação automática
  const handleAutoType = () => {
    playClick();
    triggerHaptic('medium');
    if (typedLength >= FULL_TEXT.length) {
      // Reinicia e começa de novo
      setTypedLength(0);
      setIsFinished(false);
    }
    setIsAutoTyping(true);
  };

  // Reiniciar a folha de papel
  const handleReset = () => {
    playPageFlip();
    triggerHaptic('light');
    if (autoTypeTimerRef.current !== null) {
      window.clearTimeout(autoTypeTimerRef.current);
    }
    setIsAutoTyping(false);
    setIsFinished(false);
    setTypedLength(0);
  };

  // Teclas decorativas da máquina retrô
  const VINTAGE_KEYS_ROW1 = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
  const VINTAGE_KEYS_ROW2 = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];
  const VINTAGE_KEYS_ROW3 = ['Z', 'X', 'C', 'V', 'B', 'N', 'M'];

  return (
    <div className="w-full max-w-lg mx-auto select-none space-y-4">
      
      {/* Indicador de Atalho de Teclado */}
      <div className="flex items-center justify-between px-2 text-xs text-slate-500 font-body">
        <div className="flex items-center gap-1.5 bg-white/80 px-2.5 py-1 rounded-full border border-slate-200/80 shadow-2xs">
          <Keyboard className="w-3.5 h-3.5 text-pop-pink" />
          <span>Pressione qualquer tecla ou clique abaixo</span>
        </div>
        <span className="font-mono text-[11px] font-semibold text-slate-400">
          {typedLength}/{FULL_TEXT.length} caracteres
        </span>
      </div>

      {/* Rolo e Folha de Papel Saindo da Máquina */}
      <div className="relative pt-6 px-4">
        
        {/* Folha de Papel da Máquina */}
        <div 
          onClick={typeNextLetter}
          className="relative mx-auto w-11/12 sm:w-10/12 bg-amber-50/95 border-x-2 border-t-2 border-amber-200/80 rounded-t-xl p-5 sm:p-6 shadow-md transition-all duration-300 cursor-pointer min-h-[120px] flex flex-col justify-between"
          style={{
            transform: `translateY(${Math.max(0, 16 - typedLength * 0.25)}px)`,
            backgroundImage: 'repeating-linear-gradient(transparent, transparent 23px, rgba(226, 232, 240, 0.7) 24px)',
          }}
          title="Clique na folha para avançar a digitação"
        >
          {/* Fita de fixação da folha */}
          <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-16 h-3 bg-sun-yellow/60 rounded-xs shadow-xs" />

          {/* Texto Datilografado */}
          <div className="font-mono text-sm sm:text-base text-slate-800 leading-6 tracking-wide font-medium">
            <span>{FULL_TEXT.slice(0, typedLength)}</span>
            {!isFinished && (
              <span className="inline-block w-2 h-4 bg-pop-pink ml-0.5 animate-pulse align-middle" />
            )}
          </div>

          {/* Assinatura quando finalizado */}
          {isFinished && (
            <div className="pt-3 text-right animate-in fade-in zoom-in-95 duration-300">
              <span className="font-handwriting text-xl sm:text-2xl text-pop-pink font-bold">
                {AUTHOR_SIGNATURE}
              </span>
            </div>
          )}
        </div>

        {/* Cilindro / Rolo Preto da Máquina de Escrever */}
        <div className="relative z-10 w-full h-7 bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 rounded-md border-y-2 border-slate-700 shadow-inner flex items-center justify-between px-3">
          <div className="w-4 h-4 rounded-full bg-amber-400 border border-amber-600 shadow-xs" />
          <div className="h-1 flex-1 mx-3 bg-slate-700 rounded-full" />
          <div className="w-4 h-4 rounded-full bg-amber-400 border border-amber-600 shadow-xs" />
        </div>
      </div>

      {/* Corpo Vintage da Máquina de Escrever */}
      <div className="bg-gradient-to-b from-teal-500 to-teal-700 rounded-3xl p-5 sm:p-6 shadow-xl border-4 border-teal-400/80 relative text-white space-y-4">
        
        {/* Plaqueta Dourada com Logo */}
        <div className="flex items-center justify-between pb-1">
          <div className="bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 text-amber-950 px-3 py-1 rounded-md text-[11px] font-black font-heading tracking-widest uppercase shadow-xs border border-amber-400/60 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-pop-pink" />
            <span>Thalita Type · 1974</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleAutoType}
              disabled={isAutoTyping}
              className="px-2.5 py-1 rounded-lg bg-teal-800/80 hover:bg-teal-900 border border-teal-300/40 text-xs font-heading font-semibold text-teal-100 flex items-center gap-1 transition-colors disabled:opacity-50"
              title="Digitar frase automaticamente"
            >
              {isAutoTyping ? (
                <>
                  <Sparkles className="w-3 h-3 animate-spin text-sun-yellow" />
                  <span>Digitando...</span>
                </>
              ) : isFinished ? (
                <>
                  <CheckCircle2 className="w-3 h-3 text-emerald-300" />
                  <span>Concluída!</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 fill-current text-sun-yellow" />
                  <span>Auto-Digitar</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="p-1 rounded-lg bg-teal-800/80 hover:bg-teal-900 border border-teal-300/40 text-teal-200 hover:text-white transition-colors"
              title="Trocar folha / Reiniciar frase"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Teclado Retrô Estilizado */}
        <div className="bg-teal-900/90 rounded-2xl p-3 sm:p-4 border border-teal-800 shadow-inner space-y-2">
          
          {/* Fileira 1 */}
          <div className="flex justify-center gap-1 sm:gap-1.5">
            {VINTAGE_KEYS_ROW1.map((char) => (
              <button
                key={char}
                type="button"
                onClick={typeNextLetter}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 hover:bg-white text-slate-800 font-mono text-xs font-bold border-b-2 border-slate-400 active:translate-y-0.5 active:border-b-0 shadow-xs flex items-center justify-center transition-transform hover:scale-105"
              >
                {char}
              </button>
            ))}
          </div>

          {/* Fileira 2 */}
          <div className="flex justify-center gap-1 sm:gap-1.5">
            {VINTAGE_KEYS_ROW2.map((char) => (
              <button
                key={char}
                type="button"
                onClick={typeNextLetter}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 hover:bg-white text-slate-800 font-mono text-xs font-bold border-b-2 border-slate-400 active:translate-y-0.5 active:border-b-0 shadow-xs flex items-center justify-center transition-transform hover:scale-105"
              >
                {char}
              </button>
            ))}
          </div>

          {/* Fileira 3 */}
          <div className="flex justify-center gap-1 sm:gap-1.5">
            {VINTAGE_KEYS_ROW3.map((char) => (
              <button
                key={char}
                type="button"
                onClick={typeNextLetter}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 hover:bg-white text-slate-800 font-mono text-xs font-bold border-b-2 border-slate-400 active:translate-y-0.5 active:border-b-0 shadow-xs flex items-center justify-center transition-transform hover:scale-105"
              >
                {char}
              </button>
            ))}
          </div>

          {/* Barra de Espaço Ampla */}
          <div className="flex justify-center pt-1">
            <button
              type="button"
              onClick={typeNextLetter}
              className="w-36 sm:w-48 h-6 sm:h-7 rounded-md bg-amber-200 hover:bg-amber-100 text-amber-950 font-heading text-[10px] font-bold border-b-2 border-amber-400 active:translate-y-0.5 active:border-b-0 shadow-xs flex items-center justify-center transition-transform tracking-wider uppercase"
            >
              Espaço / Digitar
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
